import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { MonthlyBudgetModel } from '@/models/monthlyBudget';


export async function GET() {
    try {
        await connectDB();
        const budgets = await MonthlyBudgetModel.aggregate([
            {
                $group: {
                    _id: "$month",
                    totalBudget: { $sum: "$amount" },
                    budgets: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    month: "$_id",
                    totalBudget: 1,
                    budgets: 1,
                    _id: 0
                }
            },
            { $sort: { month: -1 } }
        ]);
        console.log("Monthly budgets:", budgets);
        return NextResponse.json(budgets);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch monthly budgets' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();

        const budget = await MonthlyBudgetModel.create(body);
        return NextResponse.json(budget, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: 'Failed to create monthly budget' }, { status: 500 });
    }
} 