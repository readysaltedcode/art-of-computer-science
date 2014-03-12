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
    public class Program
    {
        public static KinectSensor nui;
        public static bool running = true;
        public static KinectSkeletonFrame skeletonFrame;
        public static bool newSkeletonFrame;
        public static int fps = 30;
        public static int mspf = 1000 / fps;
        public static Stopwatch stopwatch = new Stopwatch();


        static void Main(string[] args)
        {
            Kinect();
            if (args.Count() == 1) Server.serverEP = args[0];
            Server.StartServer();
        }

        private static void StartKinect()
        {
            Thread t = new Thread(new ThreadStart(Kinect));
            t.Start();
        }

        private static void Kinect()
        {
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
                nui.ElevationAngle = 0;
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

        static void nui_DepthFrameReady(object sender, DepthImageFrameReadyEventArgs e)
        {
            try
            {
                if (newSkeletonFrame)
                {
                    Console.WriteLine("Sending new skeleton frame");
                    newSkeletonFrame = false;
                }
                else
                {
                    DepthImageFrame frame = e.OpenDepthImageFrame();
                    Console.WriteLine("\tImageFrame.FrameNumber: {0}", frame.FrameNumber);
                    //skeletonFrame = new KinectSkeletonFrame(frame.FrameNumber, frame.Timestamp);
                }
            }
            catch {  }
        }

        static void nui_SkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
        {
            try
            {
                skeletonFrame = new KinectSkeletonFrame(e.OpenSkeletonFrame());
                Console.WriteLine("\tSkeletonFrame.FrameNumber: {0}", skeletonFrame.FrameNumber);
                newSkeletonFrame = true;
            }
            catch { Console.WriteLine("Failed in nui_SkeletonFrameReady"); }
        }


    }
}
