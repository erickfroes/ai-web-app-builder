import { describe, expect, it } from "vitest";

import { TEMPLATE_LIST, buildTemplateConstraint, getTemplateById } from "@/features/project/templates";

describe("template registry", () => {
  it("contains the initial template catalog", () => {
    expect(TEMPLATE_LIST).toHaveLength(6);
    expect(TEMPLATE_LIST.map((item) => item.name)).toEqual([
      "Premium SaaS Dashboard",
      "Medical Clinic SaaS",
      "CRM Operations",
      "Financial Dashboard",
      "Client Portal",
      "Premium Landing Page",
    ]);
  });

  it("resolves template metadata and preset constraints", () => {
    const template = getTemplateById("premium-saas-dashboard");
    expect(template?.appSpecPreset.features.length).toBeGreaterThan(0);
    expect(template?.designSpecPreset.colorTokens).toContain("bg-background");

    const constraints = buildTemplateConstraint(template!);
    expect(constraints).toContain("not as static code");
    expect(constraints).toContain("AppSpec preset baseline");
    expect(constraints).toContain("DesignSpec preset baseline");
  });
});
