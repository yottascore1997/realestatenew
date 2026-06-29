import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { EXPENSE_CATEGORIES } from "@/lib/finance/constants";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    let categories = await prisma.expenseCategory.findMany({ orderBy: { name: "asc" } });
    if (categories.length === 0) {
      await prisma.expenseCategory.createMany({
        data: EXPENSE_CATEGORIES.map((name) => ({ name })),
        skipDuplicates: true,
      });
      categories = await prisma.expenseCategory.findMany({ orderBy: { name: "asc" } });
    }
    return NextResponse.json(categories);
  } catch (err) {
    console.error("Expense categories API error:", err);
    return NextResponse.json(EXPENSE_CATEGORIES.map((name) => ({ id: name, name })));
  }
}
