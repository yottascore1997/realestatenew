import { Bed, Bath, Maximize } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { project: true },
  });

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Properties For Sale</h1>
        <p className="mt-2 text-slate-500">{properties.length} verified properties — zero brokerage</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-shadow hover:shadow-xl">
              <div className="relative h-52">
                <img src={property.image || ""} alt={property.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">VERIFIED</span>
                {property.featured && (
                  <span className="absolute right-3 top-3 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">FEATURED</span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">{property.title}</h2>
                <p className="text-sm text-slate-500">{property.address}, {property.city}</p>
                {property.project && (
                  <p className="mt-1 text-xs text-violet-600">{property.project.name}</p>
                )}
                <p className="mt-2 text-xl font-bold text-violet-600">{formatINR(Number(property.price))}</p>
                <div className="mt-3 flex gap-4 text-sm text-slate-500">
                  {property.bedrooms > 0 && (
                    <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.bedrooms} Beds</span>
                  )}
                  {property.bathrooms > 0 && (
                    <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms} Baths</span>
                  )}
                  {property.sqft && (
                    <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{Number(property.sqft).toLocaleString()} sqft</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {properties.length === 0 && (
          <p className="py-20 text-center text-slate-500">No properties yet. Run npm run db:seed</p>
        )}
      </div>
    </div>
  );
}
