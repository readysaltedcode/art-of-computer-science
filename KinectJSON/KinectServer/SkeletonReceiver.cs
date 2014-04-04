using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinectServer
{
    public interface SkeletonReceiver
    {
        void receiveFrame(KinectSkeletonFrame frame);
    }
}
