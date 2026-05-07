export const themeTokens = {
  colors: {
    background: "bg-background",
    foreground: "text-foreground",
    card: "bg-card",
    cardForeground: "text-card-foreground",
    primary: "bg-primary",
    primaryForeground: "text-primary-foreground",
    border: "border-border",
    muted: "bg-muted",
    mutedForeground: "text-muted-foreground",
    accent: "bg-accent",
    accentForeground: "text-accent-foreground",
    destructive: "bg-destructive",
    destructiveForeground: "text-destructive-foreground",
    ring: "ring-ring",
    input: "border-input"
  },
  radius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl"
  },
  spacing: {
    pageX: "px-6 lg:px-8",
    pageY: "py-6 lg:py-8",
    sectionGap: "space-y-6",
    cardPadding: "p-6"
  }
} as const;
