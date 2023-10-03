from statistics import mode 

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

data_list = ['1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g','1','0', '.', '0', 'k', 'g', '4', '.', '0', 'k', 'g', '4', '.', '0', 'k', 'g', '5', '.', '0', 'k', 'g', '0', '.', '0', 'k', 'g','1','0','.','k','g','4','.','0','k','g','1','4','5','.','0','k','g','1','4','5','.','0','k','g','1','4','5','.','0','k','g','1','4','5','.','0','k','g'] #Testing data 

result = extract_float_values(data_list) 

print(data_list)
print(result)
print("The Weights of this Pallet is ",mode(result),"Kg")