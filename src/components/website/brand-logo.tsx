import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/website/constants";
import { TriyardsLogoSvg } from "@/components/website/triyards-logo-svg";

export type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  height?: number;
  href?: string | null;
  variant?: "compact" | "full";
  theme?: "dark" | "light";
  showTagline?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  height = 48,
  href = "/",
  variant = "compact",
  theme = "dark",
  showTagline,
}: BrandLogoProps) {
  const logo = (
    <TriyardsLogoSvg
      height={height}
      variant={variant}
      theme={theme}
      showTagline={showTagline}
      className={cn("transition-transform duration-500 ease-out hover:scale-[1.02]", imageClassName)}
    />
  );

  const label = `${BRAND_NAME} Realty`;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={cn("inline-flex shrink-0 items-center", className)}>
        {logo}
      </Link>
    );
  }

  return (
    <span aria-label={label} className={cn("inline-flex shrink-0 items-center", className)}>
      {logo}
    </span>
  );
}
