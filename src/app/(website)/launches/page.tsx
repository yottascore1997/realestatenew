import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type LaunchWithProject = Prisma.LaunchGetPayload<{ include: { project: true } }>;

export default async function LaunchesPage() {
  let launches: LaunchWithProject[] = [];

  try {
    launches = await prisma.launch.findMany({
      orderBy: [{ featured: "desc" }, { launchDate: "asc" }],
      include: { project: true },
    });
  } catch {
    // DB unavailable or schema not migrated — render empty state
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-slate-900">New Launches</h1>
        <p className="website-body-text mt-2 text-slate-500">{launches.length} exclusive pre-launch & live opportunities</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {launches.map((launch) => (
            <Link
              key={launch.id}
              href={`/launches/${launch.slug}`}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="relative h-52">
                <img src={launch.image || ""} alt={launch.name} className="h-full w-full object-cover" />
                <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${
                  launch.status === "LIVE" ? "bg-emerald-500" : launch.status === "UPCOMING" ? "bg-blue-500" : "bg-slate-500"
                }`}>
                  {launch.status}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">{launch.name}</h2>
                <p className="text-sm text-slate-500">{launch.location}, {launch.city}</p>
                {launch.project && (
                  <p className="mt-1 text-xs text-violet-600">Project: {launch.project.name}</p>
                )}
                {launch.priceFrom && (
                  <p className="mt-2 text-lg font-bold text-violet-600">{formatINR(Number(launch.priceFrom))}* Onwards</p>
                )}
                {launch.launchDate && (
                  <p className="mt-2 text-xs text-slate-400">
                    Launch: {new Date(launch.launchDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                <div className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                  View Launch Page →
                </div>
              </div>
            </Link>
          ))}
        </div>
        {launches.length === 0 && (
          <p className="py-20 text-center text-slate-500">No launches yet. Run npm run db:seed</p>
        )}
      </div>
    </div>
  );
}
