export type Locale = "en" | "pl";

export const locales: Locale[] = ["en", "pl"];
export const defaultLocale: Locale = "en";

export const localePaths: Record<Locale, string> = {
  en: "/",
  pl: "/pl"
};

export type NavItem = {
  id: string;
  label: string;
  hint?: string;
};

export type SectionCopy = {
  heading: string;
  body?: string;
  highlights?: string[];
};

export type ProjectCopy = {
  title: string;
  subtitle: string;
  tags: string[];
  link?: string;
};

export type Experiment = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
};

export type ContactCopy = {
  heading: string;
  intro: string;
  success: string;
  error: string;
  cta: string;
  fields: {
    name: string;
    email: string;
    message: string;
    honey: string;
  };
};

export type SiteContent = {
  locale: Locale;
  hero: {
    logo: string;
    slogan: string;
  };
  nav: {
    title: string;
    items: NavItem[];
    languageLabel: string;
    languageSwitch: {
      en: string;
      pl: string;
    };
  };
  sections: {
    about: SectionCopy;
    projects: {
      heading: string;
      intro: string;
      items: ProjectCopy[];
    };
    experiments: {
      heading: string;
      intro: string;
      empty?: string;
    };
    contact: ContactCopy;
  };
};
