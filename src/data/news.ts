export type NewsStatus = "Draft" | "Published" | "Archived";

export type NewsCompany =
  | "BCU Group"
  | "Ready Food Company"
  | "SmartCycle Technologies";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: string;
  company: NewsCompany;
  status: NewsStatus;
  featured: boolean;
  coverImage: string;
  coverImageAlt: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
};

export const newsArticles: NewsArticle[] = [
  {
    id: "bcu-strategic-partnerships",
    title: "BCU Group expands its strategic partnership agenda",
    slug: "bcu-group-expands-strategic-partnership-agenda",
    excerpt:
      "BCU Group is strengthening engagement with institutions, investors and public-sector partners to accelerate the development of scalable African solutions.",
    content: [
      "BCU Group is advancing its strategic partnership programme as part of its long-term objective to build companies and projects capable of solving important African challenges.",
      "The group is focused on partnerships involving technology, food systems, institutional transformation, infrastructure, research and investment.",
      "Through its subsidiaries, Ready Food Company and SmartCycle Technologies, BCU Group intends to develop practical projects that can be piloted, measured and expanded across institutions and communities.",
      "The partnership model is designed to bring together operational expertise, capital, technology, public-sector coordination and local market knowledge.",
    ],
    category: "Corporate",
    company: "BCU Group",
    status: "Published",
    featured: true,
    coverImage: "/news/bcu-partnership.jpg",
    coverImageAlt: "BCU Group strategic partnership",
    author: "BCU Group Communications",
    publishedAt: "2026-07-28",
    readingTime: "4 min read",
    tags: ["Partnerships", "Investment", "Corporate Strategy"],
  },
  {
    id: "rfc-milk-hub-development",
    title: "RFC advances development planning for its Milk Hub",
    slug: "rfc-advances-development-planning-for-milk-hub",
    excerpt:
      "The RFC Milk Hub is being designed to connect dairy farmers with reliable collection, chilling, quality testing, processing and distribution infrastructure.",
    content: [
      "Ready Food Company is developing the RFC Milk Hub as an integrated dairy value-chain project.",
      "The proposed hub will support milk collection, quality testing, chilling, processing, packaging and distribution.",
      "The project is intended to improve market access for dairy farmers while maintaining product quality and reducing losses across the supply chain.",
      "RFC will continue evaluating equipment requirements, collection networks, operating capacity, food-safety standards and market partnerships before implementation.",
    ],
    category: "Dairy",
    company: "Ready Food Company",
    status: "Published",
    featured: true,
    coverImage: "/news/rfc-milk-hub.jpg",
    coverImageAlt: "RFC Milk Hub dairy development",
    author: "Ready Food Company",
    publishedAt: "2026-07-27",
    readingTime: "3 min read",
    tags: ["Milk Hub", "Dairy", "Farmers", "Food Processing"],
  },
  {
    id: "smartcampus360-development",
    title: "SmartCampus360 enters advanced product development",
    slug: "smartcampus360-enters-advanced-product-development",
    excerpt:
      "SmartCampus360 is being developed as an integrated digital operating system for attendance, examinations, academic workflows and institutional intelligence.",
    content: [
      "SmartCycle Technologies is advancing the development of SmartCampus360 as a unified digital platform for universities and colleges.",
      "The system includes examination management, attendance, QR-based identification, kiosk operations, room allocation and administrative reporting.",
      "SmartCampus360 is designed to reduce manual processes, improve institutional visibility and strengthen academic service delivery.",
      "Future phases will include deeper system integration, artificial-intelligence assisted timetable generation and expanded institutional analytics.",
    ],
    category: "Education Technology",
    company: "SmartCycle Technologies",
    status: "Published",
    featured: true,
    coverImage: "/news/smartcampus360.jpg",
    coverImageAlt: "SmartCampus360 education technology",
    author: "SmartCycle Technologies",
    publishedAt: "2026-07-26",
    readingTime: "4 min read",
    tags: ["SmartCampus360", "EduTech", "AI", "Digital Campus"],
  },
  {
    id: "smartflow360-service-delivery",
    title: "SmartFlow360 targets faster and more transparent service delivery",
    slug: "smartflow360-targets-faster-transparent-service-delivery",
    excerpt:
      "SmartFlow360 is being designed to modernise queue management, customer flow and operational performance across institutions.",
    content: [
      "SmartFlow360 is a digital service-delivery platform being developed by SmartCycle Technologies.",
      "The platform is intended for banks, hospitals, government offices and other institutions that manage high volumes of customers.",
      "Its capabilities include queue-ticket management, service counters, public displays, waiting-time estimates and management analytics.",
      "The broader objective is to reduce waiting times, improve accountability and provide decision-makers with reliable operational intelligence.",
    ],
    category: "Service Delivery",
    company: "SmartCycle Technologies",
    status: "Published",
    featured: false,
    coverImage: "/news/smartflow360.jpg",
    coverImageAlt: "SmartFlow360 service-delivery platform",
    author: "SmartCycle Technologies",
    publishedAt: "2026-07-24",
    readingTime: "3 min read",
    tags: ["SmartFlow360", "Queue Management", "GovTech"],
  },
  {
    id: "rfc-cold-storage",
    title: "RFC Cold Storage aims to reduce losses in food markets",
    slug: "rfc-cold-storage-aims-to-reduce-food-market-losses",
    excerpt:
      "RFC is developing cold-storage infrastructure designed to preserve perishable products and strengthen market supply chains.",
    content: [
      "RFC Cold Storage is one of Ready Food Company’s planned food-infrastructure projects.",
      "The project will focus on refrigerated storage solutions for markets, aggregation centres and food-distribution hubs.",
      "Target product categories include vegetables, fruits, dairy, meat and other perishable goods.",
      "The project is intended to reduce spoilage, extend product shelf life and improve the commercial value retained by farmers and traders.",
    ],
    category: "Cold Chain",
    company: "Ready Food Company",
    status: "Published",
    featured: false,
    coverImage: "/news/rfc-cold-storage.jpg",
    coverImageAlt: "RFC cold-storage facility",
    author: "Ready Food Company",
    publishedAt: "2026-07-22",
    readingTime: "3 min read",
    tags: ["Cold Storage", "Food Preservation", "Markets"],
  },
  {
    id: "smartpass360-access",
    title: "SmartPass360 introduces a unified approach to visitor access",
    slug: "smartpass360-unified-visitor-access-management",
    excerpt:
      "The platform combines self-registration, QR passes, approvals, kiosk printing and controlled entry and exit records.",
    content: [
      "SmartPass360 is being developed as an integrated visitor and access-control platform.",
      "Visitors will be able to register through a public kiosk or reception workflow and receive a QR-based pass.",
      "The pass can be used for controlled entry through compatible access hardware and scanned again when the visitor exits.",
      "The platform is intended to improve visitor visibility, institutional security, auditability and reception efficiency.",
    ],
    category: "Security Technology",
    company: "SmartCycle Technologies",
    status: "Published",
    featured: false,
    coverImage: "/news/smartpass360.jpg",
    coverImageAlt: "SmartPass360 visitor access system",
    author: "SmartCycle Technologies",
    publishedAt: "2026-07-20",
    readingTime: "3 min read",
    tags: ["SmartPass360", "Visitor Management", "QR Access"],
  },
];

export function getPublishedNews() {
  return newsArticles
    .filter((article) => article.status === "Published")
    .sort(
      (first, second) =>
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime()
    );
}

export function getNewsBySlug(slug: string) {
  return newsArticles.find(
    (article) =>
      article.slug === slug && article.status === "Published"
  );
}