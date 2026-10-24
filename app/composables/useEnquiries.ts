import type { DemoEnquiry, EnquiryStatus, QuoteRequestPayload } from '#shared/types'
import { seedEnquiries } from '~/data/admin'

const STORAGE_KEY = 'sungrid-demo-enquiries-v1'

function cloneSeed(): DemoEnquiry[] {
  return seedEnquiries.map((enquiry) => ({
    ...enquiry,
    notes: enquiry.notes.map((note) => ({ ...note })),
    selectedProducts: enquiry.selectedProducts?.map((item) => ({ ...item })),
  }))
}

function reference(): string {
  const number = Math.floor(1000 + Math.random() * 9000)
  return `SG-ENQ-${number}`
}

export function useEnquiries() {
  const enquiries = useState<DemoEnquiry[]>('sungrid-demo-enquiries', cloneSeed)
  const hydrated = useState<boolean>('sungrid-demo-enquiries-hydrated', () => false)
  const lastReference = useState<string>('sungrid-last-enquiry-reference', () => '')

  onMounted(() => {
    if (hydrated.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.length) {
          enquiries.value = parsed as DemoEnquiry[]
        }
      }
    } catch {
      /* Keep seeded demo records when storage is unavailable. */
    }
    hydrated.value = true
  })

  if (import.meta.client) {
    watch(
      enquiries,
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

  function addEnquiry(payload: QuoteRequestPayload): DemoEnquiry {
    const now = new Date()
    const enquiry: DemoEnquiry = {
      id: `demo-${now.getTime()}`,
      reference: reference(),
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      customerType: payload.customerType,
      projectType: payload.projectType,
      city: payload.city,
      state: payload.state,
      address: payload.address,
      status: 'new',
      assignedTo: 'Unassigned',
      budget: payload.budget,
      backupHours: payload.backupHours,
      systemType: payload.systemType,
      createdAt: now.toISOString(),
      followUpDate: null,
      source: 'Demo form',
      loadDescription: payload.loadDescription,
      notes: [],
      selectedProducts: payload.selectedProducts,
      calculatorSummary: payload.calculatorSummary,
      demo: true,
    }
    enquiries.value.unshift(enquiry)
    lastReference.value = enquiry.reference
    return enquiry
  }

  function updateStatus(id: string, status: EnquiryStatus) {
    const enquiry = enquiries.value.find((record) => record.id === id)
    if (enquiry) enquiry.status = status
  }

  function assignTo(id: string, owner: string) {
    const enquiry = enquiries.value.find((record) => record.id === id)
    if (enquiry) enquiry.assignedTo = owner
  }

  function updateEnquiry(id: string, patch: Partial<Pick<DemoEnquiry, 'status' | 'assignedTo' | 'followUpDate'>>) {
    const enquiry = enquiries.value.find((record) => record.id === id)
    if (enquiry) Object.assign(enquiry, patch)
  }

  function addNote(id: string, body: string, author = 'Demo user') {
    const enquiry = enquiries.value.find((record) => record.id === id)
    if (!enquiry || !body.trim()) return
    enquiry.notes.unshift({
      id: `note-${Date.now()}`,
      author,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    })
  }

  function find(id: string): DemoEnquiry | undefined {
    return enquiries.value.find((record) => record.id === id)
  }

  return {
    enquiries,
    lastReference,
    addEnquiry,
    updateStatus,
    assignTo,
    updateEnquiry,
    addNote,
    find,
  }
}
