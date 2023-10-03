require('dotenv').config()
import {SerialPort} from 'serialport';
import * as ss from 'simple-statistics';
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "./type/socketioEventsType";


function extractFloatValues(lst: any[]): number[] {
  const floatValues: number[] = [];
  let currentValue = "";

  for (const item of lst) {
    if (typeof item === "string" && /^\d+$/.test(item)) {
      currentValue += item;
    } else if (typeof item === "string" && item === ".") {
      currentValue += item;
    } else {
      if (currentValue) {
        try {
          const floatValue = parseFloat(currentValue);
          floatValues.push(floatValue);
        } catch (error) {
          // Ignore parsing errors
        }
      }
      currentValue = "";
    }
  }

  if (currentValue) {
    try {
      const floatValue = parseFloat(currentValue);
      floatValues.push(floatValue);
    } catch (error) {
      // Ignore parsing errors
    }
  }

  return floatValues;
}
const Numbers: string[] = [];
const data: string[] = [
  "1", "0", ".", "0", "k", "g",
  "1", "0", ".", "0", "k", "g",
  "1", "0", ".", "0", "k", "g",
  "1", "0", ".", "0", "k", "g",
  "1", "0", ".", "0", "k", "g",
  "1", "0", ".", "0", "k", "g",
  "4", ".", "0", "k", "g",
  "4", ".", "0", "k", "g",
  "5", ".", "0", "k", "g",
  "0", ".", "0", "k", "g",
  "1", "0", ".", "k", "g",
  "4", ".", "0", "k", "g",
  "1", "4", "5", ".", "0", "k", "g",
  "1", "4", "5", ".", "0", "k", "g",
  "1", "4", "5", ".", "0", "k", "g",
  "1", "4", "5", ".", "0", "k", "g",
  "1", "4", "5", ".", "0", "k", "g",
];
for (const line of data) {
  const x = line.trim();
  Numbers.push(x);
}
// Mode implementation
function mode(numbers: number[]): number | undefined {
  const frequency = new Map<number, number>();
  let maxCount = 0;
  let maxValue: number | undefined;

  for (const number of numbers) {
    const count = (frequency.get(number) ?? 0) + 1;
    frequency.set(number, count);

    if (count > maxCount) {
      maxCount = count;
      maxValue = number;
    }
  }

  return maxValue;
}
const results = mode(extractFloatValues(Numbers));

console.log("The Weights of This Pallet is:", results, "KG");
console.log(extractFloatValues(Numbers));


const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:${process.env.APP_PORT}`);
socket.emit('heightData', [1234]);

//socket.emit('heightData', [results]);