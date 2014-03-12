using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinectServer
{
    class Assert
    {
        internal static void AreEqual(long startTime, long startTicks)
        {
            if (Math.Abs(startTime - startTicks) > 1)
                throw new NotImplementedException();

        }

        internal static void AreEqual(TimeSpan startTime, TimeSpan startTicks)
        {
            if (Math.Abs(startTime.Milliseconds - startTicks.Milliseconds) > 1)
                throw new NotImplementedException();
        }
    }
}
