/**
 * src/data/ui.ts — interface labels (not page copy).
 *
 * Anything a visitor reads that is NOT page content lives here: navigation
 * labels, screen-reader text, footer headings, legal page furniture.
 * Page copy is in src/data/copy.ts and src/data/overrides.ts.
 */

export const ui = {
  /** Shown in place of the logo while site.brand.name is empty. */
  brandFallback: 'This company',

  // Navigation and skip link
  skipLink: 'Skip to main content',
  navLabel: 'Main navigation',
  homeLink: 'home page',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',

  // Footer
  footerNavTitle: 'Pages',
  footerContactTitle: 'Contact',
  footerCompanyTitle: 'Company details',
  footerLegalLabel: 'Legal pages',
  socialLabel: 'Social profiles',
  newWindow: '(opens in a new window)',
  rights: 'All rights reserved.',

  // Company record block
  recordLabels: {
    legalName: 'Registered name',
    number: 'Company number',
    placeOfRegistration: 'Registered in',
    registeredOffice: 'Registered office',
    incorporated: 'Incorporated',
    companyType: 'Company type',
    status: 'Register status',
    director: 'Director',
    sic: 'Nature of business (SIC)',
    vatNumber: 'VAT number',
  },
  recordSourceBefore: 'Every detail above is taken from the public register and can be checked on',
  recordSourceLink: 'the Companies House record',
  recordCheckedBefore: 'Checked against the register on',

  // Contact
  emailLabel: 'Email',
  phoneLabel: 'Telephone',
  addressLabel: 'Address',
  officeLabel: 'Registered office',
  areaLabel: 'Area served',
  hoursLabel: 'Opening hours',
  responseLabel: 'Response time',

  // FAQ
  faqMore: 'Not covered here?',
  faqMoreLink: 'Ask us directly',

  // Legal pages
  updatedLabel: 'Last updated:',
  legalMissing: '(to be completed)',

  // Misc
  stepPrefix: (n: number) => `Step ${n}: `,
  servicesAnchorAria: (title: string) => `Read more about ${title}`,
};

export type Ui = typeof ui;
