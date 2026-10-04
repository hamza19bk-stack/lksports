/** Shared content types — src/data/types.ts */

export interface FaqItem {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  summary: string;
  /** Bullet points shown on /services. */
  points: string[];
}

export interface LegalRow {
  label: string;
  value: string;
  /** A required row prints ui.legalMissing when the value is empty. */
  required?: boolean;
}

export interface LegalSection {
  id?: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  rows?: LegalRow[];
  links?: { label: string; href: string }[];
  link?: { before: string; label: string; href: string };
}

export interface LegalDoc {
  seo: { title: string; description: string };
  title: string;
  intro?: string;
  updated?: string;
  sections: LegalSection[];
}
