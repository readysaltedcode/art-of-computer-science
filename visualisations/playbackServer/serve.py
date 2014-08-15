import json
from threading import Timer


f = open('data/3.json')
data = json.load(f)
f.close()

out = open('api/data.json', 'w', 0)



def getTimestamp(i):
  return int(data[i]['TimeStamp'])

def getIntervalToNext(i, step):
  ts0 = getTimestamp(i)
  ts1 = getTimestamp(i + step)
  return (ts1-ts0) / 1000.0


def update(i, step):
  # step is how many samples to skip before emitting the next sample i.e. step=1 for all samples, step=10 for every tenth sample

  out.seek(0)
  out.writelines([json.dumps(data[i])])
  out.truncate()
  out.flush()

  # print(ts)

  interval = getIntervalToNext(i, step)
  t = Timer(interval, update, [i+step, step])
  t.start()


update(0, 2)