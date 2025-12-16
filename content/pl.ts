import type { SiteContent } from "../lib/i18n";

export const contentPl: SiteContent = {
  locale: "pl",
  hero: {
    logo: "Ringdove",
    slogan: "Projektujemy i tworzymy odważne doświadczenia cyfrowe."
  },
  nav: {
    title: "Nawigacja",
    items: [
      { id: "about", label: "O nas" },
      { id: "projects", label: "Projekty" },
      { id: "experiments", label: "Eksperymenty" },
      { id: "contact", label: "Kontakt" }
    ],
    languageLabel: "Język",
    languageSwitch: {
      en: "EN",
      pl: "PL"
    }
  },
  sections: {
    about: {
      heading: "Studio z wyraźnym punktem widzenia.",
      body:
        "Łączymy śmiałą eksplorację wizualną z solidnym wykonaniem. Dostarczamy szybko, iterujemy z projektantami i dbamy o mikrodetale, które sprawiają, że interfejsy żyją.",
      highlights: [
        "Opowieści marek w interaktywnej formie",
        "Creative development dla kampanii",
        "Szybkie prototypy i eksperymenty"
      ]
    },
    projects: {
      heading: "Wybrane projekty",
      intro: "Ostatnie realizacje łączące design, motion i inżynierię.",
      items: [
        {
          title: "Raw Materials",
          subtitle: "Imersyjny landing z kinetyczną typografią.",
          tags: ["WebGL-lite", "Framer Motion", "Storytelling"],
          link: "#"
        },
        {
          title: "Parallel Index",
          subtitle: "Produkt danych w filmowej oprawie.",
          tags: ["UI", "Design systemy", "Performance"],
          link: "#"
        },
        {
          title: "Northbound",
          subtitle: "Editorial modowy z responsywnym tempem.",
          tags: ["E-commerce", "Motion", "Narracja"],
          link: "#"
        }
      ]
    },
    experiments: {
      heading: "Eksperymenty",
      intro: "Półka prototypów, narzędzi i studiów wizualnych."
    },
    contact: {
      heading: "Kontakt",
      intro: "Opowiedz o projekcie. Odezwiemy się szybko.",
      success: "Wiadomość wysłana. Odezwę się wkrótce.",
      error: "Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio.",
      cta: "Wyślij wiadomość",
      fields: {
        name: "Imię i nazwisko",
        email: "Email",
        message: "Notatki o projekcie",
        honey: "Zostaw puste"
      }
    }
  }
};
