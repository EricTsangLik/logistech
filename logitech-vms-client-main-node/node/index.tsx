require('dotenv').config()
import express from "express";
import { createServer } from "http";
import {Socket, Server} from "socket.io";
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "./type/socketioEventsType";

const app = express();
const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const redirectEvents = ["lengthData", "widthData", "heightData", "weightData", 
  "healthCheck", "imgData", "pointCloudData", "horizontalData", "verticalData"];

io.on('connection', (socket: Socket) => {
  socket.data.name = "testing";

  redirectEvents.forEach((v, i) => {
    socket.on(v, (data: any)=>{
      io.emit(v as keyof ServerToClientEvents, data);
    });
  })

  socket.on("packageData", ()=>{
    
  })

})

httpServer.listen( process.env.APP_PORT || 3000, () => {
  console.log(`Listening on port ${process.env.APP_PORT}`);
  console.log(`http://localhost:${process.env.APP_PORT}`);
});
