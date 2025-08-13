import http from "http";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import { RegisterEvents, __sessions } from "./socket/events.js";


const waitFor = (emitter, event) => new Promise((resolve) => emitter.once(event, resolve));

(async () => {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: "*" } });
  RegisterEvents(io);

  await new Promise((res) => httpServer.listen(0, res));
  const port = httpServer.address().port;
  const serverAddress = `http://localhost:${port}`;

  const mkClient = () => Client(serverAddress, { transports: ["websocket"], forceNew: true });

  const admin = mkClient();
  admin.emit("create-session");
  const { sessionId } = await waitFor(admin, "session-created");
  console.log("Session created:", sessionId);
    await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  const questions = [
    { title: "2+2?", options: ["3", "4"], answer: "4" },
    { title: "Capital of France?", options: ["Paris", "Rome"], answer: "Paris" },
  ];
  admin.emit("add-question", { questions, sessionId });
  console.log(await waitFor(admin, "add-question-success"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  const alice = mkClient();
  const bob = mkClient();

  alice.emit("join", { userId: "alice", sessionId });
  console.log(await waitFor(alice, "join-success"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  bob.emit("join", { userId: "bob", sessionId });
  console.log(await waitFor(bob, "join-success"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  admin.emit("start-session", { sessionId });
  console.log("Alice got question:", await waitFor(alice, "question"));
  console.log("Bob got question:", await waitFor(bob, "question"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  alice.emit("submit-answer", { userId: "alice", sessionId, option: "4" });
  console.log("Alice result:", await waitFor(alice, "answer-result"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  bob.emit("submit-answer", { userId: "bob", sessionId, option: "3" });
  console.log("Bob result:", await waitFor(bob, "answer-result"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  admin.emit("next-question", { sessionId });
  console.log("Alice got question:", await waitFor(alice, "question"));
  console.log("Bob got question:", await waitFor(bob, "question"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  admin.emit("end-session", { sessionId });
  console.log("Alice end:", await waitFor(alice, "session-ended"));
  console.log("Bob end:", await waitFor(bob, "session-ended"));
await new Promise((resolve,reject)=>setTimeout(resolve,1000))
  admin.close();
  alice.close();
  bob.close();
  io.close();
  httpServer.close();
})();