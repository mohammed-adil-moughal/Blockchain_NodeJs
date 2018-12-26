const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pserver = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool')

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pserver = new P2pserver(bc);

app.use(bodyParser.json())

app.get('/blocks',(req,res)=>{
  res.json(bc.chain);
});

app.post('/mine',(req,res)=>{
  const block =bc.addBlock(req.body.data);
  console.log(`new block added ${block.toString}`);
  
  p2pserver.syncChains();
  res.redirect('/blocks');
});

app.get('/transactions',(req,res) => {
  res.json(tp.transactions)
});

app.post('/transact',(req, res) => {
 const { recepient, amount } =req.body;
 const transaction = wallet.createTransaction(recepient,amount,tp);

 res.redirect('/transactions');
});


app.listen(HTTP_PORT,()=>{
   console.log(`Listening on port ${HTTP_PORT}`)
});

p2pserver.listen();
// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
// HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002  npm run dev