/**
 * src/data/copy.ts — BASE PAGE COPY (file 2 of 3 to edit for a new site)
 *
 * Sector-neutral English copy that makes a site readable before any
 * per-site wording is added. Each site then overrides what it needs in
 * src/data/overrides.ts, which is deep-merged over this: objects merge key by
 * key, but AN ARRAY REPLACES THE BASE ARRAY WHOLE. So to change one of four
 * cards you restate all four — deliberately, because index-merging silently
 * leaves base copy behind in the slots you did not restate.
 *
 * WHAT MUST NEVER GO IN HERE OR IN AN OVERRIDE
 *  - numbers nobody can verify (years in business, jobs completed, ratings);
 *  - accreditations, memberships or awards the company does not hold;
 *  - testimonials, reviews or named clients that were not actually given;
 *  - guarantees, warranties or prices that have not been agreed.
 * `npm run check` blocks the obvious cases, but it cannot read minds:
 * everything written here is the company's own responsibility.
 */
import type { FaqItem, Service } from './types';

export const copy = {
  // --------------------------------------------------------------- HOME PAGE
  home: {
    seo: {
      title: 'Registered UK company',
      description:
        'A limited company registered in England and Wales. Company details, what we do and how to get in touch.',
    },
    hero: {
      eyebrow: 'Registered UK company',
      titleLead: 'Straight answers,',
      titleMark: 'work done properly',
      lead:
        'A limited company registered in England and Wales. Tell us what you need and you will get a clear answer about whether we can help, what it involves and what happens next.',
      secondaryCta: 'See what we do',
      visualLabel: 'On the public record',
    },
    highlights: {
      eyebrow: 'How we work',
      title: 'Four things you can expect',
      subtitle: 'The basics that make a job run smoothly for everyone involved.',
      items: [
        {
          icon: 'check-doc',
          title: 'A clear scope',
          text: 'Before anything starts, we agree in writing what is included and what is not, so there are no assumptions on either side.',
        },
        {
          icon: 'chat',
          title: 'One point of contact',
          text: 'You deal with the same person throughout. Questions get answered rather than passed around.',
        },
        {
          icon: 'clock',
          title: 'Realistic timings',
          text: 'We would rather give you a date we can keep than an optimistic one that slips.',
        },
        {
          icon: 'shield',
          title: 'Everything on record',
          text: 'Our company number, registered office and filing history are public. You can check who you are dealing with before you commit.',
        },
      ],
    },
    services: {
      eyebrow: 'What we do',
      title: 'Our services',
      subtitle: 'The work we take on, and what each piece involves.',
      moreLabel: 'All services',
      cardCta: 'Read more',
    },
    process: {
      eyebrow: 'The process',
      title: 'From first enquiry to finished job',
      subtitle: 'Four steps, so you know what to expect at each stage.',
      steps: [
        {
          title: 'Get in touch',
          text: 'Tell us what you need, in as much or as little detail as you have. We will say honestly whether it is something we do.',
        },
        {
          title: 'Scope and quote',
          text: 'We work out exactly what is involved and put it in writing, with the price and the timescale.',
        },
        {
          title: 'The work',
          text: 'Once you are happy with the quote, we schedule it and keep you updated as it progresses.',
        },
        {
          title: 'Sign-off',
          text: 'We check the result with you, deal with anything outstanding, and invoice only what was agreed.',
        },
      ],
    },
    record: {
      eyebrow: 'Company details',
      title: 'Who you are dealing with',
      subtitle: 'Taken from the public register, so you can verify it independently.',
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Common questions',
      subtitle: 'The things people usually ask before getting in touch.',
      items: [
        {
          q: 'Are you a registered company?',
          a: 'Yes. We are a limited company registered in England and Wales. Our registered name, company number and registered office are published on this site and on the public register at Companies House, where you can check them for yourself.',
        },
        {
          q: 'How do I get a price?',
          a: 'Get in touch with a description of what you need. If it is something we do, we will come back with a written quote setting out the scope, the price and the timescale. We do not start work before you have accepted it.',
        },
        {
          q: 'How quickly do you reply?',
          a: 'As soon as we reasonably can during working hours. If something is urgent, say so in your first message and we will tell you straight away whether we can fit it in.',
        },
        {
          q: 'What happens if something is not right?',
          a: 'Tell us. We would always rather hear about a problem early and put it right than find out later. Your legal rights as a customer are unaffected by anything on this site.',
        },
      ] as FaqItem[],
    },
    cta: {
      eyebrow: 'Next step',
      title: 'Tell us what you need',
      lead: 'A short message is enough to start. We will tell you whether we can help and what it would involve.',
      secondaryCta: 'Company details',
    },
  },

  // -------------------------------------------------------------- ABOUT PAGE
  about: {
    seo: {
      title: 'About the company',
      description: 'Who we are, how we work, and the registered company details behind the name.',
    },
    hero: {
      eyebrow: 'About',
      titleLead: 'A registered company,',
      titleMark: 'not just a website',
      lead:
        'Anyone can put up a website. Fewer publish the company number next to it. Ours is below, along with everything else on the public record.',
    },
    story: {
      title: 'How we work',
      subtitle: 'Nothing unusual, just done consistently.',
      paragraphs: [
        'We take on work we know we can do well, say so plainly when something falls outside that, and put the scope in writing before we start. Most problems on a job come from an assumption nobody said out loud, so we try to say things out loud.',
        'You deal with the same person from the first enquiry to the final invoice. If a date is going to move, you hear it from us rather than noticing it yourself.',
      ],
    },
    values: {
      title: 'What we hold to',
      items: [
        { icon: 'check-doc', title: 'Written down', text: 'Scope, price and timescale agreed in writing before work starts.' },
        { icon: 'eye', title: 'Verifiable', text: 'Our company details are public, and we point you towards them rather than away.' },
        { icon: 'chat', title: 'Reachable', text: 'A real person answers, and you keep the same contact throughout.' },
        { icon: 'shield', title: 'Accountable', text: 'If something is wrong, we put it right. Your statutory rights always stand.' },
      ],
    },
    record: {
      eyebrow: 'Public record',
      title: 'Registered company details',
      subtitle: 'As filed at Companies House.',
    },
    cta: {
      eyebrow: 'Next step',
      title: 'Any questions about the company?',
      lead: 'Ask us anything you would want to know before working with a company for the first time.',
      secondaryCta: 'What we do',
    },
  },

  // ----------------------------------------------------------- SERVICES PAGE
  servicesPage: {
    seo: {
      title: 'Services',
      description: 'The work we take on, what each service involves and how to request a quote.',
    },
    hero: {
      eyebrow: 'Services',
      titleLead: 'What we do,',
      titleMark: 'and what it involves',
      lead:
        'Each service below sets out what is included. If what you need is not listed, ask anyway and we will tell you honestly whether it is something we handle.',
    },
    quoteNote: 'Everything is quoted for the specific job. Nothing on this page is a fixed price or a binding offer.',
    cta: {
      eyebrow: 'Next step',
      title: 'Need a price?',
      lead: 'Describe the job and we will put a written quote together, with the scope and timescale set out.',
      secondaryCta: 'About the company',
    },
  },

  // ------------------------------------------------------------ CONTACT PAGE
  contact: {
    seo: {
      title: 'Contact',
      description: 'How to reach the company, where it is registered, and what to include in your first message.',
    },
    hero: {
      eyebrow: 'Contact',
      titleLead: 'Get in touch',
      titleMark: 'and tell us what you need',
      lead: 'The more you can tell us at the start, the more useful our first reply will be.',
    },
    helpful: {
      title: 'Useful to include',
      items: [
        'What you need doing, in plain terms.',
        'Where it is, and whether access is straightforward.',
        'When you would like it done, and whether that date is fixed.',
        'Anything already agreed, quoted or started by someone else.',
      ],
    },
    channelsTitle: 'How to reach us',
    recordTitle: 'Registered company details',
    noContactNote: 'Contact details are being finalised and will be published on this page.',
    cta: {
      eyebrow: 'Next step',
      title: 'Ready when you are',
      lead: 'Send the details over and we will come back to you.',
      secondaryCta: 'What we do',
    },
  },

  // ---------------------------------------------------------------- 404 PAGE
  notFound: {
    seo: { title: 'Page not found', description: 'This page does not exist or has moved.' },
    eyebrow: 'Error 404',
    titleLead: 'That page',
    titleMark: 'is not here',
    lead: 'The address may be mistyped, or the page may have moved. The home page will get you back on track.',
    cta: 'Back to the home page',
  },

  // ----------------------------------------------------------------- SERVICES
  services: [
    {
      id: 'enquiries',
      icon: 'chat',
      title: 'Enquiries and advice',
      summary: 'A straight answer on whether we can help, before either of us spends time on it.',
      points: [
        'An honest yes or no on whether the work is something we do.',
        'A rough idea of what is involved, if it is.',
        'A pointer elsewhere if it is not.',
      ],
    },
    {
      id: 'quotes',
      icon: 'check-doc',
      title: 'Written quotes',
      summary: 'Scope, price and timescale set out in writing before anything begins.',
      points: [
        'What is included, and what is explicitly not.',
        'The price, and what would change it.',
        'When the work would start and how long it should take.',
      ],
    },
    {
      id: 'delivery',
      icon: 'clipboard',
      title: 'Carrying out the work',
      summary: 'The job itself, done to the scope agreed, with updates as it goes.',
      points: [
        'The same point of contact throughout.',
        'Notice as early as we have it if a date needs to move.',
        'Nothing added to the invoice that was not agreed first.',
      ],
    },
  ] as Service[],
};

export type Copy = typeof copy;

/**
 * Deep-merges `extra` over `base`. Plain objects merge key by key; an array in
 * `extra` REPLACES the base array entirely; anything else replaces. Functions
 * are preserved from the base when `extra` does not mention them.
 *
 * Arrays replace rather than merge by index on purpose: a partial array
 * override would quietly keep base copy in the slots it did not restate, which
 * is exactly the kind of mistake that reaches production unnoticed.
 */
export function mergeCopy<A extends Record<string, unknown>>(base: A, extra: Record<string, unknown>): A {
  const isPlain = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v) && typeof v !== 'function';

  const merge = (a: unknown, b: unknown): unknown => {
    if (b === undefined) return a;
    if (isPlain(a) && isPlain(b)) {
      const out: Record<string, unknown> = { ...a };
      for (const key of Object.keys(b)) out[key] = merge(a[key], b[key]);
      return out;
    }
    return b;
  };

  return merge(base, extra) as A;
}
