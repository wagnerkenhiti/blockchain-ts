import { Blockchain, Wallet } from './blockchain.ts'
import { Transaction } from './declarations.ts';
const blockchain=new Blockchain(2);
const bob=new Wallet(50);
const alice=new Wallet(30);

let transactions:Transaction[]=[];
const newTransaction: Transaction=blockchain.createTransactions(bob.getPublicKey(),alice.getPublicKey(),20,1,bob.getPrivateKey());
transactions.push(newTransaction);

blockchain.mineBlock(transactions,alice.getPublicKey());

console.log(blockchain.returnBlockchain());