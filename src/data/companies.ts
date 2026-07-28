export type ProjectStatus =
  | "Active"
  | "Development"
  | "Expansion"
  | "Planned"
  | "Research";

export type CompanyProject = {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  tags: string[];
};

export type CompanyProfile = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  legalName: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  logo: string;
  theme: "rfc" | "smartcycle";
  sectors: string[];
  projects: CompanyProject[];
};

export const companies: CompanyProfile[] = [
  {
    id: "rfc",
    name: "Ready Food Company",
    shortName: "RFC",
    slug: "rfc",
    legalName: "Ready Food Company Limited",
    tagline: "Building stronger food systems for Africa.",
    description:
      "Ready Food Company is a diversified Tanzanian food and consumer services company building reliable solutions across meals, dairy, agriculture, food preservation, logistics and automotive care.",
    mission:
      "To provide affordable, nutritious and accessible food products and services while building sustainable value chains that connect farmers, processors, markets, institutions and consumers.",
    vision:
      "To become one of Africa’s leading integrated food solutions companies, improving food access, reducing post-harvest losses and creating sustainable economic opportunity.",
    logo: "/brands/rfc-logo.png",
    theme: "rfc",
    sectors: [
      "Food Services",
      "Agriculture",
      "Dairy",
      "Cold Chain",
      "Logistics",
      "Consumer Services",
    ],
    projects: [
      {
        id: "rfc-ready-to-eat",
        name: "Ready to Eat",
        shortName: "R2E",
        slug: "ready-to-eat",
        summary:
          "Affordable ready-to-eat meals for offices, students, households and communities.",
        description:
          "Ready to Eat operates kitchens, meal delivery services and dining locations designed to provide affordable, hygienic and nutritious meals at scale.",
        category: "Food Services",
        status: "Active",
        featured: true,
        tags: ["Meals", "Delivery", "Institutional Food"],
      },
      {
        id: "rfc-ready-to-deliver",
        name: "Ready to Deliver",
        shortName: "R2D",
        slug: "ready-to-deliver",
        summary:
          "A technology-supported food delivery and fulfilment network.",
        description:
          "Ready to Deliver coordinates food ordering, dispatch, route management and last-mile delivery for RFC kitchens, partner businesses and institutional clients.",
        category: "Delivery",
        status: "Development",
        featured: false,
        tags: ["Delivery", "Logistics", "Technology"],
      },
      {
        id: "rfc-ready-to-serve",
        name: "Ready to Serve",
        shortName: "R2S",
        slug: "ready-to-serve",
        summary:
          "Catering services for institutions, events and corporate clients.",
        description:
          "Ready to Serve provides flexible catering packages for offices, schools, universities, government institutions, private functions and major events.",
        category: "Catering",
        status: "Active",
        featured: false,
        tags: ["Catering", "Events", "Institutions"],
      },
      {
        id: "rfc-ready-on-wheels",
        name: "Ready on Wheels",
        shortName: "R2W",
        slug: "ready-on-wheels",
        summary:
          "Mobile food units serving busy commercial and community locations.",
        description:
          "Ready on Wheels uses food trucks and mobile service units to deliver hot meals in business districts, schools, transport hubs and public events.",
        category: "Mobile Food",
        status: "Planned",
        featured: false,
        tags: ["Food Trucks", "Mobile Retail", "Meals"],
      },
      {
        id: "rfc-milk-hub",
        name: "RFC Milk Hub",
        shortName: "FreshMilk",
        slug: "milk-hub",
        summary:
          "An integrated milk collection, chilling, testing and processing hub.",
        description:
          "RFC Milk Hub connects dairy farmers to reliable markets through milk collection centres, quality testing, cooling, processing, packaging and distribution.",
        category: "Dairy",
        status: "Development",
        featured: true,
        tags: ["Dairy", "Farmers", "Processing", "Cold Chain"],
      },
      {
        id: "rfc-cold-storage",
        name: "RFC Cold Storage",
        shortName: "Cold Chain",
        slug: "cold-storage",
        summary:
          "Cold rooms and market refrigeration systems that reduce food losses.",
        description:
          "RFC Cold Storage deploys refrigeration infrastructure in markets, collection centres and distribution hubs to preserve vegetables, fruits, dairy, meat and other perishable products.",
        category: "Cold Chain",
        status: "Development",
        featured: true,
        tags: ["Cold Rooms", "Refrigeration", "Food Preservation"],
      },
      {
        id: "rfc-fresh-hubs",
        name: "RFC Fresh Hubs",
        slug: "fresh-hubs",
        summary:
          "Community-based aggregation, storage and distribution centres.",
        description:
          "Fresh Hubs connect farmers, traders, processors, transporters and buyers through strategically located food aggregation and distribution centres.",
        category: "Food Infrastructure",
        status: "Planned",
        featured: true,
        tags: ["Aggregation", "Markets", "Farmers", "Distribution"],
      },
      {
        id: "rfc-transport-storage",
        name: "Transport to Market & Storage",
        slug: "transport-to-market",
        summary:
          "Integrated transport, warehousing and market access for food producers.",
        description:
          "This business unit helps farmers and suppliers transport products to buyers, markets, processors and RFC storage facilities efficiently.",
        category: "Logistics",
        status: "Planned",
        featured: false,
        tags: ["Transport", "Warehousing", "Market Access"],
      },
      {
        id: "rfc-ready-to-freeze",
        name: "Ready to Freeze",
        shortName: "R2F",
        slug: "ready-to-freeze",
        summary:
          "Frozen meals and food products designed for convenient home storage.",
        description:
          "Ready to Freeze develops hygienically prepared frozen meals and food products that households and institutions can store and prepare later.",
        category: "Food Products",
        status: "Planned",
        featured: false,
        tags: ["Frozen Food", "Retail", "Convenience"],
      },
      {
        id: "rfc-ready-to-fit",
        name: "Ready to Fit",
        shortName: "R2Fit",
        slug: "ready-to-fit",
        summary:
          "Fitness-oriented meals, nutrition packages and healthy food products.",
        description:
          "Ready to Fit provides planned meals and food products for customers focused on health, fitness, weight management and performance nutrition.",
        category: "Nutrition",
        status: "Planned",
        featured: false,
        tags: ["Fitness", "Healthy Meals", "Nutrition"],
      },
      {
        id: "rfc-ready-organic",
        name: "Ready Organic",
        shortName: "R-Org",
        slug: "ready-organic",
        summary:
          "Organic food sourcing, distribution, wholesale and retail.",
        description:
          "Ready Organic builds a trusted network of farmers and suppliers producing traceable, high-quality and sustainably grown food products.",
        category: "Agriculture",
        status: "Planned",
        featured: false,
        tags: ["Organic", "Farmers", "Retail", "Wholesale"],
      },
      {
        id: "rfc-ready-grains",
        name: "RFC Grains Store",
        shortName: "R-Grain",
        slug: "grains-store",
        summary:
          "Wholesale, retail and storage services for grains and cereals.",
        description:
          "RFC Grains Store purchases, stores, packages and distributes cereals and grains to households, institutions, retailers and bulk buyers.",
        category: "Grains",
        status: "Planned",
        featured: false,
        tags: ["Grains", "Storage", "Wholesale", "Retail"],
      },
      {
        id: "rfc-car-detail",
        name: "RFC Auto Detail & Spa",
        slug: "car-detail",
        summary:
          "Professional vehicle cleaning, detailing and automotive care.",
        description:
          "RFC Auto Detail & Spa provides fast car washing, interior deep cleaning, body detailing and premium vehicle care services.",
        category: "Consumer Services",
        status: "Development",
        featured: true,
        tags: ["Car Wash", "Detailing", "Automotive Care"],
      },
    ],
  },

  {
    id: "smartcycle",
    name: "SmartCycle Technologies",
    shortName: "SmartCycle",
    slug: "smartcycle",
    legalName: "SmartCycle Technologies Limited",
    tagline: "Engineering intelligent systems for Africa.",
    description:
      "SmartCycle Technologies builds artificial intelligence platforms, institutional software, digital infrastructure and smart-city technologies for governments, businesses and communities.",
    mission:
      "To design secure, scalable and intelligent technologies that improve institutional performance, public services, economic inclusion and daily life.",
    vision:
      "To become Africa’s leading technology and digital infrastructure company, creating systems that power institutions, cities, enterprises and communities.",
    logo: "/brands/smartcycle-new.png",
    theme: "smartcycle",
    sectors: [
      "Artificial Intelligence",
      "GovTech",
      "EduTech",
      "Smart Cities",
      "Enterprise Software",
      "Digital Infrastructure",
    ],
    projects: [
      {
        id: "smartcampus360",
        name: "SmartCampus360",
        slug: "smartcampus360",
        summary:
          "An intelligent operating system for universities and colleges.",
        description:
          "SmartCampus360 digitises attendance, examinations, room allocation, identity verification, academic workflows, kiosks and institutional reporting.",
        category: "Education Technology",
        status: "Development",
        featured: true,
        tags: ["EduTech", "AI Timetable", "Examinations", "Attendance"],
      },
      {
        id: "smartflow360",
        name: "SmartFlow360",
        slug: "smartflow360",
        summary:
          "A digital queue, workflow and service-delivery intelligence platform.",
        description:
          "SmartFlow360 reduces waiting times, coordinates service queues and provides operational analytics for banks, hospitals, public offices and service institutions.",
        category: "Service Delivery",
        status: "Development",
        featured: true,
        tags: ["Queue Management", "Analytics", "Public Services"],
      },
      {
        id: "smartpass360",
        name: "SmartPass360",
        slug: "smartpass360",
        summary:
          "A visitor, access-control and digital pass management system.",
        description:
          "SmartPass360 manages visitor registration, QR passes, kiosk printing, approvals, turnstile access, entry and exit records and institutional security.",
        category: "Security Technology",
        status: "Development",
        featured: true,
        tags: ["Visitor Management", "QR Access", "Turnstiles"],
      },
      {
        id: "smartpermit360",
        name: "SmartPermit360",
        slug: "smartpermit360",
        summary:
          "Digital permit application, approval and verification infrastructure.",
        description:
          "SmartPermit360 digitises permit applications, document validation, institutional approval, payments, compliance checks and public verification.",
        category: "GovTech",
        status: "Planned",
        featured: false,
        tags: ["Permits", "Compliance", "Verification"],
      },
      {
        id: "smartvision360",
        name: "SmartVision360",
        slug: "smartvision360",
        summary:
          "AI-powered surveillance, monitoring and public-safety intelligence.",
        description:
          "SmartVision360 connects CCTV, drones, sensors and AI analytics to improve security monitoring, incident detection and emergency response.",
        category: "Smart Security",
        status: "Planned",
        featured: true,
        tags: ["Computer Vision", "CCTV", "Drones", "Safety"],
      },
      {
        id: "smartrevenue360",
        name: "SmartRevenue360",
        slug: "smartrevenue360",
        summary:
          "Revenue collection, performance monitoring and leakage intelligence.",
        description:
          "SmartRevenue360 helps institutions identify revenue opportunities, improve collection, detect anomalies and manage performance using integrated data.",
        category: "Financial Technology",
        status: "Research",
        featured: false,
        tags: ["Revenue", "Analytics", "Compliance"],
      },
      {
        id: "asset360",
        name: "Asset360",
        slug: "asset360",
        summary:
          "A digital asset registry, tracking and lifecycle management system.",
        description:
          "Asset360 enables institutions to register, locate, assign, maintain, audit and analyse physical and digital assets.",
        category: "Enterprise Software",
        status: "Planned",
        featured: false,
        tags: ["Asset Management", "Audit", "Tracking"],
      },
      {
        id: "citizen360",
        name: "Citizen360",
        slug: "citizen360",
        summary:
          "A unified digital service and engagement platform for citizens.",
        description:
          "Citizen360 connects residents with public services, applications, notifications, requests, complaints and digital government information.",
        category: "GovTech",
        status: "Planned",
        featured: false,
        tags: ["Citizen Services", "E-Government", "Engagement"],
      },
      {
        id: "edu360",
        name: "Edu360",
        slug: "edu360",
        summary:
          "Digital education infrastructure for institutions and learners.",
        description:
          "Edu360 supports digital learning, institutional administration, student services, performance intelligence and educational access.",
        category: "Education Technology",
        status: "Research",
        featured: false,
        tags: ["Learning", "Institutions", "Students"],
      },
      {
        id: "health360",
        name: "Health360",
        slug: "health360",
        summary:
          "Connected digital systems for healthcare access and operations.",
        description:
          "Health360 is designed to support patient flow, health records, appointments, screening programmes and institutional healthcare intelligence.",
        category: "Health Technology",
        status: "Research",
        featured: false,
        tags: ["HealthTech", "Patients", "Healthcare"],
      },
      {
        id: "mappo",
        name: "Mappo",
        slug: "mappo",
        summary:
          "A unified location, business, mobility and city discovery platform.",
        description:
          "Mappo connects people with businesses, services, transport, agents, agriculture, accommodation, activities and real-time location-based experiences.",
        category: "Consumer Technology",
        status: "Development",
        featured: true,
        tags: ["Maps", "Business Discovery", "Mobility", "Local Commerce"],
      },
      {
        id: "genesis-lifeos",
        name: "Genesis: LifeOS",
        slug: "genesis-lifeos",
        summary:
          "An AI-powered personal operating system for everyday life.",
        description:
          "Genesis: LifeOS is designed as an intelligent mobile companion capable of understanding context, supporting decisions and coordinating personal digital activities.",
        category: "Artificial Intelligence",
        status: "Research",
        featured: true,
        tags: ["Personal AI", "Life Management", "Mobile Intelligence"],
      },
      {
        id: "miracle-ai",
        name: "Miracle AI",
        slug: "miracle-ai",
        summary:
          "An advanced desktop AI assistant and autonomous development system.",
        description:
          "Miracle AI is designed to understand computer activity, analyse information, execute authorised tasks and help build software applications.",
        category: "Artificial Intelligence",
        status: "Research",
        featured: false,
        tags: ["Desktop AI", "Automation", "Software Development"],
      },
      {
        id: "leakzero",
        name: "LeakZero",
        slug: "leakzero",
        summary:
          "Organisational leakage and operational-loss intelligence.",
        description:
          "LeakZero analyses institutional systems and operational data to identify where money, time, inventory and productivity are being lost.",
        category: "Enterprise Intelligence",
        status: "Research",
        featured: true,
        tags: ["Leakage Detection", "Cost Reduction", "Analytics"],
      },
      {
        id: "taxgap-ai",
        name: "TaxGap AI",
        slug: "taxgap-ai",
        summary:
          "AI-powered tax-gap detection and revenue-base intelligence.",
        description:
          "TaxGap AI helps revenue authorities identify economic activity, businesses and transactions that may not be represented correctly in the active tax base.",
        category: "GovTech",
        status: "Research",
        featured: true,
        tags: ["Tax Intelligence", "Revenue", "AI Analytics"],
      },
    ],
  },
];

export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}