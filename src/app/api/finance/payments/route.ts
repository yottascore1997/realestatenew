import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/finance/constants";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { customer: true, booking: true, receivedBy: true },
    orderBy: { paymentDate: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.payment.count();
  const receiptNo = `RCP-${String(count + 1).padStart(6, "0")}`;
  const amount = Number(body.amount);

  const payment = await prisma.payment.create({
    data: {
      receiptNo,
      bookingId: body.bookingId,
      customerId: body.customerId,
      amount,
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
      mode: body.mode ?? "UPI",
      transactionId: body.transactionId,
      referenceNo: body.referenceNo,
      receivedById: body.receivedById,
      notes: body.notes,
    },
    include: { customer: true, booking: true, receivedBy: true },
  });

  const booking = await prisma.booking.findUnique({ where: { id: body.bookingId } });
  if (booking) {
    const paid = await prisma.payment.aggregate({
      where: { bookingId: body.bookingId },
      _sum: { amount: true },
    });
    const totalPaid = toNumber(paid._sum.amount);
    const remaining = toNumber(booking.totalAmount) - totalPaid;
    const status = remaining <= 0 ? "FULLY_PAID" : totalPaid > 0 ? "PARTIAL_PAID" : "PENDING";

    await prisma.booking.update({
      where: { id: body.bookingId },
      data: { remainingBalance: Math.max(0, remaining), status },
    });

    await prisma.customerLedgerEntry.create({
      data: {
        customerId: body.customerId,
        bookingId: body.bookingId,
        type: "CREDIT",
        description: `Payment ${receiptNo}`,
        amount,
        balance: Math.max(0, remaining),
      },
    });

    await prisma.companyLedgerEntry.create({
      data: {
        type: "INCOME",
        category: "Collection",
        description: `Payment ${receiptNo} - ${booking.bookingNumber}`,
        amount,
        balance: totalPaid,
      },
    });
  }

  return NextResponse.json(payment, { status: 201 });
}
