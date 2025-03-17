import mongoose from 'mongoose';
import { MonthlyBudget } from '../types';

const monthlyBudgetSchema = new mongoose.Schema<MonthlyBudget>({
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Other']
  }
});

export const MonthlyBudgetModel = mongoose.models.MonthlyBudget || mongoose.model<MonthlyBudget>('MonthlyBudget', monthlyBudgetSchema); 