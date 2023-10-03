import codecs
class dataFrame:
    def __init__(self, byteArray: bytes):
        tempStr = codecs.decode(byteArray)
        self.FBB = int(tempStr[5],16)
        self.LBB = int(tempStr[4],16) 
        self.NBB = self.LBB-self.FBB
    