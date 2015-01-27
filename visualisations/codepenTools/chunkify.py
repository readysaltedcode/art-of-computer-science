import json
from threading import Timer
from math import ceil
from sys import argv

if len(argv) != 4:
  print("Usage: python chunkify.py <chunksize> <inputfile> <outputprefix>")
  print("The chunks are written as <outputprefix>_<number>.json")
  exit(0);

dataset_name=argv[3]
chunk_size = int(argv[1])
jsonp_callback="ChunkReceived"

f = open(argv[2])
data = json.load(f)
f.close()

num_chunks = int(ceil(len(data)/chunk_size))

for chunk_index in range(0,num_chunks):
  out = open(dataset_name+'_'+str(chunk_index)+'.json', 'w', 0)
  jsonout = {'ChunkNumber':str(chunk_index), 'TotalChunks': num_chunks, 'Frames': data[chunk_index*chunk_size:(chunk_index+1)*chunk_size]}
  out.writelines(jsonp_callback+'('+json.dumps(jsonout)+');')
  out.close

