"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { ContactModal } from "@/components/website/contact-modal";

export type ContactModalOptions = {
  inquiryType?: string;
  context?: string;
  defaultMessage?: string;
  title?: string;
  subtitle?: string;
};

type ContactContextValue = {
  openContact: (options?: ContactModalOptions) => void;
  closeContact: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ContactModalOptions>({});

  const openContact = useCallback((opts: ContactModalOptions = {}) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ContactContext.Provider value={{ openContact, closeContact }}>
      {children}
      <ContactModal open={open} onClose={closeContact} options={options} />
    </ContactContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactProvider");
  }
  return ctx;
}
