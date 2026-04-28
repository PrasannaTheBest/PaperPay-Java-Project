export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  status: 'completed' | 'pending' | 'failed';
  riskScore?: number;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', merchant: 'Swiggy', amount: 450, date: new Date().toISOString(), type: 'expense', category: 'Food', status: 'completed' },
  { id: 'tx-2', merchant: 'Zomato', amount: 820, date: new Date(Date.now() - 86400000).toISOString(), type: 'expense', category: 'Food', status: 'completed' },
  { id: 'tx-3', merchant: 'Salary', amount: 85000, date: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'income', category: 'Income', status: 'completed' },
  { id: 'tx-4', merchant: 'Amazon', amount: 2499, date: new Date(Date.now() - 86400000 * 3).toISOString(), type: 'expense', category: 'Shopping', status: 'completed' },
  { id: 'tx-5', merchant: 'Netflix', amount: 649, date: new Date(Date.now() - 86400000 * 4).toISOString(), type: 'expense', category: 'Entertainment', status: 'completed' },
];

export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Food', limit: 15000, spent: 8400, color: 'yellow' },
  { id: 'cat-2', name: 'Transport', limit: 5000, spent: 3200, color: 'blue' },
  { id: 'cat-3', name: 'Shopping', limit: 10000, spent: 12500, color: 'pink' },
  { id: 'cat-4', name: 'Bills', limit: 20000, spent: 18000, color: 'green' },
];
