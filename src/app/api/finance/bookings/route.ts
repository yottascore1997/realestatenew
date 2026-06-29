import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
      project: true,
      property: true,
      agent: true,
      payments: true,
      paymentSchedules: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.booking.count();
  const bookingNumber = `BK-${String(count + 1).padStart(5, "0")}`;

  const salePrice = Number(body.salePrice);
  const gstAmount = Number(body.gstAmount ?? 0);
  const discount = Number(body.discount ?? 0);
  const totalAmount = salePrice - discount + gstAmount;
  const bookingAmount = Number(body.bookingAmount ?? 0);

  const booking = await prisma.booking.create({
    data: {
      bookingNumber,
      customerId: body.customerId,
      projectId: body.projectId || null,
      propertyId: body.propertyId || null,
      leadId: body.leadId || null,
      agentId: body.agentId || null,
      salePrice,
      bookingAmount,
      agreementAmount: body.agreementAmount ? Number(body.agreementAmount) : null,
      registrationAmount: body.registrationAmount ? Number(body.registrationAmount) : null,
      discount,
      gstAmount,
      totalAmount,
      remainingBalance: totalAmount - bookingAmount,
      status: bookingAmount >= totalAmount ? "FULLY_PAID" : bookingAmount > 0 ? "PARTIAL_PAID" : "PENDING",
      paymentSchedules: body.schedules ? {
        create: body.schedules.map((s: { label: string; percentage: number; amount: number; dueDate: string }, i: number) => ({
          label: s.label,
          percentage: s.percentage,
          amount: s.amount,
          dueDate: new Date(s.dueDate),
          sortOrder: i,
        })),
      } : undefined,
      ledgerEntries: {
        create: {
          customerId: body.customerId,
          type: "DEBIT",
          description: `Booking ${bookingNumber}`,
          amount: totalAmount,
          balance: totalAmount - bookingAmount,
        },
      },
      gstTransactions: gstAmount > 0 ? {
        create: { type: "COLLECTED", amount: gstAmount, description: `GST for ${bookingNumber}` },
      } : undefined,
    },
    include: { customer: true, project: true, property: true, agent: true, paymentSchedules: true },
  });

  if (body.agentId && body.commissionPercent) {
    await prisma.commission.create({
      data: {
        agentId: body.agentId,
        bookingId: booking.id,
        commissionPercent: Number(body.commissionPercent),
        commissionAmount: (salePrice * Number(body.commissionPercent)) / 100,
      },
    });
  }

  return NextResponse.json(booking, { status: 201 });
}
