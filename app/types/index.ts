export type TransactionCategory = 'Food' | 'Transportation' | 'Housing' | 'Utilities' | 'Entertainment' | 'Shopping' | 'Healthcare' | 'Other';
export type TransactionType = 'expense' | 'budget';

export interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: string;
  type: TransactionType;
}

export interface MonthlyBudget {
  _id?: string;
  amount: number;
  month: string;
  category: TransactionCategory;
  totalBudget?: number;
  budgets?: MonthlyBudget[];
}

export interface AggregatedBudget {
  month: string;
  totalBudget: number;
  budgets: MonthlyBudget[];
} 