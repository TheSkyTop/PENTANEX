"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight, Clock3, Mail, PenLine, Search, Share2 } from "lucide-react";
import marketPricePayload from "../public/market-prices.json";
import { EverestSite } from "./everest-site";

type MarketPriceRow = {
  id: string;
  market: string;
  node: string;
  metric: string;
  value: string;
  unit: string;
  period: string;
  status: "live" | "source" | "checking" | "unavailable";
  sourceName: string;
  sourceUrl: string;
  note: string;
  history?: Array<{ date: string; value: number; intervals: number }>;
};

type MarketContextPeriod = {
  id: string;
  label: string;
  period: string;
  weatherPattern: string;
  states: Array<{ state: string; averageRrp: number | null; averageDemand: number | null; days: number }>;
  keyPatterns: string[];
};

type MarketContext = {
  title: string;
  generatedAt: string;
  periods: MarketContextPeriod[];
  drivers: string[];
};

type Insight = {
  id: string;
  topic: string;
  title: string;
  summary: string;
  body: string;
  readTime: string;
};

const filters = ["Market", "Policy", "Regulation", "Business", "Commercial", "Technology", "Research", "AEMO", "NEM", "Gas", "WEM", "Renewables", "AI", "Consumers"];

const initialMarketPayload = marketPricePayload as { rows?: MarketPriceRow[]; marketContext?: MarketContext | null };
const isEverestBuild = process.env.NEXT_PUBLIC_SITE_VARIANT === "everest";

const insights: Insight[] = [
  {
    id: "market",
    topic: "Market",
    title: "Australian energy market intelligence",
    summary: "Medium-term market intelligence for Australian electricity, WEM and gas readers.",
    body: "The market read connects price, demand, gas, WEM and commercial risk into one operating view.",
    readTime: "7 min",
  },
  {
    id: "policy",
    topic: "Policy",
    title: "Policy risk is moving from targets to delivery",
    summary: "The important signal is whether approvals, transmission, reliability settings and consumer protections can support actual investment.",
    body: "Energy policy is now a delivery question. Targets still matter, but market participants need to watch planning, access, community confidence and reliability frameworks.",
    readTime: "5 min",
  },
  {
    id: "commercial",
    topic: "Commercial",
    title: "PPA, GSA and GTA terms are becoming strategic risk tools",
    summary: "Commercial value sits in contract shape, basis exposure, firming rights, gas flexibility and transport capacity.",
    body: "The best procurement strategies connect electricity offtake, gas supply, transport capacity and hedge cover to the physical risk of the portfolio.",
    readTime: "6 min",
  },
];

const chartColours = ["#007f7a", "#3b82f6", "#b45309", "#7c3aed", "#be123c", "#475569"];

function formatMarketNumber(value: number | null | undefined, digits = 0) {
  return value === null || value === undefined ? "-" : value.toLocaleString("en-AU", { maximumFractionDigits: digits });
}

function formatMove(current: number | null, baseline: number | null) {
  if (current === null || baseline === null) return "-";
  const move = current - baseline;
  return `${move >= 0 ? "+" : ""}${move.toLocaleString("en-AU", { maximumFractionDigits: 1 })}`;
}

function getLiveRow(rows: MarketPriceRow[], id: string) {
  const row = rows.find((item) => item.id === id);
  return row?.status === "live" ? row : null;
}

function latestDailyValue(row: MarketPriceRow | null) {
  const latest = row?.history?.at(-1);
  return latest ? `${formatMarketNumber(latest.value, 2)} ${row?.unit}` : "-";
}

function OceanLogo({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[#007f7a] bg-white font-semibold text-[#007f7a] ${
        small ? "h-6 w-6 text-[8px]" : "h-8 w-8 text-[10px]"
      }`}
    >
      OE
    </span>
  );
}

function MarketContextBrief({ context, rows }: { context: MarketContext | null; rows: MarketPriceRow[] }) {
  if (!context?.periods?.length) return null;

  const year = context.periods.find((period) => period.id === "calendar-year");
  const quarter = context.periods.find((period) => period.id === "previous-quarter");
  const month = context.periods.find((period) => period.id === "previous-month") || context.periods.at(-1);
  const monthStates = month?.states || [];
  const highestPrice = [...monthStates].filter((state) => state.averageRrp !== null).sort((a, b) => (b.averageRrp || 0) - (a.averageRrp || 0))[0];
  const highestDemand = [...monthStates].filter((state) => state.averageDemand !== null).sort((a, b) => (b.averageDemand || 0) - (a.averageDemand || 0))[0];
  const quarterByState = new Map((quarter?.states || []).map((state) => [state.state, state]));
  const yearByState = new Map((year?.states || []).map((state) => [state.state, state]));
  const wemRow = getLiveRow(rows, "wem-rtp");
  const gasRows = ["dwgm-vic", "sttm-syd", "sttm-adl", "sttm-bri", "gsh-wallumbilla"].map((id) => getLiveRow(rows, id)).filter(Boolean) as MarketPriceRow[];
  const gasValues = gasRows.map((row) => Number(row.value)).filter((value) => !Number.isNaN(value));
  const gasRange = gasValues.length ? `${formatMarketNumber(Math.min(...gasValues), 2)}-${formatMarketNumber(Math.max(...gasValues), 2)} $/GJ` : "checking source";
  const stateSpread =
    highestPrice?.averageRrp !== null && monthStates.length
      ? (highestPrice?.averageRrp || 0) - Math.min(...monthStates.map((state) => state.averageRrp || 0).filter((value) => value > 0))
      : null;

  const gasQeds = [
    {
      row: getLiveRow(rows, "dwgm-vic"),
      read: "Shows the Victorian scheduled gas cost that can flow into gas-fired generation, industrial demand and winter adequacy risk.",
    },
    {
      row: getLiveRow(rows, "sttm-syd"),
      read: "Captures Sydney hub procurement pressure, including weather-sensitive load, pipeline delivery and retailer balancing exposure.",
    },
    {
      row: getLiveRow(rows, "sttm-adl"),
      read: "Reflects South Australian hub conditions, where local demand, supply routes and gas generation can quickly change the short-run price.",
    },
    {
      row: getLiveRow(rows, "sttm-bri"),
      read: "Links Queensland supply conditions with the short-term east-coast balance and LNG-adjacent market sentiment.",
    },
    {
      row: getLiveRow(rows, "gsh-wallumbilla"),
      read: "Provides a traded Wallumbilla reference for upstream supply, liquidity and the broader east-coast gas cost base.",
    },
  ].filter((item) => item.row);

  return (
    <section className="mt-5 border-t border-slate-100 pt-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#007f7a]">Market move</p>
        <p className="text-xs text-slate-400">medium-term market intelligence from QED-style signals</p>
      </div>
      <div className="mb-4 max-w-4xl space-y-3 text-sm leading-6 text-slate-600">
        <p>
          The useful signal in this market move is not the latest spot print. It is what the print reveals about the forward risk stack for retailers, large users, generators and investors. In Australia, electricity exposure is becoming more regional, more shape-driven and more dependent on firm capacity that can respond when weather, renewable output, outages or network limits tighten the system.
        </p>
        <p>
          The medium-term read starts with four questions. Where is basis risk building between NEM regions? Which loads are exposed to the evening ramp rather than average demand? Is the WEM developing its own adequacy and domestic-gas premium? And are east-coast gas prices setting a higher floor for peaking, firming and contract cover when the power system needs dispatchable response?
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        <SummaryCard
          label="Regional price risk"
          text={`${highestPrice?.state || "-"} is the current high-price signal at ${formatMarketNumber(highestPrice?.averageRrp, 2)} $/MWh${
            stateSpread !== null ? `, with a ${formatMarketNumber(stateSpread, 1)} $/MWh spread to the lowest state.` : "."
          } Persistent regional spreads flow into basis risk, retail margin pressure and PPA settlement value.`}
        />
        <SummaryCard
          label="Load shape"
          text={`${highestDemand?.state || "-"} carried the largest average operational demand at ${formatMarketNumber(
            highestDemand?.averageDemand,
          )} MW. The commercial issue is not only volume; it is how weather, rooftop PV and evening ramps reshape hedge and retail load exposure.`}
        />
        <SummaryCard
          label="WA adequacy"
          text={`SWIS averaged ${wemRow ? `${wemRow.value} ${wemRow.unit}` : "checking source"} over the latest week. WEM should be read separately from the NEM because reserve capacity, industrial load growth and domestic gas availability drive a different risk profile.`}
        />
        <SummaryCard
          label="Firming fuel"
          text={`East-coast gas benchmarks sit around ${gasRange}. This is a power-market signal as well as a gas-market signal because gas can set the marginal firming cost during renewable lulls, outages and evening peaks.`}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        The tables below translate near-term market outcomes into the exposures that matter over the next contracting and investment cycle: regional basis, load shape, WEM adequacy, gas-linked firming cost, PPA shape, hedge cover, GSA flexibility and GTA capacity.
      </p>

      <div className="mt-3 overflow-x-auto border border-slate-100 bg-white">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">State</th>
              <th className="px-3 py-2 font-medium">{month?.label || "Month"} RRP</th>
              <th className="px-3 py-2 font-medium">vs quarter</th>
              <th className="px-3 py-2 font-medium">Avg demand</th>
              <th className="px-3 py-2 font-medium">YTD RRP</th>
            </tr>
          </thead>
          <tbody>
            {monthStates.map((state) => {
              const quarterState = quarterByState.get(state.state);
              const yearState = yearByState.get(state.state);
              return (
                <tr className="border-t border-slate-100 text-slate-500" key={state.state}>
                  <td className="px-3 py-2 font-medium text-slate-600">{state.state}</td>
                  <td className="px-3 py-2">{formatMarketNumber(state.averageRrp, 2)} $/MWh</td>
                  <td className="px-3 py-2">{formatMove(state.averageRrp, quarterState?.averageRrp ?? null)} $/MWh</td>
                  <td className="px-3 py-2">{formatMarketNumber(state.averageDemand)} MW</td>
                  <td className="px-3 py-2">{formatMarketNumber(yearState?.averageRrp, 2)} $/MWh</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 overflow-x-auto border border-slate-100 bg-white">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Gas QED market</th>
              <th className="px-3 py-2 font-medium">7-day avg</th>
              <th className="px-3 py-2 font-medium">Latest daily</th>
              <th className="px-3 py-2 font-medium">Expert read</th>
            </tr>
          </thead>
          <tbody>
            {gasQeds.map(({ row, read }) => (
              <tr className="border-t border-slate-100 text-slate-500" key={row?.id}>
                <td className="px-3 py-2 font-medium text-slate-600">{row?.node}</td>
                <td className="px-3 py-2">
                  {row?.value} {row?.unit}
                </td>
                <td className="px-3 py-2">{latestDailyValue(row || null)}</td>
                <td className="max-w-lg px-3 py-2 leading-5">{read}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        Strategic read: {month?.weatherPattern} {context.drivers[2]} The medium-term conclusion is that electricity, gas and contract risk are converging. Regional NEM and WEM prices show where scarcity is appearing; gas prices inform the cost of flexible response; and load shape determines who is exposed during the settlement intervals that matter.
      </p>
    </section>
  );
}

function SummaryCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="border border-slate-100 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#007f7a]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function PriceChartCard({ rows, subtitle, title, unit }: { rows: MarketPriceRow[]; subtitle: string; title: string; unit: string }) {
  const series = rows.filter((row) => row.history?.length);
  const [activeSeriesId, setActiveSeriesId] = useState(series[0]?.id || "");
  const visibleSeries = series.filter((row) => row.id === activeSeriesId);
  const chartSeries = visibleSeries.length ? visibleSeries : series.slice(0, 1);
  const values = chartSeries.flatMap((row) => row.history?.map((item) => item.value) || []);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;
  const range = Math.max(1, maxValue - minValue);
  const dates = chartSeries[0]?.history?.map((item) => item.date.slice(5)) || [];

  useEffect(() => {
    if (!series.some((row) => row.id === activeSeriesId)) {
      setActiveSeriesId(series[0]?.id || "");
    }
  }, [activeSeriesId, series]);

  const pointFor = (value: number, index: number, total: number) => {
    const x = total <= 1 ? 48 : 48 + (index / (total - 1)) * 540;
    const y = 172 - ((value - minValue) / range) * 112;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  return (
    <section className="border border-slate-100 bg-white px-4 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#007f7a]">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {series.map((row, index) => (
            <button
              className={`inline-flex h-7 items-center gap-1.5 border px-2 text-xs transition ${
                row.id === activeSeriesId ? "border-[#007f7a] bg-[#007f7a] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
              key={row.id}
              onClick={() => setActiveSeriesId(row.id)}
              type="button"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.id === activeSeriesId ? "#fff" : chartColours[index % chartColours.length] }} />
              {row.market === "NEM" ? `${row.node} RRP` : row.node}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden border border-slate-100 bg-white">
        <svg aria-label={`${title} price chart`} className="h-64 w-full" preserveAspectRatio="none" role="img" viewBox="0 0 640 220">
          {[60, 116, 172].map((y) => (
            <line key={y} stroke="#e2e8f0" strokeWidth="1" x1="48" x2="588" y1={y} y2={y} />
          ))}
          <text fill="#94a3b8" fontSize="11" x="12" y="64">
            {maxValue.toLocaleString("en-AU", { maximumFractionDigits: 0 })} {unit}
          </text>
          <text fill="#94a3b8" fontSize="11" x="12" y="176">
            {minValue.toLocaleString("en-AU", { maximumFractionDigits: 0 })} {unit}
          </text>
          {dates.map((date, index) => (
            <text fill="#94a3b8" fontSize="10" key={date} textAnchor="middle" x={48 + (index / Math.max(1, dates.length - 1)) * 540} y="206">
              {date}
            </text>
          ))}
          {chartSeries.map((row) => {
            const history = row.history || [];
            const points = history.map((item, index) => pointFor(item.value, index, history.length)).join(" ");
            const colour = chartColours[Math.max(0, series.findIndex((item) => item.id === row.id)) % chartColours.length];
            return (
              <g key={row.id}>
                <polyline fill="none" points={points} stroke={colour} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                {history.map((item, index) => {
                  const [cx, cy] = pointFor(item.value, index, history.length).split(",");
                  return <circle cx={cx} cy={cy} fill="#fff" key={`${row.id}-${item.date}`} r="3" stroke={colour} strokeWidth="1.5" />;
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {chartSeries.map((row) => (
          <div className="border border-slate-100 bg-white px-3 py-2 text-xs text-slate-500" key={row.id}>
            <p className="font-medium text-slate-600">{row.market === "NEM" ? `${row.node} RRP` : row.node}</p>
            <p>
              7-day avg {row.value} {unit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketPriceSnapshot({ rows }: { rows: MarketPriceRow[] }) {
  const electricityRows = rows.filter((row) => row.market === "NEM" || row.market === "WEM");
  const gasRows = rows.filter((row) => row.market === "Gas");

  return (
    <section className="mt-6 border-t border-slate-100 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#007f7a]">Current price charts</p>
        <p className="text-xs text-slate-400">latest 7-day daily averages</p>
      </div>
      <div className="grid gap-4">
        <PriceChartCard rows={electricityRows} subtitle="NEM state RRP and WEM SWIS reference trading price" title="Electricity price chart" unit="$/MWh" />
        <PriceChartCard rows={gasRows} subtitle="DWGM, STTM hubs and GSH Wallumbilla gas price signals" title="Gas price chart" unit="$/GJ" />
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
        Source data: NEM RRP from AEMO aggregated price and demand files; WEM from AEMO WA Reference Trading Price; gas prices from AEMO/Nemweb DWGM, STTM and GSH market files.
      </p>
    </section>
  );
}

export default function Home() {
  const [isEverestPreview, setIsEverestPreview] = useState(isEverestBuild);
  const [activeFilter, setActiveFilter] = useState("Market");
  const [query, setQuery] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [marketPriceRows, setMarketPriceRows] = useState<MarketPriceRow[]>(initialMarketPayload.rows || []);
  const [marketContext, setMarketContext] = useState<MarketContext | null>(initialMarketPayload.marketContext || null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsEverestPreview(isEverestBuild || window.location.port === "3001");
  }, []);

  useEffect(() => {
    fetch("/market-prices.json")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("No local price file"))))
      .then((payload: { rows?: MarketPriceRow[]; marketContext?: MarketContext | null }) => {
        setMarketPriceRows(payload.rows || []);
        setMarketContext(payload.marketContext || null);
      })
      .catch(() => {
        setMarketPriceRows([]);
      });
  }, []);

  const visibleInsights = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (activeFilter === "Market" && !normalized) return [insights[0]];
    return insights.filter((insight) => {
      const filterMatch = activeFilter === "Market" ? insight.topic === "Market" : insight.topic === activeFilter || insight.body.toLowerCase().includes(activeFilter.toLowerCase());
      const queryMatch = !normalized || `${insight.title} ${insight.summary} ${insight.body} ${insight.topic}`.toLowerCase().includes(normalized);
      return filterMatch && queryMatch;
    });
  }, [activeFilter, query]);

  const totalPages = Math.max(1, visibleInsights.length);
  const activeInsight = visibleInsights[Math.min(page - 1, visibleInsights.length - 1)] || visibleInsights[0] || insights[0];

  const changeFilter = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const publishInsight = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPublishing(false);
    event.currentTarget.reset();
  };

  if (isEverestPreview) {
    return <EverestSite page="about" />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_24%_0%,rgba(0,127,122,0.07),transparent_30%),linear-gradient(180deg,#edf5f3_0%,#e7f0ee_48%,#f3f7f6_100%)] text-slate-600">
      <header className="px-4 pt-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-sm border border-slate-200/80 bg-white px-5 py-3 shadow-[0_18px_54px_rgba(16,35,34,0.08)]">
          <a className="flex items-center gap-3" href="#insights" aria-label="OceanEnergy home">
            <OceanLogo />
            <span>
              <span className="block text-base font-semibold text-slate-700">OceanEnergy</span>
              <span className="block text-xs text-slate-500">Australia energy insights</span>
            </span>
          </a>
          <button className="inline-flex h-10 items-center gap-2 rounded-sm bg-[#007f7a] px-4 text-sm font-semibold text-white hover:bg-[#006b67]" onClick={() => setIsPublishing(true)} type="button">
            <PenLine size={17} />
            Publish
          </button>
        </div>
      </header>

      <section id="insights" className="px-4 py-7 sm:px-6 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col gap-3 rounded-sm border border-slate-200/80 bg-white px-4 py-4 shadow-[0_18px_54px_rgba(16,35,34,0.07)] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  aria-pressed={activeFilter === filter}
                  className={`h-9 rounded-sm border px-3 text-sm font-semibold shadow-sm ${
                    activeFilter === filter ? "border-[#007f7a] bg-[#007f7a] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#007f7a]"
                  }`}
                  key={filter}
                  onClick={() => changeFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
            <label className="flex h-10 min-w-0 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 shadow-[0_10px_28px_rgba(16,35,34,0.05)] md:w-80">
              <Search className="shrink-0 text-slate-400" size={17} />
              <span className="sr-only">Search insights</span>
              <input className="w-full bg-transparent text-sm outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Search name, topic, theme" value={query} />
            </label>
          </div>

          <article className="min-h-[360px] border border-slate-200/80 bg-white p-6 shadow-[0_30px_90px_rgba(16,35,34,0.11)] md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1 border border-[#d8eeeb] bg-[#f1fbf9] px-2 py-1 font-medium text-[#007f7a]">
                  <BarChart3 size={14} />
                  {activeInsight.topic}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={14} />
                  {activeInsight.readTime}
                </span>
              </div>
              <button className="inline-flex h-9 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600" type="button">
                <Share2 size={15} />
                Share
              </button>
            </div>

            {activeInsight.topic === "Market" ? (
              <>
                <MarketContextBrief context={marketContext} rows={marketPriceRows} />
                <MarketPriceSnapshot rows={marketPriceRows} />
              </>
            ) : (
              <section className="mt-6 max-w-4xl">
                <h2 className="text-xl font-medium leading-snug text-slate-700">{activeInsight.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">{activeInsight.summary}</p>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#007f7a]">Editor's brief</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{activeInsight.body}</p>
                </div>
              </section>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing {Math.min(page, totalPages)} of {visibleInsights.length || 1} intelligence panels
              </p>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-9 items-center gap-2 rounded-sm border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 disabled:opacity-45" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button">
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="min-w-16 text-center text-sm font-semibold text-slate-600">
                  {Math.min(page, totalPages)} / {totalPages}
                </span>
                <button className="inline-flex h-9 items-center gap-2 rounded-sm border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 disabled:opacity-45" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} type="button">
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="px-4 pb-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-sm border border-slate-200/80 bg-white px-5 py-4 text-sm text-slate-500 shadow-[0_18px_54px_rgba(16,35,34,0.07)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <OceanLogo small />
            <span>OceanEnergy</span>
          </div>
          <a className="inline-flex items-center gap-2 hover:text-[#007f7a]" href="mailto:hello@oceanenergy.au">
            <Mail size={16} />
            hello@oceanenergy.au
          </a>
        </div>
      </footer>

      {isPublishing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#102322]/60 px-4 py-6 backdrop-blur-sm">
          <form className="max-h-[92vh] w-full max-w-xl overflow-auto border border-slate-200 bg-white p-5" onSubmit={publishInsight}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-800">Add an expert view</h2>
              <button className="rounded-sm border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-[#007f7a]" onClick={() => setIsPublishing(false)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              <input className="h-11 border border-slate-300 px-3 text-sm outline-none" placeholder="Title" required />
              <input className="h-11 border border-slate-300 px-3 text-sm outline-none" placeholder="Author" required />
              <textarea className="min-h-28 border border-slate-300 px-3 py-2 text-sm leading-6 outline-none" placeholder="Market insight summary" required />
            </div>
            <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="h-10 rounded-sm border border-slate-300 px-4 text-sm font-semibold hover:border-[#007f7a]" onClick={() => setIsPublishing(false)} type="button">
                Cancel
              </button>
              <button className="h-10 rounded-sm bg-[#007f7a] px-4 text-sm font-semibold text-white hover:bg-[#006b67]" type="submit">
                Publish
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
