import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedFinance } from "./seed-finance";
import { seedWebsite } from "./seed-website";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@estatepro.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "admin@estatepro.com",
      password,
      role: "ADMIN",
      avatar: "https://i.pravatar.cc/150?u=sarahjohnson",
      phone: "9876500000",
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "mayur@estatepro.com" },
    update: { name: "Mayur Patil" },
    create: {
      name: "Mayur Patil",
      email: "mayur@estatepro.com",
      password,
      role: "AGENT",
      avatar: "https://i.pravatar.cc/150?u=mayur",
      phone: "9876543200",
    },
  });

  await prisma.user.upsert({
    where: { email: "priya@estatepro.com" },
    update: {},
    create: {
      name: "Priya Nair",
      email: "priya@estatepro.com",
      password,
      role: "AGENT",
      avatar: "https://i.pravatar.cc/150?u=priya",
      phone: "9876543201",
    },
  });

  const { skylineProject, properties } = await seedWebsite(prisma, agent.id);

  const existingLead = await prisma.lead.findFirst({ where: { leadCode: "TRI000245" } });
  if (!existingLead) {
    const rahulLead = await prisma.lead.create({
      data: {
        leadCode: "TRI000245",
        fullName: "Rahul Sharma",
        mobile: "9876543210",
        email: "rahul@gmail.com",
        whatsapp: "9876543210",
        city: "Pune",
        occupation: "IT Professional",
        propertyType: "FLAT",
        projectId: skylineProject.id,
        preferredLocation: "Hinjewadi",
        budget: "₹85 Lakh",
        budgetMin: 7500000,
        budgetMax: 8500000,
        bhk: "3 BHK",
        loanRequired: true,
        purchasePurpose: "SELF_USE",
        source: "FACEBOOK_ADS",
        status: "BOOKED",
        priority: "HIGH",
        temperature: "HOT",
        aiScore: 98,
        tags: ["Site Visit Done", "Token Paid"],
        avatar: "https://i.pravatar.cc/150?u=rahulsharma",
        agentId: agent.id,
        bookingAmount: 8450000,
        paymentStatus: "PARTIAL_PAID",
        nextFollowUpDate: new Date("2026-07-05"),
        nextFollowUpTime: "11:00 AM",
        profileMeta: {
          documentsSent: ["Brochure", "Price List", "Floor Plan", "Payment Plan"],
          negotiation: {
            builderPrice: 8600000,
            customerWants: 8200000,
            finalOffer: 8450000,
            discountRequested: true,
            managerApprovalPending: false,
          },
          booking: {
            project: "Sky Heights",
            tower: "B",
            floor: "12",
            flat: "1204",
            parking: "P-18",
            bookingDate: "2026-07-20",
            bookingAmount: 8450000,
            status: "Booked",
            tokenAmount: 100000,
            tokenTxnId: "AXIS987654",
            tokenDate: "2026-07-15",
          },
          construction: {
            updates: [
              { title: "Slab Completed", done: true },
              { title: "Painting Started", done: true },
            ],
            possessionExpected: "March 2028",
          },
          possession: {
            date: "2028-04-05",
            feedbackRating: 5,
            keysHandedOver: true,
          },
        },
        activities: {
          create: [
            { type: "LEAD_CREATED", title: "Lead Created", description: "Customer filled Facebook ad form", createdAt: new Date("2026-07-03T10:00:00") },
            { type: "ASSIGNED", title: "Assigned to Mayur", createdAt: new Date("2026-07-03T10:05:00") },
            { type: "CALL", title: "Call Completed", description: "8 min call — possession 2027, loan required", createdAt: new Date("2026-07-04T11:00:00") },
            { type: "DOCUMENT", title: "Brochure Sent", createdAt: new Date("2026-07-05T09:00:00") },
            { type: "DOCUMENT", title: "Price List Sent", createdAt: new Date("2026-07-05T09:15:00") },
            { type: "SITE_VISIT", title: "Site Visit Completed", description: "Sky Heights — Flat B-1204", createdAt: new Date("2026-07-08T11:00:00") },
            { type: "NEGOTIATION", title: "Negotiation Started", createdAt: new Date("2026-07-12T14:00:00") },
            { type: "PAYMENT", title: "Token Received", description: "₹1,00,000 — AXIS987654", createdAt: new Date("2026-07-15T16:00:00") },
            { type: "BOOKED", title: "Booking Confirmed", description: "Sky Heights B-1204", createdAt: new Date("2026-07-20T12:00:00") },
          ],
        },
        followUps: {
          create: [
            { scheduledDate: new Date("2026-07-05"), scheduledTime: "11:00 AM", type: "CALL", notes: "Follow-up after first call", completed: true, completedAt: new Date("2026-07-05T11:00:00"), agentId: agent.id },
            { scheduledDate: new Date("2026-07-08"), scheduledTime: "11:00 AM", type: "SITE_VISIT", notes: "Site visit with family", completed: true, completedAt: new Date("2026-07-08T11:30:00"), agentId: agent.id },
            { scheduledDate: new Date("2026-07-25"), scheduledTime: "4:00 PM", type: "CALL", notes: "Payment follow-up", completed: false, agentId: agent.id },
          ],
        },
        callNotes: {
          create: [
            {
              content: "First call with customer",
              discussion: "Customer wants possession in 2027. Looking for 3 BHK. Loan required. Wife will also visit.",
              duration: 8,
              connected: true,
              outcome: "Connected",
              agentId: agent.id,
              createdAt: new Date("2026-07-04T11:00:00"),
            },
            {
              content: "Post site visit call",
              discussion: "Customer liked living room and amenities. Concerned about kitchen size. Ready to negotiate.",
              duration: 12,
              connected: true,
              outcome: "Interested",
              agentId: agent.id,
              createdAt: new Date("2026-07-09T10:00:00"),
            },
          ],
        },
        siteVisits: {
          create: {
            projectId: skylineProject.id,
            visitDate: new Date("2026-07-08T11:00:00"),
            visitTime: "11:00 AM",
            status: "COMPLETED",
            flatNumber: "B-1204",
            rating: 5,
            likedPoints: ["Living Room", "Amenities", "Parking"],
            dislikedPoints: ["Kitchen Size"],
            feedback: "Family liked the project overall. Kitchen size is a concern.",
            executiveId: agent.id,
          },
        },
        documents: {
          create: [
            { name: "Aadhaar", type: "AADHAR", url: "#" },
            { name: "PAN", type: "PAN", url: "#" },
            { name: "Passport Photo", type: "PASSPORT_PHOTO", url: "#" },
            { name: "Salary Slip", type: "SALARY_SLIP", url: "#" },
            { name: "Bank Statement", type: "BANK_STATEMENT", url: "#" },
            { name: "Cancelled Cheque", type: "CHEQUE", url: "#" },
            { name: "Token Receipt", type: "RECEIPT", url: "#" },
          ],
        },
      },
    });

    await prisma.lead.create({
      data: {
        fullName: "Sneha Reddy",
        mobile: "9876543211",
        email: "sneha@email.com",
        city: "Bangalore",
        propertyType: "VILLA",
        budget: "₹1.2Cr - ₹1.5Cr",
        budgetMin: 12000000,
        budgetMax: 15000000,
        bhk: "3 BHK",
        loanRequired: false,
        purchasePurpose: "INVESTMENT",
        source: "REFERRAL",
        status: "SITE_VISIT_SCHEDULED",
        priority: "HIGH",
        temperature: "HOT",
        aiScore: 88,
        tags: ["Investor", "Cash Buyer"],
        avatar: "https://i.pravatar.cc/150?u=sneha",
        agentId: agent.id,
        activities: { create: { type: "LEAD_CREATED", title: "Lead Created" } },
      },
    });

    let customer = await prisma.customer.findFirst({ where: { phone: "9876543210" } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", city: "Pune", pan: "ABCDE1234F" },
      });
    }

    await prisma.booking.create({
      data: {
        bookingNumber: "BK-RAHUL-001",
        customerId: customer.id,
        projectId: skylineProject.id,
        leadId: rahulLead.id,
        agentId: agent.id,
        salePrice: 8450000,
        bookingAmount: 945000,
        totalAmount: 8450000,
        remainingBalance: 7505000,
        status: "PARTIAL_PAID",
        bookingDate: new Date("2026-07-20"),
        paymentSchedules: {
          create: [
            { label: "Token", amount: 100000, dueDate: new Date("2026-07-15"), sortOrder: 0, status: "PAID", paidDate: new Date("2026-07-15"), paidAmount: 100000 },
            { label: "10%", amount: 845000, dueDate: new Date("2026-07-20"), sortOrder: 1, status: "PAID", paidDate: new Date("2026-07-20"), paidAmount: 845000 },
            { label: "20%", amount: 1690000, dueDate: new Date("2026-10-20"), sortOrder: 2, status: "PENDING" },
            { label: "30%", amount: 2535000, dueDate: new Date("2027-01-20"), sortOrder: 3, status: "PENDING" },
          ],
        },
      },
    });

    await prisma.deal.create({
      data: {
        title: "Sky Heights B-1204 — Rahul Sharma",
        value: 8450000,
        stage: "CLOSED_WON",
        leadId: rahulLead.id,
        propertyId: properties[0]?.id,
        agentId: agent.id,
        closedAt: new Date("2026-07-20"),
      },
    });
  }

  const existingBooking = await prisma.booking.findFirst({ where: { bookingNumber: "BK-00001" } });
  if (!existingBooking) {
    await seedFinance(skylineProject.id, agent.id, admin.id);
  }

  const waSettings = await prisma.whatsAppSettings.findFirst();
  if (!waSettings) {
    await prisma.whatsAppSettings.create({ data: { creditsTotal: 20000 } });
  }

  const templateCount = await prisma.whatsAppTemplate.count();
  if (templateCount === 0) {
    await prisma.whatsAppTemplate.createMany({
      data: [
        {
          name: "New Project Launch",
          metaName: "new_project_launch",
          category: "MARKETING",
          body: `Hi {{name}}, 👋\n\nWe are excited to launch {{project}} in {{location}}.\n\n🏡 2 & 3 BHK Luxury Apartments\n📍 Prime location\n💰 Special launch offer\n\nReply YES for site visit.\n\n— Team Triyards`,
          footer: "Reply STOP to opt out",
          variables: ["name", "project", "location"],
          status: "APPROVED",
        },
        {
          name: "Weekend Open House",
          metaName: "weekend_open_house",
          category: "MARKETING",
          body: `Hi {{name}},\n\nJoin us this weekend for an exclusive site visit at {{project}}, {{city}}.\n\n🗓 Saturday & Sunday, 10 AM – 6 PM\n🎁 Special booking benefits for visitors\n\nConfirm your visit — reply YES.`,
          footer: "Reply STOP to opt out",
          variables: ["name", "project", "city"],
          status: "APPROVED",
        },
        {
          name: "Luxury Flats Offer - Pune",
          metaName: "luxury_flats_pune",
          category: "MARKETING",
          body: `Hi {{name}},\n\nLimited period offer on premium flats in {{location}}!\n\n✨ Ready-to-move options\n✨ Flexible payment plans\n\nCall us or reply INTERESTED for details.`,
          variables: ["name", "location"],
          status: "DRAFT",
        },
      ],
    });
  }

  const counts = await Promise.all([
    prisma.project.count(),
    prisma.property.count(),
    prisma.launch.count(),
    prisma.builder.count(),
    prisma.lead.count(),
  ]);

  console.log("Seed completed successfully!");
  console.log(`  Projects: ${counts[0]} | Properties: ${counts[1]} | Launches: ${counts[2]} | Builders: ${counts[3]} | Leads: ${counts[4]}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
