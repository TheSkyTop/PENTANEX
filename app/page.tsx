"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type CSSProperties } from "react";
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
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (isGitHubPages ? "https://theskytop.github.io/PENTANEX" : "https://www.pentanex.com.au");
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isGitHubPages ? "/PENTANEX" : "");
const assetPath = (path: string) => `${basePath}${path}`;
const absoluteAssetUrl = (path: string) => new URL(assetPath(path), siteUrl).toString();
type Language = "en" | "zh";

const languageOptions: Array<{ id: Language; label: string; shortLabel: string }> = [
  { id: "en", label: "English", shortLabel: "EN" },
  { id: "zh", label: "Chinese", shortLabel: "CH" },
];

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
      "PentaNex is planning a long-term digital infrastructure platform designed for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand.",
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
      "The PentaNex capacity strategy is centred on a masterplanned 400\u00a0MW\u00a0+ hyperscale campus platform for cloud, AI, accelerated compute, and sovereign enterprise workloads.",
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
      "PentaNex is approaching delivery through a disciplined infrastructure development pathway, aligning approvals, enabling works, utility interfaces, design governance, and stakeholder coordination into a staged execution model.",
      "The delivery strategy is intended to translate a large-scale masterplanned campus into credible staged capacity. Key workstreams include energy interface planning, connectivity pathways, secure access planning, and operational readiness.",
      "For hyperscale and enterprise customers, delivery certainty is supported through milestone control, services coordination, staged capacity release, resilience validation, and expansion optionality across future phases.",
      "Delivery control is also shaped around interface readiness: planning approvals, utility sequencing, design coordination, and site access need to move together so that each release phase can progress without avoidable execution friction.",
      "This staged pathway is intended to give customers a clearer line of sight from early engagement through to capacity release, with governance and program discipline supporting more predictable deployment outcomes.",
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
      "PentaNex treats sustainability as an infrastructure design discipline, focused on operating efficiency, resilient energy strategy, climate-aware design, and long-term environmental performance.",
      "Energy planning coordinates grid connection, renewable supply, firming arrangements, backup systems, and customer load growth as part of one scalable capacity platform.",
      "Cooling, water, operations, and accountable reporting are considered together to support a credible hyperscale infrastructure platform.",
      "For AI-ready infrastructure, sustainability performance needs to be engineered into the campus from the start through efficient plant selection, adaptable cooling pathways, climate resilience, and long-term operational stewardship.",
      "This framework is intended to support a campus platform that remains efficient, resilient, and credible as technology requirements and customer deployment profiles evolve over time.",
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
      "PentaNex welcomes strategic conversations with hyperscale operators, cloud platforms, enterprise AI customers, infrastructure partners, energy market participants, investors, and government or community stakeholders aligned with Australia's next compute cycle.",
      "Engagement can begin through project enquiries, capacity requirement discussions, partnership alignment, investment and infrastructure conversations, or introductory briefings on the Melbourne North campus strategy and staged delivery pathway.",
      "Site tours and project briefings can be coordinated by appointment as the development program progresses. Early conversations should focus on customer demand profile, technical requirements, timing, energy and connectivity needs, and the commercial pathway for participation.",
    ],
    points: [contactEmailDisplay, "Capacity and partnership enquiries", "Site tour requests by appointment"],
    sideNote: "",
  },
];

type LocalizedTabCopy = {
  label: string;
  panelTitle: string;
  title: string;
  body: string[];
  points: string[];
  sideNote: string;
};

const footerGroups = [
  {
    heading: "Campus",
    items: ["Melbourne North", "Victoria", "Infra corridor"],
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

const seoAuthoritySections = [
  {
    title: "980 Hume Freeway Data Centre Campus",
    body:
      "The 980 Hume Freeway Data Centre Campus is being positioned as a long-term data centre campus and digital infrastructure platform for Melbourne, Victoria and Australia. The project vision focuses on scalable AI computing infrastructure, high-density data centre capacity, cloud infrastructure, connectivity pathways and energy-integrated campus planning without disclosing confidential tenant, pricing or commercial negotiation details.",
  },
  {
    title: "AI Infrastructure Growth",
    body:
      "AI Data Centre Australia demand is increasingly shaped by GPU data centre requirements, accelerated computing, inference growth and enterprise AI adoption. PentaNex is planning digital infrastructure that can support high-density compute environments, future liquid cooling data centre pathways, resilient operations and scalable data centre development over multiple deployment stages.",
  },
  {
    title: "Digital Infrastructure in Australia",
    body:
      "Australia is emerging as a strategic location for hyperscale data centre and cloud infrastructure investment. Melbourne and Victoria offer a strong setting for Australian digital infrastructure because large-scale campuses require grid interface planning, fibre connectivity, operational resilience, energy strategy and long-term infrastructure governance.",
  },
  {
    title: "Future of Hyperscale Computing",
    body:
      "Hyperscale campus development is shifting from single-building delivery to integrated data centre campus planning. PentaNex approaches data centre development as a digital infrastructure platform, coordinating capacity zones, power and cooling pathways, connectivity, security, customer readiness and expansion optionality for next-generation AI computing infrastructure.",
  },
  {
    title: "Energy Integrated Data Centre Strategy",
    body:
      "Energy integrated data centre planning requires alignment between grid connection strategy, renewable and firmed energy pathways, backup systems, cooling plant options and staged customer load growth. PentaNex is focused on disciplined infrastructure planning, risk management and project governance so energy, digital services and campus capacity can mature together.",
  },
  {
    title: "Sustainable Data Centre Development",
    body:
      "Sustainable data centre development depends on practical, measurable infrastructure choices: efficient operating envelopes, water-conscious cooling, lifecycle resilience, material coordination, accountable reporting and community-aware delivery. PentaNex does not rely on unsupported certifications or customer claims and presents project information at a responsible planning level.",
  },
];

const trustSignals = [
  "Development capability across staged digital infrastructure planning",
  "Infrastructure planning expertise for power, cooling, fibre and secure operations",
  "Energy integration expertise across grid, renewable, firmed and backup pathways",
  "Project governance, risk management and long-term delivery discipline",
  "Infrastructure partnerships with utilities, customers, investors and public stakeholders",
  "Long-term development strategy for AI-ready and hyperscale data centre demand",
];

const sustainabilitySdgs = [
  { number: "7", label: "Affordable and Clean Energy", color: "#fcc30b" },
  { number: "9", label: "Industry, Innovation and Infrastructure", color: "#fd6925" },
  { number: "12", label: "Responsible Consumption and Production", color: "#bf8b2e" },
  { number: "13", label: "Climate Action", color: "#3f7e44" },
];

const australiaMapYOffset = 34;

const infrastructureNarrative = [
  "PentaNex is developing AI-ready digital infrastructure designed to support Australia's next generation of hyperscale compute demand, cloud platforms, enterprise AI workloads, and sovereign digital capability.",
  "The project is being designed for high-density AI and accelerated computing environments, supported by scalable power infrastructure, renewable and firmed energy integration, operational resilience, and long-term sustainability.",
  "Positioned to support the rapid growth of AI training, inference, and large-scale cloud deployment across Australia and the Asia-Pacific region, PentaNex aims to deliver a future-ready hyperscale platform for the next compute cycle driven by artificial intelligence and digital transformation.",
];

type PageCopy = {
  navAria: string;
  mobileNavAria: string;
  languageLabel: string;
  skip: string;
  brandSubtitle: string;
  infrastructureBadge: string;
  dataHallCapacity: string;
  footerCopyright: string;
  footerTagline: string;
  metrics: typeof metrics;
  tabs: Record<string, LocalizedTabCopy>;
  footerGroups: typeof footerGroups;
  footerIntro: string;
  infrastructureNarrative: string[];
  focusLabels: Record<string, string>;
  capacityGraphic: { title: string; description: string; blocks: string[] };
  deliveryGraphic: { title: string; description: string; status: string; milestones: string[] };
  contactGraphic: {
    title: string;
    steps: Array<{ label: string; detail: string }>;
    modes: Array<{ label: string; detail: string }>;
  };
  sdgs: typeof sustainabilitySdgs;
};

const localizedCopy: Record<Language, PageCopy> = {
  en: {
    navAria: "Primary navigation",
    mobileNavAria: "Mobile navigation",
    languageLabel: "Language",
    skip: "Skip to main content",
    brandSubtitle: "Data Centre Infrastructure",
    infrastructureBadge: "Australian Digital Infrastructure",
    dataHallCapacity: "staged data hall capacity",
    footerCopyright: "(c) 2026 PentaNex. Project information is subject to planning and delivery confirmation.",
    footerTagline: "AI-ready hyperscale infrastructure platform.",
    metrics,
    tabs: Object.fromEntries(tabs.map((tab) => [tab.id, tab])),
    footerGroups,
    footerIntro,
    infrastructureNarrative,
    focusLabels: {
      capacity: "Capacity priorities",
      delivery: "Delivery milestones",
      sustainability: "Sustainability priorities",
      contact: "Engagement priorities",
    },
    capacityGraphic: {
      title: "Capacity platform",
      description: "Staged campus capacity, utility planning, and deployment zones.",
      blocks: ["Capacity", "Cooling", "Power", "Fibre"],
    },
    deliveryGraphic: {
      title: "Delivery roadmap",
      description: "2027-2032 staged development pathway.",
      status: "Permit",
      milestones: ["Permit", "Design", "Enable", "Build", "Operate"],
    },
    contactGraphic: {
      title: "Contact pathway",
      steps: [
        { label: "Enquiry", detail: "Project and capacity discussion" },
        { label: "Briefing", detail: "Technical and commercial alignment" },
        { label: "Site tour", detail: "By appointment as program progresses" },
      ],
      modes: [
        { label: "Phone", detail: "Initial project discussion" },
        { label: "Meeting", detail: "Capacity and partnership briefing" },
        { label: "Site tour", detail: "Campus visit by appointment" },
      ],
    },
    sdgs: sustainabilitySdgs,
  },
  zh: {
    navAria: "主导航",
    mobileNavAria: "移动端导航",
    languageLabel: "语言",
    skip: "跳转到主要内容",
    brandSubtitle: "数据中心基础设施",
    infrastructureBadge: "澳大利亚数字基础设施",
    dataHallCapacity: "分阶段数据大厅容量",
    footerCopyright: "(c) 2026 PentaNex。项目信息以规划、审批和交付确认为准。",
    footerTagline: "面向 AI 的超大规模数字基础设施平台。",
    metrics: [
      { value: project.capacity, label: "总体规划超大规模园区容量" },
      { value: "Melbourne", label: "墨尔本北部战略区位，VIC Australia" },
      { value: "AI-ready", label: "高密度计算基础设施" },
      { value: "Hyperscale", label: "可扩展云与 AI 计算容量" },
    ],
    tabs: {
      campus: {
        label: "园区",
        panelTitle: "园区发展策略",
        title: "",
        body: [
          "PentaNex 正在规划长期数字基础设施平台，服务超大规模云、加速计算、企业 AI 以及澳大利亚主权工作负载需求。",
          "园区策略围绕可扩展容量分区、韧性公用工程规划、安全运营、连接通道和分阶段交付能力展开。",
          "项目目标是为高密度计算环境、客户长期增长，以及澳大利亚和亚太地区下一轮数字基础设施需求提供可扩展基础。",
        ],
        points: ["400 MW + 总体规划园区容量", "可扩展容量分区", "墨尔本北部基础设施走廊"],
        sideNote: "园区规划聚焦可扩展容量分区、韧性运营和长期扩展能力。",
      },
      capacity: {
        label: "容量",
        panelTitle: "容量策略",
        title: "",
        body: [
          "PentaNex 的容量策略围绕 400\u00a0MW\u00a0+ 总体规划超大规模园区平台展开，面向云平台、AI 训练与推理、加速计算和主权企业工作负载。",
          "容量规划采用分阶段基础设施平台模式，而非单体建筑模式，通过容量分区、公用工程走廊、冷却路径、光纤多样性和客户就绪部署区随需求扩展。",
          "面向超大规模和 AI 客户，容量架构重点关注安全运营、高密度计算就绪、能源与冷却可选性，以及跨阶段的可预测容量释放路径。",
        ],
        points: ["400 MW + 总体规划园区容量", "高密度 AI 与加速计算", "可扩展分阶段部署"],
        sideNote: "",
      },
      delivery: {
        label: "交付",
        panelTitle: "交付路径",
        title: "",
        body: [
          "PentaNex 以严谨的基础设施开发路径推进交付，将规划审批、前期工程、公用工程接口、设计治理和利益相关方协调纳入分阶段执行体系。",
          "交付策略旨在把大规模总体规划园区转化为可信、可建设、可运营的客户就绪容量，关键工作包括能源接口、连接路径、冷却系统、安全通行和运营准备。",
          "面向超大规模和企业客户，交付确定性来自清晰的里程碑治理、服务接口协调、分阶段容量释放、韧性验证以及后续扩展可选性。",
          "交付控制同样围绕接口就绪度展开：规划审批、公用工程时序、设计协同和现场通行需要同步推进，才能让每一个释放阶段减少不必要的执行摩擦。",
          "这种分阶段路径旨在让客户从前期沟通到容量释放拥有更清晰的时间预期，并通过治理机制和项目纪律支撑更可预测的部署结果。",
        ],
        points: ["规划审批与前期工程", "电网、能源、光纤和冷却接口", "客户就绪里程碑治理"],
        sideNote: "",
      },
      sustainability: {
        label: "可持续",
        panelTitle: "韧性与可持续基础设施",
        title: "",
        body: [
          "PentaNex 将可持续性纳入基础设施设计原则，聚焦运营效率、能源韧性、气候适应型设计和长期环境表现。",
          "能源规划协同电网接入、可再生能源、保障性能源安排、备用系统和客户负载增长，服务同一长期容量平台。",
          "冷却、水策略、运营管理和透明报告共同支撑可信的超大规模数字基础设施平台。",
          "对于面向 AI 的基础设施，可持续表现需要从园区初始设计阶段纳入工程体系，包括高效设备选型、可适应的冷却路径、气候韧性以及长期运营管理。",
          "这一框架旨在支撑一个能够随技术要求和客户部署需求持续演进、同时保持效率、韧性与可信度的园区平台。",
        ],
        points: ["可再生能源与保障性能源整合", "高效冷却和节水型设计", "生命周期韧性与可审计报告"],
        sideNote: "",
      },
      contact: {
        label: "联系",
        panelTitle: "战略沟通",
        title: "",
        body: [
          "PentaNex 欢迎与超大规模运营商、云平台、企业 AI 客户、基础设施伙伴、能源市场参与者、投资者，以及政府和社区相关方开展战略沟通。",
          "沟通可从项目咨询、容量需求讨论、合作匹配、投资及基础设施对话，或墨尔本北部园区策略与分阶段交付路径介绍开始。",
          "随着开发计划推进，PentaNex 可按预约协调项目简报和现场参访。早期沟通建议聚焦客户容量画像、技术要求、时间窗口、能源与连接需求，以及商业参与路径。",
        ],
        points: [contactEmailDisplay, "容量与合作咨询", "预约现场参访"],
        sideNote: "",
      },
    },
    footerGroups: [
      { heading: "园区", items: ["墨尔本北部", "Victoria", "基础设施走廊"] },
      { heading: "容量", items: ["400 MW + 园区", "AI-ready 计算", "分阶段容量"] },
      { heading: "平台", items: ["云与 AI 负载", "电力 冷却 光纤", "主权能力"] },
      { heading: "联系", items: ["项目咨询", contactEmailDisplay] },
    ],
    footerIntro:
      "为澳大利亚超大规模云、加速计算和主权企业工作负载开发可扩展的 AI-ready 数字基础设施。",
    infrastructureNarrative: [
      "PentaNex 正在开发 AI-ready 数字基础设施，支持澳大利亚下一代超大规模计算需求、云平台、企业 AI 工作负载和主权数字能力。",
      "项目面向高密度 AI 与加速计算环境进行设计，并结合可扩展电力基础设施、可再生能源与保障性能源整合、运营韧性和长期可持续性。",
      "PentaNex 旨在支持澳大利亚和亚太地区 AI 训练、推理及大规模云部署的快速增长，打造面向人工智能和数字化转型下一轮计算周期的未来型超大规模平台。",
    ],
    focusLabels: {
      capacity: "容量重点",
      delivery: "交付重点",
      sustainability: "可持续重点",
      contact: "沟通路径",
    },
    capacityGraphic: {
      title: "容量平台",
      description: "分阶段园区容量、公用工程规划和部署区域。",
      blocks: ["容量", "冷却", "电力", "光纤"],
    },
    deliveryGraphic: {
      title: "交付路线图",
      description: "2027-2032 分阶段开发路径。",
      status: "审批",
      milestones: ["审批", "设计", "前期工程", "建设", "运营"],
    },
    contactGraphic: {
      title: "联系路径",
      steps: [
        { label: "咨询", detail: "项目与容量需求沟通" },
        { label: "简报", detail: "技术与商业条件对齐" },
        { label: "现场参访", detail: "随项目推进按预约安排" },
      ],
      modes: [
        { label: "电话", detail: "初步项目沟通" },
        { label: "会议", detail: "容量与合作简报" },
        { label: "参访", detail: "按预约了解园区" },
      ],
    },
    sdgs: [
      { number: "7", label: "经济适用的清洁能源", color: "#fcc30b" },
      { number: "9", label: "产业、创新和基础设施", color: "#fd6925" },
      { number: "12", label: "负责任消费与生产", color: "#bf8b2e" },
      { number: "13", label: "气候行动", color: "#3f7e44" },
    ],
  },

};

function PentanexLogo() {
  return (
    <span className="logo-lockup">
      <img
        alt="PentaNex"
        className="logo-mark"
        decoding="async"
        fetchPriority="high"
        src={assetPath("/pentanex-mark.png")}
      />
      <span className="logo-wordmark">PentaNex</span>
    </span>
  );
}

function SiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "Corporation"],
        "@id": `${siteUrl}/#organization`,
        name: "PentaNex",
        url: siteUrl,
        logo: absoluteAssetUrl("/pentanex-logo-full.png"),
        email: contactEmail,
        areaServed: {
          "@type": "Country",
          name: "Australia",
        },
        industry: [
          "Digital Infrastructure Development",
          "Data Centre Development",
          "Infrastructure Development",
          "AI Infrastructure",
          "Cloud Infrastructure",
        ],
        description:
          "PentaNex develops large-scale AI-ready data centre campuses and digital infrastructure projects across Australia, supporting hyperscale cloud, GPU computing and next-generation digital services.",
        knowsAbout: [
          "AI Data Centre Australia",
          "Data Centre Developer Australia",
          "Hyperscale Data Centre",
          "GPU Data Centre",
          "Energy Integrated Data Centre",
          "High Density Data Centre",
          "Liquid Cooling Data Centre",
          "Australian Digital Infrastructure",
        ],
      },
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${siteUrl}/#professional-service`,
        name: "PentaNex Digital Infrastructure Development",
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: "Australia",
        serviceType: [
          "Data Centre Campus Development",
          "AI Infrastructure Planning",
          "Digital Infrastructure Platform Development",
          "Energy Integrated Data Centre Planning",
        ],
      },
      {
        "@type": "Project",
        "@id": `${siteUrl}/#project-980-hume-freeway`,
        name: "980 Hume Freeway Data Centre Campus",
        alternateName: "PentaNex Melbourne North Data Centre Campus",
        description:
          "A planned Melbourne North data centre campus and digital infrastructure platform for hyperscale cloud, GPU computing, AI infrastructure and sovereign enterprise workloads.",
        location: {
          "@type": "Place",
          name: "Melbourne North, Victoria, Australia",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Melbourne North",
            addressRegion: "VIC",
            addressCountry: "AU",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: project.coordinates[1],
            longitude: project.coordinates[0],
          },
        },
        parentOrganization: { "@id": `${siteUrl}/#organization` },
        keywords:
          "980 Hume Freeway Data Centre Campus, Melbourne Data Centre, Victoria Data Centre, Hyperscale Data Centre, AI Computing Infrastructure",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "PentaNex",
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-AU",
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        name: "PentaNex | AI Data Centre & Digital Infrastructure Developer Australia",
        url: siteUrl,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: [
          { "@id": `${siteUrl}/#organization` },
          { "@id": `${siteUrl}/#project-980-hume-freeway` },
        ],
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteAssetUrl("/hyperscale-data-centre-melbourne.jpg"),
          caption: "Hyperscale data centre server hall background representing PentaNex digital infrastructure.",
        },
      },
    ],
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      type="application/ld+json"
    />
  );
}

function SeoAuthorityContent() {
  return (
    <section className="relative z-10 px-3 pb-3 sm:px-5" aria-labelledby="seo-authority-heading">
      <div className="premium-card mx-auto w-full max-w-[1180px] rounded-xl border p-5 backdrop-blur-2xl xl:p-6">
        <div className="section-kicker inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
          <CircuitBoard size={15} />
          Digital Infrastructure Platform
        </div>
        <h2 id="seo-authority-heading" className="mt-4 max-w-3xl text-[clamp(1.35rem,2vw,1.9rem)] font-semibold leading-tight text-graphite">
          AI Data Centre & Digital Infrastructure Development
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-steel">
          PentaNex is an Australian AI data centre and digital infrastructure developer focused on large-scale data centre campuses, energy-integrated AI computing facilities, hyperscale cloud infrastructure and next-generation digital services.
        </p>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {seoAuthoritySections.map((section) => (
            <article className="premium-card-soft rounded-md border p-4" key={section.title}>
              <h3 className="text-sm font-semibold leading-5 text-signal">{section.title}</h3>
              <p className="mt-3 text-xs leading-6 text-steel">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
            Trust and Delivery Signals
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {trustSignals.map((signal) => (
              <div className="flex gap-2 rounded-sm border border-slate-200 bg-white p-3" key={signal}>
                <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={16} />
                <span className="text-xs leading-5 text-steel">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapacityPlatformGraphic({
  copy,
}: {
  copy: (typeof localizedCopy)[Language]["capacityGraphic"];
}) {
  return (
    <div className="mt-5 rounded-md border border-slate-200/80 bg-white p-4 shadow-[0_14px_34px_rgba(15,39,69,0.07)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
            {copy.title}
          </p>
          <p className="mt-1 text-xs leading-5 text-steel">
            {copy.description}
          </p>
        </div>
        <span className="shrink-0 rounded-sm border border-signal/30 bg-signal/12 px-2.5 py-1 text-xs font-bold text-signal">
          400 MW +
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="grid grid-cols-[1fr_0.8fr_1fr] items-center gap-2">
          <span className="h-2 rounded-sm bg-signal/70" />
          <span className="h-px bg-slate-200" />
          <span className="h-2 rounded-sm bg-power/70" />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {copy.blocks.map((label) => (
            <div className="premium-lift rounded-md border border-slate-200 bg-white p-2" key={label}>
              <span className="block h-5 rounded-sm border border-slate-200 bg-white" />
              <p
                className="capacity-block-label mt-2 px-0.5 font-semibold uppercase text-steel"
                style={{ whiteSpace: "nowrap", overflowWrap: "normal", wordBreak: "keep-all" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryRoadmap({
  copy,
}: {
  copy: (typeof localizedCopy)[Language]["deliveryGraphic"];
}) {
  const milestones = ["2027", "2028", "2029", "2030", "2032"].map((year, index) => ({
    year,
    label: copy.milestones[index],
    active: index === 0,
  }));

  return (
    <div className="mt-5 rounded-md border border-slate-200/80 bg-white p-4 shadow-[0_14px_34px_rgba(15,39,69,0.07)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
            {copy.title}
          </p>
          <p className="mt-1 text-xs leading-5 text-steel">
            {copy.description}
          </p>
        </div>
        <span className="shrink-0 rounded-sm border border-signal/30 bg-signal/12 px-2.5 py-1 text-xs font-bold text-signal">
          {copy.status}
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
                  milestone.active ? "border-signal bg-signal shadow-[0_0_0_5px_rgba(15,114,179,0.14)]" : "border-slate-300 bg-white"
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

function ContactPathwayGraphic({
  copy,
}: {
  copy: (typeof localizedCopy)[Language]["contactGraphic"];
}) {
  const contactModes = [
    { ...copy.modes[0], icon: Phone },
    { ...copy.modes[1], icon: UsersRound },
    { ...copy.modes[2], icon: MapPin },
  ];

  return (
    <div className="rounded-md border border-slate-200/80 bg-white p-4 shadow-[0_14px_34px_rgba(15,39,69,0.07)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
        {copy.title}
      </p>
      <div className="mt-4 grid gap-3">
        {copy.steps.map((step, index) => (
          <div className="grid grid-cols-[36px_1fr] gap-3" key={step.label}>
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-signal/30 bg-signal/12 text-xs font-bold text-signal">
                {index + 1}
              </span>
              {index < copy.steps.length - 1 ? <span className="h-8 w-px bg-slate-200" /> : null}
            </div>
            <div className="pb-2">
              <p className="content-copy-sm">{step.label}</p>
              <p className="content-copy-xs mt-1">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 border-t border-slate-200/80 pt-4 sm:grid-cols-3">
        {contactModes.map((mode) => {
          const ModeIcon = mode.icon;

          return (
            <div className="premium-lift rounded-md border border-slate-200 bg-white p-3" key={mode.label}>
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-signal/25 bg-signal/12 text-signal">
                <ModeIcon size={18} />
              </div>
              <p className="content-copy-xs mt-3">{mode.label}</p>
              <p className="content-copy-xs mt-1 text-[10px]">{mode.detail}</p>
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
    const worldProjection = geoNaturalEarth1().fitExtent([[-42, -18], [662, 378]], world);
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
    <div className="map-showcase relative overflow-hidden rounded-xl border border-slate-200/80 p-3 shadow-glow backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/82 via-white/48 to-signal/10" />

      <div className="relative">
        <svg
          aria-label="Australia map with PentaNex campus marker in Melbourne North, Victoria"
          className="h-[clamp(180px,24vh,225px)] w-full"
          role="img"
          viewBox="0 0 620 360"
        >
          <defs>
            <linearGradient id="mapFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dceff8" />
            </linearGradient>
            <linearGradient id="locationTag" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e8f6fc" />
            </linearGradient>
            <linearGradient id="mapAxisX" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#0f72b3" stopOpacity="0" />
              <stop offset="50%" stopColor="#127cdb" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#0f72b3" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mapAxisY" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0f72b3" stopOpacity="0" />
              <stop offset="50%" stopColor="#127cdb" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#0f72b3" stopOpacity="0" />
            </linearGradient>
            <filter id="softGlass" height="180%" width="180%" x="-40%" y="-40%">
              <feDropShadow dx="0" dy="7" floodColor="#0f72b3" floodOpacity="0.12" stdDeviation="8" />
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
          <g opacity="0.24">
            {worldPaths.map((countryPath, index) => (
              <path
                d={countryPath}
                fill="#c9e5f3"
                key={`world-${index}`}
                stroke="#8ac4df"
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
            <path d={australiaPath} fill="url(#mapFill)" stroke="#5eaed4" strokeWidth="1.8" />
            <path
              d={`M${sitePoint[0] + 44} ${sitePoint[1] + 8} C${sitePoint[0] + 30} ${sitePoint[1] + 5} ${sitePoint[0] + 23} ${sitePoint[1] + 4} ${sitePoint[0] + 13} ${sitePoint[1] + 1}`}
              fill="none"
              stroke="#127cdb"
              strokeDasharray="4 7"
              strokeLinecap="round"
              strokeOpacity="0.72"
              strokeWidth="1.25"
            />
            <circle className="location-pulse" cx={sitePoint[0]} cy={sitePoint[1]} fill="none" r="15" stroke="#2d9abc" strokeDasharray="3 6" strokeOpacity="0.58" strokeWidth="1.6" />
            <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="#127cdb" r="4.5" />
            <circle cx={sitePoint[0]} cy={sitePoint[1]} fill="none" r="9" stroke="#127cdb" strokeOpacity="0.5" strokeWidth="3" />
            <g className="map-location-label">
              <rect
                fill="url(#locationTag)"
                filter="url(#softGlass)"
                height="38"
                rx="4"
                stroke="#87cdea"
                strokeOpacity="0.9"
                width="196"
                x={sitePoint[0] + 40}
                y={sitePoint[1] - 14}
              />
              <text fill="#127cdb" fontSize="14.2" fontWeight="500" letterSpacing="0.35" x={sitePoint[0] + 52} y={sitePoint[1] + 10}>
                Melbourne North, VIC
              </text>
            </g>
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

function getRequestedLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = window.localStorage.getItem("pentanex-language");

  return savedLanguage === "zh" ? "zh" : "en";
}

const ambientAccents: Record<string, { left: string; right: string; inner: string }> = {
  campus: {
    left: "absolute left-[-9rem] bottom-12 h-[22rem] w-[22rem] rounded-full bg-[#0b6f9f]/[0.032] blur-[86px]",
    right: "absolute right-[-8rem] bottom-[3rem] h-[30rem] w-[30rem] rounded-full bg-[#0b6f9f]/[0.034] blur-[96px]",
    inner: "absolute right-[8rem] bottom-[10rem] h-[14rem] w-[14rem] rounded-full bg-[#0b6f9f]/[0.015] blur-[62px]",
  },
  capacity: {
    left: "absolute left-[-11rem] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-[#0b6f9f]/[0.03] blur-[88px]",
    right: "absolute right-[-9rem] bottom-[5rem] h-[30rem] w-[30rem] rounded-full bg-[#0b6f9f]/[0.034] blur-[98px]",
    inner: "absolute right-[6rem] bottom-[15rem] h-[14rem] w-[14rem] rounded-full bg-[#0b6f9f]/[0.014] blur-[60px]",
  },
  delivery: {
    left: "absolute left-[-10rem] bottom-[10rem] h-[24rem] w-[24rem] rounded-full bg-[#0b6f9f]/[0.03] blur-[90px]",
    right: "absolute right-[-9rem] bottom-[10rem] h-[30rem] w-[30rem] rounded-full bg-[#0b6f9f]/[0.033] blur-[98px]",
    inner: "absolute right-[8rem] bottom-[5rem] h-[14rem] w-[14rem] rounded-full bg-[#0b6f9f]/[0.014] blur-[60px]",
  },
  sustainability: {
    left: "absolute left-[-10rem] top-[24rem] h-[26rem] w-[26rem] rounded-full bg-[#0b6f9f]/[0.031] blur-[94px]",
    right: "absolute right-[-10rem] bottom-[4rem] h-[32rem] w-[32rem] rounded-full bg-[#0b6f9f]/[0.034] blur-[102px]",
    inner: "absolute right-[10rem] bottom-[13rem] h-[13rem] w-[13rem] rounded-full bg-[#0b6f9f]/[0.013] blur-[58px]",
  },
  contact: {
    left: "absolute left-[-9rem] bottom-[8rem] h-[24rem] w-[24rem] rounded-full bg-[#0b6f9f]/[0.03] blur-[92px]",
    right: "absolute right-[-9rem] bottom-[7rem] h-[30rem] w-[30rem] rounded-full bg-[#0b6f9f]/[0.034] blur-[100px]",
    inner: "absolute right-[6rem] bottom-[18rem] h-[13rem] w-[13rem] rounded-full bg-[#0b6f9f]/[0.014] blur-[60px]",
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(getRequestedTab);
  const [language, setLanguage] = useState<Language>(getRequestedLanguage);
  const copy = localizedCopy[language];
  const activeTabCopy = copy.tabs[activeTab.id];
  const localizedActiveTab = { ...activeTab, ...activeTabCopy };
  const ActiveIcon = activeTab.icon;
  const ambientAccent = ambientAccents[activeTab.id] ?? ambientAccents.campus;
  const activeBodyParagraphs = Array.isArray(localizedActiveTab.body)
    ? localizedActiveTab.body
    : [localizedActiveTab.body];
  const focusLabel = copy.focusLabels[activeTab.id] ?? copy.focusLabels.contact;

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

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en-AU";
  }, [language]);

  return (
    <>
    <SiteStructuredData />
    <main
      className="premium-page min-h-screen overflow-x-hidden text-graphite"
      data-language={language}
      style={{ "--page-bg": `url("${assetPath("/hyperscale-data-centre-melbourne.jpg")}")` } as CSSProperties}
    >
      <h1 className="sr-only">AI Data Centre & Digital Infrastructure Development</h1>
      <div className="hero-image-wash" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className={`${ambientAccent.left} ambient-drift`} />
        <div className={`${ambientAccent.right} ambient-drift-slow`} />
        <div className={`${ambientAccent.inner} ambient-drift`} />
        <div className="datacenter-backdrop" />
      </div>
      <a className="skip-link" href="#top">
        {copy.skip}
      </a>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="premium-shell mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 rounded-xl border px-4 py-2.5 backdrop-blur-2xl">
          <a className="flex items-center gap-3" href="#top" aria-label="PentaNex home">
            <PentanexLogo />
          </a>

          <nav
            aria-label={copy.navAria}
            className="hidden items-center gap-1 rounded-lg border border-slate-200/80 bg-[#f7fbff] p-1 shadow-inner backdrop-blur-2xl lg:flex"
          >
            {tabs.map((tab) => (
              <button
                aria-pressed={activeTab.id === tab.id}
                className={`rounded-md border px-3.5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
                  activeTab.id === tab.id
                    ? "border-signal bg-signal text-white shadow-[0_10px_22px_rgba(18,124,219,0.22)]"
                    : "border-slate-200/80 bg-white text-steel hover:border-signal/45 hover:bg-white hover:text-signal"
                }`}
                key={tab.id}
                onClick={() => selectTab(tab)}
                type="button"
              >
                {copy.tabs[tab.id].label}
              </button>
            ))}
          </nav>

          <div className="hidden min-w-[132px] lg:block" aria-hidden="true" />
        </div>

        <nav
          aria-label={copy.mobileNavAria}
          className="premium-shell mx-auto mt-2 flex w-full max-w-[1120px] gap-2 overflow-x-auto rounded-xl border p-2 backdrop-blur-2xl lg:hidden"
        >
          {tabs.map((tab) => (
            <button
              aria-pressed={activeTab.id === tab.id}
              className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
                activeTab.id === tab.id
                  ? "border-signal bg-signal text-white shadow-sm"
                  : "border-slate-200 bg-white text-steel hover:border-signal/45 hover:text-signal"
              }`}
              key={tab.id}
              onClick={() => selectTab(tab)}
              type="button"
            >
              {copy.tabs[tab.id].label}
            </button>
          ))}
        </nav>
      </header>

      <section
        id="top"
        className="relative isolate z-10 flex items-start justify-center px-3 pb-3 pt-3 sm:px-5"
      >
        <div className="pointer-events-none absolute left-[8%] top-[16%] -z-10 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />

        {activeTab.id === "campus" ? (
          <div className="panel-fade relative mx-auto grid w-full max-w-[1120px] items-stretch gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:gap-4">
            <div className="grid min-h-0 gap-3 xl:gap-4">
              <AustraliaLocationMap />

              <div className="premium-card rounded-xl border p-4 backdrop-blur-2xl">
                <div className="section-kicker inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  <Globe2 size={15} />
                  {copy.infrastructureBadge}
                </div>
                <div className="mt-4 max-w-3xl space-y-3">
                  {copy.infrastructureNarrative.map((paragraph) => (
                    <p className="text-base leading-8 text-steel" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid min-h-0 gap-3 xl:gap-4">
              <div className="premium-card rounded-xl border p-3 backdrop-blur-2xl">
                <div className="grid gap-2 sm:grid-cols-4">
                  {copy.metrics.map((metric) => (
                    <div className="premium-card-soft premium-lift rounded-xl border p-3" key={metric.label}>
                      <p className="text-[clamp(0.86rem,1.05vw,1rem)] font-semibold leading-tight text-signal">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-steel">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-card flex rounded-xl border p-3 backdrop-blur-2xl xl:p-4">
                <div className="relative my-auto w-full overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 p-4">
                  <div className="image-ribbon" aria-hidden="true" />
                  <div className="section-kicker relative inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_0_20px_rgba(18,124,219,0.10)]">
                    <ActiveIcon size={15} />
                    {localizedActiveTab.panelTitle}
                  </div>
                  <div className="relative mt-4 space-y-3">
                    {activeBodyParagraphs.map((paragraph) => (
                      <p className="text-base leading-8 text-steel" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="relative mt-3 border-t border-slate-200/80 pt-3">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <span
                          className="data-hall-cell h-5 rounded-sm border border-slate-300/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.92)]"
                          key={`data-hall-${index}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-steel">
                      {copy.dataHallCapacity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="panel-fade relative mx-auto min-w-0 w-full max-w-[1120px]">
            <div className="premium-card rounded-xl border p-5 backdrop-blur-2xl xl:p-6">
              <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(290px,0.7fr)] xl:gap-5">
                <div className="premium-card-soft min-w-0 flex rounded-md border p-5 backdrop-blur-2xl xl:p-7">
                  <div className="mx-auto min-w-0 w-full max-w-3xl">
                    <div className="section-kicker inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_0_20px_rgba(18,124,219,0.10)]">
                      <ActiveIcon size={15} />
                      {localizedActiveTab.panelTitle}
                    </div>
                    {localizedActiveTab.title ? (
                      <h1 className="mt-3 max-w-3xl text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-tight text-graphite">
                        {localizedActiveTab.title}
                      </h1>
                    ) : null}
                    <div className={`${localizedActiveTab.title ? "mt-4" : "mt-5"} space-y-3`}>
                      {activeBodyParagraphs.map((paragraph) => (
                        <p className="break-words text-base leading-8 text-steel" key={paragraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="premium-card-soft min-w-0 flex rounded-md border p-5 backdrop-blur-2xl xl:p-6">
                  <div className="mx-auto min-w-0 w-full max-w-md">
                    {activeTab.id !== "contact" ? (
                      <>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
                          {focusLabel}
                        </p>
                        <div className="mt-5 grid gap-3">
                          {localizedActiveTab.points.map((point) => (
                            <div className="premium-lift flex gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(16,32,51,0.065)]" key={point}>
                              <CheckCircle2 className="mt-0.5 shrink-0 text-power" size={18} />
                              {point.includes("@") ? (
                                <a className="content-copy-sm break-words transition hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal" href={`mailto:${contactEmail}`}>
                                  {point}
                                </a>
                              ) : (
                                <span className="content-copy-sm">{point}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {activeTab.id === "capacity" ? <CapacityPlatformGraphic copy={copy.capacityGraphic} /> : null}
                    {activeTab.id === "delivery" ? <DeliveryRoadmap copy={copy.deliveryGraphic} /> : null}
                    {activeTab.id === "sustainability" ? (
                      <div className="mt-5 border-t border-slate-200/80 pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
                          SDG alignment
                        </p>
                        <div className="mt-3 grid gap-2">
                          {copy.sdgs.map((sdg) => (
                            <div
                              className="flex items-center gap-3 rounded-sm border border-slate-200 bg-white p-3"
                              key={sdg.number}
                            >
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm font-bold text-white"
                                style={{ backgroundColor: sdg.color }}
                              >
                                {sdg.number}
                              </span>
                              <span className="content-copy-sm">
                                {sdg.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {activeTab.id === "contact" ? <ContactPathwayGraphic copy={copy.contactGraphic} /> : null}
                    {localizedActiveTab.sideNote ? (
                      <div className="mt-5 border-t border-slate-200/80 pt-4">
                        <p className="text-sm leading-6 text-steel">
                          {localizedActiveTab.sideNote}
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

      <footer className="relative z-10 px-3 pb-5 sm:px-5">
        <div className="deep-footer relative mx-auto w-full max-w-[1120px] rounded-xl border p-5 backdrop-blur-2xl xl:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,2.1fr)] lg:items-start">
            <div className="pt-[1px]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">PENTANEX</p>
              <p className="content-copy-sm mt-5 max-w-md">
                {copy.footerIntro}
              </p>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1fr_1.35fr]">
              {copy.footerGroups.map((group) => (
                <div
                  className="rounded-md border border-slate-200 bg-white p-4"
                  key={group.heading}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                    {group.heading}
                  </p>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      item.includes("@") ? (
                        <a
                          className="content-copy-xs block whitespace-nowrap transition hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                          href={`mailto:${contactEmail}`}
                          key={item}
                        >
                          {item}
                        </a>
                      ) : (
                        <p className="content-copy-xs whitespace-nowrap" key={item}>
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
            <p>{copy.footerCopyright}</p>
            <p>{copy.footerTagline}</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}








