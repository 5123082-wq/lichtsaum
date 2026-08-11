export const siteConfig = {
  name: "LICHTSAUM",
  language: "de",
  locale: "de_DE",
  workingBrandNotice:
    "LICHTSAUM ist eine Arbeitsmarke. Namens- und Markenfreigabe: TBD.",
  title: "Beleuchteter Markisen-Volant | LICHTSAUM",
  description:
    "Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen in Restaurants und Cafés. Eignung, Umfang und Kosten objektbezogen prüfen lassen.",
  navigation: [
    { href: "/#wirkung", label: "Produkt" },
    { href: "/konfigurator", label: "Konfigurator" },
    { href: "/kontakt", label: "Kontakt" }
  ],
  legal: {
    providerName: "NVKV Werbeagentur Inh. Ivan Novikov",
    brandRelationship:
      "LICHTSAUM ist ein Angebot der NVKV Werbeagentur Inh. Ivan Novikov.",
    street: "Dannenwalder Weg 110",
    postalCode: "13439",
    city: "Berlin",
    country: "Deutschland",
    email: "info@lichtsaum.com",
    phones: [
      { href: "tel:+491605911284", label: "+49 (0) 160 591 12 84" },
      { href: "tel:+493043202390", label: "+49 (0) 30 432 02 390" }
    ],
    vatId: "DE367887602"
  }
} as const;
