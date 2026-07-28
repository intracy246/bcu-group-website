export type AdminProjectStatus =
  | "Draft"
  | "Published"
  | "Archived";

export type AdminProjectCompany =
  | "BCU Group"
  | "Ready Food Company"
  | "SmartCycle Technologies";

export type AdminProject = {
  id: string;
  name: string;
  slug: string;
  company: AdminProjectCompany;
  category: string;
  status: AdminProjectStatus;
  summary: string;
  description: string;
  logo: string;
  coverImage: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProjectFormData = Omit<
  AdminProject,
  "id" | "createdAt" | "updatedAt"
>;