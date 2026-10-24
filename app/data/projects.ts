import type { Project } from '#shared/types'

/**
 * DEMONSTRATION PROJECTS
 * These records exist to demonstrate the portfolio interface. They are not
 * real customer projects, and no outcome has been independently verified.
 */
export const demoProjectNotice =
  'Demonstration projects. Locations, equipment and outcomes are illustrative and are not verified customer references.'

export const projects: Project[] = [
  {
    slug: 'lekki-hybrid-home',
    title: 'Five-bedroom home with essential-load backup',
    category: 'residential',
    location: 'Lekki Phase 1, Lagos',
    capacity: '5.5 kWp',
    battery: '10.24 kWh',
    equipment: ['10 × 550 Wp modules', '5 kW hybrid inverter', '10.24 kWh LiFePO₄', 'Roof rails + DC protection'],
    date: 'March 2026',
    image: '/images/install-roof.jpg',
    imageAlt: 'Technician mounting solar modules on a residential roof',
    summary:
      'A family replacing a petrol generator wanted lighting, refrigeration, fans, internet and selected sockets to remain on during outages.',
    challenge:
      'The roof had two orientations and a shaded section near a water tank. The existing generator changeover was informal and the distribution board had no clear essential-load separation.',
    solution:
      'The array was split across two roof planes with separate strings. Essential circuits were moved to a dedicated backup board, and the generator was integrated through a proper changeover with the inverter set to prioritise solar and battery.',
    outcome:
      'Demonstration outcome: the configured system is designed to cover declared essential loads overnight. Actual runtime and generator displacement have not been independently monitored, so no savings figure is claimed.',
    demo: true,
  },
  {
    slug: 'wuse-pharmacy-backup',
    title: 'Community pharmacy with cold-chain protection',
    category: 'commercial',
    location: 'Wuse 2, Abuja',
    capacity: '8.8 kWp',
    battery: '15.36 kWh',
    equipment: ['16 × 550 Wp modules', '8 kW hybrid inverter', '3 × 5.12 kWh batteries', 'Surge protection'],
    date: 'January 2026',
    image: '/images/shopkeeper.jpg',
    imageAlt: 'Retail staff serving a customer at a point-of-sale counter',
    summary:
      'A pharmacy needed dependable power for vaccine refrigeration, point-of-sale systems and lighting without running a generator through the night.',
    challenge:
      'Cold-chain equipment has high starting currents, and the shop could not close for a long installation. The roof area above the dispensary was limited by neighbouring buildings.',
    solution:
      'A load logger recorded compressor cycling before inverter sizing. Backup circuits were split between cold chain, POS and lighting, with a staggered restart sequence to manage surge. Work was phased over two weekends.',
    outcome:
      'Demonstration outcome: the design targets overnight cold-chain support and reduced generator use. Temperature logs and generator hours should be collected over a full season to validate performance.',
    demo: true,
  },
  {
    slug: 'gra-office-hybrid',
    title: 'Three-storey office with three-phase hybrid supply',
    category: 'commercial',
    location: 'GRA, Port Harcourt',
    capacity: '25 kWp',
    battery: '30.72 kWh',
    equipment: ['45 × 550 Wp modules', 'Three-phase hybrid inverter', '6 × 5.12 kWh batteries', 'Generator synchronisation'],
    date: 'November 2025',
    image: '/images/commercial-building.jpg',
    imageAlt: 'Modern office corridor with glass partitions',
    summary:
      'An engineering consultancy wanted to reduce daytime grid and generator consumption while keeping servers, security and selected office circuits on during outages.',
    challenge:
      'The building has a three-phase supply with uneven phase loading. The existing generator was oversized for the overnight load and could not be safely paralleled without controls.',
    solution:
      'A phased design added rooftop solar, a three-phase hybrid inverter and a dedicated backup board. Phase loads were rebalanced, and the generator was retained for extended outages with a safe changeover.',
    outcome:
      'Demonstration outcome: the system is configured for daytime solar self-consumption and overnight essential backup. A full measurement and verification exercise is required before publishing any utility-bill savings.',
    demo: true,
  },
  {
    slug: 'kano-offgrid-farm',
    title: 'Off-grid irrigation and farmhouse power',
    category: 'off-grid',
    location: 'Kano State',
    capacity: '12 kWp',
    battery: '20.48 kWh',
    equipment: ['Ground-mount array', '2.2 kW solar pump', 'Off-grid inverter', '4 × 5.12 kWh batteries'],
    date: 'September 2025',
    image: '/images/solar-farm-aerial.jpg',
    imageAlt: 'Aerial view of a large ground-mounted solar installation',
    summary:
      'A farm with no grid connection needed daytime irrigation and basic power for a farmhouse and security lighting.',
    challenge:
      'The borehole yield varied by season, and diesel deliveries were expensive during the rainy season when access roads deteriorated. Panel soiling from dust was also a concern.',
    solution:
      'The pumping load was kept separate from the farmhouse supply. A ground-mounted array was tilted and spaced for access and cleaning, with a storage tank providing water outside pumping hours.',
    outcome:
      'Demonstration outcome: the design aims to shift irrigation to daylight hours and reduce diesel dependence. Water output and fuel use would need seasonal measurement to verify.',
    demo: true,
  },
  {
    slug: 'ibadan-school-solar',
    title: 'Secondary school classroom and admin backup',
    category: 'commercial',
    location: 'Ibadan, Oyo State',
    capacity: '10 kWp',
    battery: '10.24 kWh',
    equipment: ['18 × 550 Wp modules', '10 kW hybrid inverter', '2 × 5.12 kWh batteries', 'Earthing improvement'],
    date: 'July 2025',
    image: '/images/rooftop-panels.jpg',
    imageAlt: 'Solar modules mounted outdoors in an array',
    summary:
      'A school wanted reliable lighting, fans, admin computers and a small computer lab during grid interruptions, with a system that staff could operate simply.',
    challenge:
      'Several buildings shared an ageing distribution board, and earthing was inadequate. The school also needed the system to survive holiday periods without complex intervention.',
    solution:
      'Priority circuits were separated, earthing was upgraded, and the inverter was configured with a simple seasonal mode. Staff received a short handover session and a laminated monitoring guide.',
    outcome:
      'Demonstration outcome: the design targets reliable classroom lighting and lab use during outages. Usage and battery health should be reviewed each term before any performance claim is made.',
    demo: true,
  },
  {
    slug: 'kaduna-water-pumping',
    title: 'Community borehole solar pumping',
    category: 'hybrid',
    location: 'Kaduna State',
    capacity: '5.5 kWp',
    battery: 'None — tank storage',
    equipment: ['5.5 kWp array', '2.2 kW solar pump', 'VFD with dry-run protection', '10,000 L tank'],
    date: 'May 2025',
    image: '/images/solar-install.jpg',
    imageAlt: 'Ground-mounted solar array in an open field',
    summary:
      'A community borehole relied on a diesel pump with irregular fuel supply and frequent breakdowns. The priority was daily water volume, not electricity in buildings.',
    challenge:
      'Borehole tests showed a modest yield, and the tank had to serve demand after sunset. Theft of equipment was a concern at the site.',
    solution:
      'A solar pump was selected from the measured head and yield. A raised tank provides gravity supply in the evening, and the array is fenced with anti-theft fixings and a locked isolator enclosure.',
    outcome:
      'Demonstration outcome: the design aims to deliver a consistent daily water volume without diesel. Flow and tank levels would need to be logged through both dry and rainy seasons to validate output.',
    demo: true,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export const projectFilters = [
  { label: 'All projects', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Off-grid', value: 'off-grid' },
  { label: 'Hybrid', value: 'hybrid' },
]
