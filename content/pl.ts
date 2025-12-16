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
      heading: "Design z wysokości",
      body:
        "Jesteśmy studio designu, które przekształca odważne pomysły w wyjątkowe doświadczenia cyfrowe. Nasze podejście designer-first łączy eksplorację wizualną z solidnym wykonaniem—dostarczamy szybko, iterujemy z intencją i dbamy o detale, które sprawiają, że interfejsy żyją.\n\nOd interaktywnych opowieści marek po design oprogramowania audio, specjalizujemy się w pracy, która nie tylko świetnie wygląda, ale przede wszystkim działa.",
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
          tags: ["WebGL-lite", "Framer Motion", "Opowiadanie"],
          link: "#"
        },
        {
          title: "Parallel Index",
          subtitle: "Produkt danych w filmowej oprawie.",
          tags: ["UI produktu", "Systemy designu", "Wydajność"],
          link: "#"
        },
        {
          title: "Northbound",
          subtitle: "Editorial modowy z responsywnym tempem.",
          tags: ["E-commerce", "Animacja", "Narracja"],
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
