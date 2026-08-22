import type { WhatsAppProviderAdapter, WhatsAppProviderKey } from "../types";
import { MockWhatsAppProvider } from "./mock";

const mock = new MockWhatsAppProvider();

/** Returns the active provider. Real adapters plug in here when user chooses one. */
export function getWhatsAppProvider(provider: WhatsAppProviderKey = "NONE"): WhatsAppProviderAdapter {
  switch (provider) {
    case "META":
    case "INTERAKT":
    case "WATI":
    case "GUPSHUP":
    case "MSG91":
      // Provider not wired yet — fall back to demo until credentials are saved
      return mock;
    case "NONE":
    default:
      return mock;
  }
}
