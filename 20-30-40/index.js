const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const createResponse = require("./createResponse");
const { serverPort } = require("./config");
const server = express();

server.use(
  cors({
    origin: "*",
  })
);

server.use(bp.json());

server.listen(serverPort || 3000);

server.post("/ws", (req, res) => res.send(createResponse(req.body)));
