#!/usr/bin/python
#
# bsf_workshop.py
# Measure distance using an ultrasonic module
# in a loop and light leds dependant on distance.
#


# Import required Python libraries

import time
import RPi.GPIO as GPIO


# Define some functions

def measure():
  # This function measures a distance
  GPIO.output(trigger, True)
  time.sleep(0.00001)
  GPIO.output(trigger, False)
  start = time.time()

  while GPIO.input(echo)==0:
    start = time.time()

  while GPIO.input(echo)==1:
    stop = time.time()

  elapsed = stop-start
  distance = (elapsed * 34300)/2

  return distance

def measure_average():
  # This function takes 3 measurements and
  # returns the average.
  distance1=measure()
  time.sleep(0.1)
  distance2=measure()
  time.sleep(0.1)
  distance3=measure()
  distance = distance1 + distance2 + distance3
  distance = distance / 3
  return distance

# Main Script

# Use BCM GPIO references instead of physical pin numbers.
# Also set warnings to False
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Define GPIO to use on Pi
trigger = 17
echo = 27
redled = 11
yellowled = 9
greenled = 10


print "Ultrasonic Measurement"

# Set pins as output and input
GPIO.setup(trigger,GPIO.OUT)    # Trigger
GPIO.setup(echo,GPIO.IN)        # Echo
GPIO.setup(redled,GPIO.OUT)     # Red LED
GPIO.setup(yellowled,GPIO.OUT)  # Yellow LED
GPIO.setup(greenled,GPIO.OUT)   # Green LED

# Set trigger and leds to False (Low)
GPIO.output(trigger, False)
GPIO.output(redled, False)
GPIO.output(yellowled, False)
GPIO.output(greenled, False)

# Wrap main content in a try block so we can
# catch the user pressing CTRL-C and run the
# GPIO cleanup function.
try:

  while True:

    distance = measure_average()
    print "Distance : %.1f" % distance
    if distance < 20:
      GPIO.output(redled, True)
    elif distance < 50:
      GPIO.output(yellowled, True)
    else:
      GPIO.output(greenled, True)
    time.sleep(1)
    # reset leds
    GPIO.output(redled, False)
    GPIO.output(yellowled, False)
    GPIO.output(greenled, False)

except KeyboardInterrupt:
  # User pressed CTRL-C
  # Reset GPIO settings
  GPIO.cleanup()
