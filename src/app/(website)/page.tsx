import { prisma } from "@/lib/prisma";
import { HomePageContent } from "@/components/website/home-page-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let properties: Awaited<ReturnType<typeof prisma.property.findMany>> = [];
  let launches: Awaited<ReturnType<typeof prisma.launch.findMany>> = [];

  try {
    [projects, properties, launches] = await Promise.all([
      prisma.project.findMany({ take: 8, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], include: { builder: true } }),
      prisma.property.findMany({ take: 8, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], include: { project: true } }),
      prisma.launch.findMany({ take: 8, orderBy: [{ featured: "desc" }, { launchDate: "asc" }], include: { project: true } }),
    ]);
  } catch {
    // DB not connected — page still renders with empty lists
  }

  return (
    <HomePageContent
      projects={projects.map((p) => ({
        id: p.id, name: p.name, location: p.location, city: p.city,
        image: p.image, priceFrom: p.priceFrom ? Number(p.priceFrom) : null, status: p.status,
      }))}
      properties={properties.map((p) => ({
        id: p.id, title: p.title, address: p.address, city: p.city,
        image: p.image, price: Number(p.price), bedrooms: p.bedrooms,
        bathrooms: p.bathrooms, sqft: p.sqft ? Number(p.sqft) : null, status: p.status,
      }))}
      launches={launches.map((l) => ({
        id: l.id, name: l.name, location: l.location, city: l.city,
        image: l.image, priceFrom: l.priceFrom ? Number(l.priceFrom) : null, status: l.status,
      }))}
    />
  );
}
