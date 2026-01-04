export interface Transaction{
    from: string;
    to: string;
    amount: number;
    timestamp: number;
    sequence: number;
    id: string; //hash -> from + to + amount + timestamp + sequence
    signature: string;
}

export interface Block{
    header: {
        version: string;
        merkleRoot: string;
        nonce: number;
        previousBlock: string;
        date: number;
        difficulty: number;
        miner: string;
    }
    payload: Transaction [];
}

