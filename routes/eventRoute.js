const express=require("express");
const pool=require('../db');

const router=express.Router();

let clients=[];

router.get('/', (req, res)=>{
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("connection", "keep-alive");
    res.flushHeaders()

    clients.push(res);
    console.log("A new SSE event is created "+clients.length);
    req.on("close", ()=>{
        console.log("SSE connection disabled");
        clients=clients.filter(client=>client!==res);
    });
});

function broadcast(eventData) {
  clients.forEach(client =>
    client.write(`data: ${JSON.stringify(eventData)}\n\n`)
  );
}

module.exports = { router, broadcast };




