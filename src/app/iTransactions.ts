
export interface iTransactions {
    transactionId: string;
    position: number;
    receiver: string;
    amount: number;
    currentBalance: number;
    sender: string;
    type: string;
    timestamp: number;
  }