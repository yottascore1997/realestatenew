import type { Metadata } from "next";
import { SkyscraperShowcase } from "@/components/three/skyscraper-showcase";

export const metadata: Metadata = {
  title: "The Apex Residences — Live Above the Skyline",
  description:
    "An immersive 3D showcase of a luxury skyscraper with cinematic sunrise lighting.",
};

export default function ShowcasePage() {
  return <SkyscraperShowcase />;
}
