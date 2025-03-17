'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, AggregatedBudget } from '@/app/types';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B6B6B',
  '#A8E6CF',
];

export function Dashboard({ transactions }: DashboardProps) {
  const [monthlyBudgets, setMonthlyBudgets] = useState<AggregatedBudget[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchMonthlyBudgets();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      setLastTransaction(transactions[0]);
    }
  }, [transactions]);

  const fetchMonthlyBudgets = async () => {
    try {
      const response = await fetch('/api/monthly-budgets');
      const data = await response.json();
      setMonthlyBudgets(data);
    } catch (error) {
      console.error('Failed to fetch monthly budgets:', error);
    }
  };

  const currentMonthBudget = monthlyBudgets[0]?.totalBudget || 0;
  const currentMonthExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' &&
        transactionDate >= startOfMonth(new Date()) &&
        transactionDate <= endOfMonth(new Date());
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = monthlyBudgets.map(budget => ({
    month: format(new Date(budget.month), 'MMM yyyy'),
    budget: budget.totalBudget,
    spent: transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const budgetMonth = new Date(budget.month);
        return t.type === 'expense' &&
          transactionDate >= startOfMonth(budgetMonth) &&
          transactionDate <= endOfMonth(budgetMonth);
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }));

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyExpensesData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = format(new Date(t.date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
            ₹{currentMonthBudget.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
            ₹{currentMonthExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastTransaction ? (
                <span className={lastTransaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                  {lastTransaction.type === 'expense' ? '-' : '+'}₹{lastTransaction.amount.toFixed(2)}
                </span>
              ) : (
                '₹0.00'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastTransaction ? format(new Date(lastTransaction.date), 'MMM d, yyyy') : 'No transactions'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
            ₹{(currentMonthBudget - currentMonthExpenses).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(categoryData).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(categoryData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(monthlyExpensesData).map(([month, amount]) => ({ month, amount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Budget vs Actual Spends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 