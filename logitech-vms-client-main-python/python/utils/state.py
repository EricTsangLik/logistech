from enum import Enum

class deviceState(Enum):
    offline = "offline"
    pending = "pending"
    idel = "idel"
    busy = "busy"
    error = "error"
    
class workMode(Enum):
    active = "active"
    passive = "passive"
    modbusRTU = "modbusRTU"
