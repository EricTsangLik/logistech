from .........users.sapat.documents.personal-projects.logitech-vms-web.logitech-vms-client.python.utils.state import workMode
import RPi.GPIO as GPIO
from serialReceiver import serialReceiver

TXDEN_1 = 27
TXDEN_2 = 22

class serialReceiverPi(serialReceiver):
    def __init__(self, port: str = "/dev/ttyUSB", baudrate: int = 9600, timeout: int = 2, workmode: str = workMode.active):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        if "ttySC0" in port:
            self.TXDEN = TXDEN_1
        else:
            self.TXDEN = TXDEN_2
        GPIO.setup(self.TXDEN, GPIO.OUT)
        GPIO.output(self.TXDEN, GPIO.HIGH)
        super().__init__(port, baudrate, timeout, workmode)

    def write()