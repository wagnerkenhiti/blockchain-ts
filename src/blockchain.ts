import { Block, Transaction } from "./declarations.ts"
import { createHash } from 'crypto';
import { generateKeyPairSync, createSign, createVerify, privateEncrypt } from 'node:crypto';

export class Wallet{
    publicKey: string;
    amountMoney: number;
    #privateKey: string;
    #sequence: number;
    constructor(walletMoney: number){
        const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
        });
        this.#sequence=0;
        const pukey=publicKey.split('\n')[1]
        this.publicKey = pukey.substring(0,pukey.length-1);
        this.#privateKey = privateKey.split('\n')[1];
        this.amountMoney = walletMoney;
    }

    public getPublicKey():string{
        return this.publicKey;
    }

    public getPrivateKey():string{
        return this.#privateKey;
    }

    public getSequence():number{
        return this.#sequence;
    }

    public addSequence():void{
        this.#sequence++;
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
    #sequence: number;
    constructor(difficulty: number){
        this.#sequence=0;
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

    #merkleRoot(transactions: Transaction[]): string{
        const hashTransactions = transactions.map(tx => tx.id).join("|");
        return this.#generateSHA256(hashTransactions);
    }

    #lastBlockHash(): string{
        const quantityBlock = this.#chain.length;
        const lastBlock = this.#chain[quantityBlock-1];
        const data = [
            lastBlock.header.previousBlock,
            lastBlock.header.merkleRoot,
            lastBlock.header.date,
            lastBlock.header.nonce
        ].join("|")
        return this.#generateSHA256(data);
    }

    public returnBlockchain(): Block[]{
        return this.#chain;
    } 

    public returnMemorypool(): Transaction[]{
        return this.#mempool;
    } 


    
    public setDifficulty(newDifficulty: number): void {
        this.#dificulty = newDifficulty;
    }

    public mineBlock(transactions: Transaction[], miner: string): void{
        
        const merkleRoot=this.#merkleRoot(transactions);
        let date=Date.now();
        let nonce:number=0;

        const valide = (hash: string): boolean => {
            const stringcmp: string = "0".repeat(this.#dificulty);
            return hash.startsWith(stringcmp);
        }

        let stringHash: string;
        do{
            const string2digest: string = `${merkleRoot}|${date}|${this.#lastBlockHash()}|${miner}|${nonce}`;
            stringHash=this.#generateSHA256(string2digest);
            nonce=nonce+1;
        } while(!valide(stringHash));

        const block: Block = {
            header: {
                version: "0",
                merkleRoot: merkleRoot,
                nonce: nonce-1,
                previousBlock: this.#lastBlockHash(),
                date: date,
                difficulty: this.#dificulty,
                miner: miner
                },
            payload: transactions
         }

         this.#chain.push(block)
    }

    public createTransactions(from: Wallet, to: string,amount:number): void{
        const date:number=Date.now();
        const sequence:number=from.getSequence();
        const transaction:Transaction={
            from: from.getPublicKey(),
            to: to,
            amount: amount,
            date: date,
            sequence: sequence,
            id: this.#generateSHA256(`${from}|${to}|${date}|${sequence}`),
            signature: from.getPrivateKey()
        };

        from.addSequence();

        this.#mempool.push(transaction);
    }

}