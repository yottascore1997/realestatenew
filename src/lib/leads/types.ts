export interface Lead {
  id: string;
  fullName: string;
  mobile: string;
  alternateMobile?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  occupation?: string | null;
  propertyType?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  preferredLocation?: string | null;
  budget?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  bhk?: string | null;
  loanRequired: boolean;
  purchasePurpose?: string | null;
  source: string;
  status: string;
  priority: string;
  temperature: string;
  aiScore?: number | null;
  tags?: string[];
  notes?: string | null;
  avatar?: string | null;
  lostReason?: string | null;
  bookingAmount?: number | null;
  nextFollowUpDate?: string | null;
  nextFollowUpTime?: string | null;
  reminderMinutes?: number | null;
  agentId?: string | null;
  agentName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
  userName?: string | null;
}

export interface FollowUp {
  id: string;
  leadId: string;
  scheduledDate: string;
  scheduledTime?: string | null;
  type: string;
  notes?: string | null;
  reminderMinutes: number;
  completed: boolean;
}

export interface CallNote {
  id: string;
  leadId: string;
  content: string;
  outcome?: string | null;
  createdAt: string;
  agentName?: string | null;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  projectName?: string | null;
  visitDate: string;
  visitTime?: string | null;
  status: string;
  feedback?: string | null;
  executiveName?: string | null;
}

export interface LeadDocument {
  id: string;
  leadId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface LeadDashboardStats {
  totalLeads: number;
  todaysLeads: number;
  todaysFollowUps: number;
  overdueFollowUps: number;
  hotLeads: number;
  siteVisitsToday: number;
  bookedTotal: number;
  bookingsThisMonth: number;
  lostLeads: number;
  revenueGenerated: number;
}

export interface AgentPerformance {
  id: string;
  name: string;
  avatar?: string | null;
  totalLeads: number;
  bookings: number;
  conversionRate: number;
}
