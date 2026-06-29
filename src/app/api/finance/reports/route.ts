import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/finance/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const [commissions, installments, outstanding, refunds, vendors, salaries, gst, customers] = await Promise.all([
    prisma.commission.findMany({ include: { agent: true, booking: { include: { customer: true, project: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.paymentSchedule.findMany({ include: { booking: { include: { customer: true, project: true } } }, orderBy: { dueDate: "asc" } }),
    prisma.booking.findMany({
      where: { status: { in: ["PENDING", "PARTIAL_PAID"] } },
      include: { customer: true, project: true, payments: true, paymentSchedules: true },
      orderBy: { bookingDate: "desc" },
    }),
    prisma.refund.findMany({ include: { customer: true, booking: true, approvedBy: true }, orderBy: { createdAt: "desc" } }),
    prisma.vendor.findMany({ include: { expenses: true, ledgerEntries: true } }),
    prisma.salary.findMany({ include: { employee: true }, orderBy: { createdAt: "desc" } }),
    prisma.gstTransaction.findMany({ orderBy: { txnDate: "desc" }, take: 100 }),
    prisma.customer.findMany({ include: { ledgerEntries: { orderBy: { entryDate: "desc" }, take: 20 }, bookings: true } }),
  ]);

  const projectStats = await prisma.project.findMany({
    include: {
      bookings: { where: { status: { not: "CANCELLED" } } },
      expenses: { where: { status: "APPROVED" } },
    },
  });

  const projectWisePL = projectStats.map((p) => {
    const revenue = p.bookings.reduce((s, b) => s + toNumber(b.totalAmount), 0);
    const expense = p.expenses.reduce((s, e) => s + toNumber(e.totalAmount), 0);
    return { projectId: p.id, projectName: p.name, revenue, expense, profit: revenue - expense };
  });

  const companyLedger = await prisma.companyLedgerEntry.findMany({ orderBy: { entryDate: "desc" }, take: 50 });

  return NextResponse.json({
    commissions, installments, outstanding, refunds, vendors, salaries, gst,
    customers, projectWisePL, companyLedger,
  });
}
