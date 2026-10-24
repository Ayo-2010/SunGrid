import type { Article } from '#shared/types'

/**
 * Demonstration editorial content. Written as general guidance for a
 * Nigerian audience. It is not a substitute for a site-specific design.
 */
export const articles: Article[] = [
  {
    slug: 'sizing-a-solar-inverter',
    title: 'How to size a solar inverter for a Nigerian home',
    category: 'Inverters & batteries',
    excerpt:
      'Inverter size is not the same as solar panel size or battery size. Here is the load-first way to choose one.',
    readingTime: 7,
    date: '2026-03-18',
    author: 'SunGrid Engineering Desk',
    image: '/images/install-detail.jpg',
    imageAlt: 'Close-up of hands installing solar panels',
    sections: [
      {
        paragraphs: [
          'Many buyers start with an inverter wattage because it is the most visible number in an advert. A better starting point is the list of appliances you need to run at the same time, and which of those must keep running when the grid is out.',
          'Inverter capacity has two jobs: carry continuous load, and survive short start-up surges. A 1.5 HP air conditioner may draw roughly 1.1–1.3 kW while running but can demand several times that for a moment when the compressor starts. A pump can behave similarly.',
        ],
      },
      {
        heading: '1. Build a load schedule',
        paragraphs: [
          'List each appliance with its wattage, quantity and the hours it typically runs. Use the rating plate or a plug-in energy meter where possible; label values and online calculators are often optimistic.',
        ],
        bullets: [
          'Separate essential loads (lighting, fridge, fans, internet, security) from optional loads (air conditioning, iron, water heater).',
          'Note which appliances have motors or compressors and may surge on start-up.',
          'Record whether loads run during the day, at night, or both.',
        ],
      },
      {
        heading: '2. Calculate continuous and peak demand',
        paragraphs: [
          'Add the running watts of the appliances you expect to use together. That total, plus a sensible margin, sets the minimum continuous inverter rating. Then consider the largest surge: if a pump or compressor starts while other loads are running, the inverter must ride through it.',
          'A common mistake is to size the inverter for every appliance in the house at once. In practice, not everything runs simultaneously — but the system design must document the assumed diversity.',
        ],
      },
      {
        heading: '3. Match the battery architecture',
        paragraphs: [
          'A 48 V battery system is typical for larger homes and makes more efficient use of cabling at higher power. Smaller 24 V systems can be appropriate for modest loads, but they draw higher currents and leave less room to expand.',
          'Check that the inverter communicates with the chosen battery BMS, and that the battery can deliver the inverter’s peak power. A large inverter paired with a small battery may shut down under surge even when the battery has energy left.',
        ],
      },
      {
        heading: '4. Do not forget the array',
        paragraphs: [
          'The inverter’s maximum PV input is a limit, not a target. String voltage must stay inside the MPPT window across temperature, and the array should be sized for the energy you actually need — not simply filled to the inverter’s maximum.',
          'Final sizing should be confirmed on site by a competent installer who has inspected the distribution board, earthing, cable routes and roof.',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'solar-installation-cost-nigeria',
    title: 'What drives the cost of a solar installation in Nigeria?',
    category: 'Installation costs',
    excerpt:
      'Two quotes for the “same” system can differ by millions of naira. These are the variables worth comparing.',
    readingTime: 6,
    date: '2026-02-27',
    author: 'SunGrid Engineering Desk',
    image: '/images/system-design.jpg',
    imageAlt: 'Engineer drafting a solar system design',
    sections: [
      {
        paragraphs: [
          'Solar pricing is rarely a single number per kilowatt. Equipment choice, battery autonomy, roof conditions and the state of the existing electrical installation can all change the scope substantially.',
          'A quotation that looks cheaper may exclude protection, mounting, earthing, cable runs or commissioning. Comparing only the inverter and panel price can be misleading.',
        ],
      },
      {
        heading: 'The main cost drivers',
        bullets: [
          'Battery chemistry and capacity: storage is often the largest single line item.',
          'Inverter architecture: hybrid, off-grid and three-phase units differ in cost and capability.',
          'Module choice: higher-output panels can reduce mounting and labour per kWp, but cost more per panel.',
          'Roof or ground-mount works: access, waterproofing, scaffolding and structural reinforcement.',
          'Cable runs and distribution: distance from the array to the plant room, and whether a backup board is required.',
          'Protection and earthing: surge devices, isolators, breakers and an earth electrode system.',
          'Generator integration: changeover, controls and whether the existing generator is suitable.',
          'Location and logistics: transport, accommodation and mobilisation outside the main service cities.',
        ],
      },
      {
        heading: 'Why a site visit matters',
        paragraphs: [
          'A site assessment confirms what a photo cannot: roof framing, cable routes, available plant space, earthing condition and the real distribution board layout. It also lets the installer measure or log loads instead of relying on a wish list.',
          'For straightforward residential systems, a preliminary estimate can be prepared remotely from a load schedule. It should be clearly labelled as preliminary until the site is seen.',
        ],
      },
      {
        heading: 'How to compare quotations',
        bullets: [
          'Check whether installation, transport, protection and commissioning are included.',
          'Compare battery usable capacity and warranty terms, not just nominal kWh.',
          'Ask for the inverter and battery models, and confirm they are compatible.',
          'Confirm what happens after commissioning: monitoring, handover and warranty support.',
          'Be cautious of guaranteed savings percentages without a measured baseline.',
        ],
      },
      {
        heading: 'Budgeting responsibly',
        paragraphs: [
          'It is usually better to install a correctly sized essential-load system than to spread a small budget across a whole-house design that cannot perform. Plan conduit and space for future expansion, and revisit storage when budget allows.',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'lithium-vs-lead-acid',
    title: 'Lithium vs lead-acid batteries: an honest comparison',
    category: 'Inverters & batteries',
    excerpt:
      'Lithium is not automatically the right choice for every budget, but the comparison is not as simple as price per battery.',
    readingTime: 8,
    date: '2026-02-10',
    author: 'SunGrid Engineering Desk',
    image: '/images/repair-bench.jpg',
    imageAlt: 'Electronics workbench with testing equipment',
    sections: [
      {
        paragraphs: [
          'Lead-acid batteries still appear in many Nigerian solar installations because they are familiar and cheaper upfront. Lithium iron phosphate (LiFePO₄) packs cost more initially but offer more usable energy and different maintenance requirements.',
          'The right choice depends on budget, expected daily cycling, available space, maintenance capability and the inverter’s supported battery types.',
        ],
      },
      {
        heading: 'Usable capacity is the key number',
        paragraphs: [
          'A 200 Ah, 48 V lead-acid bank has a nominal 9.6 kWh, but regularly discharging it to 50% leaves about 4.8 kWh usable if you want reasonable service life. A 5.12 kWh lithium pack may allow around 90% depth of discharge, giving roughly 4.6 kWh usable in a much smaller package.',
          'Comparing nominal kWh alone can therefore make lead-acid look cheaper than it is in practice.',
        ],
      },
      {
        heading: 'Where lead-acid can still make sense',
        bullets: [
          'Very tight upfront budgets with modest daily use',
          'Sites where maintenance staff can check electrolyte and terminals',
          'Temporary or low-cycle applications',
          'Installations where ventilation and spill containment are already available',
        ],
      },
      {
        heading: 'Where lithium is usually preferable',
        bullets: [
          'Daily cycling in a home or business',
          'Limited plant-room space or wall-mounting requirements',
          'Sites where routine watering is unrealistic',
          'Systems that need BMS communication and remote monitoring',
          'Longer planned service life with predictable capacity',
        ],
      },
      {
        heading: 'Do not ignore temperature and compatibility',
        paragraphs: [
          'Lithium batteries dislike sustained heat. A poorly ventilated room or direct sun on the enclosure can shorten life regardless of the chemistry’s cycle rating. Lead-acid needs ventilation for a different reason: charging produces hydrogen.',
          'Always confirm the inverter’s supported battery list and BMS protocol. Mixing old and new batteries, or different models in one bank, can cause imbalance and premature failure.',
        ],
      },
      {
        heading: 'A note on warranties',
        paragraphs: [
          'Battery warranties often have conditions: approved inverter pairing, commissioning records, temperature limits and cycle counts. Read them before purchase, and keep the documentation. A long warranty is only useful if the conditions are met.',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'how-many-solar-panels',
    title: 'How many solar panels does a home need?',
    category: 'Buying guides',
    excerpt:
      'Panel count depends on daily energy, sunshine, system losses and the roof — not on the inverter label alone.',
    readingTime: 5,
    date: '2026-01-22',
    author: 'SunGrid Engineering Desk',
    image: '/images/rooftop-panels.jpg',
    imageAlt: 'Solar panels mounted on a rooftop',
    sections: [
      {
        paragraphs: [
          'The number of panels is one of the last things to calculate, not the first. Start with daily energy use in kilowatt-hours (kWh), then allow for system losses and the solar resource at the site.',
        ],
      },
      {
        heading: 'A simple planning calculation',
        paragraphs: [
          'Daily energy (kWh) = appliance watts × quantity × hours used ÷ 1,000.',
          'A rough array size can be estimated as daily energy ÷ (peak sun hours × system efficiency). In much of Nigeria, 4–5 peak sun hours is a reasonable starting assumption for planning, but actual yield varies with season, orientation, shading and soiling.',
          'For example, 8 kWh per day with 4.5 sun hours and 75% system efficiency gives roughly 2.4 kWp. At 550 Wp per panel, that is about five panels — before checking roof space and battery charging needs.',
        ],
      },
      {
        heading: 'Why the estimate is only a starting point',
        bullets: [
          'Panel orientation and tilt affect output; a flat roof with panels facing the wrong way will underperform.',
          'Shading from trees, tanks or neighbouring buildings can disproportionately affect a string.',
          'High temperatures reduce module output compared with laboratory ratings.',
          'Dust and soiling reduce yield until panels are cleaned.',
          'Battery charging may need a larger array than the daytime load alone suggests.',
        ],
      },
      {
        heading: 'Roof practicalities',
        paragraphs: [
          'A 550 Wp panel is roughly 2.3 m by 1.13 m. Allow maintenance access, edge clearance and space for mounting hardware. Roof condition matters too: installing on a roof that needs replacement soon is false economy.',
          'If roof space is limited, higher-output modules help, but they must still respect inverter voltage limits and mounting requirements.',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'solar-maintenance-checklist',
    title: 'A practical solar maintenance checklist',
    category: 'Maintenance',
    excerpt:
      'Most underperforming systems are not “broken” — they are dirty, shaded, or poorly configured. Here is what to check.',
    readingTime: 6,
    date: '2026-01-09',
    author: 'SunGrid Engineering Desk',
    image: '/images/electrician.jpg',
    imageAlt: 'Technician working on an electrical installation',
    sections: [
      {
        paragraphs: [
          'Solar systems have few moving parts, but they still need attention. A simple monthly and annual routine helps catch small issues before they become expensive ones.',
        ],
      },
      {
        heading: 'Monthly checks (owner-safe)',
        bullets: [
          'Look at the inverter display or app for error codes or a sudden drop in generation.',
          'Check that panels are free of leaves, bird droppings and heavy dust — clean with soft tools and water, never abrasives.',
          'Confirm the battery is reaching a reasonable state of charge and is not frequently hitting low-voltage cutoff.',
          'Keep the plant room ventilated and clear of stored items.',
          'Record the generation figure if monitoring is available, so trends are visible.',
        ],
      },
      {
        heading: 'Annual checks (competent technician)',
        bullets: [
          'Torque and inspect DC and AC terminations for heat damage or looseness.',
          'Test surge protection devices and replace if indicated.',
          'Check earthing continuity and the condition of the earth electrode.',
          'Inspect mounting fixings, roof penetrations and waterproofing.',
          'Review inverter settings against the current battery and load profile.',
          'Measure string voltages and currents to identify underperforming modules.',
          'Check battery health and firmware, where supported.',
        ],
      },
      {
        heading: 'Warning signs that need prompt attention',
        bullets: [
          'Burning smells, discoloured cable insulation or a hot distribution board',
          'Persistent inverter faults after a reset',
          'Battery swelling, leaking or unusual heat',
          'A sudden generation drop that cleaning does not fix',
          'Water ingress around roof mounts',
        ],
      },
      {
        heading: 'Keep a simple log',
        paragraphs: [
          'A notebook or spreadsheet with dates, generation readings, faults and service visits is valuable. It helps a technician diagnose issues and supports any warranty claim. Do not open inverter or battery enclosures yourself — DC and stored energy can be dangerous even after isolation.',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'grid-tied-off-grid-hybrid',
    title: 'Grid-tied, off-grid or hybrid: choosing the right architecture',
    category: 'Buying guides',
    excerpt:
      'The three system types solve different problems. Choosing the wrong one is an expensive mistake.',
    readingTime: 6,
    date: '2025-12-14',
    author: 'SunGrid Engineering Desk',
    image: '/images/solar-install.jpg',
    imageAlt: 'Solar array installed on open ground',
    sections: [
      {
        paragraphs: [
          '“Solar system” describes a family of designs. The architecture determines whether you have power during an outage, how much battery you need, and how the system interacts with the grid.',
        ],
      },
      {
        heading: 'Grid-tied',
        paragraphs: [
          'A grid-tied inverter converts solar DC to AC and synchronises with the grid. It reduces daytime consumption and is the lowest-cost architecture per kWp because there is no battery.',
          'It shuts down during a grid outage for safety unless it has a special backup capability. It suits premises with stable supply and daytime loads, such as offices or cold stores.',
        ],
      },
      {
        heading: 'Off-grid',
        paragraphs: [
          'An off-grid system supplies all loads independently. The array and battery must cover overnight use and cloudy periods, often with generator backup for critical sites.',
          'This is usually the most expensive way to deliver a given amount of energy because autonomy requirements increase battery size. It is appropriate where there is no realistic grid connection.',
        ],
      },
      {
        heading: 'Hybrid',
        paragraphs: [
          'A hybrid inverter can use solar, battery and grid, and can provide backup to selected circuits. It is the common choice for homes and businesses that want both savings and resilience.',
          'Hybrid does not mean “whole house automatically”. Backup output is limited by the inverter and the backup distribution board. Loads such as air conditioning may need to be excluded unless the system is sized for them.',
        ],
      },
      {
        heading: 'Questions that decide the architecture',
        bullets: [
          'Do you need power during an outage, and for which circuits?',
          'Is the grid stable enough for a grid-tied inverter, and are export rules clear?',
          'What is the daily energy use in kWh, and when does it occur?',
          'How many cloudy days should the battery cover?',
          'Is there a generator, and can it be integrated safely?',
          'What budget is available now, and what can be added later?',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'reduce-energy-use-before-solar',
    title: 'Seven ways to cut energy use before buying solar',
    category: 'Energy saving',
    excerpt:
      'Every kilowatt-hour you avoid is a kilowatt-hour you do not need to generate or store. Start with the cheapest wins.',
    readingTime: 5,
    date: '2025-11-30',
    author: 'SunGrid Engineering Desk',
    image: '/images/house-interior.jpg',
    imageAlt: 'Bright, modern living room interior',
    sections: [
      {
        paragraphs: [
          'Solar equipment is priced per kilowatt and per kilowatt-hour. Reducing waste can shrink the system you need, which is often cheaper than adding panels or batteries.',
        ],
      },
      {
        heading: '1. Replace the worst lighting',
        paragraphs: [
          'Old incandescent and halogen bulbs turn most of their energy into heat. LED replacements use a fraction of the power for the same light. Do this before sizing a backup system.',
        ],
      },
      {
        heading: '2. Manage air conditioning',
        bullets: [
          'Set a realistic temperature and use timers rather than cooling empty rooms.',
          'Service units regularly; dirty filters and low refrigerant increase consumption.',
          'Shade windows and reduce heat gain before adding cooling capacity.',
          'Consider inverter-driven units, but verify their surge behaviour and electronics compatibility.',
        ],
      },
      {
        heading: '3. Deal with standby loads',
        paragraphs: [
          'Decoders, consoles, chargers and older TVs can draw power for hours while apparently off. Grouping them on a switched extension or smart plug makes it easy to cut standby draw overnight.',
        ],
      },
      {
        heading: '4. Fix refrigeration habits',
        paragraphs: [
          'A fridge that is overfilled, poorly sealed or placed next to a cooker works harder. Check door gaskets, keep condensers clean and avoid putting warm food straight in.',
        ],
      },
      {
        heading: '5. Use the sun directly',
        paragraphs: [
          'Dry clothes outdoors rather than in a tumble dryer. Use daylight for tasks that need light or heat. Shift high-demand activities to daytime where practical.',
        ],
      },
      {
        heading: '6. Track your consumption',
        paragraphs: [
          'A plug-in energy meter or a whole-home monitor gives you real numbers instead of guesses. Even a week of data can reveal a surprising appliance or a failing fridge.',
        ],
      },
      {
        heading: '7. Fix the fundamentals',
        paragraphs: [
          'Loose connections, undersized cables and poor earthing are safety issues first, but they also cause losses and equipment stress. An electrical inspection is part of a responsible solar project.',
        ],
      },
    ],
    demo: true,
  },
  {
    slug: 'reading-solar-panel-specs',
    title: 'How to read a solar panel datasheet',
    category: 'Technology',
    excerpt:
      'Voc, Isc, temperature coefficient and efficiency: what these numbers mean when you are comparing modules.',
    readingTime: 6,
    date: '2025-11-06',
    author: 'SunGrid Engineering Desk',
    image: '/images/panels-closeup.jpg',
    imageAlt: 'Close-up of solar panel cells',
    sections: [
      {
        paragraphs: [
          'A solar panel datasheet is a technical document, not marketing copy. The numbers determine whether a module can be safely connected to a particular inverter and how it will behave in real conditions.',
        ],
      },
      {
        heading: 'Power at standard test conditions',
        paragraphs: [
          'The rated wattage (Wp) is measured at standard test conditions: 1,000 W/m² irradiance, 25 °C cell temperature and a specified air mass. Real rooftops rarely match these conditions exactly.',
          'Hotter cells produce less voltage and therefore less power. A module’s temperature coefficient tells you how much output changes as temperature rises; a less negative coefficient is generally better in hot climates.',
        ],
      },
      {
        heading: 'Voltage and current limits',
        bullets: [
          'Voc (open-circuit voltage) is highest when the module is cold and unloaded. String design must use the cold-temperature Voc so the inverter’s maximum input voltage is never exceeded.',
          'Vmp is the voltage at maximum power. The string’s Vmp must stay within the inverter’s MPPT range under operating temperatures.',
          'Isc (short-circuit current) and Imp (current at maximum power) determine cable, fuse and isolator ratings.',
        ],
      },
      {
        heading: 'Efficiency and size',
        paragraphs: [
          'Module efficiency is power output divided by area. Higher efficiency means more watts per square metre, which matters when roof space is limited. It does not automatically mean better value per watt.',
          'Check physical dimensions and weight too. A high-output panel is useless if it cannot be safely lifted to the roof or fixed within the available area.',
        ],
      },
      {
        heading: 'Warranty and certification',
        paragraphs: [
          'Product warranties cover defects; performance warranties guarantee a minimum output over time. Read the conditions, and confirm the module carries certification accepted by the financier, insurer or utility where relevant.',
          'Datasheets can change between revisions. Use the revision that matches the actual serial-numbered product delivered to site.',
        ],
      },
    ],
    demo: true,
  },
]

export const articleCategories = [
  'All articles',
  'Buying guides',
  'Inverters & batteries',
  'Installation costs',
  'Energy saving',
  'Maintenance',
  'Technology',
] as const

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, limit)
}
