const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pserver = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pserver = new P2pserver(bc);

app.use(bodyParser.json())

app.get('/blocks',(req,res)=>{
  res.json(bc.chain);
});

app.post('/mine',(req,res)=>{
  const block =bc.addBlock(req.body.data);
  console.log(`new block added ${block.toString}`);

  res.redirect('/blocks');
});

app.listen(HTTP_PORT,()=>{
   console.log(`Listening on port ${HTTP_PORT}`)
});

p2pserver.listen();
// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
// HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002  npm run dev