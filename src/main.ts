import { Blockchain} from './blockchain.ts'
 
const blockchain=new Blockchain(4);
const maxblock: number=10; 

for(let i: number=0;i<maxblock;i++){
    const block=blockchain.createBlock(`Block ${i}`);
    const mineInfo=blockchain.mineBlock(block);
    blockchain.pushBlock(mineInfo.minedBlock);
}

console.log(blockchain.chain);