import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractVariables } from "@/lib/whatsapp/template-render";

export const dynamic = "force-dynamic";

export async function GET() {
  const templates = await prisma.whatsAppTemplate.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, metaName, category, language, header, body: templateBody, footer, status } = body;

  if (!name?.trim() || !templateBody?.trim()) {
    return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
  }

  const template = await prisma.whatsAppTemplate.create({
    data: {
      name: name.trim(),
      metaName: metaName?.trim() || null,
      category: category ?? "MARKETING",
      language: language ?? "en",
      header: header?.trim() || null,
      footer: footer?.trim() || null,
      body: templateBody.trim(),
      variables: extractVariables(templateBody),
      status: status ?? "DRAFT",
    },
  });

  return NextResponse.json(template, { status: 201 });
}
