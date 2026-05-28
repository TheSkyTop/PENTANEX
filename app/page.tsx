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

const metrics = [
  { value: "560MW", label: "planned power-scale campus" },
  { value: "980", label: "Hume Freeway flagship location" },
  { value: "AI-ready", label: "planned for high-density workloads" },
  { value: "Australia", label: "focused digital infrastructure" },
];

const capabilities = [
  {
    icon: Factory,
    title: "Campus Development",
    body: "Power-scale site strategy, masterplanning, staged delivery, and customer-ready infrastructure pathways.",
  },
  {
    icon: Zap,
    title: "Energy Coordination",
    body: "Grid-aware planning for resilient capacity, future load growth, and responsible long-term operations.",
  },
  {
    icon: CircuitBoard,
    title: "AI Infrastructure Readiness",
    body: "Planning for dense compute, fibre connectivity, cooling pathways, and secure operational environments.",
  },
  {
    icon: ShieldCheck,
    title: "Trust and Resilience",
    body: "A disciplined approach to security, stakeholder assurance, continuity, and critical infrastructure governance.",
  },
];

const delivery = [
  "Power-led site feasibility",
  "Planning and approvals pathway",
  "Hyperscale campus masterplanning",
  "Customer and utility readiness",
];

const contactRoutes = [
  { label: "General enquiries", value: "enquiries@pentanex.com.au", icon: Mail },
  { label: "Customer support", value: "support@pentanex.com.au", icon: Mail },
  { label: "Phone", value: "+61 3 0000 0000", icon: Phone },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f9fc] text-graphite">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="PENTANEX home">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-signal/35 bg-signal/10 text-sm font-semibold text-signal">
              PX
            </span>
            <span className="text-base font-semibold tracking-[0.18em] text-graphite">
              PENTANEX
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-steel md:flex">
            <a className="transition hover:text-graphite" href="#campus">
              Campus
            </a>
            <a className="transition hover:text-graphite" href="#capabilities">
              Capabilities
            </a>
            <a className="transition hover:text-graphite" href="#delivery">
              Delivery
            </a>
            <a className="transition hover:text-graphite" href="#contact">
              Contact
            </a>
          </nav>
          <a
            className="inline-flex items-center gap-2 rounded-sm bg-graphite px-4 py-2 text-sm font-medium text-white transition hover:bg-signal"
            href="#contact"
          >
            Contact
            <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <section id="top" className="relative px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="site-grid absolute inset-0 opacity-90" />
        <div className="absolute inset-x-0 top-[55%] h-px overflow-hidden">
          <div className="scan-line h-px w-full" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-signal/20 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-signal shadow-sm">
              <Globe2 size={15} />
              Australian Digital Infrastructure
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] text-graphite sm:text-6xl lg:text-7xl">
              PENTANEX
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700 sm:text-2xl">
              AI-ready data centre infrastructure for Australia&apos;s next era of compute.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-steel">
              Led by the 980 Hume Freeway 560MW campus, PENTANEX develops power-scale
              infrastructure for cloud, AI, enterprise, and sovereign digital growth.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-signal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-graphite"
                href="#campus"
              >
                View Flagship Campus
                <ArrowRight size={17} />
              </a>
              <a
                className="inline-flex items-center justify-center rounded-sm border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-graphite transition hover:border-signal hover:text-signal"
                href="#contact"
              >
                Contact PENTANEX
              </a>
            </div>
          </div>

          <div className="relative rounded-sm border border-slate-200 bg-white p-5 shadow-glow">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                  Flagship project
                </p>
                <p className="mt-1 text-lg font-semibold text-graphite">980 Hume Freeway</p>
              </div>
              <span className="rounded-sm bg-power/15 px-3 py-2 text-sm font-semibold text-[#347022]">
                560MW
              </span>
            </div>

            <div className="mt-5 grid min-h-[390px] grid-cols-6 grid-rows-6 gap-3">
              <div className="col-span-4 row-span-3 rounded-sm border border-slate-200 bg-panel p-4">
                <div className="flex items-center justify-between text-xs text-steel">
                  <span>Campus module A</span>
                  <span>HV pathway</span>
                </div>
                <div className="mt-11 h-2 w-2/3 rounded-full bg-signal" />
                <div className="mt-3 h-2 w-1/2 rounded-full bg-slate-300" />
                <div className="mt-8 grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span className="h-7 rounded-sm bg-white shadow-sm" key={`hall-${index}`} />
                  ))}
                </div>
              </div>
              <div className="col-span-2 row-span-2 rounded-sm border border-signal/25 bg-signal/10 p-4">
                <Zap className="text-signal" size={24} />
                <p className="mt-8 text-2xl font-semibold text-graphite">Power</p>
              </div>
              <div className="col-span-2 row-span-4 rounded-sm border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-steel">Delivery spine</p>
                <div className="mt-7 space-y-3">
                  <div className="h-16 rounded-full border-l-4 border-signal" />
                  <div className="h-16 rounded-full border-l-4 border-power" />
                  <div className="h-16 rounded-full border-l-4 border-slate-300" />
                </div>
              </div>
              <div className="col-span-2 row-span-2 rounded-sm border border-slate-200 bg-white p-4">
                <MapPin className="text-signal" size={22} />
                <p className="mt-9 text-sm text-steel">Hume Freeway corridor</p>
              </div>
              <div className="col-span-4 row-span-3 rounded-sm border border-slate-200 bg-panel p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-steel">
                  <Building2 size={15} />
                  staged halls
                </div>
                <div className="mt-8 grid grid-cols-5 gap-2">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <span
                      className="h-8 rounded-sm border border-slate-200 bg-white"
                      key={`module-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div className="rounded-sm border border-slate-200 bg-[#fbfdff] px-5 py-5" key={metric.label}>
              <p className="text-3xl font-semibold text-graphite">{metric.value}</p>
              <p className="mt-2 text-sm text-steel">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="campus" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-signal">
              Flagship Campus
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-graphite sm:text-5xl">
              980 Hume Freeway 560MW project
            </h2>
          </div>
          <div className="grid gap-6 text-lg leading-8 text-slate-700">
            <p>
              The first PENTANEX project is planned as a power-scale campus for sovereign cloud,
              AI compute, hyperscale, and enterprise digital infrastructure in Australia.
            </p>
            <p>
              The public narrative should stay concrete: power strategy, transport access, staged
              delivery, connectivity, security, environmental pathway, and readiness for serious
              customer due diligence.
            </p>
          </div>
        </div>
      </section>

      <section id="capabilities" className="bg-white px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-signal">
              Capabilities
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-graphite sm:text-5xl">
              Infrastructure planned around power, certainty, and long-term customer value.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => (
              <article className="rounded-sm border border-slate-200 bg-[#fbfdff] p-6 shadow-sm" key={item.title}>
                <item.icon className="text-signal" size={26} />
                <h3 className="mt-7 text-xl font-semibold text-graphite">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-steel">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-signal">
              Delivery Model
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-graphite sm:text-4xl">
              A disciplined pathway from site strategy to hyperscale readiness.
            </h2>
            <p className="mt-5 leading-7 text-steel">
              The website should help stakeholders understand that PENTANEX is not only presenting
              a site, but a delivery platform for major digital infrastructure.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {delivery.map((item) => (
              <div className="flex gap-3 rounded-sm border border-slate-200 bg-white p-5 shadow-sm" key={item}>
                <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={20} />
                <span className="font-medium text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sustainability" className="border-y border-slate-200 bg-[#eef6f5] px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <Trees className="text-signal" size={30} />
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-graphite sm:text-4xl">
              Sustainability should be presented as a credible pathway, not an unsupported claim.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Energy strategy", "Water-conscious cooling", "Community interface", "Efficient operations"].map(
              (item) => (
                <div className="rounded-sm border border-signal/15 bg-white/82 p-5 font-medium text-graphite" key={item}>
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-signal">
              Contact
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-graphite sm:text-5xl">
              Speak with PENTANEX
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-steel">
              Dedicated contact details will be activated after the domain, email, and phone
              providers are confirmed.
            </p>
          </div>
          <div className="grid gap-3">
            {contactRoutes.map((route) => (
              <div
                className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-[#fbfdff] p-5 sm:flex-row sm:items-center sm:justify-between"
                key={route.label}
              >
                <div className="flex items-center gap-3 text-steel">
                  <route.icon className="text-signal" size={20} />
                  {route.label}
                </div>
                <div className="font-medium text-graphite">{route.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
