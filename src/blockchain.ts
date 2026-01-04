import { Block, Transaction } from "./declarations.ts"
import { createHash } from 'crypto';
import { generateKeyPairSync, createSign, createVerify, privateEncrypt } from 'node:crypto';

export class Wallet{
    publicKey: string;
    amountMoney: number;
    #privateKey: string;

    constructor(walletMoney: number){
        const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
        });

        this.publicKey = publicKey;
        this.#privateKey = privateKey;
        this.amountMoney = walletMoney;
    }

    public money(): number{
        return this.amountMoney;
    }
    public addMoney(value: number){
        this.amountMoney=value+this.amountMoney;
    }
}

export class Blockchain{
    #chain: Block[] = [];
    #mempool: Transaction[] = [];
    #dificulty: number;
    constructor(difficulty: number){
        this.#dificulty = difficulty;
        const blockGenesis: Block = {
            header: {
                version:"0",
                merkleRoot:"0",
                nonce:0,
                previousBlock:"0",
                date: Date.now(),
                difficulty: 0,
                miner:""
                },
                payload: []
        }
        this.#chain.push(blockGenesis);
        }

    #generateSHA256(data: string): string{
        return createHash("sha256").update(data).digest("hex");
    }

    #calculateHash(block:Block){
        const data = [
            block.header.previousBlock,
            block.header.merkleRoot,
            block.header.date,
            block.header.nonce
        ].join("|")
        return this.#generateSHA256(data);
    }

    #merkleRoot(transactions: Transaction[]): string{
        const hashTransactions = transactions.map(tx => tx.id).join("|");
        return this.#generateSHA256(hashTransactions);
    }

    #lastBlockHash(): string{
        const quantityBlock = this.#chain.length;
        return this.#calculateHash(this.#chain[quantityBlock-1]);
    }

    public returnBlockchain(): Block[]{
        return this.#chain;
    } 

    public returnMemorypool(): Transaction[]{
        return this.#mempool;
    } 

    public mineBlock(transactions: Transaction[], miner: string): void{
         
    }

    public createTransactions(){

    }

}