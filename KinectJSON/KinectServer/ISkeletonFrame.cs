using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Kinect;
using System.Collections;
using System.Web.Script.Serialization;
using System.Collections.ObjectModel;

namespace KinectServer
{
    

    public interface ISkeletonFrame
    {
        Int64 TimeStamp { get; }
        int FrameNumber { get; }
        //SkeletonFrameQuality Quality { get; }
        Tuple<float,float,float,float> FloorClipPlane { get; }
        //Vector NormalToGravity { get; }
        ISkeletonCollection Skeletons { get; }
    }

    public interface ISkeletonCollection : IEnumerable
    {
        int Count { get; }
        ISkeletonData this[int index] { get; }
        new IEnumerator GetEnumerator();
    }

    public interface ISkeletonData
    {
        SkeletonTrackingState TrackingState { get; }
        int TrackingID { get; }
        //int EnrollmentIndex { get; }
        //int UserIndex { get; }
        SkeletonPoint Position { get; }
        IJointsCollection Joints { get; }
        //SkeletonQuality Quality { get; }
    }

    public interface IJointsCollection : IEnumerable
    {
        int Count { get; }
        Joint this[JointType i] { get; }
        new IEnumerator GetEnumerator();
    }

    public class KinectSkeletonFrame : ISkeletonFrame
    {
        public KinectSkeletonFrame(SkeletonFrame frame) { _frame = frame; }

        public KinectSkeletonFrame(int FrameNumber, Int64 TimeStamp)
        {
            this._FrameNumber = FrameNumber;
            this._TimeStamp = TimeStamp;
        }

        public Int64 TimeStamp { get { return _frame == null ? this._TimeStamp : _frame.Timestamp; } }
        public int FrameNumber { get { return _frame==null? this._FrameNumber : _frame.FrameNumber; } }
        //public SkeletonFrameQuality Quality { get { return _frame.Quality; } }
        public Tuple<float,float,float,float> FloorClipPlane { get { return _frame.FloorClipPlane; } }
        //public Vector NormalToGravity { get { return _frame.NormalToGravity; } }
        // only returns the skeletons that are being tracked, because otherwise we generate a lot of junk data
        public ISkeletonCollection Skeletons { get {
            Skeleton[] skeletonDump = new Skeleton[_frame.SkeletonArrayLength];
            _frame.CopySkeletonDataTo(skeletonDump);
            ArrayList trimmedSkeletons = new ArrayList();
            foreach (Skeleton trimmableSkeleton in skeletonDump)
            {
                if (trimmableSkeleton.TrackingState != SkeletonTrackingState.NotTracked) trimmedSkeletons.Add(trimmableSkeleton);
            }
            return new KinectSkeletonCollection(trimmedSkeletons.ToArray(typeof(Skeleton)) as Skeleton[]); } }
        private SkeletonFrame _frame;

        private int _FrameNumber;
        private Int64 _TimeStamp;

        private class JointConverter : JavaScriptConverter
        {
            public override IEnumerable<Type> SupportedTypes
            {
                get { return new ReadOnlyCollection<Type>(new List<Type>(new Type[] { typeof(Microsoft.Kinect.Joint) })); }
            }
            public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
            {
                if (obj == null || obj.GetType() != typeof(Joint))
                    return new Dictionary<string, object>();

                Joint joint = (Joint) obj;

                if (joint != null)
                {
                    // Create the representation.
                    Dictionary<string, object> result = new Dictionary<string, object>();
                    result.Add("Position", joint.Position);
                    result.Add("TrackingState", joint.TrackingState);
                    result.Add("JointType", joint.JointType.ToString());
                    return result;
                }
                return new Dictionary<string, object>();
            }

            public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
            {
                throw new NotImplementedException();
            }
        }

        public String toJSON()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            JointConverter jc = new JointConverter();
            serializer.RegisterConverters(new JavaScriptConverter[] { jc });
            String result = serializer.Serialize(this);
            return result;
        }

        private class KinectSkeletonCollection : ISkeletonCollection
        {
            public KinectSkeletonCollection(Skeleton[] skeletons)
            {
                _skeletons = new KinectSkeletonData[skeletons.GetLength(0)];
                int i = 0;
                foreach (Skeleton skeleton in skeletons)
                {
                    _skeletons[i++] = new KinectSkeletonData(skeleton);
                }
            }
            public int Count { get { return _skeletons.GetLength(0); } }
            public ISkeletonData this[int i] { get { return _skeletons[i]; } }
            public IEnumerator GetEnumerator() { return _skeletons.GetEnumerator(); }
            private KinectSkeletonData[] _skeletons;

            private class KinectSkeletonData : ISkeletonData
            {
                public KinectSkeletonData(Skeleton data) { _data = data; }
                public SkeletonTrackingState TrackingState { get { return _data.TrackingState; } }
                public int TrackingID { get { return _data.TrackingId; } }
                //public int EnrollmentIndex { get { return _data.EnrollmentIndex; } }
                //public int UserIndex { get { return _data.UserIndex; } }
                public SkeletonPoint Position { get { return _data.Position; } }
                public IJointsCollection Joints { get { return new KinectJointsCollection(_data.Joints); } }
                //public SkeletonQuality Quality { get { return _data.Quality; } }
                private Skeleton _data;

                private class KinectJointsCollection : IJointsCollection
                {
                    public KinectJointsCollection(JointCollection joints) { _joints = joints; }
                    public int Count { get { return _joints.Count; } }
                    public Joint this[JointType i] { get { return _joints[i]; } }
                    public IEnumerator GetEnumerator() { return _joints.GetEnumerator(); }
                    private JointCollection _joints;
                }
            }
        }

        private static bool logging = KinectServer.Server.logging;
        internal byte[] ToBytes()
        //internal IList<ArraySegment<byte>> ToBytes()
        {
            List<byte> list = new List<byte>();
            list.AddRange(BitConverter.GetBytes(Int32.MaxValue)); // for the length to be set

            byte[] frameNumber = BitConverter.GetBytes((Int64)this.FrameNumber);
            list.AddRange(frameNumber);
            if (logging) Console.WriteLine("*Frame Number: {0}", BitConverter.ToInt64(frameNumber, 0));
            byte[] timeStamp = BitConverter.GetBytes(this.TimeStamp);
            list.AddRange(timeStamp);
            if (logging) Console.WriteLine("*TimeStamp: {0}", BitConverter.ToInt64(timeStamp, 0));

            if (this._frame != null)
            {
                foreach (ISkeletonData skel in this.Skeletons)
                {
                    if (skel.TrackingState != SkeletonTrackingState.NotTracked)
                    {
                        foreach (Joint joint in skel.Joints)
                        {
                            // translation
                            list.AddRange(BitConverter.GetBytes((double)(joint.Position.X)));
                            list.AddRange(BitConverter.GetBytes((double)(joint.Position.Y)));
                            list.AddRange(BitConverter.GetBytes((double)(joint.Position.Z)));

                            ////rotation
                            //list.AddRange(BitConverter.GetBytes((double)(0)));
                            //list.AddRange(BitConverter.GetBytes((double)(0)));
                            //list.AddRange(BitConverter.GetBytes((double)(0)));
                        }
                    }
                }
            }

//            return (IList<ArraySegment<byte>>)list;
            byte[] retVal = list.ToArray<byte>();
            BitConverter.GetBytes(list.Count).CopyTo(retVal, 0); // add the size
            return retVal;
        }
    }
}
