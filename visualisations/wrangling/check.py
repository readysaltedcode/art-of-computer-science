# A temporary script to extend capture data to test size of file that'll reasonably load into browser

import json


f1 = open('alg1.json')
data1 = json.load(f1)
f1.close()


for sample in data1:
  ts = sample['TimeStamp']
  print ts
