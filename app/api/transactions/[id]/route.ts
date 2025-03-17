import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Transaction } from '@/models/transaction';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectDB();
    const transaction = await Transaction.findById(params.id);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    await connectDB();
    
    const transaction = await Transaction.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await connectDB();
    const transaction = await Transaction.findByIdAndDelete(params.id);
    
    if (!transaction) {

      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 