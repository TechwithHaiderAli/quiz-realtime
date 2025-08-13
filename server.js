import express from "express"
import { Server } from "socket.io"
import  http from "http"
import cors from "cors"
import { RegisterEvents } from "./socket/events.js";

const app=express();
app.use(cors())
app.use(express.static("public"));
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:"*"}});

RegisterEvents(io);

const PORT=process.env.PORT || 4000

server.listen(PORT,()=>{
    console.log("Server is Running at port 4000")
})