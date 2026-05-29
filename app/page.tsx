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
import { geoMercator, geoNaturalEarth1, geoPath } from "d3-geo";
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
  { value: project.capacity, label: "Masterplanned hyperscale campus capacity" },
  { value: "Melbourne", label: "Strategic Melbourne North, VIC Australia" },
  { value: "AI-ready", label: "High-density compute infrastructure" },
  { value: "Hyperscale", label: "Scalable cloud and AI compute capacity" },
];

const tabs = [
  {
    id: "campus",
    label: "Campus",
    icon: Factory,
    title: "We are developing a masterplanned hyperscale campus for AI and cloud growth.",
    body: [
      "PENTANEX is planning a long-term digital infrastructure platform designed for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand.",
      "The campus strategy is centred on expandable data hall zones, customer-ready utility corridors, secure operations, fibre pathways, and staged deployment flexibility.",
      "The objective is to provide a scalable foundation for high-density compute environments, resilient customer growth, and future-ready digital infrastructure across Australia and the Asia-Pacific region.",
    ],
    points: ["560MW masterplanned campus capacity", "Expandable data hall precincts", "Melbourne North infrastructure corridor"],
  },
  {
    id: "capacity",
    label: "Capacity",
    icon: CircuitBoard,
    title: "We are planning capacity for high-density AI and accelerated compute.",
    body: "Our capacity model is being shaped around deployable infrastructure blocks: staged power delivery, high-density rack environments, cooling optionality, fibre diversity, and repeatable data hall modules. For hyperscale and AI customers, the campus is intended to support dense compute clusters, resilient operations, and predictable expansion over multiple deployment phases.",
    points: ["High-density AI compute environments", "Scalable power and cooling pathways", "Repeatable hyperscale capacity blocks"],
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: ShieldCheck,
    title: "We are building a delivery pathway from masterplan to customer-ready capacity.",
    body: "PENTANEX is approaching delivery through disciplined project controls: planning approvals, grid and energy interfaces, civil enabling works, data hall design standards, procurement sequencing, and stakeholder coordination. The objective is to convert a large-scale campus plan into staged, bankable, and customer-ready infrastructure capacity.",
    points: ["Planning and approvals workstream", "Grid and energy interface strategy", "Customer-ready delivery milestones"],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    icon: Trees,
    title: "We are designing for resilient, efficient, and accountable digital infrastructure.",
    body: "Our sustainability pathway is focused on practical outcomes that can be engineered and verified: efficient operating envelopes, renewable and firmed energy integration, water-conscious cooling options, heat and environmental management, and a transparent community interface. The campus is being planned for long-term operational resilience as AI and cloud demand scales.",
    points: ["Renewable and firmed energy planning", "Efficient cooling and operating envelopes", "Long-term operational resilience"],
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    title: "Speak with PENTANEX about capacity, partnerships, and project engagement.",
    body: "We welcome project-level conversations with hyperscale operators, cloud platforms, enterprise AI customers, energy and infrastructure partners, investors, and local stakeholders. Enquiries should focus on capacity requirements, partnership alignment, delivery pathway, and strategic infrastructure engagement for the Melbourne North campus.",
    points: ["enquiries@pentanex.com.au", "Capacity and partnership enquiries", "Melbourne, Australia"],
  },
];

const footerGroups = [
  {
    heading: "Campus",
    items: ["Craigieburn VIC", "Melbourne North", "Hume corridor"],
  },
  {
    heading: "Capacity",
    items: ["560MW campus", "AI-ready compute", "Staged data halls"],
  },
  {
    heading: "Platform",
    items: ["Cloud and AI workloads", "Power, cooling, fibre", "Sovereign capability"],
  },
  {
    heading: "Contact",
    items: ["Project enquiries", "enquiries@pentanex.com.au", "Melbourne, Australia"],
  },
];

const footerIntro =
  "Developing scalable AI-ready digital infrastructure for hyperscale cloud, accelerated compute, and sovereign enterprise workloads across Australia.";

const australiaMapYOffset = 34;

const infrastructureNarrative = [
  "PENTANEX is developing AI-ready digital infrastructure designed to support Australia's next generation of hyperscale compute demand, cloud platforms, enterprise AI workloads, and sovereign digital capability.",
  "The project is being designed for high-density AI and accelerated computing environments, supported by scalable power infrastructure, renewable and firmed energy integration, operational resilience, and long-term sustainability.",
  "Positioned to support the rapid growth of AI training, inference, and large-scale cloud deployment across Australia and the Asia-Pacific region, PENTANEX aims to deliver a future-ready hyperscale platform for the next compute cycle driven by artificial intelligence and digital transformation.",
];

function PentanexLogo() {
  return (
    <img
      alt=""
      className="h-11 w-11 shrink-0 object-contain"
      src="/pentanex-logo.png"
    />
  );
}

function AustraliaLocationMap() {
  const { australiaPath, sitePoint, worldPaths } = useMemo(() => {
    const world = feature(
      countries as never,
      (countries as { objects: { countries: unknown } }).objects.countries as never,
    ) as unknown as FeatureCollection<Geometry, { name?: string }>;
    const australiaFeature = world.features.find(
      (country) => country.id === "036" || country.properties?.name === "Australia",
    ) as Feature<Geometry>;
    const projection = geoMercator().fitExtent([[24, 8], [596, 352]], australiaFeature);
    const path = geoPath(projection);
    const worldProjection = geoNaturalEarth1().fitExtent([[-78, -58], [698, 418]], world);
    const worldPath = geoPath(worldProjection);

    return {
      australiaPath: path(australiaFeature) ?? "",
      sitePoint: projection(project.coordinates) ?? [0, 0],
      worldPaths: world.features
        .map((country) => worldPath(country))
        .filter((countryPath): countryPath is string => Boolean(countryPath)),
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-sm border border-white/70 bg-white/58 p-4 shadow-glow backdrop-blur-2xl xl:p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/82 via-white/32 to-signal/12" />

      <div className="relative">
        <svg
          aria-label="Accurate Australia map with PENTANEX campus location marker near Craigieburn, Victoria"
          className="h-[clamp(230px,32vh,300px)] w-full"
          role="img"
          viewBox="0 0 620 360"
        >
          <defs>
            <linearGradient id="mapFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#f8fffe" />
              <stop offset="100%" stopColor="#dff2ef" />
            </linearGradient>
            <linearGradient id="locationTag" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e9fbfa" />
            </linearGradient>
            <linearGradient id="mapAxisX" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#0faea6" stopOpacity="0" />
              <stop offset="50%" stopColor="#0faea6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0faea6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mapAxisY" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0faea6" stopOpacity="0" />
              <stop offset="50%" stopColor="#0faea6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0faea6" stopOpacity="0" />
            </linearGradient>
            <filter id="softGlass" height="180%" width="180%" x="-40%" y="-40%">
              <feDropShadow dx="0" dy="7" floodColor="#0faea6" floodOpacity="0.12" stdDeviation="8" />
            </filter>
            <filter id="markerGlow" height="240%" width="240%" x="-70%" y="-70%">
              <feGaussianBlur result="blur" stdDeviation="10" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="dashedArrow"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path d="M0 0L8 4L0 8Z" fill="#0faea6" />
            </marker>
          </defs>
          <path d="M36 180H584" stroke="url(#mapAxisX)" strokeWidth="1.4" />
          <path d="M310 38V326" stroke="url(#mapAxisY)" strokeWidth="1.2" />
          <g opacity="0.24">
            {worldPaths.map((countryPath, index) => (
              <path
                d={countryPath}
                fill="#c9e7e4"
                key={`world-${index}`}
                stroke="#78b9b2"
                strokeWidth="0.5"
              />
            ))}
          </g>
          <path
            d="M46 58H548M46 126H548M46 194H548M46 262H548M46 330H548M96 32V336M196 32V336M296 32V336M396 32V336M496 32V336"
            fill="none"
            stroke="#cde3e8"
            strokeDasharray="3 10"
            strokeOpacity="0.75"
            strokeWidth="1"
          />
          <g transform={`translate(0 ${australiaMapYOffset})`}>
            <path d={australiaPath} fill="url(#mapFill)" stroke="#88c7c1" strokeWidth="1.6" />
            <path
              d={`M${sitePoint[0] + 44} ${sitePoint[1] + 8} C${sitePoint[0] + 30} ${sitePoint[1] + 5} ${sitePoint[0] + 23} ${sitePoint[1] + 4} ${sitePoint[0] + 13} ${sitePoint[1] + 1}`}
              fill="none"
              markerEnd="url(#dashedArrow)"
              stroke="#0faea6"
              strokeDasharray="7 8"
              strokeLinecap="round"
              strokeWidth="2.2"
            />
            <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="none" r="15" stroke="#74c947" strokeDasharray="3 6" strokeOpacity="0.58" strokeWidth="1.6" />
            <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="#0faea6" r="4.5" />
            <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="none" r="9" stroke="#0faea6" strokeOpacity="0.5" strokeWidth="3" />
            <rect
              fill="url(#locationTag)"
              filter="url(#softGlass)"
              height="34"
              rx="4"
              stroke="#7bdad4"
              strokeOpacity="0.9"
              width="188"
              x={sitePoint[0] + 50}
              y={sitePoint[1] - 12}
            />
            <text fill="#0faea6" fontSize="11.5" fontWeight="800" letterSpacing="0.7" x={sitePoint[0] + 64} y={sitePoint[1] + 10}>
              Craigieburn VIC, Australia
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const ActiveIcon = activeTab.icon;
  const activeBodyParagraphs = Array.isArray(activeTab.body) ? activeTab.body : [activeTab.body];

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4f8] text-graphite">
      <header className="sticky top-0 z-50 px-5 pt-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-sm border border-white/80 bg-white/78 px-4 py-3 shadow-[0_18px_60px_rgba(16,32,51,0.12)] backdrop-blur-2xl">
          <a className="flex items-center gap-3" href="#top" aria-label="PENTANEX home">
            <PentanexLogo />
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
        className="relative flex items-start justify-center px-5 pb-4 pt-4 sm:px-8"
      >
        <div className="site-grid absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute left-[8%] top-[16%] h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[12%] right-[6%] h-80 w-80 rounded-full bg-power/12 blur-3xl" />

        {activeTab.id === "campus" ? (
          <div className="relative mx-auto grid w-full max-w-7xl items-stretch gap-4 lg:grid-cols-[1.05fr_0.95fr] xl:gap-5">
            <div className="grid min-h-0 gap-4">
              <AustraliaLocationMap />

              <div className="rounded-sm border border-white/70 bg-white/58 p-5 shadow-glow backdrop-blur-2xl xl:p-6">
                <div className="inline-flex items-center gap-2 rounded-sm border border-signal/20 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                  <Globe2 size={15} />
                  Australian Digital Infrastructure
                </div>
                <div className="mt-4 max-w-3xl space-y-3">
                  {infrastructureNarrative.map((paragraph) => (
                    <p className="text-sm leading-6 text-steel" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
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
                <div className="rounded-sm border border-slate-200/70 bg-[#f8fbfd]/72 p-4 xl:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-signal/10 text-signal">
                    <ActiveIcon size={22} />
                  </div>
                  <div className="mt-4 space-y-3">
                    {activeBodyParagraphs.map((paragraph) => (
                      <p className="text-sm leading-6 text-steel" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-200/80 pt-4">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <span
                          className={`h-7 rounded-sm border ${
                            index === 0
                              ? "border-signal/50 bg-[repeating-linear-gradient(135deg,rgba(15,174,166,0.2)_0,rgba(15,174,166,0.2)_2px,rgba(15,174,166,0.06)_2px,rgba(15,174,166,0.06)_8px)] shadow-[0_0_16px_rgba(15,174,166,0.18)]"
                              : "border-slate-200 bg-white/82"
                          }`}
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
        ) : (
          <div className="relative mx-auto w-full max-w-7xl">
            <div className="rounded-sm border border-white/70 bg-white/58 p-5 shadow-glow backdrop-blur-2xl xl:p-6">
              <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] xl:gap-6">
                <div className="rounded-sm border border-slate-200/70 bg-white/68 p-5 xl:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-signal/10 text-signal">
                    <ActiveIcon size={23} />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-signal">
                    {activeTab.label}
                  </p>
                  <h1 className="mt-3 max-w-3xl text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-tight text-graphite">
                    {activeTab.title}
                  </h1>
                  <div className="mt-4 max-w-3xl space-y-3">
                    {activeBodyParagraphs.map((paragraph) => (
                      <p className="text-base leading-8 text-steel" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-sm border border-slate-200/70 bg-[#f8fbfd]/76 p-5 xl:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
                    Current focus
                  </p>
                  <div className="mt-5 grid gap-3">
                    {activeTab.points.map((point) => (
                      <div className="flex gap-3 rounded-sm border border-slate-200 bg-white/72 p-4" key={point}>
                        <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={18} />
                        <span className="text-sm font-semibold leading-5 text-graphite">{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-5 gap-2">
                    {Array.from({ length: 20 }).map((_, index) => (
                      <span
                        className="h-8 rounded-sm border border-slate-200 bg-white/80"
                        key={`tab-capacity-${index}`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-steel">
                    integrated data hall planning
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="relative px-5 pb-6 sm:px-8">
        <div className="site-grid absolute inset-x-0 bottom-0 top-[-40px] opacity-50" />
        <div className="relative mx-auto max-w-7xl rounded-sm border border-white/70 bg-white/62 p-5 shadow-glow backdrop-blur-2xl xl:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_2.1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <PentanexLogo />
                <div>
                  <p className="text-sm font-semibold tracking-[0.22em] text-graphite">PENTANEX</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-steel">
                    Data Centre Infrastructure
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-steel">
                {footerIntro}
              </p>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                      <p className="break-words text-[12px] leading-5 text-graphite xl:text-[13px]" key={item}>
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
            <p>AI-ready hyperscale infrastructure platform.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
