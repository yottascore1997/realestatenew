import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { toNumber } from "@/lib/finance/constants";

export const dynamic = "force-dynamic";


export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  const [
    totalBookings,
    allPayments,
    todayPayments,
    monthPayments,
    allExpenses,
    ,
    pendingCommissions,
    gstCollected,
    gstPaid,
    outstandingBookings,
    projectRevenue,
    monthlyPayments,
    monthlyExpenses,
    recentPaymentsRaw,
    recentExpensesRaw,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { paymentDate: { gte: today, lt: tomorrow } }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { paymentDate: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: { status: "APPROVED" }, _sum: { totalAmount: true } }),
    prisma.expense.aggregate({ where: { status: "APPROVED", expenseDate: { gte: monthStart } }, _sum: { totalAmount: true } }),
    prisma.commission.aggregate({ where: { status: { in: ["PENDING", "PARTIAL"] } }, _sum: { commissionAmount: true } }),
    prisma.gstTransaction.aggregate({ where: { type: "COLLECTED" }, _sum: { amount: true } }),
    prisma.gstTransaction.aggregate({ where: { type: "PAID" }, _sum: { amount: true } }),
    prisma.booking.aggregate({ where: { status: { in: ["PENDING", "PARTIAL_PAID"] } }, _sum: { remainingBalance: true } }),
    prisma.booking.groupBy({
      by: ["projectId"],
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" }, projectId: { not: null } },
    }),
    prisma.payment.findMany({
      where: { paymentDate: { gte: yearStart } },
      select: { amount: true, paymentDate: true },
    }),
    prisma.expense.findMany({
      where: { status: "APPROVED", expenseDate: { gte: yearStart } },
      select: { totalAmount: true, expenseDate: true },
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { paymentDate: "desc" },
      include: { booking: { include: { customer: { select: { name: true } }, project: { select: { name: true } } } } },
    }),
    prisma.expense.findMany({
      take: 5,
      orderBy: { expenseDate: "desc" },
      where: { status: "APPROVED" },
      select: {
        id: true,
        description: true,
        totalAmount: true,
        expenseDate: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = toNumber(allPayments._sum.amount);
  const totalExpenses = toNumber(allExpenses._sum.totalAmount);
  const netProfit = totalRevenue - totalExpenses;
  const commissionPayable = toNumber(pendingCommissions._sum.commissionAmount);

  const projects = await prisma.project.findMany({
    where: { id: { in: projectRevenue.map((p) => p.projectId!).filter(Boolean) } },
    select: { id: true, name: true },
  });

  const projectWise = projectRevenue.map((p) => ({
    projectId: p.projectId,
    projectName: projects.find((pr) => pr.id === p.projectId)?.name ?? "Unknown",
    revenue: toNumber(p._sum.totalAmount),
  }));

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue = months.map((m, i) => ({
    month: m,
    revenue: monthlyPayments
      .filter((p) => new Date(p.paymentDate).getMonth() === i)
      .reduce((s, p) => s + toNumber(p.amount), 0),
    expenses: monthlyExpenses
      .filter((e) => new Date(e.expenseDate).getMonth() === i)
      .reduce((s, e) => s + toNumber(e.totalAmount), 0),
  }));

  return NextResponse.json({
    totalSales: totalBookings,
    totalRevenueReceived: totalRevenue,
    pendingCollection: toNumber(outstandingBookings._sum.remainingBalance),
    todaysCollection: toNumber(todayPayments._sum.amount),
    monthlyCollection: toNumber(monthPayments._sum.amount),
    totalExpenses,
    netProfit: netProfit > 0 ? netProfit : 0,
    netLoss: netProfit < 0 ? Math.abs(netProfit) : 0,
    outstandingAmount: toNumber(outstandingBookings._sum.remainingBalance),
    commissionPayable,
    gstCollected: toNumber(gstCollected._sum.amount),
    gstPaid: toNumber(gstPaid._sum.amount),
    gstPending: toNumber(gstCollected._sum.amount) - toNumber(gstPaid._sum.amount),
    monthlyRevenue,
    projectWise,
    cashFlow: {
      received: totalRevenue,
      spent: totalExpenses,
      balance: totalRevenue - totalExpenses,
    },
    recentPayments: recentPaymentsRaw.map((p) => ({
      id: p.id,
      amount: toNumber(p.amount),
      mode: p.mode,
      date: p.paymentDate,
      customer: p.booking?.customer?.name ?? "—",
      project: p.booking?.project?.name ?? "—",
      bookingNumber: p.booking?.bookingNumber ?? "—",
    })),
    recentExpenses: recentExpensesRaw.map((e) => ({
      id: e.id,
      amount: toNumber(e.totalAmount),
      category: e.category?.name ?? "Expense",
      description: e.description ?? "—",
      date: e.expenseDate,
    })),
  });
}
