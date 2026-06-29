import type { Lead, LeadActivity, FollowUp, CallNote, SiteVisit, LeadDocument, LeadDashboardStats, AgentPerformance } from "./types";

export const mockAgents: AgentPerformance[] = [
  { id: "a1", name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?u=rahul", totalLeads: 120, bookings: 15, conversionRate: 12.5 },
  { id: "a2", name: "Priya Patel", avatar: "https://i.pravatar.cc/150?u=priya", totalLeads: 98, bookings: 12, conversionRate: 12.2 },
  { id: "a3", name: "Amit Kumar", avatar: "https://i.pravatar.cc/150?u=amit", totalLeads: 85, bookings: 9, conversionRate: 10.6 },
];

export const mockLeadDashboard: LeadDashboardStats = {
  todaysLeads: 24,
  todaysFollowUps: 18,
  overdueFollowUps: 5,
  hotLeads: 32,
  siteVisitsToday: 7,
  bookingsThisMonth: 15,
  lostLeads: 8,
  revenueGenerated: 45000000,
};

export const mockLeads: Lead[] = [
  {
    id: "l1", fullName: "Rajesh Mehta", mobile: "9876543210", email: "rajesh@email.com",
    whatsapp: "9876543210", city: "Mumbai", occupation: "Business Owner",
    propertyType: "FLAT", projectName: "Skyline Residences", preferredLocation: "Bandra West",
    budget: "₹80L - ₹1Cr", budgetMin: 8000000, budgetMax: 10000000, bhk: "2 BHK",
    loanRequired: true, purchasePurpose: "SELF_USE", source: "FACEBOOK_ADS",
    status: "FOLLOW_UP", priority: "HIGH", temperature: "HOT", aiScore: 92,
    tags: ["VIP", "Loan Buyer"], agentId: "a1", agentName: "Rahul Sharma",
    nextFollowUpDate: new Date().toISOString(), nextFollowUpTime: "11:30 AM", reminderMinutes: 30,
    avatar: "https://i.pravatar.cc/150?u=rajesh",
    createdAt: "2026-06-20T10:00:00Z", updatedAt: "2026-06-23T08:00:00Z",
  },
  {
    id: "l2", fullName: "Sneha Reddy", mobile: "9876543211", email: "sneha@email.com",
    city: "Bangalore", propertyType: "VILLA", projectName: "Green Valley Villas",
    budget: "₹1.2Cr - ₹1.5Cr", budgetMin: 12000000, budgetMax: 15000000, bhk: "3 BHK",
    loanRequired: false, purchasePurpose: "INVESTMENT", source: "REFERRAL",
    status: "SITE_VISIT_SCHEDULED", priority: "HIGH", temperature: "HOT", aiScore: 88,
    tags: ["Investor", "Cash Buyer"], agentId: "a2", agentName: "Priya Patel",
    nextFollowUpDate: new Date(Date.now() + 86400000).toISOString(), nextFollowUpTime: "3:00 PM",
    avatar: "https://i.pravatar.cc/150?u=sneha",
    createdAt: "2026-06-18T10:00:00Z", updatedAt: "2026-06-22T14:00:00Z",
  },
  {
    id: "l3", fullName: "Vikram Singh", mobile: "9876543212", email: "vikram@email.com",
    city: "Pune", propertyType: "PLOT", preferredLocation: "Hinjewadi",
    budget: "₹50L - ₹70L", budgetMin: 5000000, budgetMax: 7000000,
    loanRequired: true, purchasePurpose: "INVESTMENT", source: "GOOGLE_ADS",
    status: "NEW", priority: "MEDIUM", temperature: "WARM", aiScore: 65,
    tags: ["Loan Buyer"], agentId: "a3", agentName: "Amit Kumar",
    avatar: "https://i.pravatar.cc/150?u=vikram",
    createdAt: "2026-06-23T09:00:00Z", updatedAt: "2026-06-23T09:00:00Z",
  },
  {
    id: "l4", fullName: "Anita Desai", mobile: "9876543213", email: "anita@email.com",
    city: "Mumbai", propertyType: "FLAT", projectName: "Marina Bay Towers",
    budget: "₹90L - ₹1.1Cr", budgetMin: 9000000, budgetMax: 11000000, bhk: "2 BHK",
    loanRequired: true, purchasePurpose: "SELF_USE", source: "MAGICBRICKS",
    status: "NEGOTIATION", priority: "HIGH", temperature: "HOT", aiScore: 95,
    tags: ["VIP", "Urgent"], agentId: "a1", agentName: "Rahul Sharma",
    bookingAmount: 500000,
    avatar: "https://i.pravatar.cc/150?u=anita",
    createdAt: "2026-06-10T10:00:00Z", updatedAt: "2026-06-23T07:00:00Z",
  },
  {
    id: "l5", fullName: "Karan Malhotra", mobile: "9876543214",
    city: "Gurgaon", propertyType: "COMMERCIAL", preferredLocation: "Sector 62",
    budget: "₹2Cr+", budgetMin: 20000000, budgetMax: 30000000,
    loanRequired: false, purchasePurpose: "INVESTMENT", source: "WALK_IN",
    status: "BOOKED", priority: "HIGH", temperature: "HOT", aiScore: 100,
    tags: ["VIP", "Cash Buyer", "Investor"], agentId: "a2", agentName: "Priya Patel",
    bookingAmount: 2000000,
    avatar: "https://i.pravatar.cc/150?u=karan",
    createdAt: "2026-06-01T10:00:00Z", updatedAt: "2026-06-20T16:00:00Z",
  },
  {
    id: "l6", fullName: "Pooja Nair", mobile: "9876543215", email: "pooja@email.com",
    city: "Chennai", propertyType: "FLAT", bhk: "1 BHK",
    budget: "₹40L - ₹55L", budgetMin: 4000000, budgetMax: 5500000,
    loanRequired: true, source: "HOUSING",
    status: "CONTACTED", priority: "LOW", temperature: "COLD", aiScore: 35,
    tags: ["Loan Buyer"], agentId: "a3", agentName: "Amit Kumar",
    avatar: "https://i.pravatar.cc/150?u=pooja",
    createdAt: "2026-06-22T11:00:00Z", updatedAt: "2026-06-22T15:00:00Z",
  },
  {
    id: "l7", fullName: "Arjun Iyer", mobile: "9876543216",
    city: "Mumbai", propertyType: "VILLA",
    budget: "₹3Cr+", source: "BROKER",
    status: "LOST", priority: "MEDIUM", temperature: "COLD", aiScore: 10,
    lostReason: "Budget mismatch", agentId: "a1", agentName: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    createdAt: "2026-05-15T10:00:00Z", updatedAt: "2026-06-18T10:00:00Z",
    loanRequired: false,
  },
  {
    id: "l8", fullName: "Meera Joshi", mobile: "9876543217", email: "meera@email.com",
    city: "Pune", propertyType: "FLAT", projectName: "Emerald Heights",
    budget: "₹65L - ₹80L", bhk: "2 BHK", loanRequired: true,
    source: "WHATSAPP", status: "INTERESTED", priority: "MEDIUM", temperature: "WARM", aiScore: 72,
    tags: ["NRI", "Referral"], agentId: "a2", agentName: "Priya Patel",
    nextFollowUpDate: new Date().toISOString(), nextFollowUpTime: "4:30 PM",
    avatar: "https://i.pravatar.cc/150?u=meera",
    createdAt: "2026-06-21T08:00:00Z", updatedAt: "2026-06-23T06:00:00Z",
  },
];

export const mockActivities: Record<string, LeadActivity[]> = {
  l1: [
    { id: "act1", leadId: "l1", type: "LEAD_CREATED", title: "Lead Created", description: "Lead created from Facebook Ads", createdAt: "2026-06-20T10:00:00Z", userName: "System" },
    { id: "act2", leadId: "l1", type: "ASSIGNED", title: "Assigned to Rahul Sharma", createdAt: "2026-06-20T10:05:00Z", userName: "Admin" },
    { id: "act3", leadId: "l1", type: "CALL", title: "First Call Done", description: "Customer wants 2 BHK, Budget 80 Lakhs, Needs Loan", createdAt: "2026-06-20T14:00:00Z", userName: "Rahul Sharma" },
    { id: "act4", leadId: "l1", type: "STATUS_CHANGE", title: "Status changed to Interested", createdAt: "2026-06-21T10:00:00Z", userName: "Rahul Sharma" },
    { id: "act5", leadId: "l1", type: "FOLLOW_UP", title: "Follow-up scheduled", description: "Tomorrow 11:30 AM - Call Customer", createdAt: "2026-06-22T16:00:00Z", userName: "Rahul Sharma" },
  ],
};

export const mockFollowUps: FollowUp[] = [
  { id: "f1", leadId: "l1", scheduledDate: new Date().toISOString(), scheduledTime: "11:30 AM", type: "CALL", notes: "Call customer about loan approval", reminderMinutes: 30, completed: false },
  { id: "f2", leadId: "l2", scheduledDate: new Date(Date.now() + 86400000).toISOString(), scheduledTime: "3:00 PM", type: "SITE_VISIT", notes: "Site visit at Green Valley", reminderMinutes: 60, completed: false },
  { id: "f3", leadId: "l8", scheduledDate: new Date().toISOString(), scheduledTime: "4:30 PM", type: "WHATSAPP", notes: "Send brochure", reminderMinutes: 15, completed: false },
];

export const mockCallNotes: Record<string, CallNote[]> = {
  l1: [
    { id: "cn1", leadId: "l1", content: "Customer wants 2 BHK in Bandra. Budget 80 Lakhs. Needs home loan. Visit on Sunday.", outcome: "Interested", createdAt: "2026-06-20T14:00:00Z", agentName: "Rahul Sharma" },
    { id: "cn2", leadId: "l1", content: "Discussed Skyline Residences. Customer liked the location. Wants to visit this weekend.", outcome: "Follow-up", createdAt: "2026-06-21T11:00:00Z", agentName: "Rahul Sharma" },
  ],
};

export const mockSiteVisits: SiteVisit[] = [
  { id: "sv1", leadId: "l2", projectName: "Green Valley Villas", visitDate: new Date(Date.now() + 86400000).toISOString(), visitTime: "3:00 PM", status: "SCHEDULED", executiveName: "Priya Patel" },
  { id: "sv2", leadId: "l1", projectName: "Skyline Residences", visitDate: "2026-06-18T10:00:00Z", visitTime: "11:00 AM", status: "COMPLETED", feedback: "Liked the project, negotiating price", executiveName: "Rahul Sharma" },
];

export const mockDocuments: Record<string, LeadDocument[]> = {
  l4: [
    { id: "d1", leadId: "l4", name: "PAN Card", type: "PAN", url: "#", uploadedAt: "2026-06-22T10:00:00Z" },
    { id: "d2", leadId: "l4", name: "Booking Form", type: "BOOKING_FORM", url: "#", uploadedAt: "2026-06-23T09:00:00Z" },
  ],
};

export const mockSourcePerformance = [
  { source: "Facebook Ads", leads: 450, bookings: 28, conversion: 6.2 },
  { source: "Referral", leads: 320, bookings: 45, conversion: 14.1 },
  { source: "Google Ads", leads: 280, bookings: 18, conversion: 6.4 },
  { source: "MagicBricks", leads: 210, bookings: 15, conversion: 7.1 },
  { source: "Walk-in", leads: 150, bookings: 22, conversion: 14.7 },
  { source: "WhatsApp", leads: 180, bookings: 12, conversion: 6.7 },
];

export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((l) => l.id === id);
}

export function filterLeads(params: {
  search?: string;
  status?: string;
  source?: string;
  agentId?: string;
  priority?: string;
  temperature?: string;
}): Lead[] {
  return mockLeads.filter((lead) => {
    if (params.search) {
      const q = params.search.toLowerCase();
      const match = lead.fullName.toLowerCase().includes(q) ||
        lead.mobile.includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.projectName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (params.status && lead.status !== params.status) return false;
    if (params.source && lead.source !== params.source) return false;
    if (params.agentId && lead.agentId !== params.agentId) return false;
    if (params.priority && lead.priority !== params.priority) return false;
    if (params.temperature && lead.temperature !== params.temperature) return false;
    return true;
  });
}

export function getKanbanData() {
  const columns: Record<string, Lead[]> = {};
  for (const col of ["NEW", "INTERESTED", "FOLLOW_UP", "SITE_VISIT_SCHEDULED", "NEGOTIATION", "BOOKED", "LOST"]) {
    columns[col] = mockLeads.filter((l) => l.status === col);
  }
  return columns;
}

export function checkDuplicate(mobile?: string, email?: string) {
  const duplicates: Lead[] = [];
  if (mobile) duplicates.push(...mockLeads.filter((l) => l.mobile === mobile));
  if (email) duplicates.push(...mockLeads.filter((l) => l.email === email && !duplicates.find((d) => d.id === l.id)));
  return duplicates;
}
