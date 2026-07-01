import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PropertyDetailContent } from "@/components/website/property-detail-content";
import {
  buildPropertyDetail,
  getFallbackProperty,
} from "@/lib/website/property-detail-data";

export const dynamic = "force-dynamic";

type PropertyRow = Prisma.PropertyGetPayload<{
  include: { project: true; agent: true };
}>;

function parseImages(raw: unknown, fallback: string | null): string[] {
  if (Array.isArray(raw)) {
    const imgs = raw.filter((i): i is string => typeof i === "string");
    if (imgs.length > 0) return imgs;
  }
  return fallback ? [fallback] : [];
}

function parseAmenities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((a): a is string => typeof a === "string");
}

function serializeProperty(p: PropertyRow) {
  return buildPropertyDetail({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    address: p.address,
    city: p.city,
    state: p.state,
    zipCode: p.zipCode,
    price: Number(p.price),
    type: p.type,
    status: p.status,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    image: p.image,
    images: parseImages(p.images, p.image),
    amenities: parseAmenities(p.amenities),
    featured: p.featured,
    projectName: p.project?.name ?? null,
    agent: p.agent
      ? {
          name: p.agent.name,
          designation: p.agent.designation || "Property Consultant",
          phone: p.agent.phone || "+91 98765 43210",
          email: p.agent.email,
          avatar: p.agent.avatar,
        }
      : undefined,
  });
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let property = null;

  try {
    const row = await prisma.property.findUnique({
      where: { slug: params.slug },
      include: { project: true, agent: true },
    });
    if (row) property = serializeProperty(row);
  } catch {
    // DB unavailable
  }

  if (!property) {
    property = getFallbackProperty(params.slug);
  }

  if (!property) {
    notFound();
  }

  return <PropertyDetailContent property={property} />;
}
