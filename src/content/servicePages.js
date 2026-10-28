// Content for service pages. Each entry becomes a real, prerendered page at its path.
// Wording follows the client's previous site; items marked REVIEW need the owner's sign-off before launch.
//
// To add a page: add an entry here. The route, <title>/meta tags, JSON-LD, sitemap entry and footer link
// are all derived from this list.

export const SITE = 'https://northwestsiding.com'

export const servicePages = [
  {
    path: '/siding/fiber-cement-siding',
    title: 'Fiber Cement Siding in Eugene, OR | James Hardie Installer | Northwest Siding',
    description:
      "James Hardie fiber cement siding installed in Eugene-Springfield by the area's Exclusive Preferred Remodeler. Durable, fire- and pest-resistant. Free estimates.",
    breadcrumb: ['Siding', 'Fiber Cement Siding'],
    serviceName: 'Fiber Cement Siding Installation (James Hardie)',
    city: 'Eugene',
    h1: 'Fiber Cement Siding in Eugene, OR',
    kicker: 'James Hardie® Exclusive Preferred Remodeler',
    intro: [
      'Northwest Siding is the Exclusive Preferred Remodeler of James Hardie® fiber cement siding for the Eugene-Springfield area. Since 1999 we have helped homeowners protect and beautify their exteriors, and James Hardie fiber cement siding is one of the best choices we install.',
      'We install HardiePlank®, HardieShingle® and HardiePanel® products to factory specification, so your siding comes with the manufacturer warranty to match.',
    ],
    benefitsTitle: 'Benefits of James Hardie fiber cement siding',
    benefits: [
      ['Durability', 'Resistant to moisture, rot and warping, so it keeps its integrity and appearance in all weather.'], // REVIEW
      ['Fire resistance', 'Made from non-combustible materials, an excellent choice for fire protection.'], // REVIEW
      ['Pest resistance', "Unlike wood, fiber cement doesn't attract termites or woodpeckers, reducing maintenance and repair costs."], // REVIEW
      ['Longevity', 'With a lifespan that can exceed 30 years, it is an investment that pays off over time.'], // REVIEW
      ['Style and color', 'Available in a wide range of colors and styles to suit any home and enhance curb appeal.'],
      ['Built for the climate', 'Engineered for specific climate conditions for lasting performance.'], // REVIEW
    ],
    products: ['HardiePlank® lap siding', 'HardieShingle® siding', 'HardiePanel® vertical siding'],
    whyTitle: 'Why homeowners choose Northwest Siding',
    why: [
      "Exclusive Preferred Remodeler of James Hardie products for Eugene-Springfield.",
      'Installed to factory specification, with the manufacturer warranty.',
      'A 3-year workmanship warranty on our work.',
      'Licensed, bonded and insured. Oregon CCB #136733.',
      'More than 25 years in business and over 2,000 homes completed.',
    ],
    faqs: [
      ['Do you install James Hardie fiber cement siding in Eugene?', "Yes. We are James Hardie's Exclusive Preferred Remodeler for Eugene-Springfield and install HardiePlank, HardieShingle and HardiePanel siding."],
      ['Is the siding covered by a warranty?', 'James Hardie products carry the manufacturer warranty when installed to factory specification, and we back our own work with a 3-year workmanship warranty.'],
      ['How do I get an estimate?', 'Estimates are free. Send the form below or call (541) 688-2997. We respond within one business day.'],
    ],
  },
]

export const pageByPath = Object.fromEntries(servicePages.map((p) => [p.path, p]))
