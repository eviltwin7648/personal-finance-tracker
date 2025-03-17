'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { Dashboard } from '../components/Dashboard';
import { MonthlyBudgetForm } from '../components/MonthlyBudgetForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '../types';
import { format } from 'date-fns';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleSubmit = async (data: Omit<Transaction, '_id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create transaction');
      
      await fetchTransactions();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleEdit = async (data: Omit<Transaction, '_id'>) => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update transaction');
      
      await fetchTransactions();
      setEditingTransaction(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete transaction');
      
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleBudgetSubmit = async (data: { amount: number; category: string }) => {
    try {
      const response = await fetch('/api/monthly-budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          month: format(new Date(), 'yyyy-MM'),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to set budget');
      
      setIsBudgetDialogOpen(false);
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <div className="flex gap-2">
          <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Set Monthly Budget</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Monthly Budget</DialogTitle>
              </DialogHeader>
              <MonthlyBudgetForm onSubmit={handleBudgetSubmit} />
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={editingTransaction ? handleEdit : handleSubmit}
                initialData={editingTransaction || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard transactions={transactions} />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionList
            transactions={transactions}
            onEdit={(transaction) => {
              setEditingTransaction(transaction);
              setIsDialogOpen(true);
            }}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
