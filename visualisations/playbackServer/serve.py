import json
from threading import Timer


f = open('data/3.json')
data = json.load(f)
f.close()

numSamples = len(data)
# print numSamples

out = open('api/data.json', 'w', 0)



def getTimestamp(i):
  return int(data[i]['TimeStamp'])

def getIntervalToNext(i0, i1):
  ts0 = getTimestamp(i0)
  ts1 = getTimestamp(i1)
  return (ts1-ts0) / 1000.0


def update(i0, step):
  # step is how many samples to skip before emitting the next sample i.e. step=1 for all samples, step=10 for every tenth sample

  out.seek(0)
  out.writelines([json.dumps(data[i0])])
  out.truncate()
  out.flush()

  # print(ts)

  i1 = (i0 + step) % numSamples

  interval = getIntervalToNext(i0, i1)
  t = Timer(interval, update, [i1, step])
  t.start()


update(0, 4)