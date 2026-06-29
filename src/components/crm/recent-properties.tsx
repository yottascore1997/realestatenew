import Link from "next/link";
import { Bed, Bath, Maximize, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface RecentProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  image: string;
  status: string;
}

interface RecentPropertiesProps {
  data: RecentProperty[];
}

export function RecentProperties({ data }: RecentPropertiesProps) {
  return (
    <Card className="crm-card border-slate-100/80">
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Recent Properties</CardTitle>
          <p className="mt-0.5 text-xs text-slate-400">Latest from database</p>
        </div>
        <Link href="/crm/properties" className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700">
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      {data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-slate-400">
          No properties yet
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map((property) => (
            <li key={property.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-violet-100 hover:bg-violet-50/30">
              <img src={property.image} alt={property.title} className="h-16 w-20 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-slate-100" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{property.title}</p>
                    <p className="text-xs text-slate-500">{property.address}</p>
                  </div>
                  <Badge variant={property.status === "FOR_RENT" ? "default" : "success"}>
                    {property.status === "FOR_RENT" ? "For Rent" : "For Sale"}
                  </Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{property.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{property.bathrooms}</span>
                  {property.sqft && <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{property.sqft.toLocaleString()} sqft</span>}
                </div>
                <p className="mt-1 text-sm font-extrabold text-violet-700">{formatCurrency(property.price)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
