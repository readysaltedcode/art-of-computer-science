using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinectServer
{
    /**
     * Records KinectDriver frames for playback later
     */
    class FrameRecorder : SkeletonReceiver
    {
        /**
         * Singleton!  Use!
         */
        private static FrameRecorder _instance;
        public static FrameRecorder getInstance()
        {
            if (_instance == null)
                _instance = new FrameRecorder();
            return _instance;

        }
        private FrameRecorder() { }

        private LinkedList<KinectSkeletonFrame> frames = new LinkedList<KinectSkeletonFrame>();

        public void receiveFrame(KinectSkeletonFrame frame)
        {
            lock (frames) frames.AddLast(frame);
        }

        public LinkedList<KinectSkeletonFrame> GetFrames()
        {
            return frames;
        }

        public void Clear()
        {
            frames.Clear();
        }
    }
}
