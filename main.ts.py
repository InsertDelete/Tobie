# This is a rather straightforward translation of main.ts to MicroPython.

from microbit import *
from time import *

display.show(Image.YES, delay=100, wait=False, clear=True)

Motor_R = False
Motor_L = False
Force = 10

# Read the value sensed by the right side of the infrared sensor.
    
def Read_RBlock():
	sleep_ms(100)
	ADL_R = pin2.read_analog()
	pin12.write_digital(1)
	sleep_us(250)
	ADH_R = pin2.read_analog()
	pin12.write_digital(0)

	if pin8.read_digital():
		return ADH_R - ADL_R

# Read the value sensed by the left side of the infrared sensor.

def Read_LBlock():
    sleep_ms(100)
    ADL_L = pin1.read_analog()
    pin12.write_digital(1)
    sleep_us(250)
    ADH_L = pin1.read_analog()
    pin12.write_digital(0)

    return ADH_L - ADL_L

# Determine if there are obstacles on the right side.

def RBlock(threshold=512):
    sleep_ms(100)
    ADL_R = pin2.read_analog()
    pin12.write_digital(1)
    sleep_us(250)
    ADH_R = pin2.read_analog()
    pin12.write_digital(0)

    return ADH_R - ADL_R > threshold and pin8.read_digital()

# Determine if there are obstacles on the left side.

def LBlock(threshold=512):
    sleep_ms(100)
    ADL_L = pin1.read_analog()
    pin12.write_digital(1)
    sleep_us(250)
    ADH_L = 0
    pin12.write_digital(0)

    if pin8.read_digital():
        ADH_L = pin1.read_analog()
        pin12.write_digital(0)

    return ADH_L - ADL_L > threshold

# Tobbie-II walks forward.

def forward():
    if pin8.read_digital():
        pin13.write_digital(1)
        pin14.write_digital(0)

def backward():
    global Force
    if Force:
        pin13.write_digital(0)
        pin14.write_digital(1)
        Force = Force - 1
    if pin8.read_digital:
        Force = 10 

# Tobbie-II stops walking.

def stopwalk():
    pin13.write_digital(0)
    pin14.write_digital(0)

# Tobbie-II rotates to the right.

def rightward():
    pin15.write_digital(0)
    pin16.write_digital(1)
    Motor_L = False
    Motor_R = True

# Tobbie-II rotates to the left.

def leftward():
    pin15.write_digital(1)
    pin16.write_digital(0)
    Motor_L = True
    Motor_R = False

# Tobbie-II stops rotating.

def stopturn():
    global Motor_L, Motor_R
    if Motor_L or Motor_R:
        if Motor_R:
            pin15.write_digital(1)
            pin16.write_digital(0)
        else:
            pin15.write_digital(0)
            pin16.write_digital(1)
        sleep_ms(50)

    if pin8.read_digital():
        pin15.write_digital(0)
        pin16.write_digital(0)
        Motor_L = False
        Motor_R = False

# Tobbie-II stamps his foot for a certain number of times.

def vibrate(time):
    for i in range(time):
        pin13.write_digital(1)
        pin14.write_digital(0)
        sleep_ms(150)
        pin13.write_digital(0)
        pin14.write_digital(1)
        sleep_ms(150)
    pin13.write_digital(0)
    pin14.write_digital(0)

# Tobbie-II shakes his head for a certain number of times.

def shake_head(time):
    for i in range(time):
        pin15.write_digital(1)
        pin16.write_digital(0)
        sleep_ms(250)
        pin15.write_digital(0)
        pin16.write_digital(1)
        sleep_ms(250)
    pin15.write_digital(0)
    pin16.write_digital(0)

# Tobbie-II repeats the dance for for a certain number of times.

def dance(time):
    for i in range(time):
        pin13.write_digital(0)
        pin14.write_digital(1)
        pin15.write_digital(0)
        pin16.write_digital(1)
        sleep_ms(250)
        pin13.write_digital(1)
        pin14.write_digital(0)
        pin15.write_digital(1)
        pin16.write_digital(0)
        sleep_ms(250)
    pin13.write_digital(0)
    pin14.write_digital(0)
    pin15.write_digital(0)
    pin16.write_digital(0)

if True:
    Read_RBlock()
    Read_LBlock()
    RBlock(threshold=512)
    LBlock(threshold=512)
    forward()
    backward()
    stopwalk()
    rightward()
    leftward()
    stopturn()
    vibrate(3)
    shake_head(3)
    dance(3)

display.show(Image.HAPPY, delay=500, wait=True, clear=True)

