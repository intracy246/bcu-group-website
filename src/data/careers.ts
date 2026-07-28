export type JobCompany =
  | "BCU Group"
  | "Ready Food Company"
  | "SmartCycle Technologies";

export type JobStatus =
  | "Draft"
  | "Open"
  | "Closed"
  | "Archived";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Volunteer";

export type JobOpening = {
  id: string;
  title: string;
  slug: string;
  company: JobCompany;
  department: string;
  location: string;
  employmentType: EmploymentType;
  workMode: "On-site" | "Hybrid" | "Remote";
  status: JobStatus;
  featured: boolean;
  summary: string;
  description: string[];
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  benefits: string[];
  applicationDeadline: string;
  publishedAt: string;
};

export const jobOpenings: JobOpening[] = [
  {
    id: "smartcycle-full-stack-developer",
    title: "Full-Stack Software Developer",
    slug: "full-stack-software-developer",
    company: "SmartCycle Technologies",
    department: "Technology",
    location: "Dar es Salaam, Tanzania",
    employmentType: "Full-time",
    workMode: "Hybrid",
    status: "Open",
    featured: true,
    summary:
      "Build scalable web platforms, APIs and enterprise systems across the SmartCycle technology portfolio.",
    description: [
      "SmartCycle Technologies is seeking a Full-Stack Software Developer to support the development of institutional software, artificial-intelligence platforms and digital infrastructure.",
      "The role will contribute to products including SmartCampus360, SmartFlow360, SmartPass360 and other SmartCycle solutions.",
    ],
    responsibilities: [
      "Develop responsive frontend interfaces using modern web technologies.",
      "Build and maintain secure backend APIs and database integrations.",
      "Work with PostgreSQL and structured application data.",
      "Collaborate on product architecture, testing and deployment.",
      "Document technical decisions and development processes.",
      "Support troubleshooting, optimisation and system maintenance.",
    ],
    requirements: [
      "Experience with JavaScript or TypeScript.",
      "Knowledge of React, Next.js or a comparable frontend framework.",
      "Understanding of Node.js and REST APIs.",
      "Basic experience with relational databases.",
      "Ability to use Git and GitHub.",
      "Strong analytical and problem-solving skills.",
    ],
    preferredQualifications: [
      "Experience with PostgreSQL and Prisma ORM.",
      "Understanding of cloud or self-hosted deployment.",
      "Exposure to AI integrations or enterprise software.",
      "Experience building secure authentication systems.",
    ],
    benefits: [
      "Opportunity to build high-impact African technology products.",
      "Direct exposure to multiple software platforms.",
      "Professional growth and product-development experience.",
      "Flexible hybrid collaboration structure.",
    ],
    applicationDeadline: "2026-09-30",
    publishedAt: "2026-07-28",
  },
  {
    id: "rfc-operations-coordinator",
    title: "Food Operations Coordinator",
    slug: "food-operations-coordinator",
    company: "Ready Food Company",
    department: "Operations",
    location: "Dar es Salaam, Tanzania",
    employmentType: "Full-time",
    workMode: "On-site",
    status: "Open",
    featured: true,
    summary:
      "Coordinate kitchen operations, food quality, fulfilment and daily service performance.",
    description: [
      "Ready Food Company is seeking an operations professional to support meal production, food-service coordination and operational discipline.",
      "The role will help maintain quality, hygiene, inventory control and efficient fulfilment across RFC operations.",
    ],
    responsibilities: [
      "Coordinate daily food production and service schedules.",
      "Monitor hygiene, quality and food-safety procedures.",
      "Support inventory planning and stock control.",
      "Coordinate staff duties and operational reporting.",
      "Track orders, deliveries and customer-service issues.",
      "Identify opportunities to reduce waste and improve efficiency.",
    ],
    requirements: [
      "Experience in food service, hospitality or operations.",
      "Strong organisation and communication skills.",
      "Understanding of hygiene and food-handling standards.",
      "Ability to supervise daily operational activities.",
      "Basic reporting and record-management skills.",
    ],
    preferredQualifications: [
      "Training in hospitality, food production or business operations.",
      "Experience in institutional catering.",
      "Experience using digital order or inventory systems.",
    ],
    benefits: [
      "Opportunity to join a growing Tanzanian food company.",
      "Exposure to food-service and value-chain operations.",
      "Potential for expanded leadership responsibility.",
      "Professional development within RFC.",
    ],
    applicationDeadline: "2026-09-15",
    publishedAt: "2026-07-28",
  },
  {
    id: "bcu-business-development-intern",
    title: "Business Development Intern",
    slug: "business-development-intern",
    company: "BCU Group",
    department: "Strategy and Partnerships",
    location: "Dar es Salaam, Tanzania",
    employmentType: "Internship",
    workMode: "Hybrid",
    status: "Open",
    featured: false,
    summary:
      "Support research, proposals, partnerships and strategic opportunity development across BCU Group.",
    description: [
      "BCU Group is seeking an ambitious Business Development Intern to support strategic research, proposal preparation and partnership development.",
      "The intern will gain exposure to technology, food systems, investment planning and corporate development.",
    ],
    responsibilities: [
      "Conduct market and institutional research.",
      "Support preparation of proposals and presentations.",
      "Maintain records of partnership opportunities.",
      "Assist with project summaries and business documentation.",
      "Support coordination of meetings and follow-up activities.",
    ],
    requirements: [
      "Current student or recent graduate in business, economics, finance, public administration or a related field.",
      "Strong written and verbal communication skills.",
      "Good research and analytical ability.",
      "Professional use of Microsoft Office or Google Workspace.",
      "Ability to work independently and meet deadlines.",
    ],
    preferredQualifications: [
      "Interest in entrepreneurship, technology or African development.",
      "Previous internship or project-research experience.",
      "Strong English and Kiswahili communication.",
    ],
    benefits: [
      "Practical exposure to corporate strategy.",
      "Mentorship and project-development experience.",
      "Participation in real business and institutional initiatives.",
      "Potential consideration for future opportunities.",
    ],
    applicationDeadline: "2026-08-31",
    publishedAt: "2026-07-28",
  },
];

export function getOpenJobs() {
  return jobOpenings
    .filter((job) => job.status === "Open")
    .sort(
      (first, second) =>
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime()
    );
}

export function getJobBySlug(slug: string) {
  return jobOpenings.find(
    (job) => job.slug === slug && job.status === "Open"
  );
}