from statistics import mode 
import time 

file_path = "/Users/erictsang/Desktop/test.txt"
start_time = time.time()

Numbers = []

while time.time() - start_time < 0.5: 
    with open(file_path, "r") as file:
        for line in file:
            x = line.strip()
            Numbers.append(x)

print("The Weights of This Pallet is:", mode(Numbers))
