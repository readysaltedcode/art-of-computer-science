using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinectServer
{

    public interface SkeletonEventDispatcher
    {
        void addSkeletonReceiver(SkeletonReceiver listener);
        void removeSkeletonReceiver(SkeletonReceiver listener);
    }
}
