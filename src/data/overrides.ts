/**
 * LK Community Sports — lksports.shop
 * LK COMMUNITY SPORTS CIC, company no. 17406255, South Shields.
 * SIC: 93120 Activities of sport clubs.
 *
 * This is a COMMUNITY INTEREST COMPANY, limited by guarantee with no share
 * capital, not an ordinary trading company. It has an asset lock, is overseen
 * by the Regulator of Community Interest Companies, and files a community
 * interest report each year. The site explains that, because it is the single
 * most useful thing a visitor can know about this organisation.
 *
 * NOTE FOR THE CLIENT: no coaching qualification, governing body affiliation,
 * DBS check or insurance is claimed anywhere, because none of it can be
 * verified from here. All of it matters enormously to a parent. Send the real
 * details and they go on the site.
 */

export const overrides: Record<string, unknown> = {
  home: {
    seo: {
      title: 'Community sport in South Shields',
      description:
        'LK Community Sports CIC, a community interest company registered in England and Wales (company no. 17406255). Sport run for the community in South Tyneside.',
    },
    hero: {
      eyebrow: 'Community interest company, South Shields',
      titleLead: 'Sport that belongs',
      titleMark: 'to the people who turn up',
      lead:
        'This is a community interest company, which means the assets and any surplus are locked to community benefit by law, not by good intentions. Nobody takes a dividend out of this.',
      secondaryCta: 'What we run',
      visualLabel: 'A community interest company',
    },
    highlights: {
      eyebrow: 'How a CIC works',
      title: 'What makes this different from a club',
      subtitle: 'Four things a community interest company is committed to by law.',
      items: [
        {
          icon: 'shield',
          title: 'The asset lock',
          text: 'Assets and surpluses are legally locked to community benefit. They cannot be distributed to members for private gain.',
        },
        {
          icon: 'eye',
          title: 'Accountable to a regulator',
          text: 'CICs are overseen by the Regulator of Community Interest Companies and file an annual report on what they actually delivered.',
        },
        {
          icon: 'users',
          title: 'Limited by guarantee',
          text: 'There are no shares and no shareholders. The structure exists to run the activity, not to build value for owners.',
        },
        {
          icon: 'heart',
          title: 'Open to begin with',
          text: 'Sport that assumes no equipment, no experience and no history of being any good at it.',
        },
      ],
    },
    services: {
      eyebrow: 'What we run',
      title: 'Sessions and activity',
      subtitle: 'What the organisation does, and who it is for.',
      moreLabel: 'All activities',
      cardCta: 'Read more',
    },
    process: {
      eyebrow: 'Getting involved',
      title: 'From interested to taking part',
      subtitle: 'Four steps, and none of them require being fit first.',
      steps: [
        {
          title: 'Get in touch',
          text: 'Tell us who it is for and roughly what they are after. No experience assumed, and no wrong answer.',
        },
        {
          title: 'Come and look',
          text: 'Watch a session before committing to anything. Bring whoever needs to feel comfortable about it.',
        },
        {
          title: 'Join in',
          text: 'Start at whatever level you are actually at. The first few sessions are about turning up, not performing.',
        },
        {
          title: 'Keep going',
          text: 'The whole point is that it becomes a normal part of the week rather than a short burst of enthusiasm.',
        },
      ],
    },
    record: {
      eyebrow: 'Organisation details',
      title: 'Who we are, on the record',
      subtitle: 'Registered at Companies House as a community interest company.',
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Common questions',
      subtitle: 'Including the ones parents should always ask.',
      items: [
        {
          q: 'What is a community interest company?',
          a: 'It is a company set up to benefit a community rather than its owners. Ours is limited by guarantee with no share capital, so there are no shares and nobody can take a dividend. It carries an asset lock, meaning assets and surpluses must stay within the organisation or go to another asset-locked body. CICs are overseen by the Regulator of Community Interest Companies and file an annual community interest report describing what they actually did.',
        },
        {
          q: 'What safeguarding and qualifications are in place?',
          a: 'Ask us directly and we will tell you, with the paperwork to look at. We deliberately do not list qualifications, checks or affiliations on this website, because anyone can type those and you have no way to verify them from a web page. Any parent is entitled to ask who is supervising, what checks they hold and what the safeguarding arrangements are, and to get a straight answer before their child takes part.',
        },
        {
          q: 'Does it cost anything?',
          a: 'Get in touch and ask about the specific session. Where a charge exists it covers running costs rather than profit, because the structure does not allow surpluses to be taken out. We will tell you plainly if cost is a barrier, because it should not be the reason someone does not take part.',
        },
        {
          q: 'Do you need to be fit or experienced?',
          a: 'No. That assumption is the single biggest reason people never start. Sessions are built so that someone who has not done anything in years can turn up and not feel out of place.',
        },
        {
          q: 'How new is the organisation?',
          a: 'It was incorporated on 18 August 2026, so it is new and we would rather say so. The company number, registered office and incorporation date are all on the public register, linked below, where you can also confirm the community interest company status.',
        },
      ],
    },
    cta: {
      eyebrow: 'Next step',
      title: 'Thinking about coming along?',
      lead: 'Tell us who it is for and we will tell you what would suit, honestly.',
      secondaryCta: 'Our details',
    },
  },

  about: {
    seo: {
      title: 'About LK Community Sports CIC',
      description:
        'A community interest company for sport, registered in England and Wales and based in South Shields. Registered details as filed at Companies House.',
    },
    hero: {
      eyebrow: 'About',
      titleLead: 'Not a business',
      titleMark: 'with a community angle',
      lead:
        'A community interest company is a legal structure, not a description. The asset lock is enforceable, which is rather the point of choosing it.',
    },
    story: {
      title: 'Why this structure',
      subtitle: 'Good intentions are not a governance arrangement.',
      paragraphs: [
        'Plenty of organisations describe themselves as community focused. A community interest company has to prove it: a community interest statement at incorporation, an asset lock written into the articles, a regulator, and an annual report on what was actually delivered for the community rather than for members.',
        'We chose it because sport attracts both the genuine and the opportunistic, and a parent deciding whether to send their child somewhere deserves something firmer than a nice sentence on a website. Our company number is on this page and you can read the filings yourself.',
        'The activity itself is built on one idea: that most people who would benefit from sport never start, because they assume they need to be fit, equipped or experienced first. Removing that assumption is most of the work.',
      ],
    },
    values: {
      title: 'What we hold to',
      items: [
        { icon: 'shield', title: 'Asset locked', text: 'Surpluses stay in the organisation. Nobody takes a dividend.' },
        { icon: 'eye', title: 'Accountable', text: 'A regulator, and an annual community interest report.' },
        { icon: 'heart', title: 'Open to beginners', text: 'No fitness, equipment or experience assumed.' },
        { icon: 'chat', title: 'Answerable to parents', text: 'Ask about supervision and checks. You will get a direct answer.' },
      ],
    },
    record: {
      eyebrow: 'Public record',
      title: 'Registered details',
      subtitle: 'As filed at Companies House, including the community interest company status.',
    },
    cta: {
      eyebrow: 'Next step',
      title: 'Want to know more first?',
      lead: 'Ask anything, including the awkward questions about who is supervising.',
      secondaryCta: 'What we run',
    },
  },

  servicesPage: {
    seo: {
      title: 'Sessions, youth sport and community activity',
      description:
        'What LK Community Sports CIC runs in South Shields: sport club activity, sessions for young people, beginner sessions and community events.',
    },
    hero: {
      eyebrow: 'What we run',
      titleLead: 'Four kinds of session,',
      titleMark: 'one way in',
      lead: 'Come and watch one before joining anything. That offer is genuine and nobody will push you.',
    },
    quoteNote:
      'Ask us about any session and we will tell you what it involves and what, if anything, it costs. As a community interest company, any surplus stays in the organisation.',
    cta: {
      eyebrow: 'Next step',
      title: 'Come and have a look',
      lead: 'Tell us who it is for and we will point you at the right session.',
      secondaryCta: 'About us',
    },
  },

  contact: {
    seo: {
      title: 'Contact LK Community Sports CIC, South Shields',
      description:
        'Get in touch about taking part, volunteering or supporting the organisation. Registered office: 58 Basil Way, South Shields, NE34 8UD. Company no. 17406255.',
    },
    hero: {
      eyebrow: 'Contact',
      titleLead: 'Tell us who it is for,',
      titleMark: 'and what would put them off',
      lead: 'Knowing the hesitation is more useful than knowing the goal. Most of it we have heard before.',
    },
    helpful: {
      title: 'Useful to include',
      items: [
        'Who it is for, and roughly what age.',
        'Whether they have done anything like it before.',
        'Anything we should know to make them comfortable taking part.',
        'If you are asking about volunteering or supporting us, say so.',
      ],
    },
    channelsTitle: 'How to reach us',
    recordTitle: 'Registered details',
    cta: {
      eyebrow: 'Next step',
      title: 'Ready when you are',
      lead: 'Send a message and we will come back to you.',
      secondaryCta: 'What we run',
    },
  },

  services: [
    {
      id: 'club-sessions',
      icon: 'users',
      title: 'Club sessions',
      summary: 'Regular sport club activity, which is what the organisation is registered to do.',
      points: [
        'Sessions that run to a regular pattern you can build a week around.',
        'Mixed ability, with no assumption about where you are starting.',
        'Come and watch one before joining anything.',
        'Ask about supervision arrangements before taking part.',
      ],
    },
    {
      id: 'young-people',
      icon: 'heart',
      title: 'Sessions for young people',
      summary: 'Activity for children and young people, with parents entitled to ask anything.',
      points: [
        'Parents and carers welcome to stay and watch.',
        'Clear information about who is supervising, on request.',
        'Safeguarding arrangements explained before a child takes part.',
        'Nothing about performance in the first few weeks.',
      ],
    },
    {
      id: 'beginners',
      icon: 'compass',
      title: 'Beginner sessions',
      summary: 'For people who have not done anything in years and assume that disqualifies them.',
      points: [
        'No equipment needed to try it.',
        'Pitched at the person who feels least confident in the room.',
        'Stopping, resting and going at your own pace is normal here.',
        'No pressure to commit to anything on the first visit.',
      ],
    },
    {
      id: 'community',
      icon: 'globe',
      title: 'Community activity',
      summary: 'Working with other local organisations, which is what the structure exists for.',
      points: [
        'Joint activity with schools, groups and other organisations.',
        'Activity shaped by what the area asks for.',
        'Reported on annually in our community interest report.',
        'Volunteers and supporters welcome to get in touch.',
      ],
    },
  ],
};
