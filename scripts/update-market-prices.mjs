import { mkdir, writeFile } from "node:fs/promises";
import { inflateRawSync } from "node:zlib";

const regions = [
  { code: "NSW1", node: "NSW" },
  { code: "QLD1", node: "QLD" },
  { code: "VIC1", node: "VIC" },
  { code: "SA1", node: "SA" },
  { code: "TAS1", node: "TAS" },
];

const fallbackRows = [
  {
    id: "gsh-price",
    market: "Gas",
    node: "GSH",
    metric: "Exchange traded gas price",
    value: "Source linked",
    unit: "$/GJ",
    period: "Recent trades from AEMO Gas Supply Hub",
    status: "source",
    sourceName: "AEMO GSH",
    sourceUrl: "https://www.nemweb.com.au/Reports/CURRENT/GSH/",
    note: "GSH is exchange-based; use trade-level data where current benchmark files are unavailable.",
  },
];

const nemDailyCache = new Map();

function monthCandidates() {
  const now = new Date();
  return [0, -1].map((offset) => {
    const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
    return `${candidate.getUTCFullYear()}${String(candidate.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

function monthRange(start, end) {
  const months = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));

  while (cursor <= end) {
    months.push(`${cursor.getUTCFullYear()}${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
}

function marketPeriods() {
  const now = new Date();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const previousMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const previousMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
  const currentQuarter = Math.floor(now.getUTCMonth() / 3);
  const previousQuarterStartMonth = currentQuarter === 0 ? 9 : (currentQuarter - 1) * 3;
  const previousQuarterYear = currentQuarter === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const previousQuarterStart = new Date(Date.UTC(previousQuarterYear, previousQuarterStartMonth, 1));
  const previousQuarterEnd = new Date(Date.UTC(previousQuarterYear, previousQuarterStartMonth + 3, 0));

  return [
    {
      id: "calendar-year",
      label: `${now.getUTCFullYear()} calendar year to date`,
      start: formatDateDashed(yearStart),
      end: sydneyDateKey(),
      driver:
        "Year-to-date results should be read through summer heat, shoulder-season rooftop solar, hydro conditions and the availability of coal, gas, batteries and interconnectors.",
    },
    {
      id: "previous-quarter",
      label: `Previous quarter Q${Math.floor(previousQuarterStartMonth / 3) + 1} ${previousQuarterYear}`,
      start: formatDateDashed(previousQuarterStart),
      end: formatDateDashed(previousQuarterEnd),
      driver:
        "Quarterly outcomes expose structural market patterns: renewable penetration, outage clustering, interconnector constraints, coal availability and how often gas or hydro set scarcity prices.",
    },
    {
      id: "previous-month",
      label: `Previous month ${previousMonthStart.toLocaleString("en-AU", { month: "long", timeZone: "UTC" })} ${previousMonthStart.getUTCFullYear()}`,
      start: formatDateDashed(previousMonthStart),
      end: formatDateDashed(previousMonthEnd),
      driver:
        "Monthly results are useful for near-term procurement because they show recent weather, low operational demand, renewable output, planned outages and short-duration volatility.",
    },
  ];
}

function sydneyDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .split("/")
    .reverse()
    .join("-");
}

function parseDailyAverages(csvText) {
  const rows = csvText.trim().split(/\r?\n/);
  const header = rows.shift()?.split(",").map((cell) => cell.trim().toUpperCase()) || [];
  const settlementIndex = header.indexOf("SETTLEMENTDATE");
  const rrpIndex = header.indexOf("RRP");
  const demandIndex = header.indexOf("TOTALDEMAND");
  const grouped = new Map();

  if (settlementIndex === -1 || rrpIndex === -1) return [];

  for (const row of rows) {
    const cells = row.split(",");
    const date = (cells[settlementIndex] || "").split(" ")[0]?.replaceAll("/", "-");
    const rrp = Number(cells[rrpIndex]);
    const demand = Number(cells[demandIndex]);

    if (!date || Number.isNaN(rrp)) continue;
    grouped.set(date, [
      ...(grouped.get(date) || []),
      {
        rrp,
        demand: Number.isNaN(demand) ? null : demand,
      },
    ]);
  }

  const today = sydneyDateKey();
  return Array.from(grouped.entries())
    .filter(([date, intervals]) => date < today && intervals.length >= 288)
    .map(([date, intervals]) => {
      const prices = intervals.map((item) => item.rrp);
      const demand = intervals.map((item) => item.demand).filter((item) => item !== null);
      return {
      date,
      value: prices.reduce((total, price) => total + price, 0) / prices.length,
        demand: demand.length ? demand.reduce((total, item) => total + item, 0) / demand.length : null,
      intervals: prices.length,
      };
    });
}

function splitCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells.map((item) => item.trim());
}

function parseCsvObjects(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  const headerLine = lines.find((line) => !line.startsWith("C,") && !line.startsWith("I,") && !line.startsWith("D,"));
  const dataLines = headerLine ? lines.slice(lines.indexOf(headerLine) + 1) : lines.filter((line) => line.startsWith("D,"));
  const headers = headerLine ? splitCsvLine(headerLine) : [];

  return dataLines
    .map((line) => splitCsvLine(line))
    .filter((cells) => cells.length)
    .map((cells) => {
      if (cells[0] === "D" && !headers.length) return cells;
      return Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
    });
}

function parseNemwebTable(csvText, tableName) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  const headerLine = lines.find((line) => line.startsWith(`I,GSH,${tableName},`));
  if (!headerLine) return [];

  const headers = splitCsvLine(headerLine).slice(4);
  return lines
    .filter((line) => line.startsWith(`D,GSH,${tableName},`))
    .map((line) => splitCsvLine(line).slice(4))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

const gasMonths = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function parseGasDate(value) {
  const text = String(value || "").replaceAll("/", "-").trim();
  const compact = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;

  const slash = String(value || "").match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  if (slash) return `${slash[1]}-${slash[2]}-${slash[3]}`;

  const named = String(value || "").match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (!named || !gasMonths[named[2]]) return "";
  return `${named[3]}-${gasMonths[named[2]]}-${String(named[1]).padStart(2, "0")}`;
}

function averageHistory(history) {
  if (!history.length) return null;
  return history.reduce((total, item) => total + item.value, 0) / history.length;
}

function buildPriceRow({ id, market, node, metric, sourceName, sourceUrl, note, history, periodFallback }) {
  const average = averageHistory(history);

  return {
    id,
    market,
    node,
    metric,
    value: average === null ? "Checking source" : average.toLocaleString("en-AU", { maximumFractionDigits: 2 }),
    unit: "$/GJ",
    period: history.length ? `${history[0].date} to ${history.at(-1).date}` : periodFallback,
    status: history.length ? "live" : "checking",
    sourceName,
    sourceUrl,
    note,
    history,
  };
}

async function fetchRegion(region) {
  const daily = [];
  let sourceUrl = "https://aemo.com.au/energy-systems/electricity/national-electricity-market-nem/data-nem/aggregated-data";

  for (const month of monthCandidates()) {
    const result = await fetchRegionMonth(region, month);
    if (!result) continue;
    sourceUrl = result.sourceUrl;
    daily.push(...result.daily);
  }

  const uniqueDaily = Array.from(new Map(daily.map((item) => [item.date, item])).values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  const average =
    uniqueDaily.length > 0 ? uniqueDaily.reduce((total, item) => total + item.value, 0) / uniqueDaily.length : null;

  return {
    id: `nem-${region.code.toLowerCase()}`,
    market: "NEM",
    node: region.node,
    metric: "RRP",
    value: average === null ? "Checking source" : average.toLocaleString("en-AU", { maximumFractionDigits: 2 }),
    unit: "$/MWh",
    period: uniqueDaily.length ? `${uniqueDaily[0].date} to ${uniqueDaily.at(-1).date}` : "Latest 7 complete trading days",
    status: uniqueDaily.length ? "live" : "checking",
    sourceName: "AEMO aggregated price and demand",
    sourceUrl,
    note: "Seven-day average calculated from AEMO RRP values for complete trading days.",
    history: uniqueDaily.map((item) => ({
      date: item.date,
      value: Number(item.value.toFixed(2)),
      intervals: item.intervals,
    })),
  };
}

async function fetchRegionMonth(region, month) {
  const cacheKey = `${region.code}-${month}`;
  if (nemDailyCache.has(cacheKey)) return nemDailyCache.get(cacheKey);

  const url = `https://www.aemo.com.au/aemo/data/nem/priceanddemand/PRICE_AND_DEMAND_${month}_${region.code}.csv`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      nemDailyCache.set(cacheKey, null);
      return null;
    }

    const result = { sourceUrl: url, daily: parseDailyAverages(await response.text()) };
    nemDailyCache.set(cacheKey, result);
    return result;
  } catch {
    nemDailyCache.set(cacheKey, null);
    return null;
  }
}

function parseZipFirstFile(buffer) {
  const signature = buffer.readUInt32LE(0);
  if (signature !== 0x04034b50) throw new Error("Unsupported zip format");

  const compressionMethod = buffer.readUInt16LE(8);
  const compressedSize = buffer.readUInt32LE(18);
  const fileNameLength = buffer.readUInt16LE(26);
  const extraLength = buffer.readUInt16LE(28);
  const start = 30 + fileNameLength + extraLength;
  const compressed = buffer.subarray(start, start + compressedSize);

  if (compressionMethod === 0) return compressed.toString("utf8");
  if (compressionMethod === 8) return inflateRawSync(compressed).toString("utf8");

  throw new Error(`Unsupported zip compression method ${compressionMethod}`);
}

function formatDateCompact(date) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
}

function formatDateDashed(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

async function fetchWemDaily(date) {
  const compact = formatDateCompact(date);
  const dashed = formatDateDashed(date);
  const previousUrl = `https://data.wa.aemo.com.au/public/market-data/wemde/referenceTradingPrice/previous/ReferenceTradingPrice_${compact}.zip`;
  const currentUrl = `https://data.wa.aemo.com.au/public/market-data/wemde/referenceTradingPrice/current/ReferenceTradingPrice_${dashed}.json`;

  for (const url of [previousUrl, currentUrl]) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      const text = url.endsWith(".zip")
        ? parseZipFirstFile(Buffer.from(await response.arrayBuffer()))
        : await response.text();
      const payload = JSON.parse(text);
      const prices = (payload.data?.referenceTradingPrices || [])
        .filter((item) => item.isPublished !== false)
        .map((item) => Number(item.referenceTradingPrice))
        .filter((value) => !Number.isNaN(value));

      if (!prices.length) continue;

      return {
        date: payload.data?.tradingDay || dashed,
        value: prices.reduce((total, price) => total + price, 0) / prices.length,
        intervals: prices.length,
        sourceUrl: url,
      };
    } catch {
      // Try next URL.
    }
  }

  return null;
}

async function fetchWemRow() {
  const today = new Date();
  const daily = [];

  for (let offset = 1; offset <= 14 && daily.length < 7; offset += 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset));
    const item = await fetchWemDaily(date);
    if (item) daily.push(item);
  }

  const history = daily
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      date: item.date,
      value: Number(item.value.toFixed(2)),
      intervals: item.intervals,
    }));
  const average = history.length ? history.reduce((total, item) => total + item.value, 0) / history.length : null;

  return {
    id: "wem-rtp",
    market: "WEM",
    node: "SWIS",
    metric: "Reference trading price",
    value: average === null ? "Checking source" : average.toLocaleString("en-AU", { maximumFractionDigits: 2 }),
    unit: "$/MWh",
    period: history.length ? `${history[0].date} to ${history.at(-1).date}` : "Latest 7 available trading days",
    status: history.length ? "live" : "checking",
    sourceName: "AEMO WEM reference trading price",
    sourceUrl: daily.at(-1)?.sourceUrl || "https://data.wa.aemo.com.au/public/market-data/wemde/referenceTradingPrice/current/",
    note: "Seven-day average calculated from AEMO WEM Reference Trading Price files.",
    history,
  };
}

async function fetchDwgmRow() {
  const sourceUrl = "https://www.nemweb.com.au/Reports/CURRENT/VicGas/int041_v4_market_and_reference_prices_1.csv";
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`DWGM source returned ${response.status}`);

  const rows = parseCsvObjects(await response.text());
  const history = rows
    .map((row) => ({
      date: parseGasDate(row.gas_date),
      value: Number(row.imb_wtd_ave_price_gst_ex),
      intervals: 5,
    }))
    .filter((item) => item.date && !Number.isNaN(item.value))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map((item) => ({ ...item, value: Number(item.value.toFixed(2)) }));

  return buildPriceRow({
    id: "dwgm-vic",
    market: "Gas",
    node: "DWGM Victoria",
    metric: "Imbalance weighted average price",
    sourceName: "AEMO DWGM market/reference prices",
    sourceUrl,
    note: "Seven-day average calculated from AEMO DWGM imbalance weighted average prices, GST exclusive.",
    history,
    periodFallback: "Latest 7 available gas days",
  });
}

async function fetchSttmRows() {
  const sourceUrl = "https://www.nemweb.com.au/Reports/CURRENT/STTM/int651_v1_ex_ante_market_price_rpt_1.csv";
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`STTM source returned ${response.status}`);

  const rows = parseCsvObjects(await response.text());
  const hubs = [
    { code: "SYD", node: "STTM Sydney" },
    { code: "ADL", node: "STTM Adelaide" },
    { code: "BRI", node: "STTM Brisbane" },
  ];

  return hubs.map((hub) => {
    const history = rows
      .filter((row) => row.hub_identifier === hub.code)
      .map((row) => ({
        date: parseGasDate(row.gas_date),
        value: Number(row.ex_ante_market_price),
        intervals: 1,
      }))
      .filter((item) => item.date && !Number.isNaN(item.value))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map((item) => ({ ...item, value: Number(item.value.toFixed(2)) }));

    return buildPriceRow({
      id: `sttm-${hub.code.toLowerCase()}`,
      market: "Gas",
      node: hub.node,
      metric: "Ex ante market price",
      sourceName: "AEMO STTM ex ante market price",
      sourceUrl,
      note: "Seven-day average calculated from AEMO STTM hub ex ante market prices.",
      history,
      periodFallback: "Latest 7 available gas days",
    });
  });
}

async function fetchGshRow() {
  const today = new Date();
  let sourceUrl = "https://www.nemweb.com.au/Reports/CURRENT/GSH/Benchmark_Price/";
  let text = "";

  for (let offset = 0; offset <= 7; offset += 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset));
    const compact = formatDateCompact(date);
    const url = `https://www.nemweb.com.au/Reports/CURRENT/GSH/Benchmark_Price/PUBLIC_WALLUMBILLABENCHMARKPRICE_${compact}.zip`;

    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      sourceUrl = url;
      text = parseZipFirstFile(Buffer.from(await response.arrayBuffer()));
      break;
    } catch {
      // Try the previous daily benchmark file.
    }
  }

  if (!text) throw new Error("No current GSH benchmark price file was available");

  const todayKey = sydneyDateKey();
  const history = parseNemwebTable(text, "BENCHMARK_PRICE")
    .filter((row) => row.PRODUCT_LOCATION === "WAL" && row.PRODUCT_TYPE === "Gas - NG DA Days")
    .map((row) => ({
      date: parseGasDate(row.GAS_DATE),
      value: Number(row.BENCHMARK_PRICE),
      intervals: 1,
    }))
    .filter((item) => item.date && item.date <= todayKey && !Number.isNaN(item.value))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map((item) => ({ ...item, value: Number(item.value.toFixed(2)) }));

  return buildPriceRow({
    id: "gsh-wallumbilla",
    market: "Gas",
    node: "GSH Wallumbilla",
    metric: "Benchmark price",
    sourceName: "AEMO GSH Wallumbilla benchmark price",
    sourceUrl,
    note: "Seven-day average calculated from AEMO Gas Supply Hub Wallumbilla benchmark prices.",
    history,
    periodFallback: "Latest 7 available benchmark gas days",
  });
}

function summarisePeriod(period, regionDaily) {
  const states = regions
    .map((region) => {
      const daily = (regionDaily.get(region.code) || []).filter((item) => item.date >= period.start && item.date <= period.end);
      const priceAverage = averageHistory(daily.map((item) => ({ value: item.value })));
      const demandDaily = daily.filter((item) => item.demand !== null);
      const demandAverage = demandDaily.length
        ? demandDaily.reduce((total, item) => total + item.demand, 0) / demandDaily.length
        : null;

      return {
        state: region.node,
        averageRrp: priceAverage === null ? null : Number(priceAverage.toFixed(2)),
        averageDemand: demandAverage === null ? null : Number(demandAverage.toFixed(0)),
        days: daily.length,
      };
    })
    .filter((item) => item.days > 0);

  const highestPrice = states
    .filter((item) => item.averageRrp !== null)
    .sort((a, b) => b.averageRrp - a.averageRrp)[0];
  const highestDemand = states
    .filter((item) => item.averageDemand !== null)
    .sort((a, b) => b.averageDemand - a.averageDemand)[0];
  const lowestDemand = states
    .filter((item) => item.averageDemand !== null)
    .sort((a, b) => a.averageDemand - b.averageDemand)[0];

  const keyPatterns = [
    highestPrice ? `${highestPrice.state} showed the highest average spot price in this view.` : null,
    highestDemand ? `${highestDemand.state} carried the largest average operational demand.` : null,
    lowestDemand ? `${lowestDemand.state} had the lowest average operational demand, where renewable penetration and interconnector flows can have outsized price effects.` : null,
  ].filter(Boolean);

  return {
    id: period.id,
    label: period.label,
    period: `${period.start} to ${period.end}`,
    weatherPattern: period.driver,
    states,
    keyPatterns,
  };
}

async function buildMarketContext() {
  const periods = marketPeriods();
  const firstStart = periods.map((period) => period.start).sort()[0];
  const lastEnd = periods.map((period) => period.end).sort().at(-1);
  const months = monthRange(new Date(`${firstStart}T00:00:00Z`), new Date(`${lastEnd}T00:00:00Z`));
  const regionDaily = new Map();

  await Promise.all(
    regions.map(async (region) => {
      const daily = [];
      for (const month of months) {
        const result = await fetchRegionMonth(region, month);
        if (result) daily.push(...result.daily);
      }
      regionDaily.set(region.code, Array.from(new Map(daily.map((item) => [item.date, item])).values()));
    }),
  );

  return {
    title: "Market context",
    generatedAt: new Date().toISOString(),
    periods: periods.map((period) => summarisePeriod(period, regionDaily)),
    drivers: [
      "Weather drives both demand and supply: summer heat lifts cooling load, while shoulder-season mild weather and rooftop solar can push operational demand lower.",
      "Low operational demand can increase volatility when minimum load, unit commitment and network constraints bind.",
      "High renewable penetration lowers average energy prices when the system is unconstrained, but outages, congestion and evening ramps can still lift spot prices.",
      "Key infrastructure outages, coal availability, gas peaker economics, hydro conditions, interconnector limits and battery bidding shape the realised price pattern.",
    ],
  };
}

async function withFallback(name, fallback, loader) {
  try {
    return await loader();
  } catch (error) {
    console.warn(`${name} update skipped:`, error?.message || error);
    return fallback;
  }
}

async function main() {
  const [nemRows, wemRow, dwgmRow, sttmRows, gshRow, marketContext] = await Promise.all([
    Promise.all(regions.map(fetchRegion)),
    fetchWemRow(),
    withFallback("DWGM", [], async () => [await fetchDwgmRow()]),
    withFallback("STTM", [], fetchSttmRows),
    withFallback("GSH", fallbackRows, async () => [await fetchGshRow()]),
    withFallback("Market context", null, buildMarketContext),
  ]);
  const payload = {
    generatedAt: new Date().toISOString(),
    dateBasis: "Australia/Sydney complete trading days",
    rows: [...nemRows, wemRow, ...dwgmRow, ...sttmRows, ...gshRow],
    marketContext,
  };

  await mkdir("public", { recursive: true });
  await writeFile("public/market-prices.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote public/market-prices.json with ${payload.rows.length} rows.`);
}

main().catch(async (error) => {
  console.warn("Market price update failed:", error?.message || error);
  await mkdir("public", { recursive: true });
  await writeFile(
    "public/market-prices.json",
    `${JSON.stringify({ generatedAt: new Date().toISOString(), dateBasis: "unavailable", rows: fallbackRows }, null, 2)}\n`,
    "utf8",
  );
});
