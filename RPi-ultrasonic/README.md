Art of Computer Science
=======================

##Raspberry Pi Workshop##
##Python GPIO Project##

The three Python scripts used in the workshop to test the ultrasonic sensor, test the LEDs and combine the two elements together. This creates a basic simulation of a parking sensor.

**ultrasonic2.py** - Takes three measurements from the ultrasonic sensor and calculates the average. This is displayed and one second later it takes another average. By Matt Hawkins [Raspberry Pi Spy](http://www.raspberrypi-spy.co.uk/2013/01/ultrasonic-distance-measurement-using-python-part-2/)

**blink3.py** - Flashes the three LEDS, in sequence, 5 times.

**ultrasonicsensor.py** - The complete script that takes three measurements from the ultrasonic sensor and then lights up a single LED dependant on the distance measured.

**ultrasonic_minecraft.py** - A modified version of *ultrasonicsensor.py* that as well as lighting up the LEDs, build blocks of the appropriate colour in Minecraft running on the local machine.