using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Kinect;
using System.Threading;
using System.Net.Sockets;
using System.Diagnostics;
using System.Net;

namespace KinectServer
{
    public class KinectDriver : SkeletonEventDispatcher
    {

        public KinectSensor nui;
        //public bool running = true;
        public static KinectSkeletonFrame skeletonFrame;
        public static bool newSkeletonFrame;
        public static int fps = 30;
        public static int mspf = 1000 / fps;
        public static Stopwatch stopwatch = new Stopwatch();
        private List<SkeletonReceiver> listeners = new List<SkeletonReceiver>();

        public KinectDriver() {
            init();
        }

        private void init() {
            foreach (var potentialSensor in KinectSensor.KinectSensors)
            {
                if (potentialSensor.Status == KinectStatus.Connected)
                {
                    nui = potentialSensor;
                    break;
                }
            }
            try
            {
                nui.Start();
            }
            catch (Exception e)
            {
                Console.WriteLine("Failed to initialise Kinect");
                return;
            }

            try
            {
                Thread.Sleep(300);
                nui.ElevationAngle = -1;
                Thread.Sleep(1000);
                nui.ElevationAngle = 1;
                Thread.Sleep(1000);
                nui.ElevationAngle = 10;
                Thread.Sleep(300);
            }
            catch (Exception e) { 
                Console.WriteLine("Failed to change elevation.\n{0}", e.Message);
                throw new Exception("Error initializing kinect");
            }

            try
            {
                nui.SkeletonStream.Enable();
            }
            catch {
                Console.WriteLine("Failed to open skeleton stream"); 
            }


            try
            {
                nui.DepthStream.Enable(DepthImageFormat.Resolution320x240Fps30);
            }
            catch { Console.WriteLine("Failed to open depth stream"); }

            /*try
            {
                nui.DepthFrameReady += new EventHandler<DepthImageFrameReadyEventArgs>(nui_DepthFrameReady);
            }
            catch { Console.WriteLine("Failed to add skeleton stream frame ready event handler"); }
            */
            try
            {
                nui.SkeletonFrameReady += new EventHandler<SkeletonFrameReadyEventArgs>(nui_SkeletonFrameReady);
            }
            catch { Console.WriteLine("Failed to add skeleton stream frame ready event handler"); }
        }

        private void nui_SkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
        {
            try
            {
                KinectSkeletonFrame skeletonFrame = new KinectSkeletonFrame(e.OpenSkeletonFrame());
                Console.WriteLine("\tSkeletonFrame.FrameNumber: {0}", skeletonFrame.FrameNumber);
                newSkeletonFrame = true;

                List<SkeletonReceiver> sickListeners = new List<SkeletonReceiver>();
                // This would be more stable if implemented using a thread pool and a queue, but for
                // a handful of clients this shouldn't be an issue;
                List<SkeletonReceiver> listenersCopy;
                lock (listeners)
                {
                    listenersCopy = listeners.ToList();
                }
                foreach (SkeletonReceiver listener in listenersCopy)
                {
                    try
                    {
                        listener.receiveFrame(skeletonFrame);
                    }
                    catch
                    {
                        Console.WriteLine("A Kinect client caused an error and will no longer receive messages.");
                        sickListeners.Add(listener);
                    }
                }
                foreach (SkeletonReceiver sickListener in sickListeners)
                {
                    listeners.Remove(sickListener);
                }
            }
            catch (Exception ex) { Console.WriteLine("Failed in nui_SkeletonFrameReady"); Console.WriteLine(ex.StackTrace); }

        }

        public void addSkeletonReceiver(SkeletonReceiver listener)
        {

            lock (listeners)
            {
                if (!listeners.Contains(listener))
                    listeners.Add(listener);
            }
        }

        public void removeSkeletonReceiver(SkeletonReceiver listener)
        {
            lock(listeners)
                listeners.Remove(listener);
        }
    }
}
