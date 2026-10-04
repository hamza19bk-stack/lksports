/**
 * Shared data selectors used by the pages (no copy in this file).
 */
import { site } from '../data/site';
import { ui } from '../data/content';
import type { FaqItem, LegalRow } from '../data/types';
import { isSet, phoneHref } from './utils';

export const brandSet = isSet(site.brand.name);
export const brandName = brandSet ? site.brand.name : ui.brandFallback;

export const hasEmail = isSet(site.contact.email);
export const hasPhone = isSet(site.contact.phone);
export const hasAddress = isSet(site.contact.address);
export const hasArea = isSet(site.contact.area);
export const hasHours = isSet(site.contact.hours);
export const hasResponse = isSet(site.contact.responseTime);
export const hasAnyContact = hasEmail || hasPhone;
export const hasCtaNote = isSet(site.cta.note);
export const telHref = hasPhone ? `tel:${phoneHref(site.contact.phone)}` : '';

export function mailto(subject: string, body: string): string {
  if (!hasEmail) return '';
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Social profiles that actually have a URL. */
export const socialLinks = [
  { key: 'linkedin', label: 'LinkedIn', url: site.social.linkedin },
  { key: 'facebook', label: 'Facebook', url: site.social.facebook },
  { key: 'instagram', label: 'Instagram', url: site.social.instagram },
  { key: 'tiktok', label: 'TikTok', url: site.social.tiktok },
  { key: 'youtube', label: 'YouTube', url: site.social.youtube },
  { key: 'whatsapp', label: 'WhatsApp', url: site.social.whatsapp },
].filter((s) => isSet(s.url));

/* --------------------------------------------------------------- COMPANY ---
 * The public-register block. Only rows with a real value are returned, so a
 * site that has not filled something in simply shows a shorter table — it
 * never shows an empty row or an invented one.
 */
const c = site.company;

export const companyRows: LegalRow[] = [
  { label: ui.recordLabels.legalName, value: c.legalName },
  { label: ui.recordLabels.number, value: c.number },
  { label: ui.recordLabels.placeOfRegistration, value: c.placeOfRegistration },
  { label: ui.recordLabels.registeredOffice, value: c.registeredOffice },
  { label: ui.recordLabels.companyType, value: c.companyType },
  { label: ui.recordLabels.incorporated, value: c.incorporated },
  { label: ui.recordLabels.status, value: c.status },
  { label: ui.recordLabels.director, value: c.director },
  { label: ui.recordLabels.vatNumber, value: c.vatNumber },
].filter((r) => isSet(r.value));

export const sicRows = c.sic.filter((s) => isSet(s.code) && isSet(s.label));
export const hasCompanyRecord = companyRows.length > 0;
export const hasRegisterLink = isSet(c.companiesHouseUrl);
export const hasRecordChecked = isSet(c.recordChecked);

/** The Companies Act 2006 s.82 disclosure line, for the footer. */
export const disclosureParts = [
  isSet(c.legalName) ? c.legalName : '',
  isSet(c.number) && isSet(c.placeOfRegistration)
    ? `Registered in ${c.placeOfRegistration}, company number ${c.number}`
    : isSet(c.number)
      ? `Company number ${c.number}`
      : '',
  isSet(c.registeredOffice) ? `Registered office: ${c.registeredOffice}` : '',
  isSet(c.vatNumber) ? `VAT number ${c.vatNumber}` : '',
].filter(Boolean);

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function visibleFaq(items: FaqItem[]): FaqItem[] {
  return items.filter((i) => isSet(i.q) && isSet(i.a));
}
