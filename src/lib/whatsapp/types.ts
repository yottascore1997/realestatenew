export type WhatsAppProviderKey = "NONE" | "META" | "INTERAKT" | "WATI" | "GUPSHUP" | "MSG91";

export interface SendMessageInput {
  phone: string;
  body: string;
  templateName?: string;
  variables?: Record<string, string>;
}

export interface SendMessageResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface WhatsAppProviderAdapter {
  name: WhatsAppProviderKey;
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
  isConfigured(): boolean;
}

export interface RecipientFilter {
  recipientSource?: "crm" | "file_import";
  fileName?: string;
  leadIds?: string[];
  city?: string;
  status?: string;
  leadSource?: string;
  temperature?: string;
  projectId?: string;
  contacts?: ImportedContact[];
}

export interface ImportedContact {
  fullName: string;
  mobile: string;
  city?: string;
  email?: string;
}

export interface CampaignPreviewRecipient {
  id: string;
  fullName: string;
  phone: string;
  city: string | null;
}
