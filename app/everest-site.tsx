"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Car,
  Check,
  ChevronRight,
  FlaskConical,
  Factory,
  Globe2,
  Hash,
  HeartPulse,
  Layers3,
  Leaf,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Phone,
  Recycle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from "lucide-react";

type Language = "en" | "zh";
type Page = "home" | "about" | "products" | "sustainability" | "contact";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;
const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theskytop.github.io";
const contactReturnUrl = `${publicSiteUrl}${basePath}/contact/`;

const navItems: Array<{ href: string; page: Page; en: string; zh: string }> = [
  { href: "/about", page: "about", en: "About us", zh: "关于我们" },
  { href: "/products", page: "products", en: "Products", zh: "产品" },
  { href: "/sustainability", page: "sustainability", en: "Sustainability", zh: "可持续发展" },
  { href: "/contact", page: "contact", en: "Contact", zh: "联系我们" },
];

const copy = {
  en: {
    eyebrow: "Engineered foam solutions",
    heroTitle: "Everest Foam",
    heroLead:
      "Backed by 35 years of world-class manufacturing experience, Everest Foam is opening a major foam production facility in Derrimut, Victoria. Production begins late 2026.",
    primaryCta: "Contact sales",
    secondaryCta: "Explore products",
    badge: "Commercial foam manufacturing",
    stat1: "A$23M",
    stat1Label: "total investment",
    stat2: "17,000 m²",
    stat2Label: "factory floor",
    stat3: "Late 2026",
    stat3Label: "production start",
    aboutEyebrow: "About us",
    aboutTitle: "Everest Foam in Australia",
    aboutLead:
      "Everest Foam is establishing a major production facility in Derrimut, Victoria, to support Australia's bedding, furniture, packaging, EPS and industrial foam markets. Backed by 35 years of manufacturing experience, the company combines foam chemistry knowledge, commercial production planning and responsive customer support. The Derrimut site is planned as a long-term manufacturing platform for local supply, product development and industry partnerships.\n\nThe Australian operation is designed to strengthen domestic supply resilience while giving customers access to more technical product conversations. From material selection and density planning to conversion formats and application performance, Everest Foam aims to support buyers with practical manufacturing knowledge, not just catalogue supply.",
    pillars: [
      {
        title: "35 years of manufacturing knowledge",
        body: "The Australian operation is backed by a mature manufacturing base, giving customers confidence in process discipline and product know-how.",
      },
      {
        title: "Derrimut production Factory",
        body: "The new Victorian facility is planned around scale, repeatability and commercial supply for bedding, furniture, EPS and industrial customers.",
      },
      {
        title: "Responsive commercial support",
        body: "Clear communication, practical lead-time planning and bilingual support for local and cross-border customers.",
      },
    ],
    productsEyebrow: "Products",
    productsTitle: "Everest Products and Solutions",
    productsLead:
      "Explore Everest Foam's core product families and brand lines across bedding systems, furniture components, EPS, industrial filtration, medical foam and automotive comfort applications. Each range is structured for clear commercial conversations, specification planning and supply enquiries.",
    productGroups: [
      {
        title: "Bedding & Sleep Systems",
        body: "Comfort, support and pressure-relief foam lines for mattresses, toppers and pillows.",
        tags: ["DreamCore™", "ViscoRest™", "Natural Latex", "PureNature™"],
        natural: ["Natural Latex", "PureNature™"],
      },
      {
        title: "Furniture & Upholstery Components",
        body: "Seat, back, arm and upholstery foam components for residential and commercial furniture.",
        tags: ["Fortis™", "Endura™"],
      },
      {
        title: "Automotive Comfort Components",
        body: "Foam components for vehicle seating, headrests, lumbar support and recreational vehicle interiors.",
        tags: ["AutoForm™", "MotionRest™"],
      },
      {
        title: "Medical & Healthcare Foam",
        body: "Specialty foam formats for healthcare, aged care and medical product development.",
        tags: ["CareForm™", "MediFoam™"],
      },
      {
        title: "Industrial Filtration & Acoustics",
        body: "Project-specific formats for filtration, acoustic treatment, display and specialty uses.",
        tags: ["AquaFiltr™", "AcousTex™"],
      },
      {
        title: "EPS Packaging & Insulation",
        body: "Lightweight polystyrene formats for packaging, insulation and protective industrial uses.",
        tags: ["Polaris™"],
      },
    ],
    rdEyebrow: "Research & Development",
    rdTitle: "Advancing foam innovation in Australia",
    rdLead:
      "Everest Foam is committed to building a genuine R&D capability in Australia - not just a factory. Our technical team brings over three decades of foam chemistry expertise, and we are in active discussions with the University of Melbourne and the University of Sydney to establish collaborative research partnerships.",
    rdFocusTitle: "Research focus",
    rdFocusAreas: [
      "Industrial water filtration foam for wastewater treatment.",
      "Next-generation eco and biodegradable foam formulations.",
      "Medical-grade foam for healthcare and aged care applications.",
    ],
    rdLab:
      "An on-site R&D laboratory will be established within our Derrimut facility, staffed by Australian chemists and materials scientists. Our goal is to develop products that solve real problems in Australian industry - and to build an IP position that goes well beyond standard foam manufacturing.",
    sustainabilityEyebrow: "Sustainability",
    sustainabilityTitle: "Commitment and Practice",
    sustainabilityLead:
      "Everest Foam is building sustainability into the operating model of the Derrimut facility: high material utilisation, no unmanaged production waste, no untreated pollutant discharge and practical recovery pathways for foam products after use.\n\nThe Australian operation will focus on closed-loop material management, cleaner production planning, customer specification support and supplier accountability. Where customer programs and local pathways allow, used foam products can be collected, sorted and reprocessed into new application formats rather than being treated as end-of-life waste.",
    sustainabilityItems: [
      "Production planning designed around high material yield and no unmanaged foam offcut waste.",
      "Pollution control focused on preventing untreated discharge and maintaining clean manufacturing practices.",
      "Customer take-back pathways for used foam products where they can be sorted, recovered and reprocessed.",
      "Continuous supplier and packaging review to reduce avoidable inputs and support responsible sourcing.",
    ],
    sustainabilityPanelEyebrow: "Sustainability practice",
    sustainabilityPanelTitle: "Closed-loop foam manufacturing with practical recycle pathways",
    sustainabilityPanelLead:
      "Everest Foam treats sustainability as an operational discipline: minimise waste at source, prevent untreated pollution streams, recover customer-used foam where practical and build future lower-impact formulations through Australian R&D capability.",
    sustainabilityPanelFocusTitle: "Practice focus",
    sustainabilityPanelFocusAreas: [
      "Zero unmanaged waste approach through cutting plans, recovery streams and material reuse.",
      "Cleaner manufacturing controls designed to avoid untreated pollutant discharge.",
      "Customer product recovery for sorting, reprocessing and conversion into new foam applications.",
    ],
    sdgTitle: "Relevant SDG goals",
    contactEyebrow: "Contact",
    contactTitle: "Start an Enquiry",
    contactLead:
      "Tell us whether your enquiry relates to product supply, factory partnerships, distribution, procurement or investment. The Everest Foam team will respond with the next practical step.",
    contactPanelEyebrow: "Company contact",
    contactPanelTitle: "Australian operations and commercial enquiries",
    contactPanelLead:
      "Everest Foam is establishing its Australian production base in Derrimut, Victoria. For product supply, project specifications, partnership discussions or procurement enquiries, please contact the commercial team directly.",
    contactPanelFocusTitle: "Contact details",
    contactPanelFocusAreas: [
      "Location: 30 Fulton Drive, Derrimut, Victoria, Australia.",
      "Sales contact: 0421650033 / sales@everestsupplies.com.au.",
      "Support: English and Chinese communication for local and cross-border customers.",
    ],
    formName: "Name",
    formCompany: "Company",
    formEmail: "Email",
    formMessage: "Project details",
    formButton: "Send enquiry",
    formSuccess: "Thanks. Your enquiry has been submitted.",
    footerLine: "Everest Foam.",
    figuresEyebrow: "Australian operations",
    figuresTitle: "Key figures",
    figuresLead: "Everest Foam operational scale",
    progressLabel: "Production timeline",
    progressNote: "Expected to commence production by the end of 2026",
    homeNote: "Major foam production facility opening in Derrimut, Victoria.",
  },
  zh: {
    eyebrow: "专业泡棉制造解决方案",
    heroTitle: "Everest Foam",
    heroLead:
      "Everest Foam 依托 35 年世界级制造经验，正在维多利亚州 Derrimut 建设大型泡棉生产基地，预计于 2026 年底投产。",
    primaryCta: "联系销售",
    secondaryCta: "浏览产品",
    badge: "商业泡棉制造",
    stat1: "A$23M",
    stat1Label: "总投资",
    stat2: "17,000 m²",
    stat2Label: "工厂面积",
    stat3: "2026 年底",
    stat3Label: "预计投产",
    aboutEyebrow: "关于我们",
    aboutTitle: "Everest Foam 澳大利亚制造基地",
    aboutLead:
      "Everest Foam 正在维多利亚州 Derrimut 建设大型泡棉生产设施，面向澳大利亚床垫、家具、包装、EPS 以及工业应用市场提供本地化制造能力。公司依托 35 年制造经验，结合泡棉化学技术、规模化生产规划和响应式客户支持，打造面向长期供应、产品开发和产业合作的澳大利亚制造平台。\n\n该基地旨在增强澳大利亚本地供应韧性，并为客户提供更具技术深度的产品沟通。从材料选择、密度设计、加工形式到应用性能，Everest Foam 以制造端的专业知识支持采购、规格制定和项目落地，而不只是提供目录式产品供应。",
    pillars: [
      {
        title: "35 年制造经验",
        body: "澳大利亚业务依托成熟制造体系，为客户提供稳定工艺、产品理解和长期供应信心。",
      },
      {
        title: "Derrimut 生产基地",
        body: "维州新基地围绕规模化制造、稳定重复性和商业化供应能力建设，服务床垫、家具、EPS 与工业客户。",
      },
      {
        title: "响应式商务支持",
        body: "提供清晰沟通、交期规划和中英文服务，支持本地及跨境客户高效推进项目。",
      },
    ],
    productsEyebrow: "产品",
    productsTitle: "Everest 产品与应用方案",
    productsLead:
      "Everest Foam 的产品体系覆盖睡眠系统、家具部件、汽车舒适部件、医疗健康泡棉、工业过滤与声学材料以及 EPS 包装保温应用。各产品系列以清晰的商业沟通、规格规划和供应咨询为核心，便于客户快速匹配应用需求。",
    productGroups: [
      {
        title: "床垫与睡眠系统",
        body: "用于床垫、床垫 topper 和枕头的舒适支撑、压力缓释泡棉产品线。",
        tags: ["DreamCore™", "ViscoRest™", "Natural Latex", "PureNature™"],
        natural: ["Natural Latex", "PureNature™"],
      },
      {
        title: "家具与软包部件",
        body: "用于民用及商用家具坐垫、靠背、扶手和软包结构的泡棉组件。",
        tags: ["Fortis™", "Endura™"],
      },
      {
        title: "汽车舒适部件",
        body: "用于汽车座椅、头枕、腰托及房车内饰系统的舒适性泡棉部件。",
        tags: ["AutoForm™", "MotionRest™"],
      },
      {
        title: "医疗与健康泡棉",
        body: "面向医疗健康、养老护理及医疗产品开发的专用泡棉材料形式。",
        tags: ["CareForm™", "MediFoam™"],
      },
      {
        title: "工业过滤与声学",
        body: "适用于过滤、声学处理、展示结构和特殊项目需求的定制泡棉材料。",
        tags: ["AquaFiltr™", "AcousTex™"],
      },
      {
        title: "EPS 包装与保温",
        body: "用于包装、保温隔热和工业防护用途的轻量化聚苯乙烯材料方案。",
        tags: ["Polaris™"],
      },
    ],
    rdEyebrow: "研发能力",
    rdTitle: "在澳大利亚建立应用型泡棉研发能力",
    rdLead:
      "Everest Foam 致力于在澳大利亚建立真正的本地研发能力，而不仅是一座生产工厂。技术团队拥有超过三十年的泡棉化学经验，并正与墨尔本大学和悉尼大学积极沟通，探索面向应用材料和产业需求的合作研究关系。",
    rdFocusTitle: "研发方向",
    rdFocusAreas: [
      "用于废水处理和工业水循环的过滤泡棉。",
      "下一代环保型及可生物降解泡棉配方。",
      "面向医疗健康和养老护理应用的医疗级泡棉。",
    ],
    rdLab:
      "Everest Foam 将在 Derrimut 工厂内建设现场研发实验室，并由澳大利亚化学家和材料科学家参与。我们的目标是开发能够解决澳大利亚产业实际问题的产品，并建立超越标准泡棉制造的知识产权能力。",
    sustainabilityEyebrow: "可持续发展",
    sustainabilityTitle: "可持续承诺与实践",
    sustainabilityLead:
      "Everest Foam 将可持续发展纳入 Derrimut 工厂的运营体系：提升材料利用率，避免未管理的生产废料，杜绝未经处理的污染排放，并为客户使用后的泡棉产品建立可执行的回收再加工路径。\n\n澳大利亚业务将聚焦闭环材料管理、清洁生产计划、客户规格支持和供应商责任管理。在客户项目和本地条件允许时，旧泡棉产品可被回收、分拣并再加工为新的应用形式，而不是直接作为废弃物处理。",
    sustainabilityItems: [
      "以高材料利用率为目标进行生产规划，避免形成未管理的泡棉边角废料。",
      "以污染预防和过程控制为重点，避免未经处理的排放并保持清洁制造实践。",
      "为客户旧泡棉产品建立回收路径，支持分拣、回收及再加工。",
      "持续评估供应商和包装方案，减少不必要投入并支持负责任采购。",
    ],
    sustainabilityPanelEyebrow: "可持续实践",
    sustainabilityPanelTitle: "闭环泡棉制造与可执行的回收路径",
    sustainabilityPanelLead:
      "Everest Foam 将可持续发展视为运营纪律：从源头减少浪费，避免未经处理的污染排放，在可行条件下回收客户使用后的泡棉产品，并通过澳大利亚研发能力推进未来低影响泡棉配方。",
    sustainabilityPanelFocusTitle: "实践重点",
    sustainabilityPanelFocusAreas: [
      "通过裁切规划、回收流程和材料再利用，推动无未管理废料目标。",
      "通过清洁制造控制，避免未经处理的污染排放。",
      "回收客户旧产品，分拣、再加工并转化为新的泡棉应用。",
    ],
    sdgTitle: "相关可持续发展目标",
    contactEyebrow: "联系我们",
    contactTitle: "提交商务咨询",
    contactLead:
      "请说明您的需求是否涉及产品供应、工厂合作、渠道分销、采购或投资沟通。Everest Foam 团队将根据项目情况回复下一步建议。",
    contactPanelEyebrow: "公司联系",
    contactPanelTitle: "澳大利亚运营基地与商务联系",
    contactPanelLead:
      "Everest Foam 正在维多利亚州 Derrimut 建立澳大利亚生产基地。如涉及产品供应、项目规格、合作洽谈或采购咨询，可直接联系商务团队。",
    contactPanelFocusTitle: "联系信息",
    contactPanelFocusAreas: [
      "地址：30 Fulton Drive, Derrimut, Victoria, Australia。",
      "销售联系：0421650033 / sales@everestsupplies.com.au。",
      "支持范围：为本地及跨境客户提供中英文沟通。",
    ],
    formName: "姓名",
    formCompany: "公司",
    formEmail: "邮箱",
    formMessage: "项目说明",
    formButton: "发送咨询",
    formSuccess: "谢谢，您的咨询已提交。",
    footerLine: "Everest Foam.",
    figuresEyebrow: "澳大利亚运营",
    figuresTitle: "运营数据",
    figuresLead: "Everest Foam 澳大利亚项目规模",
    progressLabel: "Production timeline",
    progressNote: "Expected to commence production by the end of 2026",
    homeNote: "位于维多利亚州 Derrimut 的大型泡棉生产基地。",
  },
};

const figures = [
  { value: "A$23M", en: "Total investment", zh: "总投资" },
  { value: "17,000", unit: "m²", en: "Factory floor", zh: "工厂面积" },
  { value: "10,000t", en: "Annual capacity", zh: "年产能" },
  { value: "150", en: "Jobs created", zh: "创造就业" },
  { value: "A$100M", en: "Revenue target", zh: "营收目标" },
  { value: "2026", en: "Production start", zh: "开始生产" },
];

const iconMap = [Ruler, PackageCheck, ShieldCheck];
const productIcons = [Layers3, ShieldCheck, Car, HeartPulse, Factory, PackageCheck];
const bedProductImage = {
  src: "/everest-bed-product.png",
  alt: "Everest Foam bedding and mattress product display",
  position: "center",
};
const furnitureProductImage = {
  src: "/everest-furniture-product.png",
  alt: "Everest Foam furniture and upholstery product display",
  position: "center",
};
const epsProductImage = {
  src: "/everest-eps-product.png",
  alt: "Everest Foam EPS and polystyrene product display",
  position: "center",
};
const industrialFilterProductImage = {
  src: "/everest-industrial-filter-product.png",
  alt: "Everest Foam industrial and filtration product display",
  position: "center",
};
const medicalProductImage = {
  src: "/everest-medical-product.png",
  alt: "Everest Foam medical product display",
  position: "center",
};
const automotiveProductImage = {
  src: "/everest-automotive-product.png",
  alt: "Everest Foam automotive comfort product display",
  position: "center",
};
const productImages = [bedProductImage, furnitureProductImage, automotiveProductImage, medicalProductImage, industrialFilterProductImage, epsProductImage];
const sdgItems = {
  en: [
    { goal: "SDG 6", number: "6", colour: "#26BDE2", logoTitle: "Clean Water and Sanitation", title: "Clean Water", detail: "Filtration foam R&D for wastewater treatment and industrial water reuse." },
    { goal: "SDG 12", number: "12", colour: "#BF8B2E", logoTitle: "Responsible Consumption and Production", title: "Responsible Production", detail: "Eco and biodegradable formulations, better yield and lower material waste." },
    { goal: "SDG 9", number: "9", colour: "#FD6925", logoTitle: "Industry, Innovation and Infrastructure", title: "Industry & Innovation", detail: "Australian lab capability, applied materials science and foam IP development." },
    { goal: "SDG 3", number: "3", colour: "#4C9F38", logoTitle: "Good Health and Well-Being", title: "Good Health", detail: "Medical-grade foam for healthcare, aged care and skin-contact applications." },
  ],
  zh: [
    { goal: "SDG 6", number: "6", colour: "#26BDE2", logoTitle: "Clean Water and Sanitation", title: "清洁饮水", detail: "研发用于废水处理和工业水循环的过滤泡棉。" },
    { goal: "SDG 12", number: "12", colour: "#BF8B2E", logoTitle: "Responsible Consumption and Production", title: "责任生产", detail: "环保及可降解配方，提升材料利用率并减少浪费。" },
    { goal: "SDG 9", number: "9", colour: "#FD6925", logoTitle: "Industry, Innovation and Infrastructure", title: "产业与创新", detail: "在澳建立实验室能力、材料科学应用和泡棉知识产权。" },
    { goal: "SDG 3", number: "3", colour: "#4C9F38", logoTitle: "Good Health and Well-Being", title: "健康福祉", detail: "面向医疗、养老和皮肤接触应用的医疗级泡棉。" },
  ],
};
const sdgIconMap = {
  "6": Waves,
  "12": Recycle,
  "9": Factory,
  "3": HeartPulse,
};

export function EverestSite({ page }: { page: Page }) {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];

  return (
    <main className="min-h-screen bg-[#f4f7f2] text-[#17231d]" data-language={language}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <SiteHeader activePage={page} language={language} setLanguage={setLanguage} />
      {page === "home" ? <HomePage language={language} /> : null}
      {page === "about" ? <AboutPage language={language} /> : null}
      {page === "products" ? <ProductsPage language={language} /> : null}
      {page === "sustainability" ? <SustainabilityPage language={language} /> : null}
      {page === "contact" ? <ContactPage language={language} /> : null}
      <SiteFooter language={language} footerLine={t.footerLine} />
    </main>
  );
}

function SiteHeader({
  activePage,
  language,
  setLanguage,
}: {
  activePage: Page;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#dce5d8] bg-[#fbfcf8]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link className="flex items-center gap-3" href="/" aria-label="Everest Foam home">
          <EverestMark />
          <p className="text-[17px] font-semibold tracking-[0.02em] text-[#123528]">Everest Foam</p>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#405047] lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              className={`transition hover:text-[#0d5f45] ${activePage === item.page ? "text-[#0d5f45]" : ""}`}
              href={item.href}
              key={item.href}
            >
              {item[language]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <Link className="inline-flex h-11 items-center gap-2 rounded-sm bg-[#0d5f45] px-4 text-sm font-semibold text-white transition hover:bg-[#094533]" href="/contact">
            {t.primaryCta}
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[#d2ddd0] bg-white text-[#123528] lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          type="button"
          aria-label="Open menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-[#dce5d8] bg-[#fbfcf8] px-5 py-4 lg:hidden">
          <div className="grid gap-3">
            {navItems.map((item) => (
              <Link className="py-2 text-sm font-semibold text-[#20342a]" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                {item[language]}
              </Link>
            ))}
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HomePage({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <div id="content">
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 foam-grid opacity-70" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[calc(100svh-80px)] max-w-7xl items-center gap-9 px-5 py-10 sm:gap-12 sm:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16 xl:min-h-[720px]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-[#c9d9c7] bg-white/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0d5f45]">
              <Leaf size={15} />
              {t.eyebrow}
            </div>
            <h1 className="max-w-3xl text-[clamp(3.4rem,12vw,5.25rem)] font-semibold leading-[0.98] tracking-normal text-[#10251b] lg:text-[clamp(5.6rem,7.2vw,94px)]">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#53655a] sm:text-lg">{t.heroLead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#0d5f45] px-5 text-sm font-semibold text-white transition hover:bg-[#094533]" href="/contact">
                {t.primaryCta}
                <ArrowUpRight size={18} />
              </Link>
              <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-[#c7d6c5] bg-white/80 px-5 text-sm font-semibold text-[#123528] transition hover:border-[#0d5f45]" href="/products">
                {t.secondaryCta}
                <ChevronRight size={18} />
              </Link>
            </div>
            <div className="mt-9 grid max-w-2xl gap-3 sm:mt-12 sm:grid-cols-3">
              <Metric value={t.stat1} label={t.stat1Label} />
              <Metric value={t.stat2} label={t.stat2Label} />
              <Metric value={t.stat3} label={t.stat3Label} />
            </div>
          </div>

          <HeroMaterial badge={t.badge} />
        </div>
      </section>

      <section className="border-y border-[#dce5d8] bg-[#fbfcf8]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 md:grid-cols-4 lg:px-8 lg:py-9">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5f45]">{t.figuresEyebrow}</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#5e6e64]">{t.homeNote}</p>
          </div>
          <div className="grid gap-3 md:col-span-3 md:grid-cols-3">
            <Metric value="10,000t" label={language === "en" ? "annual capacity" : "年产能"} />
            <Metric value="150" label={language === "en" ? "jobs created" : "创造就业"} />
            <Metric value="A$100M" label={language === "en" ? "revenue target" : "营收目标"} />
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutPage({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <section className="relative overflow-hidden bg-[#f4f7f2] pt-24" id="content">
      <div className="absolute inset-0 foam-grid opacity-70" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-7 pt-8 sm:pt-10 lg:px-8 lg:pt-12">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start xl:gap-10">
        <div className="flex flex-col justify-start lg:min-h-[280px]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5f45]">{t.aboutEyebrow}</p>
          <h1 className={`mt-4 max-w-2xl font-semibold leading-[1.08] tracking-normal text-[#17231d] ${language === "zh" ? "text-[26px] sm:text-[31px] lg:whitespace-nowrap xl:text-[34px]" : "text-[30px] sm:text-[38px]"}`}>
            {t.aboutTitle}
          </h1>
          <div className="mt-5 max-w-2xl space-y-3 text-[13px] leading-7 text-[#5e6e64] sm:text-sm">
            {t.aboutLead.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="grid gap-3 pt-1 sm:gap-4">
          {t.pillars.map((pillar, index) => {
            const Icon = iconMap[index];
            return (
              <article className="border border-[#dce5d8] bg-white p-4 shadow-[0_18px_60px_rgba(31,54,42,0.06)] sm:p-5 lg:min-h-[112px] xl:p-6" key={pillar.title}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#e7f0e4] text-[#0d5f45]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#17231d]">{pillar.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#5e6e64]">{pillar.body}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <KeyFigures language={language} compact />
      </div>
    </section>
  );
}

function ProductsPage({ language }: { language: Language }) {
  const t = copy[language];
  const [activeProduct, setActiveProduct] = useState(0);
  const productImage = productImages[activeProduct];

  return (
    <section className="relative overflow-hidden bg-[#f4f7f2] pt-24" id="content">
      <div className="absolute inset-0 foam-grid opacity-70" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-7 pt-8 sm:pt-10 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[0.47fr_0.53fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5f45]">{t.productsEyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-[30px] font-semibold leading-[1.08] tracking-normal text-[#10251b] sm:text-[38px]">
            {t.productsTitle}
          </h1>
        </div>
        <p className="max-w-2xl text-[13px] leading-7 text-[#5e6e64] sm:text-sm lg:pb-1">{t.productsLead}</p>
      </div>

      <div className="mt-6 grid gap-3 border border-[#dce5d8] bg-white p-3 shadow-[0_24px_70px_rgba(31,54,42,0.06)] sm:p-4 lg:grid-cols-[minmax(220px,280px)_1fr] xl:grid-cols-[300px_1fr]">
        <div className="border border-[#dce5d8] bg-[#fbfcf8] lg:min-h-[clamp(430px,48vw,560px)]">
          <div className="grid w-full grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 lg:block">
            {t.productGroups.map((item, index) => {
              const TabIcon = productIcons[index];
              const active = activeProduct === index;
              return (
                <button
                  className={`flex min-h-[68px] w-full items-center gap-3 border-b border-[#dce5d8] px-3 py-2.5 text-left transition last:border-b-0 min-[520px]:border-r md:min-h-[74px] lg:border-r-0 lg:px-4 ${
                    active ? "bg-[#0d5f45] text-white" : "bg-[#fbfcf8] text-[#24372d] hover:bg-white"
                  }`}
                  key={item.title}
                  onClick={() => setActiveProduct(index)}
                  type="button"
                >
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${active ? "bg-[#d9ecd4] text-[#0d5f45]" : "bg-[#e7f0e4] text-[#0d5f45]"}`}>
                    <TabIcon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold leading-snug sm:text-[12px]">{item.title}</span>
                    <span className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.1em] ${active ? "text-[#c9d8cf]" : "text-[#8b9d8b]"}`}>
                      0{index + 1}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <article className="flex min-h-[280px] items-center justify-center overflow-hidden bg-white sm:min-h-[360px] lg:h-[clamp(430px,48vw,560px)]">
          {productImage ? (
            <img alt={productImage.alt} className="h-full w-full object-contain" src={assetPath(productImage.src)} style={{ objectPosition: productImage.position }} />
          ) : (
            <div className="flex h-full items-end bg-white p-6">
              <div className="grid w-full grid-cols-3 gap-3">
                <FoamSample tone="light" />
                <FoamSample tone="mid" />
                <FoamSample tone="dark" />
              </div>
            </div>
          )}
        </article>
      </div>

      <section className="info-feature-panel mt-5 grid gap-5 border border-[#b7d1bc] p-5 text-white shadow-[0_24px_70px_rgba(31,54,42,0.12)] lg:grid-cols-[320px_1fr] lg:px-6 lg:py-5 xl:grid-cols-[360px_1fr]">
        <div className="info-feature-glow" aria-hidden="true" />
        <div className="info-feature-sheen" aria-hidden="true" />
        <div className="relative z-10">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#d9ecd4] text-[#0d5f45]">
            <FlaskConical size={21} />
          </span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9bcf9f]">{t.rdEyebrow}</p>
          <h2 className="mt-2 max-w-[320px] text-[22px] font-semibold leading-tight tracking-normal">{t.rdTitle}</h2>
        </div>
        <div className="relative z-10">
          <p className="text-xs leading-6 text-[#d9e5dd]">{t.rdLead}</p>
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e4b947]">{t.rdFocusTitle}</p>
            <div className="mt-2 grid gap-3 md:grid-cols-3">
              {t.rdFocusAreas.map((item) => (
                <div className="flex gap-3" key={item}>
                  <Check className="mt-1 shrink-0 text-[#9bcf9f]" size={17} />
                  <p className="text-xs leading-6 text-[#d9e5dd]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>
    </section>
  );
}

function SustainabilityPage({ language }: { language: Language }) {
  const t = copy[language];
  const sdgs = sdgItems[language];

  return (
    <div className="relative overflow-hidden bg-[#f4f7f2] text-[#17231d]" id="content">
      <div className="absolute inset-0 foam-grid opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-24 sm:pt-28 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.96fr_1.04fr] lg:items-start xl:gap-8">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5f45]">{t.sustainabilityEyebrow}</p>
            <h1 className="mt-4 max-w-2xl text-[30px] font-semibold leading-[1.08] tracking-normal text-[#17231d] sm:text-[38px]">{t.sustainabilityTitle}</h1>
            <div className="mt-5 max-w-2xl space-y-3 text-[13px] leading-7 text-[#5e6e64] sm:text-sm">
              {t.sustainabilityLead.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-7 grid gap-3">
              {t.sustainabilityItems.map((item) => (
                <div className="flex min-h-[54px] gap-3 border border-[#dce5d8] bg-white/85 px-4 py-3 shadow-[0_14px_40px_rgba(31,54,42,0.04)]" key={item}>
                  <Check className="mt-1 shrink-0 text-[#0d5f45]" size={18} />
                  <p className="text-[13px] leading-6 text-[#405047] sm:text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden border border-[#dce5d8] bg-white/80 p-4 shadow-[0_24px_70px_rgba(31,54,42,0.08)] sm:p-5 lg:mt-10 lg:min-h-[clamp(460px,44vw,520px)]">
            <div className="absolute inset-0 sustainability-lines" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-4 pt-5 sm:pt-8 lg:pt-10">
              <div className="flex justify-end">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#d9ecd4] text-[#0d5f45]">
                  <Recycle size={21} />
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0d5f45]">{t.sdgTitle}</p>
                <div className="mt-3 grid gap-2">
                  {sdgs.map((sdg) => (
                    <article className="border border-[#dce5d8] bg-[#fbfcf8] p-2 sm:p-2.5" key={sdg.goal}>
                      <div className="flex items-center gap-3">
                        <SdgLogo sdg={sdg} />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: sdg.colour }}>
                            {sdg.goal}
                          </p>
                          <h3 className="mt-1 text-xs font-semibold text-[#17231d]">{sdg.logoTitle}</h3>
                          <p className="mt-1 text-[10.5px] leading-[1.35] text-[#5e6e64] sm:text-[11px]">{sdg.detail}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 grid grid-cols-3 gap-2.5">
                  <FoamSample tone="light" compact />
                  <FoamSample tone="mid" compact />
                  <FoamSample tone="dark" compact />
                </div>
                <p className="max-w-full text-[10px] uppercase leading-5 tracking-[0.06em] text-[#0d5f45] sm:whitespace-nowrap">Closed-loop material use / clean production / product recovery</p>
              </div>
            </div>
          </div>
        </div>
        <section className="info-feature-panel mt-5 grid gap-5 border border-[#b7d1bc] p-5 text-white shadow-[0_24px_70px_rgba(31,54,42,0.12)] lg:grid-cols-[0.32fr_0.68fr] lg:p-6">
          <div className="info-feature-glow" aria-hidden="true" />
          <div className="info-feature-sheen" aria-hidden="true" />
          <div className="relative z-10">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#d9ecd4] text-[#0d5f45]">
              <Leaf size={21} />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#9bcf9f]">{t.sustainabilityPanelEyebrow}</p>
            <h2 className="mt-2 max-w-xl text-[22px] font-semibold leading-tight tracking-normal">{t.sustainabilityPanelTitle}</h2>
          </div>
          <div className="relative z-10">
            <p className="text-xs leading-6 text-[#d9e5dd]">{t.sustainabilityPanelLead}</p>
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e4b947]">{t.sustainabilityPanelFocusTitle}</p>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                {t.sustainabilityPanelFocusAreas.map((item) => (
                  <div className="flex gap-3" key={item}>
                    <Check className="mt-1 shrink-0 text-[#9bcf9f]" size={17} />
                    <p className="text-xs leading-6 text-[#d9e5dd]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactPage({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <PageShell>
      <div>
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <SectionIntro eyebrow={t.contactEyebrow} title={t.contactTitle} lead={t.contactLead} />
            <div className="mt-10 grid gap-4 text-sm text-[#53655a]">
              <ContactLine icon={Mail} text="sales@everestsupplies.com.au" />
              <ContactLine icon={Phone} text="0421650033" />
              <ContactLine icon={MapPin} text="Derrimut, Victoria" />
            </div>
          </div>

          <form action="https://formsubmit.co/sales@everestsupplies.com.au" className="border border-[#dce5d8] bg-white p-5 shadow-[0_24px_70px_rgba(31,54,42,0.08)] sm:p-8" method="POST">
            <input name="_subject" type="hidden" value="Everest Foam website enquiry" />
            <input name="_template" type="hidden" value="table" />
            <input name="_captcha" type="hidden" value="false" />
            <input name="_next" type="hidden" value={contactReturnUrl} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.formName} name="name" />
              <Field label={t.formCompany} name="company" />
            </div>
            <div className="mt-4">
              <Field label={t.formEmail} name="email" type="email" />
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-[#24372d]">
              {t.formMessage}
              <textarea className="min-h-40 resize-none border border-[#ccd9c9] bg-[#fbfcf8] px-4 py-3 text-sm font-normal leading-7 outline-none transition focus:border-[#0d5f45] focus:bg-white" name="message" required />
            </label>
            <button className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#0d5f45] px-5 text-sm font-semibold text-white transition hover:bg-[#094533] sm:w-auto" type="submit">
              {t.formButton}
              <ArrowUpRight size={18} />
            </button>
          </form>
        </div>
        <section className="info-feature-panel mt-5 grid gap-5 border border-[#b7d1bc] p-5 text-white shadow-[0_24px_70px_rgba(31,54,42,0.12)] lg:grid-cols-[0.32fr_0.68fr] lg:p-6">
          <div className="info-feature-glow" aria-hidden="true" />
          <div className="info-feature-sheen" aria-hidden="true" />
          <div className="relative z-10">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#d9ecd4] text-[#0d5f45]">
              <MapPin size={21} />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#9bcf9f]">{t.contactPanelEyebrow}</p>
            <h2 className="mt-2 max-w-xl text-[22px] font-semibold leading-tight tracking-normal">{t.contactPanelTitle}</h2>
          </div>
          <div className="relative z-10">
            <p className="text-xs leading-6 text-[#d9e5dd]">{t.contactPanelLead}</p>
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e4b947]">{t.contactPanelFocusTitle}</p>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                {t.contactPanelFocusAreas.map((item) => (
                  <div className="flex gap-3" key={item}>
                    <Check className="mt-1 shrink-0 text-[#9bcf9f]" size={17} />
                    <p className="text-xs leading-6 text-[#d9e5dd]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#f4f7f2] pt-24" id="content">
      <div className="absolute inset-0 foam-grid opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-8 sm:pt-12 lg:px-8">{children}</div>
    </section>
  );
}

function KeyFigures({ language, compact = false }: { language: Language; compact?: boolean }) {
  const t = copy[language];

  return (
    <section className={`${compact ? "mt-6" : "mt-16"} key-figures-panel relative overflow-hidden text-white`}>
      <div className="key-figures-glow" aria-hidden="true" />
      <div className="key-figures-sheen" aria-hidden="true" />
      <div className="grid gap-0 lg:grid-cols-[0.68fr_1.32fr]">
        <div className={`relative p-5 ${compact ? "lg:p-4" : "lg:p-8"}`}>
          <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#d9ecd4] text-[#0d5f45]">
            <Hash size={19} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9bcf9f]">{t.figuresEyebrow}</p>
          <h2 className={`${compact ? "mt-2 text-[26px]" : "mt-4 text-4xl"} font-semibold leading-tight tracking-normal`}>{t.figuresTitle}</h2>
          <p className={`${compact ? "mt-2 text-[11px] leading-5" : "mt-4 text-sm leading-7"} max-w-md text-[#d7e4dc]`}>{t.figuresLead}</p>
        </div>
        <div className="relative">
          <div className="grid sm:grid-cols-2">
            {figures.map((figure) => (
              <div className={compact ? "px-4 py-3" : "p-6"} key={figure.en}>
                <p className={`${compact ? "text-xl" : "text-3xl"} font-semibold text-[#e4b947]`}>
                  {figure.value}
                  {"unit" in figure ? <span className={`${compact ? "text-sm" : "text-xl"} ml-1`}>{figure.unit}</span> : null}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#cbd8d0]">{figure[language]}</p>
              </div>
            ))}
          </div>
          <div className={compact ? "px-4 py-4" : "p-6"}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#cbd8d0]">{t.progressLabel}</p>
              <p className="text-[11px] font-semibold text-[#73df9d]">{t.progressNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ footerLine }: { language: Language; footerLine: string }) {
  return (
    <footer className="border-t border-[#dce5d8] bg-[#f4f7f2]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-[#53655a] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <EverestMark small />
          <span>{footerLine}</span>
        </div>
        <p>© 2026 Everest Foam. All rights reserved.</p>
      </div>
    </footer>
  );
}

function EverestMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-sm bg-[#123528] text-white ${small ? "h-7 w-7" : "h-10 w-10"}`} aria-hidden="true">
      <span className={`${small ? "h-4 w-4" : "h-6 w-6"} mountain-mark`} />
    </span>
  );
}

function LanguageToggle({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  return (
    <div className="inline-flex rounded-sm border border-[#cbdac8] bg-white p-1">
      {(["en", "zh"] as Language[]).map((item) => (
        <button
          className={`h-8 min-w-10 rounded-sm px-3 text-xs font-semibold transition ${language === item ? "bg-[#10251b] text-white" : "text-[#53655a] hover:text-[#0d5f45]"}`}
          key={item}
          onClick={() => setLanguage(item)}
          type="button"
        >
          {item === "zh" ? "CN" : "EN"}
        </button>
      ))}
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[#d6e2d4] bg-white/80 px-4 py-4">
      <p className="text-lg font-semibold text-[#123528]">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#68766b]">{label}</p>
    </div>
  );
}

function HeroMaterial({ badge }: { badge: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] sm:max-w-xl">
      <div className="absolute left-3 top-5 z-10 max-w-[calc(100%-1.5rem)] border border-[#cddcca] bg-white px-3 py-2 shadow-[0_20px_60px_rgba(31,54,42,0.12)] sm:top-8 sm:px-4 sm:py-3 lg:-left-6 lg:top-12">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#0d5f45]">{badge}</p>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden border border-[#cbdac8] bg-[#dfe9da] shadow-[0_30px_100px_rgba(31,54,42,0.18)]">
        <div className="absolute inset-8 material-photo">
          <div className="foam-block foam-block-one" />
          <div className="foam-block foam-block-two" />
          <div className="foam-block foam-block-three" />
          <div className="foam-cut-line" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#10251b]/82 to-transparent p-4 pt-20 text-white sm:p-6 sm:pt-28">
          <p className="max-w-sm text-xs leading-6 text-[#edf4ec] sm:text-sm">Layered comfort, protective structure and custom profiles represented as a clean product system.</p>
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5f45]">{eyebrow}</p>
      <h1 className="mt-4 max-w-2xl text-[30px] font-semibold leading-[1.08] tracking-normal text-[#17231d] sm:text-[38px]">{title}</h1>
      <p className="mt-5 max-w-2xl text-[13px] leading-7 text-[#5e6e64] sm:text-sm">{lead}</p>
    </div>
  );
}

function FoamSample({ tone, compact = false }: { tone: "light" | "mid" | "dark"; compact?: boolean }) {
  return <div className={`${compact ? "h-16 sm:h-20" : "h-24 sm:h-28"} border border-white/10 foam-sample foam-sample-${tone}`} />;
}

function SdgLogo({ sdg }: { sdg: (typeof sdgItems.en)[number] }) {
  const Icon = sdgIconMap[sdg.number as keyof typeof sdgIconMap];

  return (
    <span
      aria-label={`${sdg.goal} ${sdg.logoTitle}`}
      className="relative flex h-12 w-12 shrink-0 overflow-hidden text-white shadow-[0_5px_14px_rgba(31,54,42,0.12)] sm:h-14 sm:w-14"
      style={{ backgroundColor: sdg.colour }}
    >
      <span className="absolute left-1.5 top-1 text-xl font-bold leading-none sm:left-2 sm:text-2xl">{sdg.number}</span>
      <Icon className="absolute bottom-1.5 right-1.5 h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
    </span>
  );
}

function ContactLine({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#e7f0e4] text-[#0d5f45]">
        <Icon size={18} />
      </span>
      <span className="min-w-0 break-words">{text}</span>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#24372d]">
      {label}
      <input className="h-12 border border-[#ccd9c9] bg-[#fbfcf8] px-4 text-sm font-normal outline-none transition focus:border-[#0d5f45] focus:bg-white" name={name} required type={type} />
    </label>
  );
}
