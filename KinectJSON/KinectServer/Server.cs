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
        private HttpListener httpServer;

        public bool logging = false;
        public static int INT64_BYTES = BitConverter.GetBytes(Int64.MaxValue).Length;
        public static int DOUBLE_BYTES = BitConverter.GetBytes(Double.MaxValue).Length;

        private SkeletonEventDispatcher source;
        private Boolean running = false;

        public Server(SkeletonEventDispatcher source)
        {
            this.source = source;
        }

        /** 
         * Run a blocking server
         */
        public void StartServer()
        {
            if (running) return;
            running = true;
            if (logging) Console.WriteLine("Listening on remoteEP "+serverEP);
            Run();
        }

        private void Connect()
        {
            if (httpServer == null)
            {
                httpServer = new HttpListener();
                httpServer.Prefixes.Add(serverEP);
                httpServer.Start();
            }
            
            HttpListenerContext clientContext = httpServer.GetContext();
            ServerTask spawnClient = new ServerTask(clientContext, source, logging);
            Console.WriteLine("Spawning client");
        }

        private void Run()
        {
            while (running){

                if(logging)Console.WriteLine("Waiting for a connection");
                Connect();
            }
        }
    }
}
