"use client";

import { type ReactNode, type MouseEvent } from "react";
import { useContactModal, type ContactModalOptions } from "@/lib/website/contact-context";
import { cn } from "@/lib/utils";

type ContactTriggerProps = ContactModalOptions & {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function ContactTrigger({ children, className, onClick, ...options }: ContactTriggerProps) {
  const { openContact } = useContactModal();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick?.();
    openContact(options);
  };

  return (
    <button type="button" onClick={handleClick} className={cn(className)}>
      {children}
    </button>
  );
}
