from statistics import mode
import time 
import random

start_time = time.time()

numbers = []

while time.time() - start_time < 0.5:
    number = random.randint(1,100)
    weights = str(number) + "kg"
    numbers.append(weights)

print(numbers)
print("The Weights of this pallet is:", mode(numbers))



