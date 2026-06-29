import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProjectWithBuilder = Prisma.ProjectGetPayload<{
  include: { builder: true; _count: { select: { properties: true } } };
}>;

export default async function ProjectsPage() {
  let projects: ProjectWithBuilder[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { builder: true, _count: { select: { properties: true } } },
    });
  } catch {
    // DB unavailable or schema not migrated — render empty state
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Our Projects</h1>
        <p className="mt-2 text-slate-500">{projects.length} premium developments across India</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-shadow hover:shadow-xl">
              <div className="relative h-56">
                <img src={project.image || ""} alt={project.name} className="h-full w-full object-cover" />
                {project.featured && (
                  <span className="absolute left-3 top-3 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">FEATURED</span>
                )}
              </div>
              <div className="p-6">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {project.status.replace(/_/g, " ")}
                </span>
                <h2 className="mt-3 text-xl font-bold text-slate-900">{project.name}</h2>
                <p className="text-slate-500">{project.location}, {project.city}</p>
                <p className="mt-1 text-sm text-slate-400">
                  by {project.builder?.name || project.developer || "EstatePro"}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">Starting from</p>
                    <p className="font-bold text-violet-600">
                      {project.priceFrom ? formatINR(Number(project.priceFrom)) : "On Request"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Units</p>
                    <p className="font-bold text-slate-900">{project.totalUnits ?? "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 && (
          <p className="py-20 text-center text-slate-500">No projects yet. Run npm run db:seed</p>
        )}
      </div>
    </div>
  );
}
