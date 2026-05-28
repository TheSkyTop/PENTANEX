"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircuitBoard,
  Factory,
  Globe2,
  Mail,
  ShieldCheck,
  Trees,
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
    title: "A 560MW data centre campus planned for staged hyperscale growth.",
    body: "The Craigieburn campus should be framed as a capacity platform: staged data halls, utility coordination, cooling optionality, secure operations, and customer due diligence from the earliest planning phase.",
    points: ["560MW planned capacity envelope", "Staged data hall expansion", "Craigieburn / Hume Freeway location"],
  },
  {
    id: "capacity",
    label: "Capacity",
    icon: CircuitBoard,
    title: "Capacity planning for AI, cloud, and enterprise workload demand.",
    body: "For data centre customers, capacity is not just land or megawatts. The offer must translate into future data hall blocks, density pathways, fibre strategy, cooling readiness, and predictable expansion sequencing.",
    points: ["High-density data hall planning", "Customer-ready capacity blocks", "AI and cloud infrastructure readiness"],
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: ShieldCheck,
    title: "A delivery pathway from capacity strategy to customer readiness.",
    body: "The strongest positioning is not simply ownership of a location. It is the ability to coordinate planning, approvals, utility interfaces, data hall design, stakeholder engagement, and delivery milestones.",
    points: ["Capacity-led site feasibility", "Planning and approvals pathway", "Customer and utility readiness"],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    icon: Trees,
    title: "A sustainability pathway that stays evidence-led and buildable.",
    body: "Until formal targets are confirmed, the site should communicate credible planning principles: efficient operating envelopes, water-conscious cooling options, grid-aware development, and clear community interface.",
    points: ["Efficient operating envelope", "Water-conscious cooling options", "Community and grid interface"],
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    title: "Clear channels for customers, partners, investors, and stakeholders.",
    body: "The contact experience should separate customer capacity enquiries, partnerships, media, and support once the domain, email, and phone systems are confirmed.",
    points: ["enquiries@pentanex.com.au", "support@pentanex.com.au", "+61 3 0000 0000"],
  },
];

const footerGroups = [
  {
    heading: "Campus",
    items: ["980 Hume Freeway", "Craigieburn VIC 3064", "Melbourne northern growth corridor"],
  },
  {
    heading: "Capacity",
    items: ["560MW planned capacity envelope", "AI-ready data hall planning", "Hyperscale customer demand"],
  },
  {
    heading: "Company",
    items: ["Australian digital infrastructure", "Cloud, AI, and enterprise workloads", "Staged delivery pathway"],
  },
  {
    heading: "Contact",
    items: ["enquiries@pentanex.com.au", "support@pentanex.com.au", "+61 3 0000 0000"],
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
    <div className="relative overflow-hidden rounded-sm border border-white/70 bg-white/58 p-4 shadow-glow backdrop-blur-2xl xl:p-5">
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

      <div className="relative mt-3 grid gap-3 lg:grid-cols-[1fr_0.68fr] lg:items-center xl:mt-4 xl:gap-4">
        <svg
          aria-label="Accurate Australia map with PENTANEX campus location marker near Craigieburn, Victoria"
          className="h-[clamp(150px,24vh,220px)] w-full"
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

        <div className="rounded-sm border border-slate-200/70 bg-white/70 p-3 backdrop-blur xl:p-4">
          <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none text-graphite">
            {project.capacity}
          </p>
          <p className="mt-2 text-sm leading-6 text-steel">
            Planned campus capacity envelope in {project.corridor}.
          </p>
          <p className="mt-2 text-[11px] leading-5 text-steel">
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
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-sm border border-white/80 bg-white/78 px-4 py-3 shadow-[0_18px_60px_rgba(16,32,51,0.12)] backdrop-blur-2xl">
          <a className="flex items-center gap-3" href="#top" aria-label="PENTANEX home">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-signal/35 bg-white/80 text-xs font-semibold text-signal">
              PX
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.22em] text-graphite">
                PENTANEX
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-steel sm:block">
                Data Centre Infrastructure
              </span>
            </span>
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 rounded-sm border border-slate-200/75 bg-[#f8fbfd]/78 p-1 shadow-inner backdrop-blur-2xl lg:flex"
          >
            {tabs.map((tab) => (
              <button
                className={`rounded-sm border px-3.5 py-2 text-sm font-semibold transition ${
                  activeTab.id === tab.id
                    ? "border-signal bg-signal text-white shadow-sm"
                    : "border-slate-200/70 bg-white/62 text-steel hover:border-signal/45 hover:bg-white/90 hover:text-signal"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden w-[210px] lg:block" aria-hidden="true" />
        </div>

        <nav
          aria-label="Mobile navigation"
          className="mx-auto mt-2 flex max-w-7xl gap-2 overflow-x-auto rounded-sm border border-white/75 bg-white/70 p-2 shadow-sm backdrop-blur-2xl lg:hidden"
        >
          {tabs.map((tab) => (
            <button
              className={`shrink-0 rounded-sm border px-3 py-2 text-xs font-semibold transition ${
                activeTab.id === tab.id
                  ? "border-signal bg-signal text-white shadow-sm"
                  : "border-slate-200/70 bg-white/62 text-steel hover:border-signal/45 hover:text-signal"
              }`}
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <section
        id="top"
        className="relative flex items-start justify-center px-5 pb-4 pt-[118px] sm:px-8 lg:pt-[92px]"
      >
        <div className="site-grid absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute left-[8%] top-[16%] h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[12%] right-[6%] h-80 w-80 rounded-full bg-power/12 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-stretch gap-4 lg:grid-cols-[1.05fr_0.95fr] xl:gap-5">
          <div className="grid min-h-0 gap-4">
            <AustraliaLocationMap />

            <div className="rounded-sm border border-white/70 bg-white/58 p-5 shadow-glow backdrop-blur-2xl xl:p-6">
              <div className="inline-flex items-center gap-2 rounded-sm border border-signal/20 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                <Globe2 size={15} />
                Australian Digital Infrastructure
              </div>
              <h1 className="mt-4 text-[clamp(2.6rem,5.2vw,4rem)] font-semibold leading-[1] text-graphite">
                PENTANEX
              </h1>
              <p className="mt-3 max-w-2xl text-[clamp(1.05rem,2vw,1.35rem)] leading-8 text-slate-700">
                AI-ready data centre capacity for Australia&apos;s next compute cycle.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-steel">
                Led by the {project.address} {project.capacity} campus capacity envelope,
                PENTANEX is planning scalable infrastructure for AI compute, cloud platforms,
                enterprise workloads, and sovereign digital infrastructure.
              </p>
            </div>
          </div>

          <div className="grid min-h-0 gap-4">
            <div className="rounded-sm border border-white/70 bg-white/56 p-3 shadow-glow backdrop-blur-2xl xl:p-4">
              <div className="grid gap-2 sm:grid-cols-4">
                {metrics.map((metric) => (
                  <div className="rounded-sm border border-slate-200/70 bg-white/66 p-3" key={metric.label}>
                    <p className="text-[clamp(0.95rem,1.35vw,1.125rem)] font-semibold text-graphite">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-steel">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-white/70 bg-white/58 p-4 shadow-glow backdrop-blur-2xl xl:p-5">
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] xl:gap-5">
                <div className="rounded-sm border border-slate-200/70 bg-white/68 p-4 xl:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-signal/10 text-signal">
                    <ActiveIcon size={22} />
                  </div>
                  <h2 className="mt-4 text-[clamp(1.25rem,2.2vw,1.5rem)] font-semibold leading-tight text-graphite">
                    {activeTab.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-steel">{activeTab.body}</p>
                </div>

                <div className="rounded-sm border border-slate-200/70 bg-[#f8fbfd]/76 p-4 xl:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
                    Current focus
                  </p>
                  <div className="mt-4 space-y-2 xl:mt-5 xl:space-y-3">
                    {activeTab.points.map((point) => (
                      <div className="flex gap-3 rounded-sm border border-slate-200 bg-white/72 p-3" key={point}>
                        <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={18} />
                        <span className="text-sm font-medium text-graphite">{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-2 xl:mt-5">
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

      <footer className="relative px-5 pb-6 sm:px-8">
        <div className="site-grid absolute inset-x-0 bottom-0 top-[-40px] opacity-50" />
        <div className="relative mx-auto max-w-7xl rounded-sm border border-white/70 bg-white/62 p-5 shadow-glow backdrop-blur-2xl xl:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_2.1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-signal/35 bg-white/80 text-xs font-semibold text-signal">
                  PX
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-[0.22em] text-graphite">PENTANEX</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-steel">
                    Data Centre Infrastructure
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-steel">
                Planning AI-ready data centre capacity for cloud platforms, enterprise workloads,
                and sovereign digital infrastructure in Australia.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {footerGroups.map((group) => (
                <div
                  className="rounded-sm border border-slate-200/70 bg-white/68 p-4"
                  key={group.heading}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                    {group.heading}
                  </p>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <p className="text-sm leading-5 text-graphite" key={item}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-slate-200/80 pt-4 text-xs text-steel sm:flex-row sm:items-center sm:justify-between">
            <p>(c) 2026 PENTANEX. Project information is subject to planning and delivery confirmation.</p>
            <p>Flagship campus: {project.address}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
