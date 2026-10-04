/**
 * src/data/legal.ts — UK legal pages (legal notice + privacy notice).
 *
 * Written for a private limited company registered in England and Wales.
 * Values come from src/data/site.ts; a missing MANDATORY disclosure renders
 * as ui.legalMissing ("(to be completed)") rather than silently disappearing,
 * so the page never pretends to be complete.
 *
 * Statutes referenced, and why:
 *  - Companies Act 2006 s.82 + Companies (Trading Disclosures) Regulations
 *    2008: a limited company must disclose its registered name, company
 *    number, place of registration and registered office on its website.
 *  - Consumer Rights Act 2015 and Consumer Protection from Unfair Trading
 *    Regulations 2008: nothing on the site may mislead, and statutory rights
 *    cannot be excluded.
 *  - UK GDPR and Data Protection Act 2018: the privacy notice below.
 *  - Privacy and Electronic Communications Regulations 2003 (PECR): this
 *    site sets no cookies, so no consent banner is required. If analytics or
 *    embeds are ever added, that section must be rewritten first.
 *
 * This is a careful general-purpose notice, not legal advice. A solicitor
 * should review it before it is relied on, particularly for a regulated
 * activity.
 */
import { site } from './site';
import { ui } from './ui';
import { isSet } from '../lib/utils';
import type { LegalDoc } from './types';

const c = site.company;
const displayName = isSet(site.brand.name) ? site.brand.name : c.legalName;
const sicLine = c.sic.map((s) => `${s.code} — ${s.label}`).join('; ');
const hasContact = isSet(site.contact.email) || isSet(site.contact.phone);
const contactLine = [site.contact.email, site.contact.phone].filter((v) => isSet(v)).join(' · ');

/** The s.82 disclosure, reused in the footer and on both legal pages. */
export const statutoryLine = [
  isSet(c.legalName) ? c.legalName : '',
  isSet(c.number) ? `a company registered in ${c.placeOfRegistration} under number ${c.number}` : '',
  isSet(c.registeredOffice) ? `registered office: ${c.registeredOffice}` : '',
]
  .filter(Boolean)
  .join('. ');

export const legalNotice: LegalDoc = {
  seo: {
    title: 'Legal notice',
    description:
      'Registered company details, website publisher and hosting information, terms of use and governing law.',
  },
  title: 'Legal notice',
  intro:
    'The registered details of the company behind this website, together with the terms on which the site is made available.',
  updated: isSet(site.legal.lastUpdated) ? site.legal.lastUpdated : ui.legalMissing,
  sections: [
    {
      id: 'company',
      title: 'Company information',
      paragraphs: [
        'This website is published by the company named below. The following details are disclosed under section 82 of the Companies Act 2006 and the Companies (Trading Disclosures) Regulations 2008.',
      ],
      rows: [
        { label: ui.recordLabels.legalName, value: c.legalName, required: true },
        { label: ui.recordLabels.number, value: c.number, required: true },
        { label: ui.recordLabels.placeOfRegistration, value: c.placeOfRegistration, required: true },
        { label: ui.recordLabels.registeredOffice, value: c.registeredOffice, required: true },
        { label: ui.recordLabels.companyType, value: c.companyType },
        { label: ui.recordLabels.incorporated, value: c.incorporated },
        { label: ui.recordLabels.sic, value: sicLine },
        { label: ui.recordLabels.vatNumber, value: c.vatNumber },
        { label: 'Public register', value: c.companiesHouseUrl },
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      paragraphs: [
        hasContact
          ? `You can reach the company at: ${contactLine}.`
          : 'Contact details are being finalised and will be published on this page. Until then, written correspondence can be sent to the registered office shown above.',
      ],
    },
    {
      id: 'responsible',
      title: 'Responsibility for content',
      rows: [
        { label: 'Responsible for this website', value: isSet(site.legal.contentOwner) ? site.legal.contentOwner : c.director },
        { label: 'Regulator and registration', value: site.legal.regulator },
      ],
      paragraphs: [
        'Where no regulator is named above, the company does not hold itself out as carrying on any activity that requires authorisation by a UK regulator.',
      ],
    },
    {
      id: 'hosting',
      title: 'Hosting',
      paragraphs: [
        'This website is a set of static files published through GitHub Pages, a service of the host named below. The host provides the infrastructure only and has no involvement in the content of the site.',
      ],
      rows: [
        { label: 'Host', value: site.legal.host.name },
        { label: 'Address', value: site.legal.host.address },
        { label: 'Website', value: site.legal.host.url },
      ],
    },
    {
      id: 'accuracy',
      title: 'Accuracy of the information on this site',
      paragraphs: [
        'The information on this site is published in good faith and is intended to describe, in general terms, the work the company undertakes. It is not an offer, a quotation or a commitment to supply anything on any particular terms.',
        'Nothing here forms a contract. Any work is carried out on the terms actually agreed between the company and the customer, in writing, for that specific job.',
        'We correct errors as soon as we become aware of them. If you think anything on this site is inaccurate or out of date, please tell us so that we can look at it.',
      ],
    },
    {
      id: 'consumers',
      title: 'Your rights as a customer',
      paragraphs: [
        'Nothing on this website limits or excludes your statutory rights. If you deal with the company as a consumer, the Consumer Rights Act 2015 gives you rights in relation to services supplied to you, including that they be carried out with reasonable care and skill, and those rights cannot be signed away.',
        'The company does not make claims on this site about qualifications, accreditations, memberships or past work that it does not hold or has not carried out. Doing so would be a breach of the Consumer Protection from Unfair Trading Regulations 2008.',
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property',
      paragraphs: [
        'The text, layout, design and code of this site belong to the company or are used with permission. You may read, print and share pages for your own use or to discuss the company with someone else. Republishing substantial parts of the site, or using them commercially, requires written permission.',
        'Company names, numbers and registered offices quoted on this site are facts drawn from the public register at Companies House and are not claimed as anyone’s property.',
      ],
    },
    {
      id: 'links',
      title: 'Links to other websites',
      paragraphs: [
        'Where this site links to another website, that site is outside our control. We link to the public register at Companies House so that the company details above can be checked independently. We are not responsible for the content of any external site, and a link is not an endorsement.',
      ],
    },
    {
      id: 'liability',
      title: 'Liability',
      paragraphs: [
        'The company does not exclude or limit its liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be excluded.',
        'Subject to that, the company is not liable for any loss arising from reliance on general information published on this website, as opposed to advice given to you directly about your own circumstances.',
      ],
    },
    {
      id: 'law',
      title: 'Governing law',
      paragraphs: [
        'This notice and your use of this website are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. If you live in Scotland or Northern Ireland, you may also bring proceedings in the courts there.',
      ],
    },
    {
      id: 'complaints',
      title: 'Complaints',
      paragraphs: [
        'If something has gone wrong, tell us first and give us the chance to put it right. We will look into it and reply to you.',
        'If you are not satisfied with our response, you may be able to take the matter to an alternative dispute resolution scheme, or to seek independent advice from Citizens Advice.',
      ],
      links: [{ label: 'Citizens Advice consumer helpline', href: 'https://www.citizensadvice.org.uk/consumer/' }],
    },
  ],
};

export const privacyNotice: LegalDoc = {
  seo: {
    title: 'Privacy notice',
    description:
      'What personal data this company collects, why, how long it is kept, and your rights under the UK GDPR, including the right to complain to the ICO.',
  },
  title: 'Privacy notice',
  intro:
    'This notice explains what personal data the company collects through this website and by email or telephone, what it does with it, and the rights you have under the UK GDPR and the Data Protection Act 2018.',
  updated: isSet(site.legal.lastUpdated) ? site.legal.lastUpdated : ui.legalMissing,
  sections: [
    {
      id: 'controller',
      title: 'Who is responsible for your data',
      paragraphs: [
        'The data controller is the company named below. "Controller" is the term the UK GDPR uses for the organisation that decides how and why personal data is used.',
      ],
      rows: [
        { label: ui.recordLabels.legalName, value: c.legalName, required: true },
        { label: ui.recordLabels.number, value: c.number, required: true },
        { label: ui.recordLabels.registeredOffice, value: c.registeredOffice, required: true },
        { label: 'Contact for data protection', value: site.contact.email, required: true },
      ],
    },
    {
      id: 'no-cookies',
      title: 'Cookies and tracking',
      paragraphs: [
        'This website sets no cookies. It contains no analytics, no advertising tags, no social media pixels and no third-party embeds. Nothing is stored on your device by this site and your visit is not profiled.',
        'Because nothing but strictly necessary technical processing takes place, no consent banner is required under the Privacy and Electronic Communications Regulations 2003. If analytics or embedded content were ever added, this notice would be updated and consent sought first.',
      ],
    },
    {
      id: 'what',
      title: 'What data we collect, and why',
      paragraphs: [
        'We only hold what you choose to send us, plus the technical records our host keeps automatically.',
      ],
      list: [
        'Enquiries: if you email or telephone us, we hold your name, your contact details and whatever you tell us about what you need. The lawful basis is legitimate interests (UK GDPR Article 6(1)(f)): we cannot answer an enquiry without keeping it long enough to reply.',
        'Quotes and work: if we quote for or carry out work, we hold the records needed to do the job and to invoice it. The lawful basis is performance of a contract (Article 6(1)(b)), and legal obligation (Article 6(1)(c)) for the accounting records we must keep.',
        'Server logs: our host records the IP address and basic technical details of requests to the site, as part of operating and securing it. We do not use these logs to identify visitors.',
      ],
    },
    {
      id: 'special',
      title: 'Data we do not want',
      paragraphs: [
        'Please do not send us health information, information about your beliefs, or other special category data under Article 9 of the UK GDPR unless we have specifically asked for it and explained why. If you send it anyway, we will delete it once we have dealt with your enquiry.',
      ],
    },
    {
      id: 'sharing',
      title: 'Who we share it with',
      paragraphs: [
        'We do not sell personal data, and we do not share it for marketing. It is shared only where it is needed to run the business:',
      ],
      list: [
        'Our hosting provider, GitHub, Inc., which serves the pages of this site and keeps the technical logs described above.',
        'Our email provider, which transmits and stores messages you send us.',
        'Our accountant and HM Revenue & Customs, for invoices and accounting records.',
        'Professional advisers, insurers or a court, where we are required or legally entitled to disclose something.',
      ],
    },
    {
      id: 'transfers',
      title: 'Transfers outside the UK',
      paragraphs: [
        'Our hosting provider is based in the United States, so technical data about requests to this site is processed there. Transfers of that kind are covered by the safeguards the UK GDPR requires, such as the International Data Transfer Agreement or the UK Addendum to the EU standard contractual clauses, together with the UK extension to the EU-US Data Privacy Framework where the provider participates in it.',
      ],
    },
    {
      id: 'retention',
      title: 'How long we keep it',
      list: [
        'Enquiries that do not lead to work: up to twelve months, then deleted.',
        'Quotes, contracts and job records: six years after the work ends, matching the limitation period for contract claims under the Limitation Act 1980.',
        'Accounting records and invoices: six years after the end of the accounting period, as required by HM Revenue & Customs and the Companies Act 2006.',
        'Server logs: for the period our host retains them, which is short and set by the host.',
      ],
    },
    {
      id: 'security',
      title: 'How it is kept safe',
      paragraphs: [
        'This site is served over HTTPS. Access to email and business records is limited to the people who need it, and devices are protected by passwords and device encryption. No system is perfectly secure, but we take the care the UK GDPR requires, and we would tell you and the ICO about a breach that put your rights at risk, within 72 hours where the law requires it.',
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      paragraphs: ['Under the UK GDPR you have the right to:'],
      list: [
        'be told what we hold about you and get a copy of it (a subject access request);',
        'have inaccurate data corrected;',
        'have data erased, where we no longer have a reason to keep it;',
        'restrict how we use it while a dispute about it is resolved;',
        'object to processing we carry out on the basis of legitimate interests;',
        'receive data you gave us in a portable form, where that right applies;',
        'withdraw consent at any time, where we relied on consent.',
      ],
      link: {
        before: 'To exercise any of these, contact us using the details on the',
        label: 'contact page',
        href: '/contact',
      },
    },
    {
      id: 'response',
      title: 'How we handle a request',
      paragraphs: [
        'We respond within one month. If a request is complex we may extend that by a further two months, and we will tell you if so. There is no charge, unless a request is excessive or repetitive. We may need to confirm who you are before releasing personal data.',
      ],
    },
    {
      id: 'automated',
      title: 'Automated decisions and profiling',
      paragraphs: [
        'We do not make decisions about you by automated means, and we do not profile visitors to this site.',
      ],
    },
    {
      id: 'complaints',
      title: 'Complaining to the regulator',
      paragraphs: [
        'If you are unhappy with how we have handled your personal data, please tell us first so we can try to put it right. You also have the right to complain to the Information Commissioner’s Office, the UK data protection regulator, at any time. Complaining to the ICO is free.',
      ],
      rows: [
        { label: 'Information Commissioner’s Office', value: 'Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF' },
        { label: 'Helpline', value: '0303 123 1113' },
        { label: 'Website', value: 'https://ico.org.uk/make-a-complaint/' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this notice',
      paragraphs: [
        'If what we do with personal data changes, we update this page and change the date at the top. Material changes affecting people we already hold data about will be notified to them directly.',
      ],
    },
  ],
};

export const legal = { legalNotice, privacyNotice };
