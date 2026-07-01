import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/website/constants";

type BrandWordmarkProps = {
  className?: string;
  /** When true, renders TRIYARDS in all caps (logo style). When false, uses title case Triyards. */
  uppercase?: boolean;
  /** inherit = match parent font size (for inline headings) */
  size?: "default" | "inherit";
};

/** TRIYARDS wordmark — Inter sans, bold, wide letter-spacing (matches footer) */
export function BrandWordmark({ className, uppercase = true, size = "default" }: BrandWordmarkProps) {
  return (
    <span
      className={cn(
        "font-sans font-bold tracking-[0.1em]",
        size === "default" && "text-lg",
        className
      )}
    >
      {uppercase ? BRAND_NAME.toUpperCase() : BRAND_NAME}
    </span>
  );
}
