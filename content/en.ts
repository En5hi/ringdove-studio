import type { SiteContent } from "../lib/i18n";

export const contentEn: SiteContent = {
  locale: "en",
  hero: {
    logo: "ringdove",
    slogan: "Design-led digital experiments for brands with edge."
  },
  nav: {
    title: "Navigate",
    items: [
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "experiments", label: "Experiments" },
      { id: "contact", label: "Contact" }
    ],
    languageLabel: "Language",
    languageSwitch: {
      en: "EN",
      pl: "PL"
    }
  },
  sections: {
    about: {
      heading: "Studio with a point of view.",
      body:
        "We pair bold visual exploration with resilient engineering. We ship fast, iterate with designers, and obsess over the small details that make interfaces feel alive.",
      highlights: [
        "Interactive brand storytelling",
        "Creative dev for campaigns",
        "Rapid prototypes & experiments"
      ]
    },
    projects: {
      heading: "Selected projects",
      intro: "Recent engagements blending design, motion, and engineering.",
      items: [
        {
          title: "Raw Materials",
          subtitle: "Immersive landing with kinetic typography.",
          tags: ["WebGL-lite", "Framer Motion", "Storytelling"],
          link: "#"
        },
        {
          title: "Parallel Index",
          subtitle: "Data-heavy product given a cinematic skin.",
          tags: ["Product UI", "Design systems", "Performance"],
          link: "#"
        },
        {
          title: "Northbound",
          subtitle: "Fashion editorial with responsive filmic pace.",
          tags: ["E-commerce", "Motion", "Narrative"],
          link: "#"
        }
      ]
    },
    experiments: {
      heading: "Experiments",
      intro: "A rotating shelf of prototypes, tools, and visual studies."
    },
    contact: {
      heading: "Contact",
      intro: "Tell us about the thing you want to build. We'll respond fast.",
      success: "Message sent. We'll be in touch soon.",
      error: "Something went wrong. Please try again or email us directly.",
      cta: "Send message",
      fields: {
        name: "Name",
        email: "Email",
        message: "Project notes",
        honey: "Leave this empty"
      }
    }
  }
};
