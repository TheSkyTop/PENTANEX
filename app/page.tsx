"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircuitBoard,
  Factory,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trees,
  UsersRound,
} from "lucide-react";
import { geoMercator, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import countries from "world-atlas/countries-50m.json";

const project = {
  address: "Melbourne North, Victoria",
  capacity: "400 MW +",
  corridor: "Melbourne North infrastructure corridor",
  coordinates: [144.96, -37.62] as [number, number],
};

const contactEmail = "enquiries@pentanex.com.au";
const contactEmailDisplay = "Enquiries@pentanex.com.au";
const siteUrl = "https://pentanex.com.au";

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
    panelTitle: "Campus Development Strategy",
    title: "We are developing a masterplanned hyperscale campus for AI and cloud growth.",
    body: [
      "PENTANEX is planning a long-term digital infrastructure platform designed for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand.",
      "The campus strategy is centred on expandable capacity zones, resilient utility planning, secure operations, connectivity pathways, and staged deployment flexibility.",
      "The objective is to provide a scalable foundation for high-density compute environments, resilient customer growth, and future-ready digital infrastructure across Australia and the Asia-Pacific region.",
    ],
    points: ["400 MW + masterplanned campus capacity", "Expandable capacity precincts", "Melbourne North infrastructure corridor"],
    sideNote: "Campus planning is structured around scalable capacity zones, resilient operations, and long-term expansion flexibility.",
  },
  {
    id: "capacity",
    label: "Capacity",
    icon: CircuitBoard,
    panelTitle: "Capacity Strategy",
    title: "",
    body: [
      "The PENTANEX capacity strategy is centred on a masterplanned 400 MW + hyperscale campus platform for cloud, AI, accelerated compute, and sovereign enterprise workloads.",
      "Capacity is being planned as a staged infrastructure platform rather than a single building, with expandable precincts, resilient utility planning, connectivity diversity, and deployment zones able to scale in line with demand.",
      "For hyperscale and AI customers, the capacity architecture prioritises secure operations, high-density compute readiness, energy and cooling optionality, and predictable release pathways across multiple development phases.",
    ],
    points: ["400 MW + masterplanned campus capacity", "High-density AI and accelerated compute", "Scalable staged deployment"],
    sideNote: "",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: ShieldCheck,
    panelTitle: "Delivery Pathway",
    title: "",
    body: [
      "PENTANEX is approaching delivery through a disciplined infrastructure development pathway, aligning approvals, enabling works, utility interfaces, design governance, and stakeholder coordination into a staged execution model.",
      "The delivery strategy is intended to translate a large-scale masterplanned campus into credible staged capacity. Key workstreams include energy interface planning, connectivity pathways, secure access planning, and operational readiness.",
      "For hyperscale and enterprise customers, delivery certainty is supported through milestone control, services coordination, staged capacity release, resilience validation, and expansion optionality across future phases.",
    ],
    points: ["Planning approvals and enabling works", "Grid, energy, fibre, and cooling interfaces", "Customer-ready milestone governance"],
    sideNote: "",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    icon: Trees,
    panelTitle: "Resilient Infrastructure",
    title: "",
    body: [
      "PENTANEX treats sustainability as an infrastructure design discipline. The campus pathway focuses on operating efficiency, resilient energy strategy, climate-aware design, and environmental performance across development and operations.",
      "Energy planning is a core design driver. Grid connection, renewable supply, firming arrangements, backup systems, and customer load growth need to be coordinated as part of the same long-term capacity platform.",
      "Cooling and water strategy are central to AI-ready capacity. The campus approach considers efficient operating envelopes, water-conscious cooling pathways, heat management, and plant optionality for varied customer technology profiles.",
      "Operational sustainability extends beyond energy use. Secure operations, monitoring and controls, maintenance access, materials awareness, community engagement, and reporting structures all support a credible hyperscale platform.",
    ],
    points: ["Renewable and firmed energy integration", "Efficient cooling and water-conscious design", "Lifecycle resilience and accountable reporting"],
    sideNote: "",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    panelTitle: "Strategic Engagement",
    title: "",
    body: [
      "PENTANEX welcomes strategic conversations with hyperscale operators, cloud platforms, enterprise AI customers, infrastructure partners, energy market participants, investors, and government or community stakeholders aligned with Australia's next compute cycle.",
      "Engagement can begin through project enquiries, capacity requirement discussions, partnership alignment, investment and infrastructure conversations, or introductory briefings on the Melbourne North campus strategy and staged delivery pathway.",
      "Site tours and project briefings can be coordinated by appointment as the development program progresses. Early conversations should focus on customer demand profile, technical requirements, timing, energy and connectivity needs, and the commercial pathway for participation.",
    ],
    points: [contactEmailDisplay, "Capacity and partnership enquiries", "Site tour requests by appointment"],
    sideNote: "",
  },
];

const footerGroups = [
  {
    heading: "Campus",
    items: ["Melbourne North", "Victoria", "Infrastructure corridor"],
  },
  {
    heading: "Capacity",
    items: ["400 MW + campus", "AI-ready compute", "Staged capacity"],
  },
  {
    heading: "Platform",
    items: ["Cloud AI workloads", "Power cooling fibre", "Sovereign capability"],
  },
  {
    heading: "Contact",
    items: ["Project enquiries", contactEmailDisplay],
  },
];

const footerIntro =
  "Developing scalable AI-ready digital infrastructure for hyperscale cloud, accelerated compute, and sovereign enterprise workloads across Australia.";

const sustainabilitySdgs = [
  { number: "7", label: "Affordable and Clean Energy", color: "#fcc30b" },
  { number: "9", label: "Industry, Innovation and Infrastructure", color: "#fd6925" },
  { number: "12", label: "Responsible Consumption and Production", color: "#bf8b2e" },
  { number: "13", label: "Climate Action", color: "#3f7e44" },
];

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

function SiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PENTANEX",
    url: siteUrl,
    logo: `${siteUrl}/pentanex-logo.png`,
    email: contactEmail,
    areaServed: "Australia",
    description:
      "PENTANEX is developing AI-ready digital infrastructure for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand in Australia.",
    makesOffer: {
      "@type": "Offer",
      name: "AI-ready hyperscale data centre campus capacity",
      areaServed: "Australia",
      category: "Digital infrastructure",
    },
    location: {
      "@type": "Place",
      name: "PENTANEX Melbourne North campus",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Melbourne North",
        addressRegion: "VIC",
        addressCountry: "AU",
      },
    },
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      type="application/ld+json"
    />
  );
}

function CapacityPlatformGraphic() {
  return (
    <div className="mt-5 rounded-sm border border-slate-200/80 bg-white/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
            Capacity platform
          </p>
          <p className="mt-1 text-xs leading-5 text-steel">
            Staged campus capacity, utility planning, and deployment zones.
          </p>
        </div>
        <span className="shrink-0 rounded-sm border border-signal/30 bg-signal/10 px-2.5 py-1 text-xs font-bold text-signal">
          400 MW +
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="grid grid-cols-[1fr_0.8fr_1fr] items-center gap-2">
          <span className="h-2 rounded-sm bg-signal/70" />
          <span className="h-px bg-slate-200" />
          <span className="h-2 rounded-sm bg-power/70" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["Capacity", "Cooling", "Power", "Fibre"].map((label) => (
            <div className="rounded-sm border border-slate-200 bg-[#f8fbfd]/90 p-2" key={label}>
              <span className="block h-5 rounded-sm border border-slate-200 bg-white/86" />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-steel">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="relative mt-1 h-12 overflow-hidden rounded-sm border border-slate-200 bg-[#f8fbfd]/90">
          <div className="absolute left-4 right-4 top-1/2 h-px bg-signal/35" />
          <div className="absolute left-[18%] top-3 h-6 w-px bg-signal/30" />
          <div className="absolute left-[48%] top-3 h-6 w-px bg-signal/30" />
          <div className="absolute left-[78%] top-3 h-6 w-px bg-signal/30" />
          <p className="absolute bottom-2 left-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-steel">
            Utility planning and staged release pathway
          </p>
        </div>
      </div>
    </div>
  );
}

function DeliveryRoadmap() {
  const milestones = [
    { year: "2027", label: "Permit", active: true },
    { year: "2028", label: "Design" },
    { year: "2029", label: "Enable" },
    { year: "2030", label: "Build" },
    { year: "2032", label: "Operate" },
  ];

  return (
    <div className="mt-5 rounded-sm border border-slate-200/80 bg-white/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
            Delivery roadmap
          </p>
          <p className="mt-1 text-xs leading-5 text-steel">
            2027-2032 staged development pathway.
          </p>
        </div>
        <span className="shrink-0 rounded-sm border border-signal/30 bg-signal/10 px-2.5 py-1 text-xs font-bold text-signal">
          Permit
        </span>
      </div>

      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-slate-200/80">
          <div className="h-2 w-[14%] rounded-full bg-signal" />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {milestones.map((milestone) => (
            <div key={milestone.year}>
              <div
                className={`mx-auto h-3 w-3 rounded-full border ${
                  milestone.active ? "border-signal bg-signal shadow-[0_0_0_5px_rgba(15,174,166,0.12)]" : "border-slate-300 bg-white"
                }`}
              />
              <p className={`mt-2 text-center text-[10px] font-bold ${milestone.active ? "text-signal" : "text-steel"}`}>
                {milestone.year}
              </p>
              <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-steel">
                {milestone.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPathwayGraphic() {
  const steps = [
    { label: "Enquiry", detail: "Project and capacity discussion" },
    { label: "Briefing", detail: "Technical and commercial alignment" },
    { label: "Site tour", detail: "By appointment as program progresses" },
  ];
  const contactModes = [
    { label: "Phone", detail: "Initial project discussion", icon: Phone },
    { label: "Meeting", detail: "Capacity and partnership briefing", icon: UsersRound },
    { label: "Site tour", detail: "Campus visit by appointment", icon: MapPin },
  ];

  return (
    <div className="rounded-sm border border-slate-200/80 bg-white/88 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
        Contact pathway
      </p>
      <div className="mt-4 grid gap-3">
        {steps.map((step, index) => (
          <div className="grid grid-cols-[36px_1fr] gap-3" key={step.label}>
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-signal/30 bg-signal/10 text-xs font-bold text-signal">
                {index + 1}
              </span>
              {index < steps.length - 1 ? <span className="h-8 w-px bg-slate-200" /> : null}
            </div>
            <div className="pb-2">
              <p className="text-sm font-semibold text-graphite">{step.label}</p>
              <p className="mt-1 text-xs leading-5 text-steel">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 border-t border-slate-200/80 pt-4 sm:grid-cols-3">
        {contactModes.map((mode) => {
          const ModeIcon = mode.icon;

          return (
            <div className="rounded-sm border border-slate-200 bg-white/92 p-3" key={mode.label}>
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-signal/25 bg-signal/10 text-signal">
                <ModeIcon size={18} />
              </div>
              <p className="mt-3 text-xs font-semibold text-graphite">{mode.label}</p>
              <p className="mt-1 text-[10px] leading-4 text-steel">{mode.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
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
    const worldProjection = geoNaturalEarth1().fitExtent([[-108, -58], [728, 418]], world);
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
    <div className="relative overflow-hidden rounded-sm border border-white/70 bg-white/58 p-3 shadow-glow backdrop-blur-2xl xl:p-4">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/82 via-white/32 to-signal/12" />

      <div className="relative">
        <svg
          aria-label="Australia map with PENTANEX campus marker in Melbourne North, Victoria"
          className="h-[clamp(210px,28vh,270px)] w-full"
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
          </defs>
          <path d="M36 180H584" stroke="url(#mapAxisX)" strokeWidth="1.4" />
          <path d="M310 38V326" stroke="url(#mapAxisY)" strokeWidth="1.2" />
          <g opacity="0.24" transform="translate(310 180) scale(1.08 1) translate(-310 -180)">
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
              stroke="#0faea6"
              strokeDasharray="4 7"
              strokeLinecap="round"
              strokeOpacity="0.72"
              strokeWidth="1.25"
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
            <text fill="#0faea6" fontSize="11.5" fontWeight="500" letterSpacing="0.7" x={sitePoint[0] + 64} y={sitePoint[1] + 10}>
              Melbourne North, VIC
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

function getRequestedTab() {
  if (typeof window === "undefined") {
    return tabs[0];
  }

  const requestedTabId =
    window.location.hash.replace("#", "") || window.localStorage.getItem("pentanex-active-tab");

  return tabs.find((tab) => tab.id === requestedTabId) ?? tabs[0];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(getRequestedTab);
  const ActiveIcon = activeTab.icon;
  const activeBodyParagraphs = Array.isArray(activeTab.body) ? activeTab.body : [activeTab.body];
  const focusLabel =
    activeTab.id === "capacity"
      ? "Capacity priorities"
      : activeTab.id === "delivery"
        ? "Delivery milestones"
        : activeTab.id === "sustainability"
          ? "Sustainability priorities"
          : "Engagement priorities";

  useLayoutEffect(() => {
    const syncRequestedTab = () => setActiveTab(getRequestedTab());

    syncRequestedTab();
    window.addEventListener("hashchange", syncRequestedTab);

    return () => window.removeEventListener("hashchange", syncRequestedTab);
  }, []);

  const selectTab = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab);
    window.localStorage.setItem("pentanex-active-tab", tab.id);
    window.history.replaceState(null, "", `#${tab.id}`);
  };

  return (
    <>
    <SiteStructuredData />
    <main className="min-h-screen overflow-x-hidden bg-[#eef4f8] text-graphite">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 93% 38%, rgba(15,174,166,0.12) 0, rgba(15,174,166,0.095) 18rem, rgba(15,174,166,0.045) 34rem, rgba(15,174,166,0) 54rem)",
        }}
        aria-hidden="true"
      >
        <div className="absolute left-[-10rem] bottom-10 h-[26rem] w-[26rem] rounded-full bg-power/[0.06] blur-3xl" />
        <div className="absolute right-[18%] bottom-[-14rem] h-[32rem] w-[32rem] rounded-full bg-signal/[0.045] blur-3xl" />
      </div>
      <a className="skip-link" href="#top">
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 rounded-sm border border-white/80 bg-white/78 px-4 py-3 shadow-[0_18px_60px_rgba(16,32,51,0.12)] backdrop-blur-2xl">
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
                aria-pressed={activeTab.id === tab.id}
                className={`rounded-sm border px-3.5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
                  activeTab.id === tab.id
                    ? "border-signal bg-signal text-white shadow-sm"
                    : "border-slate-200/70 bg-white/62 text-steel hover:border-signal/45 hover:bg-white/90 hover:text-signal"
                }`}
                key={tab.id}
                onClick={() => selectTab(tab)}
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
          className="mx-auto mt-2 flex w-full max-w-[1180px] gap-2 overflow-x-auto rounded-sm border border-white/75 bg-white/70 p-2 shadow-sm backdrop-blur-2xl lg:hidden"
        >
          {tabs.map((tab) => (
            <button
              aria-pressed={activeTab.id === tab.id}
              className={`shrink-0 rounded-sm border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
                activeTab.id === tab.id
                  ? "border-signal bg-signal text-white shadow-sm"
                  : "border-slate-200/70 bg-white/62 text-steel hover:border-signal/45 hover:text-signal"
              }`}
              key={tab.id}
              onClick={() => selectTab(tab)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <section
        id="top"
        className="relative flex items-start justify-center bg-[#eef4f8] px-3 pb-3 pt-3 sm:px-5"
      >
        <div className="pointer-events-none absolute left-[8%] top-[16%] h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[12%] right-[6%] h-80 w-80 rounded-full bg-power/12 blur-3xl" />

        {activeTab.id === "campus" ? (
          <div className="relative mx-auto grid w-full max-w-[1180px] items-stretch gap-3 bg-[#eef4f8] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:gap-4">
            <div className="grid min-h-0 gap-3 xl:gap-4">
              <AustraliaLocationMap />

              <div className="rounded-sm border border-white/70 bg-white/88 p-4 shadow-glow backdrop-blur-2xl xl:p-5">
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

            <div className="grid min-h-0 gap-3 xl:gap-4">
              <div className="rounded-sm border border-white/70 bg-white/88 p-3 shadow-glow backdrop-blur-2xl">
                <div className="grid gap-2 sm:grid-cols-4">
                  {metrics.map((metric) => (
                    <div className="rounded-sm border border-slate-200/70 bg-white/66 p-3" key={metric.label}>
                      <p className="text-[clamp(0.86rem,1.05vw,1rem)] font-semibold leading-tight text-signal">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-steel">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-white/70 bg-white/88 p-3 shadow-glow backdrop-blur-2xl xl:p-4">
                <div className="rounded-sm border border-slate-200/70 bg-white/90 p-4">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-signal/25 bg-white/62 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-signal shadow-[0_0_20px_rgba(15,174,166,0.08)]">
                    <ActiveIcon size={15} />
                    {activeTab.panelTitle}
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
          <div className="relative mx-auto w-full max-w-[1180px]">
            <div className="rounded-sm border border-white/70 bg-white/88 p-4 shadow-glow backdrop-blur-2xl xl:p-5">
              <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.22fr)_minmax(300px,0.78fr)] xl:gap-5">
                <div className="flex rounded-sm border border-slate-200/70 bg-white/86 p-5 shadow-[0_18px_44px_rgba(16,32,51,0.04)] backdrop-blur-2xl xl:p-7">
                  <div className="mx-auto w-full max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-sm border border-signal/25 bg-white/62 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-signal shadow-[0_0_20px_rgba(15,174,166,0.08)]">
                      <ActiveIcon size={15} />
                      {activeTab.panelTitle}
                    </div>
                    {activeTab.title ? (
                      <h1 className="mt-3 max-w-3xl text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-tight text-graphite">
                        {activeTab.title}
                      </h1>
                    ) : null}
                    <div className={`${activeTab.title ? "mt-4" : "mt-5"} space-y-3`}>
                      {activeBodyParagraphs.map((paragraph) => (
                        <p className="text-base leading-8 text-steel" key={paragraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="flex rounded-sm border border-slate-200/70 bg-white/84 p-5 shadow-[0_18px_44px_rgba(16,32,51,0.04)] backdrop-blur-2xl xl:p-6">
                  <div className="mx-auto w-full max-w-md">
                    {activeTab.id !== "contact" ? (
                      <>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
                          {focusLabel}
                        </p>
                        <div className="mt-5 grid gap-3">
                          {activeTab.points.map((point) => (
                            <div className="flex gap-3 rounded-sm border border-slate-200 bg-white/72 p-4 shadow-[0_12px_28px_rgba(16,32,51,0.04)]" key={point}>
                              <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={18} />
                              {point.includes("@") ? (
                                <a className="break-words text-sm font-semibold leading-5 text-graphite transition hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal" href={`mailto:${contactEmail}`}>
                                  {point}
                                </a>
                              ) : (
                                <span className="text-sm font-semibold leading-5 text-graphite">{point}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {activeTab.id === "capacity" ? <CapacityPlatformGraphic /> : null}
                    {activeTab.id === "delivery" ? <DeliveryRoadmap /> : null}
                    {activeTab.id === "sustainability" ? (
                      <div className="mt-5 border-t border-slate-200/80 pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
                          SDG alignment
                        </p>
                        <div className="mt-3 grid gap-2">
                          {sustainabilitySdgs.map((sdg) => (
                            <div
                              className="flex items-center gap-3 rounded-sm border border-slate-200 bg-white/72 p-3"
                              key={sdg.number}
                            >
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm font-bold text-white"
                                style={{ backgroundColor: sdg.color }}
                              >
                                {sdg.number}
                              </span>
                              <span className="text-sm font-semibold leading-5 text-graphite">
                                {sdg.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {activeTab.id === "contact" ? <ContactPathwayGraphic /> : null}
                    {activeTab.sideNote ? (
                      <div className="mt-5 border-t border-slate-200/80 pt-4">
                        <p className="text-sm leading-6 text-steel">
                          {activeTab.sideNote}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="relative bg-[#eef4f8] px-3 pb-5 sm:px-5">
        <div className="relative mx-auto w-full max-w-[1180px] rounded-sm border border-white/70 bg-white/82 p-4 shadow-glow backdrop-blur-2xl xl:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,2.1fr)] lg:items-start">
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

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1fr_1.35fr]">
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
                      item.includes("@") ? (
                        <a
                          className="block whitespace-nowrap text-[10.5px] leading-5 text-graphite transition hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal xl:text-[11px]"
                          href={`mailto:${contactEmail}`}
                          key={item}
                        >
                          {item}
                        </a>
                      ) : (
                        <p className="break-words text-[12px] leading-5 text-graphite xl:text-[13px]" key={item}>
                          {item}
                        </p>
                      )
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
    </>
  );
}
