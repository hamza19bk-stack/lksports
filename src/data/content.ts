/**
 * src/data/content.ts — assembles the copy actually rendered by the pages.
 *
 * Base copy (src/data/copy.ts) is deep-merged with the per-site copy in
 * src/data/overrides.ts, so a site only restates what it changes. Interface
 * labels come from src/data/ui.ts and the legal pages from src/data/legal.ts,
 * both of which can also be overridden.
 *
 * Pages import from here and nowhere else.
 */
import { copy, mergeCopy } from './copy';
import { ui as uiBase } from './ui';
import { legalNotice as legalNoticeBase, privacyNotice as privacyNoticeBase, statutoryLine } from './legal';
import { overrides } from './overrides';

const { ui: uiOverride, legalNotice: legalNoticeOverride, privacyNotice: privacyNoticeOverride, ...copyOverride } =
  overrides as Record<string, unknown>;

const merged = mergeCopy(copy, copyOverride);

export const ui = mergeCopy(uiBase, (uiOverride ?? {}) as Record<string, unknown>);

export const home = merged.home;
export const about = merged.about;
export const servicesPage = merged.servicesPage;
export const contact = merged.contact;
export const notFound = merged.notFound;
export const services = merged.services;

export const legal = {
  legalNotice: mergeCopy(legalNoticeBase, (legalNoticeOverride ?? {}) as Record<string, unknown>),
  privacyNotice: mergeCopy(privacyNoticeBase, (privacyNoticeOverride ?? {}) as Record<string, unknown>),
};

export { statutoryLine };
export type { FaqItem, Service, LegalRow, LegalSection, LegalDoc } from './types';
