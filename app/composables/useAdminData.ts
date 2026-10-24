import type {
  AdminCustomer,
  AdminInstallation,
  AdminNotification,
  AdminQuote,
  Availability,
  ContentStatus,
  ProjectStage,
  QuoteStatus,
  TeamMember,
} from '#shared/types'
import {
  seedCustomers,
  seedInstallations,
  seedNotifications,
  seedQuotes,
  teamMembers as seedTeam,
} from '~/data/admin'

const STORAGE_KEY = 'sungrid-admin-data-v1'

interface ProductOverride {
  price?: number | null
  availability?: Availability
  featured?: boolean
}

interface AdminDataState {
  quotes: AdminQuote[]
  customers: AdminCustomer[]
  installations: AdminInstallation[]
  team: TeamMember[]
  notifications: AdminNotification[]
  productOverrides: Record<string, ProductOverride>
  contentStatus: Record<string, ContentStatus>
}

interface NewQuoteInput {
  customer: string
  phone: string
  items: number
  subtotal: number
  install: number
  status: QuoteStatus
  validUntil: string
  owner: string
}

interface NewCustomerInput {
  name: string
  type: string
  phone: string
  email: string
  city: string
  state: string
}

interface NewInstallationInput {
  customer: string
  location: string
  capacity: string
  stage: ProjectStage
  tech: string
  startDate: string
  targetDate: string
  nextAction: string
}

function cloneState(): AdminDataState {
  return {
    quotes: seedQuotes.map((quote) => ({ ...quote })),
    customers: seedCustomers.map((customer) => ({ ...customer })),
    installations: seedInstallations.map((installation) => ({ ...installation })),
    team: seedTeam.map((member) => ({ ...member })),
    notifications: seedNotifications.map((notification) => ({ ...notification })),
    productOverrides: {},
    contentStatus: {},
  }
}

function nextQuoteReference(quotes: AdminQuote[]): string {
  const highest = quotes.reduce((max, quote) => {
    const match = quote.reference.match(/(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 85)
  return `SG-Q-${String(highest + 1).padStart(3, '0')}`
}

function stageProgress(stage: ProjectStage): number {
  return { assessment: 10, design: 25, procurement: 40, installation: 70, commissioning: 90, complete: 100 }[stage]
}

/**
 * Mutable demo data for the admin workspace. Everything is persisted to
 * localStorage so status changes survive a refresh. No request leaves the
 * browser and no record here should be treated as production data.
 */
export function useAdminData() {
  const state = useState<AdminDataState>('sungrid-admin-data', cloneState)
  const hydrated = useState<boolean>('sungrid-admin-data-hydrated', () => false)

  onMounted(() => {
    if (hydrated.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AdminDataState>
        const base = cloneState()
        state.value = {
          quotes: Array.isArray(parsed.quotes) ? parsed.quotes : base.quotes,
          customers: Array.isArray(parsed.customers) ? parsed.customers : base.customers,
          installations: Array.isArray(parsed.installations) ? parsed.installations : base.installations,
          team: Array.isArray(parsed.team) ? parsed.team : base.team,
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : base.notifications,
          productOverrides: parsed.productOverrides && typeof parsed.productOverrides === 'object' ? parsed.productOverrides : {},
          contentStatus: parsed.contentStatus && typeof parsed.contentStatus === 'object' ? parsed.contentStatus : {},
        }
        // Keep older browser snapshots aligned with the current demo super admin.
        const lead = state.value.team.find((member) => member.id === 'tm-1')
        if (lead?.name === 'Ade Balogun') {
          lead.name = 'Abdullah Abdulwahab'
          lead.email = 'abdullah@sungrid.example.com'
        }
      }
    } catch {
      /* Keep the seeded demo state when storage is unavailable. */
    }
    hydrated.value = true
  })

  if (import.meta.client) {
    watch(
      state,
      (value) => {
        if (!hydrated.value) return
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* Ignore quota errors in demo mode. */
        }
      },
      { deep: true },
    )
  }

  const unreadNotifications = computed(() => state.value.notifications.filter((item) => !item.read).length)

  function addQuote(input: NewQuoteInput): AdminQuote {
    const quote: AdminQuote = {
      id: `q-${Date.now()}`,
      reference: nextQuoteReference(state.value.quotes),
      customer: input.customer.trim(),
      phone: input.phone.trim(),
      items: input.items,
      subtotal: input.subtotal,
      install: input.install,
      total: input.subtotal + input.install,
      status: input.status,
      validUntil: input.validUntil,
      createdAt: new Date().toISOString().slice(0, 10),
      owner: input.owner,
    }
    state.value.quotes.unshift(quote)
    return quote
  }

  function updateQuote(id: string, patch: Partial<AdminQuote>) {
    const quote = state.value.quotes.find((record) => record.id === id)
    if (!quote) return
    Object.assign(quote, patch)
    quote.total = quote.subtotal + quote.install
  }

  function addCustomer(input: NewCustomerInput): AdminCustomer {
    const customer: AdminCustomer = {
      id: `cus-${Date.now()}`,
      name: input.name.trim(),
      type: input.type,
      phone: input.phone.trim(),
      email: input.email.trim(),
      city: input.city.trim(),
      state: input.state,
      joined: new Date().toISOString().slice(0, 10),
      totalSpend: 0,
      projects: 0,
      lastContact: new Date().toISOString().slice(0, 10),
    }
    state.value.customers.unshift(customer)
    return customer
  }

  function updateCustomer(id: string, patch: Partial<AdminCustomer>) {
    const customer = state.value.customers.find((record) => record.id === id)
    if (customer) Object.assign(customer, patch)
  }

  function addInstallation(input: NewInstallationInput): AdminInstallation {
    const installation: AdminInstallation = {
      id: `ins-${Date.now()}`,
      reference: `SG-INS-${Math.floor(100 + Math.random() * 900)}`,
      customer: input.customer.trim(),
      location: input.location.trim(),
      capacity: input.capacity.trim(),
      stage: input.stage,
      tech: input.tech,
      startDate: input.startDate,
      targetDate: input.targetDate,
      progress: stageProgress(input.stage),
      nextAction: input.nextAction.trim() || 'Confirm next step with the customer',
    }
    state.value.installations.unshift(installation)
    return installation
  }

  function updateInstallation(id: string, patch: Partial<AdminInstallation>) {
    const installation = state.value.installations.find((record) => record.id === id)
    if (!installation) return
    Object.assign(installation, patch)
    if (patch.stage && patch.progress === undefined) {
      installation.progress = stageProgress(patch.stage)
    }
  }

  function advanceInstallation(id: string): ProjectStage | null {
    const installation = state.value.installations.find((record) => record.id === id)
    if (!installation) return null
    const order: ProjectStage[] = ['assessment', 'design', 'procurement', 'installation', 'commissioning', 'complete']
    const next = order[Math.min(order.indexOf(installation.stage) + 1, order.length - 1)]
    if (!next) return null
    installation.stage = next
    installation.progress = stageProgress(next)
    if (next === 'complete') installation.nextAction = 'Schedule 30-day performance review'
    return next
  }

  function inviteMember(name: string, email: string, role: string): TeamMember {
    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      name: name.trim(),
      role,
      email: email.trim(),
      status: 'invited',
      lastActive: '—',
    }
    state.value.team.push(member)
    return member
  }

  function updateMember(id: string, patch: Partial<TeamMember>) {
    const member = state.value.team.find((record) => record.id === id)
    if (member) Object.assign(member, patch)
  }

  function removeMember(id: string) {
    state.value.team = state.value.team.filter((member) => member.id !== id)
  }

  function markNotification(id: string, read = true) {
    const notification = state.value.notifications.find((item) => item.id === id)
    if (notification) notification.read = read
  }

  function markAllNotificationsRead() {
    state.value.notifications.forEach((notification) => {
      notification.read = true
    })
  }

  function setProductOverride(productId: string, patch: ProductOverride) {
    state.value.productOverrides[productId] = {
      ...state.value.productOverrides[productId],
      ...patch,
    }
  }

  function clearProductOverride(productId: string) {
    delete state.value.productOverrides[productId]
  }

  function setContentStatus(key: string, status: ContentStatus) {
    state.value.contentStatus[key] = status
  }

  function contentStatusFor(key: string): ContentStatus {
    return state.value.contentStatus[key] ?? 'published'
  }

  function resetDemoState() {
    state.value = cloneState()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* Ignore unavailable storage. */
    }
  }

  return {
    state,
    unreadNotifications,
    addQuote,
    updateQuote,
    addCustomer,
    updateCustomer,
    addInstallation,
    updateInstallation,
    advanceInstallation,
    inviteMember,
    updateMember,
    removeMember,
    markNotification,
    markAllNotificationsRead,
    setProductOverride,
    clearProductOverride,
    setContentStatus,
    contentStatusFor,
    resetDemoState,
  }
}

export type { AdminDataState, NewCustomerInput, NewInstallationInput, NewQuoteInput, ProductOverride }
