import Link from "next/link";
import { ArrowRight, Building2, Rocket, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { websiteProjects, websiteLaunches, recentProperties } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#1e2a5e] to-[#4F6BF5] py-20 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-300">
            Premium Real Estate
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Find Your Dream Home & Investment
          </h1>
          <p className="mt-6 text-lg text-blue-100">
            Explore premium projects, properties, and exclusive launches. Your perfect property is just a click away.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects">
              <Button size="lg" className="bg-white text-[#4F6BF5] hover:bg-white/90">
                Explore Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/launches">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                New Launches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedSection() {
  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Projects</h2>
              <p className="text-slate-500">Premium developments across top cities</p>
            </div>
            <Link href="/projects" className="text-sm font-medium text-[#4F6BF5] hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {websiteProjects.map((project) => (
              <div key={project.id} className="group overflow-hidden rounded-2xl bg-white card-shadow-lg border border-slate-100">
                <div className="relative h-52 overflow-hidden">
                  <img src={project.image} alt={project.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                    {project.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.location}</p>
                  <p className="mt-2 text-sm font-semibold text-[#4F6BF5]">
                    From ₹{(project.priceFrom / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">New Launches</h2>
              <p className="text-slate-500">Be the first to book exclusive launches</p>
            </div>
            <Link href="/launches" className="text-sm font-medium text-[#4F6BF5] hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {websiteLaunches.map((launch) => (
              <div key={launch.id} className="overflow-hidden rounded-2xl bg-white card-shadow border border-slate-100">
                <img src={launch.image} alt={launch.name} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${launch.status === "LIVE" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                    {launch.status}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900">{launch.name}</h3>
                  <p className="text-sm text-slate-500">{launch.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Properties For Sale</h2>
            <p className="text-slate-500">Handpicked properties for you</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recentProperties.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-2xl bg-white card-shadow border border-slate-100">
                <img src={property.image} alt={property.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-slate-900">{property.title}</h3>
                  <p className="text-sm text-slate-500">{property.address}</p>
                  <p className="mt-2 text-lg font-bold text-[#4F6BF5]">{formatCurrency(property.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <Building2 className="mx-auto h-10 w-10 text-[#4F6BF5]" />
              <h3 className="mt-4 text-xl font-bold">50+ Projects</h3>
              <p className="mt-2 text-slate-400">Premium developments across India</p>
            </div>
            <div className="text-center">
              <Home className="mx-auto h-10 w-10 text-[#4F6BF5]" />
              <h3 className="mt-4 text-xl font-bold">1200+ Properties</h3>
              <p className="mt-2 text-slate-400">Homes, villas, and commercial spaces</p>
            </div>
            <div className="text-center">
              <Rocket className="mx-auto h-10 w-10 text-[#4F6BF5]" />
              <h3 className="mt-4 text-xl font-bold">25+ Launches</h3>
              <p className="mt-2 text-slate-400">Exclusive pre-launch opportunities</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
