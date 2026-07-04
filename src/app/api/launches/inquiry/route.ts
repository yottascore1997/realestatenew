import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullName = body.fullName?.trim();
    const mobile = body.mobile?.trim();
    const email = body.email?.trim();

    if (!fullName || !mobile) {
      return NextResponse.json({ error: "Name and mobile are required" }, { status: 400 });
    }

    const launchSlug = body.launchSlug?.trim();
    const launchName = body.launchName?.trim() || "New Launch";
    const launchCity = body.launchCity?.trim();
    const launchLocation = body.launchLocation?.trim();
    const projectId = body.projectId || null;
    const bhk = body.bhk?.trim();
    const budget = body.budget?.trim();
    const message = body.message?.trim() || "";
    const utmSource = body.utmSource?.trim();
    const utmCampaign = body.utmCampaign?.trim();

    let launch = launchSlug
      ? await prisma.launch.findUnique({ where: { slug: launchSlug }, include: { project: true } })
      : null;

    const noteLines = [
      `Launch LP: ${launchName}`,
      launchSlug ? `Slug: ${launchSlug}` : null,
      launchLocation && launchCity ? `Location: ${launchLocation}, ${launchCity}` : null,
      bhk ? `BHK interest: ${bhk}` : null,
      budget ? `Budget: ${budget}` : null,
      utmSource ? `UTM Source: ${utmSource}` : null,
      utmCampaign ? `UTM Campaign: ${utmCampaign}` : null,
      message ? `\nMessage:\n${message}` : null,
    ].filter(Boolean);

    const existing = await prisma.lead.findFirst({
      where: { OR: [{ mobile }, ...(email ? [{ email }] : [])] },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: {
          temperature: "HOT",
          priority: "HIGH",
          trackingProject: launchName,
          trackingLocation: launchLocation || launchCity || existing.trackingLocation,
          projectId: projectId || launch?.projectId || existing.projectId,
          notes: noteLines.join("\n"),
          lastStatusRemark: `Re-inquired via launch page: ${launchName}`,
          activities: {
            create: {
              type: "NOTE",
              title: "Launch landing page inquiry",
              description: noteLines.join(" · "),
            },
          },
        },
      });

      return NextResponse.json({ success: true, leadId: existing.id, updated: true });
    }

    const lead = await prisma.lead.create({
      data: {
        fullName,
        mobile,
        email: email || null,
        whatsapp: mobile,
        city: launchCity || null,
        preferredLocation: launchLocation || null,
        projectId: projectId || launch?.projectId || null,
        bhk: bhk || launch?.bhk || null,
        budget: budget || null,
        source: "WEBSITE",
        status: "NEW",
        priority: "HIGH",
        temperature: "HOT",
        tags: ["launch-lp", ...(launchSlug ? [launchSlug] : [])],
        trackingProject: launchName,
        trackingLocation: launchLocation || launchCity || null,
        lastStatusRemark: `Inquiry from launch landing page`,
        notes: noteLines.join("\n"),
        nextFollowUpDate: new Date(Date.now() + 86400000),
        nextFollowUpTime: "11:00",
        activities: {
          create: {
            type: "LEAD_CREATED",
            title: "Launch Landing Page Lead",
            description: noteLines.join(" · "),
          },
        },
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err) {
    console.error("Launch inquiry error:", err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
