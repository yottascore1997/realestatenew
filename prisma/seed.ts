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
    where: { email: "rahul@estatepro.com" },
    update: {},
    create: {
      name: "Rahul Sharma",
      email: "rahul@estatepro.com",
      password,
      role: "AGENT",
      avatar: "https://i.pravatar.cc/150?u=rahul",
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

  const existingLead = await prisma.lead.findFirst({ where: { mobile: "9876543210" } });
  if (!existingLead) {
    const leads = await Promise.all([
      prisma.lead.create({
        data: {
          fullName: "Rajesh Mehta",
          mobile: "9876543210",
          email: "rajesh@email.com",
          whatsapp: "9876543210",
          city: "Mumbai",
          occupation: "Business Owner",
          propertyType: "FLAT",
          projectId: skylineProject.id,
          preferredLocation: "Bandra West",
          budget: "₹80L - ₹1Cr",
          budgetMin: 8000000,
          budgetMax: 10000000,
          bhk: "2 BHK",
          loanRequired: true,
          purchasePurpose: "SELF_USE",
          source: "FACEBOOK_ADS",
          status: "FOLLOW_UP",
          priority: "HIGH",
          temperature: "HOT",
          aiScore: 92,
          tags: ["VIP", "Loan Buyer"],
          avatar: "https://i.pravatar.cc/150?u=rajesh",
          agentId: agent.id,
          nextFollowUpDate: new Date(),
          nextFollowUpTime: "11:30 AM",
          activities: {
            create: [
              { type: "LEAD_CREATED", title: "Lead Created", description: "From Facebook Ads" },
              { type: "ASSIGNED", title: "Assigned to Rahul Sharma" },
              { type: "CALL", title: "First Call Done", description: "Customer wants 2 BHK, Budget 80 Lakhs" },
            ],
          },
          followUps: {
            create: {
              scheduledDate: new Date(),
              scheduledTime: "11:30 AM",
              type: "CALL",
              notes: "Call customer about loan approval",
              reminderMinutes: 30,
            },
          },
          callNotes: {
            create: {
              content: "Customer wants 2 BHK in Bandra. Budget 80 Lakhs. Needs home loan.",
              outcome: "Interested",
              agentId: agent.id,
            },
          },
        },
      }),
      prisma.lead.create({
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
      }),
    ]);

    await prisma.deal.create({
      data: {
        title: "Luxury 3 BHK Bandra Deal",
        value: properties[0]?.price ?? 28500000,
        stage: "NEGOTIATION",
        leadId: leads[0].id,
        propertyId: properties[0]?.id,
        agentId: agent.id,
      },
    });

    await prisma.appointment.create({
      data: {
        title: "Property Showing — Bandra West",
        type: "PROPERTY_SHOWING",
        location: "Bandra West, Linking Road, Mumbai",
        startTime: new Date("2026-06-25T10:00:00"),
        leadId: leads[0].id,
        agentId: agent.id,
      },
    });
  }

  const existingBooking = await prisma.booking.findFirst({ where: { bookingNumber: "BK-00001" } });
  if (!existingBooking) {
    await seedFinance(skylineProject.id, agent.id, admin.id);
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
