/* ------------------------------------------------------------------
 * Shared domain types
 * These types are intentionally UI-agnostic so the same contracts can
 * be reused by Nuxt server routes and a future Prisma schema.
 * ------------------------------------------------------------------ */

export type CategorySlug =
  | 'solar-panels'
  | 'hybrid-inverters'
  | 'off-grid-inverters'
  | 'grid-tied-inverters'
  | 'lithium-batteries'
  | 'lead-acid-batteries'
  | 'charge-controllers'
  | 'mounting'
  | 'cables-protection'
  | 'solar-kits'
  | 'accessories'

export type Availability = 'in-stock' | 'limited' | 'pre-order' | 'quote-only'

export interface ProductCategory {
  slug: CategorySlug
  name: string
  shortName: string
  description: string
  icon: string
}

export interface Brand {
  slug: string
  name: string
  origin?: string
}

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  model: string
  sku: string
  category: CategorySlug
  keySpec: string
  /** Indicative demo price in NGN. `null` means quotation only. */
  price: number | null
  availability: Availability
  warranty: string
  bestFor: string
  shortDescription: string
  description: string[]
  specs: ProductSpec[]
  features: string[]
  compatibility: string[]
  accessories?: string[]
  featured?: boolean
  /** Used for catalogue filtering, e.g. 5 for 5 kW / 5 kWh. */
  capacity?: number
  capacityUnit?: 'W' | 'kW' | 'kWh' | 'A' | 'V'
  datasheetAvailable?: boolean
  demo: true
}

export type SolutionSlug =
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'solar-water-pumping'
  | 'solar-street-lighting'
  | 'off-grid'
  | 'grid-tied'
  | 'energy-audits-upgrades'

export interface Solution {
  slug: SolutionSlug
  title: string
  navLabel: string
  tagline: string
  summary: string
  image: string
  imageAlt: string
  icon: string
  idealFor: string[]
  benefits: string[]
  limitations: string[]
  components: string[]
  designNotes: string[]
  relatedProducts: string[]
}

export type ProjectCategory = 'residential' | 'commercial' | 'industrial' | 'off-grid' | 'hybrid'

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  location: string
  capacity: string
  battery: string
  equipment: string[]
  date: string
  image: string
  imageAlt: string
  summary: string
  challenge: string
  solution: string
  outcome: string
  demo: true
}

export type ArticleCategory =
  | 'Buying guides'
  | 'Inverters & batteries'
  | 'Installation costs'
  | 'Energy saving'
  | 'Maintenance'
  | 'Technology'

export interface ArticleSection {
  heading?: string
  paragraphs?: string[]
  bullets?: string[]
}

export interface Article {
  slug: string
  title: string
  category: ArticleCategory
  excerpt: string
  readingTime: number
  date: string
  author: string
  image: string
  imageAlt: string
  sections: ArticleSection[]
  demo: true
}

export interface FaqItem {
  question: string
  answer: string
  category: FaqCategory
}

export type FaqCategory =
  | 'Solar basics'
  | 'Sizing & costs'
  | 'Equipment'
  | 'Installation'
  | 'Support & warranty'
  | 'Payments'

/* ----------------------------- Calculator ----------------------------- */

export type ApplianceWave = 'resistive' | 'inductive' | 'electronic'

export interface AppliancePreset {
  id: string
  name: string
  watts: number
  defaultHours: number
  wave: ApplianceWave
  icon: string
}

export interface CalculatorAppliance {
  id: string
  presetId: string
  name: string
  watts: number
  quantity: number
  hours: number
  essential: boolean
  wave: ApplianceWave
}

export type SystemTypePreference = 'hybrid' | 'off-grid' | 'grid-tied' | 'not-sure'

export interface CalculatorInputs {
  appliances: CalculatorAppliance[]
  backupHours: number
  budget: string
  systemPreference: SystemTypePreference
  state: string
  gridAvailability: 'reliable' | 'unreliable' | 'none'
  sunHours: number
  depthOfDischarge: number
  systemEfficiency: number
  surgeAllowance: number
}

export interface SizingResult {
  dailyWh: number
  essentialWh: number
  optionalWh: number
  peakWatts: number
  largestSurgeWatts: number
  inverterKw: number
  recommendedInverterLabel: string
  batteryUsableKwh: number
  batteryNominalKwh: number
  solarKwp: number
  panelCount: number
  recommendations: string[]
  warnings: string[]
}

/** Saved calculator hand-off (session storage only). */
export interface CalculatorBrief {
  summary: string
  state: string
  backupHours: number
  systemPreference: string
  budget: string
  dailyKwh: number
  essentialKwh: number
  peakWatts: number
  inverterKw: number
  batteryKwh: number
  arrayKwp: number
  panelCount: number
  createdAt: string
}

/* ------------------------------ Enquiries ------------------------------ */

export type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'won' | 'lost'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
export type ProjectStage =
  | 'assessment'
  | 'design'
  | 'procurement'
  | 'installation'
  | 'commissioning'
  | 'complete'

export interface CustomerTypeOption {
  value: 'homeowner' | 'tenant' | 'business' | 'developer' | 'institution' | 'other'
  label: string
}

export interface QuoteLineItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface QuoteRequestPayload {
  fullName: string
  phone: string
  email: string
  customerType: string
  projectType: string
  address: string
  state: string
  city: string
  powerSource: string
  loadDescription: string
  backupHours: number
  systemType: string
  budget: string
  timeframe: string
  comments: string
  consent: boolean
  selectedProducts: { productId: string; name: string; quantity: number }[]
  calculatorSummary?: string
  files?: { name: string; size: number; type: string }[]
}

export interface DemoEnquiry {
  id: string
  reference: string
  fullName: string
  phone: string
  email: string
  customerType: string
  projectType: string
  city: string
  state: string
  address: string
  status: EnquiryStatus
  assignedTo: string
  budget: string
  backupHours: number
  systemType: string
  createdAt: string
  followUpDate: string | null
  source: 'Demo form' | 'Website' | 'WhatsApp' | 'Phone'
  loadDescription: string
  notes: { id: string; author: string; body: string; createdAt: string }[]
  selectedProducts?: { productId: string; name: string; quantity: number }[]
  calculatorSummary?: string
  demo: true
}

/** Messages from the contact and service forms (browser storage only). */
export type DemoMessageChannel = 'contact' | 'service' | 'installation'

export interface DemoMessage {
  id: string
  reference: string
  channel: DemoMessageChannel
  name: string
  phone: string
  email: string
  subject: string
  body: string
  meta: string
  read: boolean
  createdAt: string
  demo: true
}

/* -------------------------------- Admin -------------------------------- */

export interface AdminCustomer {
  id: string
  name: string
  type: string
  phone: string
  email: string
  city: string
  state: string
  joined: string
  totalSpend: number
  projects: number
  lastContact: string
}

export interface AdminQuote {
  id: string
  reference: string
  customer: string
  phone: string
  items: number
  subtotal: number
  install: number
  total: number
  status: QuoteStatus
  validUntil: string
  createdAt: string
  owner: string
}

export interface AdminInstallation {
  id: string
  reference: string
  customer: string
  location: string
  capacity: string
  stage: ProjectStage
  tech: string
  startDate: string
  targetDate: string
  progress: number
  nextAction: string
}

export interface AdminActivity {
  id: string
  actor: string
  action: string
  target: string
  time: string
  icon: string
}

export interface AdminNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'enquiry' | 'quote' | 'installation' | 'system'
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  status: 'active' | 'invited' | 'disabled'
  lastActive: string
}

/** Local-only editorial state used by the demo admin content screen. */
export type ContentStatus = 'published' | 'in-review' | 'draft'

export interface DashboardMetric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'flat'
  hint: string
}
