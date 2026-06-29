import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EXPENSE_CATEGORIES } from "@/lib/finance/constants";

export async function GET() {
  let categories = await prisma.expenseCategory.findMany({ orderBy: { name: "asc" } });
  if (categories.length === 0) {
    await prisma.expenseCategory.createMany({
      data: EXPENSE_CATEGORIES.map((name) => ({ name })),
      skipDuplicates: true,
    });
    categories = await prisma.expenseCategory.findMany({ orderBy: { name: "asc" } });
  }
  return NextResponse.json(categories);
}
