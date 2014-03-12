using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace KinectServer
{
    public class Server
    {
        // the EndPoint corresponding to this server
        public static String serverEP = "http://localhost:8111/";
        private static System.Diagnostics.Stopwatch stopwatch;
        private static HttpListener server;

        // These few variables would make good instance variables...
        private static int framesToGet;
        private static String callbackfn;
        private static System.IO.StreamWriter clientWriter;
        private static HttpListenerContext clientContext;

        static readonly object locker = new object();
        public static bool logging = false;
        public static int INT64_BYTES = BitConverter.GetBytes(Int64.MaxValue).Length;
        public static int DOUBLE_BYTES = BitConverter.GetBytes(Double.MaxValue).Length;

        public static void StartServer()
        {
            stopwatch = Program.stopwatch;
            stopwatch.Start();
            if (logging) Console.WriteLine("Listening for remoteEP");
            Thread t = new Thread(() => Server.KinectServer());
            t.Start();
        }

        private static void Connect()
        {
            if (server == null)
            {
                server = new HttpListener();
                server.Prefixes.Add(serverEP);
                server.Start();
            }
            
            clientContext = server.GetContext();
            clientWriter = new System.IO.StreamWriter(clientContext.Response.OutputStream);

            if (clientContext.Request.QueryString["frames"] != null)
            {
                framesToGet = int.Parse(clientContext.Request.QueryString["frames"]);
            }
            else
            {
                framesToGet = 1;
            }

            if (clientContext.Request.QueryString["callback"] != null)
            {
                callbackfn = clientContext.Request.QueryString["callback"];
            }
            else
            {
                callbackfn = null;
            }
        }

        private static void Disconnect()
        {
            clientWriter.Flush();
            clientContext.Response.OutputStream.Close();
        }

        private static void KinectServer()
        {
            while (Program.running)
            {
                TimeSpan startTime = Program.stopwatch.Elapsed;
                if(logging)Console.WriteLine("Waiting for a connection");
                Connect();

                int lastFrameNumber = 0;

                if (callbackfn!=null)
                {
                    SendString(callbackfn + "(");
                }
                if (framesToGet > 1) SendString("["); // when getting multiple frames, return in an array
                for (int framesGot = 0; framesGot < framesToGet; ++framesGot )
                {
                    while (Program.skeletonFrame == null || Program.skeletonFrame.FrameNumber == lastFrameNumber) Thread.Sleep(5);
                    Send(Program.skeletonFrame);
                    lastFrameNumber = Program.skeletonFrame.FrameNumber;
                    if (framesToGet - framesGot > 1) SendString(",");
                }
                if (framesToGet > 1) SendString("]");

                if (callbackfn != null)
                {
                    SendString(")");
                }
                Disconnect();
                TimeSpan endTime = stopwatch.Elapsed;
                TimeSpan timeDiff = endTime - startTime;
            }
        }

        private static void Send(KinectSkeletonFrame skeletonFrame)
        {
            String buffer;
            if (skeletonFrame != null)
            {
                try
                {
                    lock (locker)
                    {
                        // TODO: get the callback string from the URL prams
                        buffer = skeletonFrame.toJSON();
                    }
                    SendString(buffer);
                }
                catch (Exception e) { Console.WriteLine("Failed to Send\n{0}", e.Message); }
            }
            else
            {
                Console.WriteLine("SkeletonFrame not ready");
            }
        }

        private static void SendString(String toSend) {
            try
            {
                clientWriter.Write(toSend);
                if (logging) Console.WriteLine("Sent: {0}", toSend);
            }
            catch (Exception e) { Console.WriteLine("Failed to Send\n{0}", e.Message); }
        }
    }
}
