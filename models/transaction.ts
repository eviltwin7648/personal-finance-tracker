import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Other'],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'income'],
    default: 'expense',
  },
}, {
  timestamps: true,
});

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema); 