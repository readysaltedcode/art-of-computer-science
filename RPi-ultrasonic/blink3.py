#!/usr/bin/python

# Import required python libaries

import RPi.GPIO as GPIO
from time import sleep

red = 11
yellow = 9
green = 10
led_pin = red

print ("Setting up GPIO")

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(red, GPIO.OUT)
GPIO.setup(yellow, GPIO.OUT)
GPIO.setup(green, GPIO.OUT)

def enable_led(should_enable):
	if should_enable:
		GPIO.output(led_pin, True)
	else:
		GPIO.output(led_pin, False)


for n in range(5):
        enable_led(False)
        led_pin = red
        enable_led(True)
        sleep(.5)

        enable_led(False)
        led_pin = yellow
        enable_led(True)
        sleep(.5)
        
        enable_led(False)
        led_pin = green
        enable_led(True)
        sleep(.5)



enable_led(False)
print("End")
GPIO.cleanup()
