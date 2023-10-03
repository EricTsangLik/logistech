import serial
import codecs
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
import RPi.GPIO as GPIO
from state import workMode

class serialReceiver:
    def __init__(self, port: str = "/dev/ttyUSB", baudrate: int = 9600, timeout: int= 2, workmode: str = workMode.active):
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.workmode = workmode
        self.initSerial()

    def initSerial(self, workmode):
        self.workmode = workmode
        if self.workmode in [workMode.active, workMode.passive]:
            self.ser = serial.Serial()
            self.ser.port = self.port
            self.ser.baudrate = self.baudrate
            self.ser.bytesize = serial.EIGHTBITS #number of bits per bytes
            self.ser.parity = serial.PARITY_NONE #set parity check
            self.ser.stopbits = serial.STOPBITS_ONE #number of stop bits
            self.ser.timeout = round(self.timeout,2)          #non-block read 0.5s
            self.ser.write_timeout = round(self.timeout,2)     #timeout for write 0.5s
            self.ser.xonxoff = False    #disable software flow control
            self.ser.rtscts = False     #disable hardware (RTS/CTS) flow control
            self.ser.dsrdtr = False     #disable hardware (DSR/DTR) flow control
        elif self.workmode in [workMode.modbusRTU]:
            self.ser = ModbusClient(method='rtu', port=self.port, timeout=self.timeout,
                                baudrate=self.baudrate)
        else:
            print("WorkMode is not supported")
            exit(1)

    def connect(self):
        try:
            if self.workmode in [workMode.active, workMode.passive]:
                self.ser.open()
            else:
                self.ser.connect()
        except Exception as ex:
            print ("open serial port error " + str(ex))
            exit(1)
    
    def readUart(self, endbyte: bytes, numOfbytes: int):
        if self.ser.isOpen():
            try:
                self.ser.flushInput() #flush input buffer
                self.ser.flushOutput() #flush output buffer
                if endbyte != None:
                    response = self.ser.read_until(endbyte)
                elif numOfbytes != None:
                    response = self.ser.read(numOfbytes)
                else:
                    response = self.ser.read_all()
                return True, response
            except Exception as e:
                return False, None
        else:
            return False, None
    
    def readModbus(self, address: int = 0, count: int = 1, unit: int = 1):
        try:
            response = self.ser.read_holding_registers(address=address,count=count,unit=unit)
            data = response.registers
            return True, data
        except Exception as e:
            # print(e)
            return False, None, None

    def read(self, data: dict = {"numOfbyte": 1, "address": 0, "count": 1, "unit": 1}):
        if self.workmode in [workMode.active, workMode.passive]:
            return self.readUart()
        else:
            return self.readModbus(address=data["address"], count=data["count"], unit=data["unit"])
        
    def writeUart(self, msg: bytes = b""):
        if self.ser.isOpen():
            res = self.ser.write(msg)
            return True, res
        else:
            return False, None

    def writeModbus(self, address: int = 0, value: int = 0, slave: int = 0):
        if self.ser.isOpen():
            res = self.ser.write_register(address=address,value=value,slave=slave)
            return True, res
        else:
            return False, None

    def write(self, data: dict = {"msg": b"", "address": 0, "value": 1, "slave": 1}):
        if self.workmode in [workMode.active, workMode.passive]:
            return self.writeUart()
        else:
            return self.writeModbus(address=data["address"], value=data["value"], slave=data["slave"])
    
    def disconnect(self):
        if self.ser.isOpen():
            self.ser.close()
            return not self.ser.isOpen()
        return not self.ser.isOpen()
 
def main():
    test = RS485receiver(
        port="/dev/ttyUSB0",
        baudrate=9600,
        timeout=2)
    ret, res = test.read()
    print("data: ", res)
    test.disconnect() 
   
if __name__=='__main__':
    main()