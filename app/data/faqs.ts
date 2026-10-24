import type { FaqItem } from '#shared/types'

export const faqs: FaqItem[] = [
  {
    category: 'Solar basics',
    question: 'How does a solar power system work?',
    answer:
      'Solar panels convert daylight into direct current (DC) electricity. An inverter converts that DC into alternating current (AC) for your appliances. In a hybrid or off-grid system, excess energy charges a battery, which supplies power at night or during an outage. A grid-connected system can also draw from the grid when solar is insufficient.',
  },
  {
    category: 'Solar basics',
    question: 'Will solar power my air conditioner?',
    answer:
      'It can, but air conditioning is one of the largest household loads. A single 1.5 HP unit may draw around 1.2 kW while running, with a higher start-up surge. Running one overnight requires a substantially larger inverter and battery bank than an essential-load system. We size for air conditioning only when it is explicitly included in the load schedule.',
  },
  {
    category: 'Solar basics',
    question: 'Do solar panels work during the rainy season?',
    answer:
      'Panels still generate in cloudy conditions, but output is lower than on clear days. System sizing should account for seasonal variation. If your requirements are critical, the design may need a larger array, more battery autonomy or a generator backup rather than assuming peak output every day.',
  },
  {
    category: 'Sizing & costs',
    question: 'How do I estimate my household energy use?',
    answer:
      'List each appliance, its wattage, quantity and daily hours. Multiply watts × quantity × hours and divide by 1,000 to get kilowatt-hours per day. A plug-in energy meter gives more accurate figures for fridges and other cycling loads. Our solar calculator uses this method and shows every assumption.',
  },
  {
    category: 'Sizing & costs',
    question: 'Why do quotations for similar systems vary so much?',
    answer:
      'Quotes may differ in battery usable capacity, inverter model, panel tier, mounting method, cable runs, protection, earthing, labour and whether installation or transport is included. A lower headline price can exclude items that are necessary for a safe, complete installation. Compare scope and equipment models, not only the total.',
  },
  {
    category: 'Sizing & costs',
    question: 'Can I start small and expand later?',
    answer:
      'Often, yes — but it needs planning. Choose an inverter with expansion capacity, leave physical space for additional batteries, and design cable routes and protection for the eventual system. Expanding a poorly planned system can cost more than doing it correctly the first time.',
  },
  {
    category: 'Equipment',
    question: 'How do I choose an inverter?',
    answer:
      'Start with the appliances you need to run at the same time, including start-up surges. Then choose the system architecture: hybrid if you need backup, off-grid for sites without a grid, grid-tied if backup is not required. Confirm battery compatibility, PV input limits and whether the unit can be serviced locally. Inverter kW is not the same as battery kWh or panel kWp.',
  },
  {
    category: 'Equipment',
    question: 'Is lithium better than lead-acid?',
    answer:
      'Lithium iron phosphate (LiFePO₄) typically offers more usable capacity, longer cycle life and lower maintenance in a smaller package, at a higher upfront price. Lead-acid can suit very tight budgets or low-cycle use where maintenance is available. Compare usable kWh, expected life, warranty conditions and replacement cost — not just purchase price.',
  },
  {
    category: 'Equipment',
    question: 'Can I add solar panels to my existing inverter?',
    answer:
      'Only after checking the inverter’s maximum PV input, MPPT voltage window, string configuration and battery charging limits. Adding panels beyond the design limits can damage equipment or void warranties. A qualified installer should review the existing system and array before any addition.',
  },
  {
    category: 'Equipment',
    question: 'Do you sell products without installation?',
    answer:
      'Supply-only sales can be arranged for some catalogue items, subject to stock and technical suitability. We may decline supply-only requests where the equipment needs configuration, commissioning or compatibility checks that cannot be confirmed remotely. Installation is quoted separately in all cases.',
  },
  {
    category: 'Installation',
    question: 'What happens during a site inspection?',
    answer:
      'We review the roof or ground area, structural condition, shading, cable routes, plant-room space and the existing distribution board and earthing. We may photograph the site and record loads. The visit informs the final design and quotation; it is not a commitment to install until the proposal is accepted.',
  },
  {
    category: 'Installation',
    question: 'How long does installation take?',
    answer:
      'A simple residential essential-load system may take one to three days on site, while larger commercial projects can take weeks and involve multiple trades. Timelines depend on site readiness, roof works, equipment availability and whether electrical remedial work is needed. We provide an indicative schedule with the quotation and update it after the site assessment.',
  },
  {
    category: 'Installation',
    question: 'Will you need to change my distribution board?',
    answer:
      'Sometimes. A backup system usually requires a dedicated essential-load board so selected circuits can run during an outage. If the existing board is unsafe, overloaded or has no spare ways, remedial work may be recommended before installation. This is identified during the site assessment and priced separately.',
  },
  {
    category: 'Support & warranty',
    question: 'What maintenance does a solar system need?',
    answer:
      'Panels should be cleaned when dusty or soiled, and the system should be checked periodically for loose terminations, faults and battery health. We recommend a professional review at least once a year, plus prompt attention to any inverter error or burning smell. Do not open DC equipment yourself.',
  },
  {
    category: 'Support & warranty',
    question: 'What warranty do you provide?',
    answer:
      'Equipment warranties come from the manufacturer or distributor and vary by product; installation workmanship is covered separately for the period stated in your contract. Warranty claims require proof of purchase, installation records and compliance with the manufacturer’s conditions. We do not currently publish a blanket warranty duration because it depends on the equipment supplied.',
  },
  {
    category: 'Support & warranty',
    question: 'Can I monitor my system remotely?',
    answer:
      'Many inverters support a Wi-Fi or LAN monitoring dongle, subject to model compatibility and a stable internet connection. Monitoring helps identify underperformance and supports remote troubleshooting. It does not replace safe isolation or physical inspection when a fault occurs.',
  },
  {
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer:
      'Bank transfer is the standard method for quoted projects. Card and payment-gateway options are planned but not yet live on this prototype. No online payment is taken through this website, and no payment should be sent to account details that have not been verified through an official SunGrid channel.',
  },
  {
    category: 'Payments',
    question: 'Do you offer instalment payments?',
    answer:
      'Instalment or financing options are not confirmed for this demonstration. Any future plan would be subject to a separate credit assessment, approved provider and written terms. We will not advertise a financing offer until it is operational and its conditions can be explained clearly.',
  },
  {
    category: 'Payments',
    question: 'What areas do you serve?',
    answer:
      'The planned primary coverage is Lagos, Abuja (FCT) and Port Harcourt, with other states served by arrangement. Travel and mobilisation may affect pricing outside these areas. Confirm coverage with the team before scheduling a site visit.',
  },
]

export const faqCategories = [
  'All questions',
  'Solar basics',
  'Sizing & costs',
  'Equipment',
  'Installation',
  'Support & warranty',
  'Payments',
] as const
