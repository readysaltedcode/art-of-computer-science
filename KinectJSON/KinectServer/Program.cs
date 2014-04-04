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
        public static int fps = 30;
        public static int mspf = 1000 / fps;

        public static Stopwatch stopwatch = new Stopwatch();
        private static KinectDriver kinectDriver;
        private static Server server;

        static void Main(string[] args)
        {
            kinectDriver = new KinectDriver();
            server = new Server(kinectDriver);
            server.logging = true;
            if (args.Count() == 1) Server.serverEP = args[0];

            server.StartServer(); // blocks till exit
        }

    }
}
