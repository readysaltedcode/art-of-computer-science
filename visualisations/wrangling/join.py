# A temporary script to extend capture data to test size of file that'll reasonably load into browser

import json


f1 = open('alg1.json')
f2 = open('alg2.json')
data1 = json.load(f1)
data2 = json.load(f2)
f1.close()
f2.close()

numSamples1 = len(data1)
numSamples2 = len(data2)
print numSamples1
print numSamples2

out = open('algboth.json', 'w', 0)

extendedData = []

breakts = 155000

for sample in data1:
  ts = sample['TimeStamp']
  if ts < breakts:
    extendedData.append(sample)

for sample in data2:
  ts = sample['TimeStamp'] + breakts
  sample['TimeStamp'] = ts
  extendedData.append(sample)

# print extendedData
out.write(json.dumps(extendedData))