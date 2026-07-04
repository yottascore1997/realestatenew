import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  size?: "default" | "inherit";
  /** light = white text on dark backgrounds */
  theme?: "dark" | "light";
};

/** Matches hero "Find Your Dream Property" — Inter semibold + orange accent on "yards" */
export function BrandWordmark({ className, size = "default", theme = "dark" }: BrandWordmarkProps) {
  const isLight = theme === "light";
  return (
    <span
      className={cn(
        "website-type font-semibold tracking-wide",
        size === "default" && "text-lg",
        isLight && "hero-text-shadow",
        className
      )}
    >
      <span className={isLight ? "text-white" : "text-[#0f1729]"}>Tri</span>
      <span
        className={cn(
          "inline-block text-[1.05em] text-orange-400",
          isLight ? "hero-dream-glow" : "brand-accent-glow-light"
        )}
      >
        yards
      </span>
    </span>
  );
}
