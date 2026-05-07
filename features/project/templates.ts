import type { AppSpec, DesignSpec } from "@/schemas";

export type TemplateId =
  | "premium-saas-dashboard"
  | "medical-clinic-saas"
  | "crm-operations"
  | "financial-dashboard"
  | "client-portal"
  | "premium-landing-page";

export type TemplatePreset = {
  id: TemplateId;
  name: string;
  category: "dashboard" | "portal" | "landing";
  description: string;
  constraintSummary: string;
  appSpecPreset: AppSpec;
  designSpecPreset: DesignSpec;
};

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplatePreset> = {
  "premium-saas-dashboard": {
    id: "premium-saas-dashboard",
    name: "Premium SaaS Dashboard",
    category: "dashboard",
    description: "Executive analytics workspace with team workflows and operational monitoring.",
    constraintSummary: "Prioritize KPI visibility, role-based dashboards, and actionable analytics workflows.",
    appSpecPreset: {
      name: "Premium SaaS Dashboard",
      description: "Multi-tenant SaaS dashboard focused on execution visibility and team operations.",
      goals: ["Increase weekly active usage", "Reduce decision latency with real-time KPI views"],
      targetUsers: ["Founders", "Operations leads", "Team managers"],
      features: ["KPI overview", "Team activity feed", "Report export", "Alerts and notifications"],
    },
    designSpecPreset: {
      theme: "system",
      styleKeywords: ["premium", "data-rich", "high-contrast hierarchy", "enterprise polish"],
      colorTokens: ["bg-background", "bg-card", "text-foreground", "bg-primary", "text-primary-foreground", "border-border"],
      typography: { headingFont: "Inter", bodyFont: "Inter" },
    },
  },
  "medical-clinic-saas": {
    id: "medical-clinic-saas",
    name: "Medical Clinic SaaS",
    category: "dashboard",
    description: "Clinical operations platform for scheduling, intake, and patient workflow tracking.",
    constraintSummary: "Emphasize trust, clarity, scheduling efficiency, and privacy-conscious UX patterns.",
    appSpecPreset: {
      name: "Medical Clinic SaaS",
      description: "Operations workspace for clinics to coordinate appointments and patient interactions.",
      goals: ["Reduce no-shows", "Improve patient throughput", "Surface day-of operational risks"],
      targetUsers: ["Clinic administrators", "Front-desk staff", "Providers"],
      features: ["Appointment board", "Patient queue", "Visit status tracking", "Daily operational summary"],
    },
    designSpecPreset: {
      theme: "light",
      styleKeywords: ["trustworthy", "clean", "accessible", "calm"],
      colorTokens: ["bg-background", "bg-card", "text-foreground", "bg-primary", "text-primary-foreground", "border-border"],
      typography: { headingFont: "Inter", bodyFont: "Inter" },
    },
  },
  "crm-operations": {
    id: "crm-operations",
    name: "CRM Operations",
    category: "dashboard",
    description: "Pipeline and account operations hub for revenue teams.",
    constraintSummary: "Focus on pipeline flow, account health signals, and rapid task execution.",
    appSpecPreset: {
      name: "CRM Operations",
      description: "Revenue operations app for tracking pipeline movement and customer engagement.",
      goals: ["Improve conversion rate", "Standardize follow-up workflows"],
      targetUsers: ["Sales managers", "Account executives", "Customer success leads"],
      features: ["Pipeline stages", "Account timeline", "Task queue", "Forecast summary"],
    },
    designSpecPreset: {
      theme: "system",
      styleKeywords: ["focused", "actionable", "modular", "fast-scanning"],
      colorTokens: ["bg-background", "bg-card", "text-foreground", "bg-primary", "text-primary-foreground", "border-border"],
      typography: { headingFont: "Inter", bodyFont: "Inter" },
    },
  },
  "financial-dashboard": {
    id: "financial-dashboard",
    name: "Financial Dashboard",
    category: "dashboard",
    description: "Finance intelligence console for budgets, cash flow, and reporting.",
    constraintSummary: "Prioritize numerical readability, trend comparison, and confidence-inspiring data presentation.",
    appSpecPreset: {
      name: "Financial Dashboard",
      description: "Finance operations dashboard with planning, monitoring, and reporting surfaces.",
      goals: ["Improve budget adherence", "Accelerate monthly reporting"],
      targetUsers: ["Finance leads", "Controllers", "Department owners"],
      features: ["Cash flow overview", "Budget variance", "Report center", "Alert thresholds"],
    },
    designSpecPreset: {
      theme: "dark",
      styleKeywords: ["precise", "analytical", "structured", "executive"],
      colorTokens: ["bg-background", "bg-card", "text-foreground", "bg-primary", "text-primary-foreground", "border-border"],
      typography: { headingFont: "Inter", bodyFont: "Inter" },
    },
  },
  "client-portal": {
    id: "client-portal",
    name: "Client Portal",
    category: "portal",
    description: "Shared workspace for clients to track deliverables, timelines, and communication.",
    constraintSummary: "Optimize for transparency, status communication, and simple client actions.",
    appSpecPreset: {
      name: "Client Portal",
      description: "External-facing portal where clients review work progress and collaborate.",
      goals: ["Reduce support requests", "Improve client satisfaction and visibility"],
      targetUsers: ["Clients", "Project managers", "Account teams"],
      features: ["Milestone timeline", "Document hub", "Comment threads", "Status updates"],
    },
    designSpecPreset: {
      theme: "light",
      styleKeywords: ["clear", "reassuring", "collaborative", "minimal"],
      colorTokens: ["bg-background", "bg-card", "text-foreground", "bg-primary", "text-primary-foreground", "border-border"],
      typography: { headingFont: "Inter", bodyFont: "Inter" },
    },
  },
  "premium-landing-page": {
    id: "premium-landing-page",
    name: "Premium Landing Page",
    category: "landing",
    description: "Conversion-focused marketing experience for product storytelling and lead capture.",
    constraintSummary: "Maximize messaging clarity, visual polish, and conversion-oriented content flow.",
    appSpecPreset: {
      name: "Premium Landing Page",
      description: "High-converting marketing site that communicates value and drives qualified signups.",
      goals: ["Increase conversion rate", "Improve message comprehension"],
      targetUsers: ["Prospective buyers", "Executive evaluators"],
      features: ["Hero with CTA", "Value sections", "Social proof", "Pricing", "Lead capture form"],
    },
    designSpecPreset: {
      theme: "light",
      styleKeywords: ["premium", "editorial", "high-clarity", "conversion-focused"],
      colorTokens: ["bg-background", "bg-card", "text-foreground", "bg-primary", "text-primary-foreground", "border-border"],
      typography: { headingFont: "Inter", bodyFont: "Inter" },
    },
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_REGISTRY);

export function getTemplateById(id: string) {
  return TEMPLATE_REGISTRY[id as TemplateId] ?? null;
}

export function buildTemplateConstraint(template: TemplatePreset): string {
  return [
    `Use template \"${template.name}\" as a behavioral and quality constraint, not as static code to copy.`,
    `Constraint focus: ${template.constraintSummary}`,
    `AppSpec preset baseline: ${JSON.stringify(template.appSpecPreset)}`,
    `DesignSpec preset baseline: ${JSON.stringify(template.designSpecPreset)}`,
  ].join("\n");
}
