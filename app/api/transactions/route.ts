import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Transaction } from '@/models/transaction';

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const transaction = await Transaction.create(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
} 