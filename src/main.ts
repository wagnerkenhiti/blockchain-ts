import { Blockchain, Wallet } from './blockchain.ts'
import { Transaction } from './declarations.ts';
const blockchain=new Blockchain(1);
const bob=new Wallet(50);
const alice=new Wallet(30);

let transactions:Transaction[]=[];
blockchain.createTransactions(bob,alice.getPublicKey(),20);

console.log(bob.getPrivateKey());

blockchain.mineBlock(transactions,alice.getPublicKey());

console.log(JSON.stringify(blockchain.returnBlockchain(), null, 2));
