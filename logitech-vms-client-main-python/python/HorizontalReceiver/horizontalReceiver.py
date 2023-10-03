import RS485receiver
from time import time
import socketio
import os   
from dataFrame import dataFrame
from state import deviceState

class horizontalReceiver(RS485receiver):
    def __init__(self)-> None:
        self.deviceID:str = os.getenv("DEVICE_ID")
        self.deviceType: str = "Horizontal Receiver"
        self.Points: list[list[int]] = []
        self._isRunning: bool = False
        self._isCapture: bool = False
        self._state = deviceState.offline
        self.io = socketio.Client(logger=False, engineio_logger=False)
        self.ioConnect()
        super().__init__(port = os.getenv("RS485_PORT_HORIZONTAL"), 
                        baudrate = os.getenv("RS485_BAUDRATE_HORIZONTAL"),
                        timeout = int(os.getenv("RS485_TIMEOUT_HORIZONTAL"))
        )
        return
        
    def ioConnect(self) -> None:
        self.io.on('deviceHealthCheck', self.ioHealthCheck)
        self.io.on('deviceControl', self.ioControl)
        self.io.connect(f'ws://{os.getenv("SOCKETIO_HOST")}:{os.getenv("SOCKETIO_PORT")}')
        return
    
    def ioUpdateState(self)-> None:
        self.io.emit("deviceState",{
            "deviceID": self.deviceID,
            "deviceType": self.deviceType,
            "state": self._state
        })
        return
    
    def ioControl(self, state: bool) -> None:
        self._isRunning = state
        return
        
    def ioHealthCheck(self)-> None:
        if self.ser.isOpen() and self._isRunning:
            if self._isCapture:
                self._state  = deviceState.busy
            else:
                self._state = deviceState.idel
        else:
            self._state = deviceState.offline
        self.ioUpdateState()
        return
        
    def read(self):
        if self.ser.isOpen():
            try:
                response = self.ser.read()
                res: bytes = b''
                while response != b"\x01":
                    response = self.ser.read()
                response
                res +=  self.ser.read()
                dataLength = self.ser.read()
                res += dataLength
                res += self.ser.read(int(dataLength))
                return True, res
            except Exception as e1:
                return False, None
        else:
            return False, None
        
    def capture(self, start_time: float) -> None:
        self._isCapture = True
        self.ioUpdateState()
        while self._isCapture:
            ret, res = self.read()
            if ret:
                current_time = time()
                data = dataFrame(res)
                if data.NBB >0:
                    self.Points.append([data.FBB, current_time-start_time])
                    self.Points.append([data.LBB, current_time-start_time])
                else: 
                    self.sendSocketData()
                    # print("MLG_H:",result)
                    # print(f"Process time: {current_time-start_time} sec")
                    self._isCapture = False
                    return
    
    def sendSocketData(self) -> None:
        self.io.emit("horizontalData", self.Points)
        return
        
    def run(self):
        self._isRunning = True
        self.ioUpdateState()
        self.ser.flushInput() #flush input buffer
        self.ser.flushOutput() #flush output buffer
        while self._isRunning:
            ret, res = self.read()
            if ret:
                self.Points.clear()
                data = dataFrame(res)
                self.Points.append([data.FBB,0])
                self.Points.append([data.LBB,0])
                self.capture(time())
        self.close()
        
def main():
    test = horizontalReceiver()
    test.run()
    
   
if __name__=='__main__':
    main()