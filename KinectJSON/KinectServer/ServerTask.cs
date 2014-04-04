using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace KinectServer
{
    /**
     * A handler pipeline between skeleton frames coming in from the KinectDriver and an end client
     * that has connected to the Server.  The server can create as many of these as it needs.
     * 
     * Potentially this could be threaded or threadpooled, but there seems little advantage in
     * a low-load environment.
     */
    public class ServerTask : SkeletonReceiver
    {
        // These few variables would make good instance variables...
        private int framesToGet;
        private int framesGot;
        private String callbackfn;
        private System.IO.StreamWriter clientWriter;
        private HttpListenerContext clientContext;
        private Boolean logging;
        private Boolean running;
        private SkeletonEventDispatcher source;

        readonly object locker = new object();
        public static int INT64_BYTES = BitConverter.GetBytes(Int64.MaxValue).Length;
        public static int DOUBLE_BYTES = BitConverter.GetBytes(Double.MaxValue).Length;

        public ServerTask(HttpListenerContext clientContext, SkeletonEventDispatcher source, Boolean logging)
        {
            this.clientContext = clientContext;
            this.source = source;
            this.logging = logging;
            this.running = true;
            clientWriter = new System.IO.StreamWriter(clientContext.Response.OutputStream);

            if (clientContext.Request.QueryString["frames"] != null)
            {
                framesToGet = int.Parse(clientContext.Request.QueryString["frames"]);
            }
            else
            {
                framesToGet = 1;
            }
            framesGot = 0;

            if (clientContext.Request.QueryString["callback"] != null)
            {
                callbackfn = clientContext.Request.QueryString["callback"];
            }
            else
            {
                callbackfn = null;
            }
            if (callbackfn != null)
            {
                clientWriter.Write(callbackfn + "(");
            }

            if (clientContext.Request.QueryString["recordState"]!=null)
            {
                if (clientContext.Request.QueryString["recordState"].Equals("START"))
                {
                    FrameRecorder frameRecorder = FrameRecorder.getInstance();
                    frameRecorder.Clear();
                    source.addSkeletonReceiver(frameRecorder);
                    SendString("{'status':'success'}");
                    Disconnect();
                }
                else if (clientContext.Request.QueryString["recordState"].Equals("STOP"))
                {
                    FrameRecorder frameRecorder = FrameRecorder.getInstance();

                    LinkedList<KinectSkeletonFrame> frames = frameRecorder.GetFrames();
                    lock (frames)
                    {
                        IEnumerator<KinectSkeletonFrame> frameIter = frames.GetEnumerator();
                        SendString("[");
                        //frameIter.Reset();
                        //frameIter.MoveNext();
                        for (int i = 0; i < frames.Count - 1; ++i)
                        {
                            Send(frameIter.Current);
                            SendString(",");
                            frameIter.MoveNext();
                        }
                        Send(frameIter.Current);
                    }
                    SendString("]");
                    Disconnect();
                }
                return;
            }

            if (framesToGet > 1)
            {
                clientWriter.Write("[");
            }

            source.addSkeletonReceiver(this);
        }

        private void Disconnect()
        {
            this.running = false;
            source.removeSkeletonReceiver(this);
            Console.WriteLine("Removing Client");
            if (framesToGet > 1) clientWriter.Write("]");
            if (callbackfn != null) clientWriter.Write(");");
            clientWriter.Flush();
            clientContext.Response.OutputStream.Close();
        }

        
        private void Send(KinectSkeletonFrame skeletonFrame)
        {
            String buffer;
            if (skeletonFrame != null)
            {
                try
                {
                    // TODO: get the callback string from the URL prams
                    buffer = skeletonFrame.toJSON();
                    SendString(buffer);
                }
                catch (Exception e) 
                { 
                    Console.WriteLine("Failed to Send\n{0}", e.Message);
                    throw e;
                }
            }
            else
            {
                Console.WriteLine("SkeletonFrame not ready");
            }
        }

        private void SendString(String toSend) {
            try
            {
                clientWriter.Write(toSend);
                //if (logging) Console.WriteLine("Sent: {0}", toSend); // even for logging this produces a lot of data when there are 2 skeletons
            }
            catch (Exception e) { Console.WriteLine("Failed to Send\n{0}", e.Message); throw e; }
        }

        public void receiveFrame(KinectSkeletonFrame frame)
        {
            if (!running) return; // unregistering ourselves is no guarantee that we are not going to get called for a couple of frames
            Send(frame);
            ++framesGot;

            // Either add a comma if there is more data remaining, or finish up
            if (framesToGet > framesGot) SendString(",");
            else Disconnect();
        }

        public Boolean isRunning()
        {
            return running;
        }
    }
}
