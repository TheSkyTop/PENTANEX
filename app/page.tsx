"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Factory,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trees,
  Zap,
} from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import countries from "world-atlas/countries-50m.json";

const project = {
  address: "980 Hume Freeway, Craigieburn VIC 3064",
  capacity: "560MW",
  corridor: "Melbourne northern growth corridor",
  coordinates: [144.934, -37.594] as [number, number],
};

const metrics = [
  { value: project.capacity, label: "planned campus capacity envelope" },
  { value: "Craigieburn", label: "Hume Freeway, Victoria location" },
  { value: "AI-ready", label: "high-density data hall planning" },
  { value: "Hyperscale", label: "capacity for cloud and enterprise demand" },
];

const tabs = [
  {
    id: "campus",
    label: "Campus",
    icon: Factory,
    title: "A flagship data centre campus positioned for large-scale digital demand.",
    body: "PENTANEX is planning a 560MW campus capacity envelope at 980 Hume Freeway, Craigieburn VIC 3064. The site narrative is focused on data hall capacity, staging, connectivity, cooling readiness, and customer due diligence.",
    points: ["560MW planned capacity envelope", "Staged data hall expansion", "Craigieburn / Hume Freeway location"],
  },
  {
    id: "capacity",
    label: "Capacity",
    icon: CircuitBoard,
    title: "Capacity planning for AI, cloud, and enterprise workloads.",
    body: "The website should communicate capacity as a product: scalable blocks of future-ready infrastructure for dense compute, resilient operations, and long-term customer growth.",
    points: ["High-density data hall planning", "Customer-ready capacity blocks", "AI and cloud infrastructure readiness"],
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: ShieldCheck,
    title: "A disciplined pathway from site strategy to hyperscale readiness.",
    body: "PENTANEX should be presented as a delivery platform, not simply a landholding. The message should connect planning, approvals, utility readiness, campus design, and stakeholder confidence.",
    points: ["Capacity-led site feasibility", "Planning and approvals pathway", "Customer and utility readiness"],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    icon: Trees,
    title: "A credible sustainability pathway for long-life digital infrastructure.",
    body: "Sustainability language should stay precise and evidence-led until formal targets and certifications are confirmed. The site can still communicate responsible planning, efficient operations, and community interface.",
    points: ["Energy strategy", "Water-conscious cooling", "Efficient operations"],
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    title: "Structured contact channels for customers, partners, and stakeholders.",
    body: "Dedicated contact details will be activated after the domain, email, and phone providers are confirmed. The current site uses placeholder contact details for prototype continuity.",
    points: ["enquiries@pentanex.com.au", "support@pentanex.com.au", "+61 3 0000 0000"],
  },
];

function AustraliaLocationMap() {
  const { australiaPath, sitePoint } = useMemo(() => {
    const australia = feature(
      countries as never,
      (countries as { objects: { countries: unknown } }).objects.countries as never,
    ) as unknown as FeatureCollection<Geometry, { name?: string }>;
    const australiaFeature = australia.features.find(
      (country) => country.id === "036" || country.properties?.name === "Australia",
    ) as Feature<Geometry>;
    const projection = geoMercator().fitSize([520, 330], australiaFeature);
    const path = geoPath(projection);

    return {
      australiaPath: path(australiaFeature) ?? "",
      sitePoint: projection(project.coordinates) ?? [0, 0],
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-sm border border-white/70 bg-white/58 p-5 shadow-glow backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-signal/10" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-steel">Location</p>
          <p className="mt-1 text-sm font-semibold text-graphite">{project.address}</p>
        </div>
        <span className="rounded-sm border border-signal/20 bg-signal/10 px-2.5 py-1 text-xs font-semibold text-signal">
          VIC
        </span>
      </div>

      <div className="relative mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-center">
        <svg
          aria-label="Accurate Australia map with PENTANEX campus location marker near Craigieburn, Victoria"
          className="h-[220px] w-full"
          role="img"
          viewBox="0 0 520 330"
        >
          <defs>
            <linearGradient id="mapFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#f8fffe" />
              <stop offset="100%" stopColor="#dff2ef" />
            </linearGradient>
            <filter id="markerGlow" height="240%" width="240%" x="-70%" y="-70%">
              <feGaussianBlur result="blur" stdDeviation="7" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={australiaPath} fill="url(#mapFill)" stroke="#88c7c1" strokeWidth="1.5" />
          <path
            d="M52 64H470M52 132H470M52 200H470M52 268H470M105 36V298M210 36V298M315 36V298M420 36V298"
            fill="none"
            stroke="#cde3e8"
            strokeDasharray="3 10"
            strokeOpacity="0.75"
            strokeWidth="1"
          />
          <path
            d={`M${sitePoint[0]} ${sitePoint[1]} 294 190`}
            stroke="#0faea6"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="#0faea6" filter="url(#markerGlow)" r="6" />
          <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="none" r="17" stroke="#0faea6" strokeOpacity="0.42" strokeWidth="9" />
          <rect fill="#102033" height="30" rx="3" width="126" x="214" y="174" />
          <text fill="#ffffff" fontSize="11" fontWeight="700" x="228" y="193">
            Craigieburn VIC
          </text>
        </svg>

        <div className="rounded-sm border border-slate-200/70 bg-white/70 p-4 backdrop-blur">
          <p className="text-4xl font-semibold text-graphite">{project.capacity}</p>
          <p className="mt-3 text-sm leading-6 text-steel">
            Planned campus capacity envelope in {project.corridor}.
          </p>
          <p className="mt-3 text-[11px] leading-5 text-steel">
            Map outline uses Natural Earth geodata via world-atlas. Marker uses approximate
            Craigieburn coordinates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const ActiveIcon = activeTab.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4f8] text-graphite">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/62 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="PENTANEX home">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-signal/35 bg-white/80 text-xs font-semibold text-signal">
              PX
            </span>
            <span className="text-sm font-semibold tracking-[0.22em] text-graphite">PENTANEX</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-steel md:flex">
            {tabs.slice(0, 4).map((tab) => (
              <button
                className="transition hover:text-graphite"
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <button
            className="inline-flex items-center gap-2 rounded-sm bg-graphite px-4 py-2 text-sm font-medium text-white transition hover:bg-signal"
            onClick={() => setActiveTab(tabs[4])}
            type="button"
          >
            Contact
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <section id="top" className="relative min-h-screen px-5 pt-[68px] sm:px-8">
        <div className="site-grid absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute left-[8%] top-[16%] h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[12%] right-[6%] h-80 w-80 rounded-full bg-power/12 blur-3xl" />

        <div className="relative mx-auto grid h-[calc(100vh-68px)] max-w-7xl items-center gap-5 py-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="grid min-h-0 gap-4">
            <AustraliaLocationMap />

            <div className="rounded-sm border border-white/70 bg-white/58 p-6 shadow-glow backdrop-blur-2xl">
              <div className="inline-flex items-center gap-2 rounded-sm border border-signal/20 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                <Globe2 size={15} />
                Australian Digital Infrastructure
              </div>
              <h1 className="mt-5 text-5xl font-semibold leading-[1] text-graphite sm:text-6xl">
                PENTANEX
              </h1>
              <p className="mt-4 max-w-2xl text-xl leading-8 text-slate-700">
                AI-ready data centre capacity for Australia&apos;s next era of compute.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-steel">
                Led by the {project.address} {project.capacity} campus capacity envelope,
                PENTANEX is planning scalable infrastructure for cloud platforms, AI compute,
                enterprise workloads, and sovereign digital growth.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-signal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-graphite"
                  onClick={() => setActiveTab(tabs[0])}
                  type="button"
                >
                  View Campus
                  <ArrowRight size={17} />
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-sm border border-slate-300 bg-white/72 px-5 py-3 text-sm font-semibold text-graphite transition hover:border-signal hover:text-signal"
                  onClick={() => setActiveTab(tabs[1])}
                  type="button"
                >
                  Capacity Strategy
                </button>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 gap-4">
            <div className="rounded-sm border border-white/70 bg-white/56 p-4 shadow-glow backdrop-blur-2xl">
              <div className="grid gap-2 sm:grid-cols-4">
                {metrics.map((metric) => (
                  <div className="rounded-sm border border-slate-200/70 bg-white/66 p-3" key={metric.label}>
                    <p className="text-lg font-semibold text-graphite">{metric.value}</p>
                    <p className="mt-1 text-[11px] leading-4 text-steel">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-white/70 bg-white/58 p-5 shadow-glow backdrop-blur-2xl">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm font-semibold transition ${
                      activeTab.id === tab.id
                        ? "border-signal bg-signal text-white"
                        : "border-slate-200 bg-white/72 text-steel hover:border-signal hover:text-signal"
                    }`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-sm border border-slate-200/70 bg-white/68 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-signal/10 text-signal">
                    <ActiveIcon size={22} />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold leading-tight text-graphite">
                    {activeTab.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-steel">{activeTab.body}</p>
                </div>

                <div className="rounded-sm border border-slate-200/70 bg-[#f8fbfd]/76 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
                    Current focus
                  </p>
                  <div className="mt-5 space-y-3">
                    {activeTab.points.map((point) => (
                      <div className="flex gap-3 rounded-sm border border-slate-200 bg-white/72 p-3" key={point}>
                        <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={18} />
                        <span className="text-sm font-medium text-graphite">{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {Array.from({ length: 15 }).map((_, index) => (
                      <span
                        className="h-7 rounded-sm border border-slate-200 bg-white/80"
                        key={`data-hall-${index}`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-steel">
                    staged data hall capacity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
