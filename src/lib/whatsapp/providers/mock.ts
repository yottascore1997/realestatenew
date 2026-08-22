import type { SendMessageInput, SendMessageResult, WhatsAppProviderAdapter } from "../types";

/** Simulates WhatsApp API — swap for real provider later without changing CRM UI. */
export class MockWhatsAppProvider implements WhatsAppProviderAdapter {
  name = "NONE" as const;

  isConfigured() {
    return true;
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const digits = input.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      return { success: false, error: "Invalid phone number" };
    }

    // ~3% simulated failure for realistic demo stats
    if (Math.random() < 0.03) {
      return { success: false, error: "Simulated delivery failure (demo mode)" };
    }

    await new Promise((r) => setTimeout(r, 15 + Math.random() * 35));

    return {
      success: true,
      providerMessageId: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
  }
}
