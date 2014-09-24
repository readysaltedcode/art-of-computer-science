# A temporary script to extend capture data to test size of file that'll reasonably load into browser

import json


f = open('../playbackServer/data/3.json')
data = json.load(f)
f.close()

numSamples = len(data)
# print numSamples

out = open('big.json', 'w', 0)

extendedData = []

def normaliseTimestamps():
  basets = int(data[0]['TimeStamp'])
  for sample in data:
    sample['TimeStamp'] = int(sample['TimeStamp']) - basets

def roundPositions():
  for sample in data:
    for skeleton in sample['Skeletons']:
      for joint in skeleton['Joints']:
        joint['Position']['X'] = round(joint['Position']['X'], 3)
        joint['Position']['Y'] = round(joint['Position']['Y'], 3)
        joint['Position']['Z'] = round(joint['Position']['Z'], 3)

def appendData(startTs):
  for sample in data:
    newsample = {}

    if(len(sample['Skeletons']) > 0):
      newsample['TimeStamp'] = int(sample['TimeStamp']) + startTs
      newsample['Skeletons'] = [sample['Skeletons'][0]]
      extendedData.append(newsample)

def latestts():
  return extendedData[len(extendedData) - 1]['TimeStamp'] + 30

normaliseTimestamps()
roundPositions()

appendData(0)

# lastts = extendedData[len(extendedData) - 1]['TimeStamp'] + 30
for i in range(0, 8):
  appendData(latestts())


for sample in extendedData:
  print sample['TimeStamp']

print len(extendedData)

out.write(json.dumps(extendedData))