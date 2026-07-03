import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_LOGO, BRAND_NAME } from "@/lib/website/constants";

export type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  /** Display height in px */
  height?: number;
  href?: string | null;
  priority?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  height = 44,
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={BRAND_LOGO}
      alt={`${BRAND_NAME} Realty`}
      width={200}
      height={200}
      priority={priority}
      className={cn("w-auto object-contain", imageClassName)}
      style={{ height: `${height}px`, width: "auto" }}
    />
  );

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
        {image}
      </Link>
    );
  }

  return <span className={cn("inline-flex shrink-0 items-center", className)}>{image}</span>;
}
