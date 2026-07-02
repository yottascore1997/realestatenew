import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (err) {
    console.error("Contacts GET error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.trim();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const inquiryType = body.inquiryType?.trim() || "General Enquiry";
    const message = body.message?.trim() || "";
    const context = body.context?.trim() || "";
    const source = body.source?.trim() || "Website";

    const notesParts = [`Source: ${source}`, `Inquiry: ${inquiryType}`];
    if (context) notesParts.push(`Interest: ${context}`);
    if (message) notesParts.push(`\nMessage:\n${message}`);

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: body.phone?.trim() || null,
        company: inquiryType,
        notes: notesParts.join("\n"),
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error("Contacts POST error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
