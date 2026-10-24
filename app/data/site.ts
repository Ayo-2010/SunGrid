export const site = {
  name: 'SunGrid Energy',
  legalName: 'SunGrid Energy Ltd. (placeholder)',
  tagline: 'Reliable Power. Brighter Possibilities.',
  description:
    'Solar systems, inverters, batteries and installation services for Nigerian homes, businesses and industry. Engineering-led design, honest sizing and after-sales support.',
  phoneDisplay: '+234 704 503 3528',
  phoneHref: 'tel:+2347045033528',
  whatsappDisplay: '+234 704 503 3528',
  whatsappNumber: '2347045033528',
  email: 'hello@sungrid.example.com',
  supportEmail: 'support@sungrid.example.com',
  address: {
    line1: 'Registered office address to be confirmed',
    line2: 'Lagos, Nigeria',
    note: 'Demo contact details — replace with verified business information before launch.',
  },
  hours: [
    { days: 'Monday – Friday', time: '8:30 am – 5:30 pm' },
    { days: 'Saturday', time: '9:00 am – 2:00 pm' },
    { days: 'Sunday & public holidays', time: 'Closed (emergency support by arrangement)' },
  ],
  serviceAreas: ['Lagos', 'Abuja (FCT)', 'Port Harcourt', 'Ibadan', 'Benin City', 'Enugu', 'Kano', 'Kaduna'],
  serviceNote:
    'Primary coverage is indicated for Lagos, Abuja and Port Harcourt. Other states are served by arrangement and may include mobilisation costs. Confirm coverage before booking.',
  socials: [
    { label: 'WhatsApp', icon: 'i-lucide-message-circle', href: 'https://wa.me/2347045033528' },
    { label: 'LinkedIn', icon: 'i-lucide-linkedin', href: '#', unavailable: true },
    { label: 'Instagram', icon: 'i-lucide-instagram', href: '#', unavailable: true },
  ],
}

export const placeholderStats = [
  { value: '10+', label: 'Years of combined team experience', note: 'illustrative' },
  { value: '350+', label: 'Installations completed', note: 'illustrative' },
  { value: '400+', label: 'Homes and businesses served', note: 'illustrative' },
  { value: 'Up to 10 yrs', label: 'Equipment warranty options', note: 'varies by product' },
  { value: '8 states', label: 'Service coverage planned', note: 'subject to confirmation' },
]

export const values = [
  {
    title: 'Engineering before selling',
    body: 'We size systems from a load schedule and site conditions. If solar is not the right answer for your situation, we will say so.',
    icon: 'i-lucide-ruler',
  },
  {
    title: 'Honest numbers',
    body: 'No guaranteed savings, no invented payback periods and no “unlimited power” claims. We show our assumptions so you can question them.',
    icon: 'i-lucide-calculator',
  },
  {
    title: 'Safety is non-negotiable',
    body: 'Earthing, protection, cable sizing and changeover design are part of the system, not optional extras.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Support after handover',
    body: 'A system should be understood by its owner. We explain the controls, document the installation and stay reachable for support.',
    icon: 'i-lucide-headset',
  },
  {
    title: 'Respect for the site',
    body: 'We plan cable routes, protect roofs and leave plant rooms tidy. Installation quality is visible long after the team leaves.',
    icon: 'i-lucide-hard-hat',
  },
  {
    title: 'Built to be maintained',
    body: 'Equipment should be serviceable and documented. We avoid designs that cannot be accessed, isolated or repaired.',
    icon: 'i-lucide-wrench',
  },
]

export const expertise = [
  {
    title: 'Load assessment & system sizing',
    body: 'Appliance-level load schedules, surge analysis and battery autonomy modelling for residential and commercial sites.',
  },
  {
    title: 'Hybrid & off-grid design',
    body: 'Single- and three-phase systems with generator integration, changeover and backup distribution designed around critical loads.',
  },
  {
    title: 'Solar pumping & specialist systems',
    body: 'Borehole and irrigation pumping, standalone lighting and remote-site power where conventional supply is impractical.',
  },
  {
    title: 'Installation & commissioning',
    body: 'Mounting, DC/AC protection, earthing, testing and documented handover by experienced installation teams.',
  },
  {
    title: 'Monitoring & maintenance',
    body: 'Performance checks, fault finding, battery health reviews and scheduled maintenance to protect the investment.',
  },
  {
    title: 'Electrical safety reviews',
    body: 'Distribution board inspections, earthing checks and recommendations before adding solar to an existing installation.',
  },
]

export const industries = [
  {
    slug: 'homes',
    name: 'Homes & apartments',
    icon: 'i-lucide-house',
    summary: 'Essential-load backup, generator replacement and rooftop solar for family homes.',
    solution: 'residential',
  },
  {
    slug: 'retail',
    name: 'Retail & hospitality',
    icon: 'i-lucide-store',
    summary: 'Shops, salons, restaurants and hotels that need daytime solar and reliable backup.',
    solution: 'commercial',
  },
  {
    slug: 'healthcare',
    name: 'Clinics & hospitals',
    icon: 'i-lucide-heart-pulse',
    summary: 'Cold-chain, diagnostics and critical-care loads where interruption has real consequences.',
    solution: 'commercial',
  },
  {
    slug: 'education',
    name: 'Schools & campuses',
    icon: 'i-lucide-graduation-cap',
    summary: 'Classroom lighting, computer labs, water pumping and admin blocks across multiple buildings.',
    solution: 'commercial',
  },
  {
    slug: 'agriculture',
    name: 'Agriculture',
    icon: 'i-lucide-sprout',
    summary: 'Irrigation pumping, agro-processing and off-grid power for farms and rural facilities.',
    solution: 'solar-water-pumping',
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    icon: 'i-lucide-factory',
    summary: 'Larger three-phase loads, generator integration and phased solar for industrial sites.',
    solution: 'industrial',
  },
  {
    slug: 'real-estate',
    name: 'Property development',
    icon: 'i-lucide-building-2',
    summary: 'Estate infrastructure, shared facilities and solar-ready designs for new developments.',
    solution: 'commercial',
  },
  {
    slug: 'remote-sites',
    name: 'Remote & telecom sites',
    icon: 'i-lucide-radio-tower',
    summary: 'Off-grid power with monitoring and maintenance access planned from the start.',
    solution: 'off-grid',
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Tell us what needs power',
    body: 'Share your appliances, operating hours, backup priorities and photos of the site. No technical knowledge required.',
    icon: 'i-lucide-clipboard-list',
  },
  {
    step: '02',
    title: 'Get a preliminary recommendation',
    body: 'We review the information and suggest a system direction, with assumptions clearly stated. This is not a final design.',
    icon: 'i-lucide-file-text',
  },
  {
    step: '03',
    title: 'Site assessment & final quote',
    body: 'A technical visit confirms roof condition, cable routes, earthing and distribution. You receive a fixed-scope quotation.',
    icon: 'i-lucide-search-check',
  },
  {
    step: '04',
    title: 'Install, commission & hand over',
    body: 'We install, test and explain the system. Timelines depend on scope, equipment availability and site readiness.',
    icon: 'i-lucide-check-circle-2',
  },
]

export const teamRoles = [
  {
    role: 'Engineering & design',
    body: 'Load studies, single-line diagrams, equipment selection and system proposals.',
    icon: 'i-lucide-drafting-compass',
  },
  {
    role: 'Installation & commissioning',
    body: 'Site teams responsible for mounting, wiring, protection, testing and handover.',
    icon: 'i-lucide-hard-hat',
  },
  {
    role: 'Customer care & support',
    body: 'Enquiries, scheduling, documentation and after-sales coordination.',
    icon: 'i-lucide-headset',
  },
]

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Solar Solutions', to: '/solutions', dropdown: 'solutions' },
  { label: 'Products', to: '/products' },
  { label: 'Industries', to: '/industries' },
  { label: 'Projects', to: '/projects' },
  { label: 'About Us', to: '/about' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
]

export const footerLinks = {
  solutions: [
    { label: 'Residential solar', to: '/solutions/residential' },
    { label: 'Commercial solar', to: '/solutions/commercial' },
    { label: 'Industrial solar', to: '/solutions/industrial' },
    { label: 'Solar water pumping', to: '/solutions/solar-water-pumping' },
    { label: 'Off-grid systems', to: '/solutions/off-grid' },
    { label: 'Energy audits', to: '/solutions/energy-audits-upgrades' },
  ],
  company: [
    { label: 'About SunGrid', to: '/about' },
    { label: 'Our projects', to: '/projects' },
    { label: 'Installation services', to: '/installation' },
    { label: 'Resources', to: '/resources' },
    { label: 'Contact', to: '/contact' },
    { label: 'Staff dashboard (demo)', to: '/admin' },
  ],
  tools: [
    { label: 'Solar calculator', to: '/calculator' },
    { label: 'Request a quote', to: '/quote' },
    { label: 'Product catalogue', to: '/products' },
    { label: 'Compare products', to: '/compare' },
    { label: 'FAQs', to: '/faq' },
    { label: 'Service coverage', to: '/contact#coverage' },
  ],
}

export const quoteAssumptions = [
  'Preliminary sizing uses your declared appliance wattages and hours. Actual consumption may differ.',
  'Battery autonomy uses usable capacity after depth of discharge and inverter losses; real runtime depends on load behaviour and temperature.',
  'Solar yield uses a planning value for peak sun hours and a system efficiency allowance. Seasonal weather, shading and soiling can reduce output.',
  'Final equipment selection, cable sizing, protection and installation must be confirmed by a site assessment.',
]

export const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT — Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
]
