from statistics import mode 
import time 
import serial 

def extract_float_values(lst): #This is a function that extract float value from raw data 
    float_values = []
    current_value = ""

    for item in lst:
        if isinstance(item, str) and item.isdigit():
            current_value += item
        elif isinstance(item, str) and item == '.':
            current_value += item
        else:
            if current_value:
                try:
                    float_value = float(current_value)
                    float_values.append(float_value)
                except ValueError:
                    pass
            current_value = ""

    if current_value:
        try:
            float_value = float(current_value)
            float_values.append(float_value)
        except ValueError:
            pass

    return float_values


port = serial.Serial('Com9', baudrate=9600, timeout=1) #This is setting of port for connecting scale

start_time = time.time() 
#data_list = []

data_list = ['1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g', '4', '.', '0', 'k', 'g', '4', '.', '0', 'k', 'g', '5', '.', '0', 'k', 'g', '0', '.', '0', 'k', 'g','1','0','.','k','g','4','.','0','k','g','1','4','5','.','0','k','g','1','4','5','.','0','k','g','1','4','5','.','0','k','g','1','4','5','.','0','k','g'] #Testing data 

while time.time() - start_time <0.5: #Main Function reading data in 0.5s
    data = port.read(100) #100 bytes of data read 
    if data:
        decoded_data = data.decode()
        data_list.append(decoded_data) #appending data to data_list 

result = extract_float_values(data_list)

print(result)
print("The Weights of this Pallet is ",mode(result),"Kg")
