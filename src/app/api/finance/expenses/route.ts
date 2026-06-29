import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  const expenses = await prisma.expense.findMany({
    include: { category: true, project: true, vendor: true, approvedBy: true },
    orderBy: { expenseDate: "desc" },
  });
  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.expense.count();
  const expenseNumber = `EXP-${String(count + 1).padStart(5, "0")}`;
  const amount = Number(body.amount);
  const gstAmount = Number(body.gstAmount ?? 0);
  const totalAmount = amount + gstAmount;
  const needsApproval = amount >= 50000;

  const expense = await prisma.expense.create({
    data: {
      expenseNumber,
      categoryId: body.categoryId,
      projectId: body.projectId || null,
      vendorId: body.vendorId || null,
      amount,
      gstAmount,
      totalAmount,
      expenseDate: body.expenseDate ? new Date(body.expenseDate) : new Date(),
      description: body.description,
      billUrl: body.billUrl,
      status: needsApproval ? "PENDING" : "APPROVED",
      approvedById: needsApproval ? null : body.approvedById,
      gstTransactions: gstAmount > 0 ? {
        create: { type: "PAID", amount: gstAmount, description: `GST on ${expenseNumber}` },
      } : undefined,
    },
    include: { category: true, project: true, vendor: true },
  });

  if (!needsApproval) {
    await prisma.companyLedgerEntry.create({
      data: {
        type: "EXPENSE",
        category: body.categoryName ?? "Expense",
        description: `${expenseNumber}: ${body.description ?? ""}`,
        amount: totalAmount,
        balance: 0,
      },
    });
  }

  return NextResponse.json(expense, { status: 201 });
}
