require('dotenv').config()
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "./type/socketioEventsType";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:${process.env.APP_PORT}`);
socket.on("heightData", (height)=>  {
    console.log(`test2 receive ${height}`);
})