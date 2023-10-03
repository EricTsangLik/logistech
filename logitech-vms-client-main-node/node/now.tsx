require('dotenv').config()
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "./type/socketioEventsType";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:${process.env.APP_PORT}`);

console.log("This is now.tsx");

socket.on("heightData", (height) => {
  const dataContainer = document.getElementById("dataContainer");
  if (dataContainer) {
    dataContainer.innerText = `Received height data: ${height}`;
  }
});