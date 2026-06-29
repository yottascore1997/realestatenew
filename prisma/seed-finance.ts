import { PrismaClient } from "@prisma/client";
import { EXPENSE_CATEGORIES } from "../src/lib/finance/constants";

const prisma = new PrismaClient();

export async function seedFinance(project1Id: string, agentId: string, adminId: string) {
  await prisma.expenseCategory.createMany({
    data: EXPENSE_CATEGORIES.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const marketingCat = await prisma.expenseCategory.findFirst({ where: { name: "Facebook Ads" } });
  const salaryCat = await prisma.expenseCategory.findFirst({ where: { name: "Salary" } });

  const vendor = await prisma.vendor.create({
    data: { name: "Metro Construction Supplies", category: "Material", phone: "9876500001", gstin: "27AABCU9603R1ZM" },
  });

  const customers = await Promise.all([
    prisma.customer.create({ data: { name: "Rajesh Mehta", phone: "9876543210", email: "rajesh@email.com", city: "Mumbai", pan: "ABCDE1234F" } }),
    prisma.customer.create({ data: { name: "Sneha Reddy", phone: "9876543211", email: "sneha@email.com", city: "Bangalore" } }),
    prisma.customer.create({ data: { name: "Karan Malhotra", phone: "9876543214", email: "karan@email.com", city: "Gurgaon" } }),
  ]);

  const salePrice = 9500000;
  const gst = 1710000;
  const total = salePrice + gst;
  const bookingAmt = 1900000;

  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: "BK-00001",
      customerId: customers[0].id,
      projectId: project1Id,
      agentId,
      salePrice,
      bookingAmount: bookingAmt,
      agreementAmount: 3800000,
      registrationAmount: 1900000,
      gstAmount: gst,
      totalAmount: total,
      remainingBalance: total - bookingAmt,
      status: "PARTIAL_PAID",
      paymentSchedules: {
        create: [
          { label: "Booking Amount (20%)", percentage: 20, amount: 1900000, dueDate: new Date(), sortOrder: 0, status: "PAID", paidDate: new Date(), paidAmount: 1900000 },
          { label: "Agreement (40%)", percentage: 40, amount: 3800000, dueDate: new Date(Date.now() + 30 * 86400000), sortOrder: 1 },
          { label: "Registration (20%)", percentage: 20, amount: 1900000, dueDate: new Date(Date.now() + 60 * 86400000), sortOrder: 2 },
          { label: "Possession (20%)", percentage: 20, amount: 1900000, dueDate: new Date(Date.now() + 90 * 86400000), sortOrder: 3 },
        ],
      },
      payments: {
        create: {
          receiptNo: "RCP-000001",
          customerId: customers[0].id,
          amount: bookingAmt,
          mode: "UPI",
          transactionId: "UPI123456789",
          receivedById: agentId,
          notes: "Initial booking amount",
        },
      },
      commissions: {
        create: { agentId, commissionPercent: 2, commissionAmount: salePrice * 0.02, status: "PENDING" },
      },
      gstTransactions: { create: { type: "COLLECTED", amount: gst, description: "GST on BK-00001" } },
      ledgerEntries: {
        create: [
          { customerId: customers[0].id, type: "DEBIT", description: "Booking BK-00001", amount: total, balance: total - bookingAmt },
          { customerId: customers[0].id, type: "CREDIT", description: "Payment RCP-000001", amount: bookingAmt, balance: total - bookingAmt },
        ],
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: "BK-00002",
      customerId: customers[2].id,
      projectId: project1Id,
      agentId,
      salePrice: 15000000,
      bookingAmount: 3000000,
      gstAmount: 2700000,
      totalAmount: 17700000,
      remainingBalance: 0,
      status: "FULLY_PAID",
      payments: {
        create: {
          receiptNo: "RCP-000002",
          customerId: customers[2].id,
          amount: 17700000,
          mode: "NEFT",
          transactionId: "NEFT987654",
          receivedById: adminId,
        },
      },
      commissions: {
        create: { agentId, commissionPercent: 2.5, commissionAmount: 375000, status: "PAID", paidAmount: 375000, paymentDate: new Date() },
      },
    },
  });

  if (marketingCat) {
    await prisma.expense.create({
      data: {
        expenseNumber: "EXP-00001",
        categoryId: marketingCat.id,
        projectId: project1Id,
        amount: 250000,
        gstAmount: 45000,
        totalAmount: 295000,
        description: "Facebook Ads campaign Q2",
        status: "APPROVED",
        approvedById: adminId,
        gstTransactions: { create: { type: "PAID", amount: 45000, description: "GST on marketing" } },
      },
    });
  }

  if (salaryCat) {
    await prisma.expense.create({
      data: {
        expenseNumber: "EXP-00002",
        categoryId: salaryCat.id,
        amount: 85000,
        gstAmount: 0,
        totalAmount: 85000,
        description: "Monthly salary - Rahul Sharma",
        status: "APPROVED",
        approvedById: adminId,
      },
    });
  }

  await prisma.expense.create({
    data: {
      expenseNumber: "EXP-00003",
      categoryId: (await prisma.expenseCategory.findFirst({ where: { name: "Material" } }))!.id,
      projectId: project1Id,
      vendorId: vendor.id,
      amount: 550000,
      gstAmount: 99000,
      totalAmount: 649000,
      description: "Construction material - Phase 1",
      status: "PENDING",
    },
  });

  await prisma.salary.create({
    data: {
      employeeId: agentId,
      month: "June 2026",
      baseSalary: 75000,
      commission: 37500,
      bonus: 10000,
      deduction: 5000,
      finalSalary: 117500,
      status: "PENDING",
    },
  });

  await prisma.companyLedgerEntry.createMany({
    data: [
      { type: "OPENING", category: "Opening Balance", description: "FY 2026 Opening", amount: 5000000, balance: 5000000, entryDate: new Date("2026-04-01") },
      { type: "INCOME", category: "Collection", description: "Payment RCP-000001", amount: bookingAmt, balance: bookingAmt, entryDate: new Date() },
      { type: "INCOME", category: "Collection", description: "Payment RCP-000002", amount: 17700000, balance: 19600000, entryDate: new Date() },
      { type: "EXPENSE", category: "Marketing", description: "Facebook Ads", amount: 295000, balance: 19305000, entryDate: new Date() },
      { type: "EXPENSE", category: "Salary", description: "Staff salary", amount: 85000, balance: 19220000, entryDate: new Date() },
    ],
  });

  console.log("Finance seed completed:", { booking1: booking1.bookingNumber, booking2: booking2.bookingNumber });
}
