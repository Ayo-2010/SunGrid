<script setup lang="ts">
import type { AdminQuote, QuoteStatus } from '#shared/types'
import { addDaysIso, adminOwnerOptions, daysUntil } from '~/utils/admin'
import { quoteStatusOptions } from '~/utils/status'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin quotations',
  description: 'Demonstration quotation register. Create, edit and track mock quotations stored in the browser only.',
  noindex: true,
})

const admin = useAdminData()
const route = useRoute()
const toast = useToast()

const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const status = ref<'all' | QuoteStatus>('all')
const owner = ref('all')

const modalOpen = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  customer: '',
  phone: '',
  items: 1,
  subtotal: 0,
  install: 0,
  status: 'draft' as QuoteStatus,
  validUntil: addDaysIso(14),
  owner: 'Unassigned',
})

const errors = reactive<Record<string, string>>({})

const quotes = computed(() => admin.state.value.quotes)

const ownerOptions = computed(() => {
  const names = new Set<string>(adminOwnerOptions)
  quotes.value.forEach((quote) => names.add(quote.owner))
  return ['all', ...Array.from(names).sort()]
})

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return quotes.value.filter((quote) => {
    if (status.value !== 'all' && quote.status !== status.value) return false
    if (owner.value !== 'all' && quote.owner !== owner.value) return false
    if (!term) return true
    return `${quote.reference} ${quote.customer} ${quote.phone} ${quote.owner}`.toLowerCase().includes(term)
  })
})

const totalPipeline = computed(() => quotes.value.reduce((total, quote) => total + quote.total, 0))
const acceptedValue = computed(() =>
  quotes.value.filter((quote) => quote.status === 'accepted').reduce((total, quote) => total + quote.total, 0),
)
const sentCount = computed(() => quotes.value.filter((quote) => quote.status === 'sent').length)
const expiringSoon = computed(() =>
  quotes.value.filter((quote) => {
    if (quote.status !== 'draft' && quote.status !== 'sent') return false
    const remaining = daysUntil(quote.validUntil)
    return remaining >= 0 && remaining <= 14
  }).length,
)

const draftTotal = computed(() => Math.max(0, Number(form.subtotal) || 0) + Math.max(0, Number(form.install) || 0))

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function openNew(prefill?: { customer?: string; phone?: string }) {
  editingId.value = null
  clearErrors()
  form.customer = prefill?.customer ?? ''
  form.phone = prefill?.phone ?? ''
  form.items = 1
  form.subtotal = 0
  form.install = 0
  form.status = 'draft'
  form.validUntil = addDaysIso(14)
  form.owner = 'Unassigned'
  modalOpen.value = true
}

function openEdit(quote: AdminQuote) {
  editingId.value = quote.id
  clearErrors()
  form.customer = quote.customer
  form.phone = quote.phone
  form.items = quote.items
  form.subtotal = quote.subtotal
  form.install = quote.install
  form.status = quote.status
  form.validUntil = quote.validUntil
  form.owner = quote.owner
  modalOpen.value = true
}

function validate(): boolean {
  clearErrors()
  if (!form.customer.trim()) errors.customer = 'Enter the customer name.'
  if (!Number.isFinite(form.items) || form.items < 1) errors.items = 'At least one line item is required.'
  if (!Number.isFinite(form.subtotal) || form.subtotal < 0) errors.subtotal = 'Subtotal cannot be negative.'
  if (!Number.isFinite(form.install) || form.install < 0) errors.install = 'Installation cannot be negative.'
  if (!form.validUntil) errors.validUntil = 'Choose a validity date.'
  if (form.phone.trim() && !/^\+?[0-9 ()-]{7,20}$/.test(form.phone.trim())) errors.phone = 'Use a phone format such as +234 803 555 0100.'
  return Object.keys(errors).length === 0
}

function save() {
  if (!validate()) return
  if (editingId.value) {
    admin.updateQuote(editingId.value, {
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      items: Math.round(form.items),
      subtotal: Math.round(form.subtotal),
      install: Math.round(form.install),
      status: form.status,
      validUntil: form.validUntil,
      owner: form.owner,
    })
    toast.add({ title: 'Quotation updated', description: 'Demo values saved in this browser.', color: 'success' })
  } else {
    const created = admin.addQuote({
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      items: Math.round(form.items),
      subtotal: Math.round(form.subtotal),
      install: Math.round(form.install),
      status: form.status,
      validUntil: form.validUntil,
      owner: form.owner,
    })
    toast.add({
      title: `Quotation ${created.reference} created`,
      description: 'Stored locally. No PDF was generated and no email was sent.',
      color: 'success',
    })
  }
  modalOpen.value = false
}

function exportCsv() {
  const ok = downloadCsv('sungrid-demo-quotations.csv', filtered.value, [
    { key: 'reference', label: 'Reference' },
    { key: 'customer', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'items', label: 'Items' },
    { key: 'subtotal', label: 'Subtotal (NGN)' },
    { key: 'install', label: 'Installation (NGN)' },
    { key: 'total', label: 'Total (NGN)' },
    { key: 'status', label: 'Status', value: (row) => quoteStatusLabel(row.status) },
    { key: 'validUntil', label: 'Valid until' },
    { key: 'owner', label: 'Owner' },
  ])
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${filtered.value.length} quotation records exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}

function expiryClass(value: string, quoteStatus: QuoteStatus): string {
  if (quoteStatus === 'accepted' || quoteStatus === 'rejected') return 'text-muted'
  const remaining = daysUntil(value)
  if (remaining < 0) return 'font-semibold text-red-700'
  if (remaining <= 14) return 'font-semibold text-amber-800'
  return 'text-muted'
}

function resetFilters() {
  search.value = ''
  status.value = 'all'
  owner.value = 'all'
}

onMounted(() => {
  if (route.query.new !== '1') return
  openNew({
    customer: typeof route.query.customer === 'string' ? route.query.customer : '',
    phone: typeof route.query.phone === 'string' ? route.query.phone : '',
  })
})
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Sales documents"
      title="Quotations"
      description="A local quotation register for interface demonstration. Totals are illustrative; no PDF, email, e-signature or payment is produced."
      badge="Demo quotes"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" icon="i-lucide-download" @click="exportCsv">Export CSV</AppButton>
        <AppButton size="sm" icon="i-lucide-plus" @click="openNew()">New quotation</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Quoted value" :value="formatNaira(totalPipeline, { compact: true })" icon="i-lucide-wallet" hint="All demo quotations" />
      <AdminStatCard label="Accepted value" :value="formatNaira(acceptedValue, { compact: true })" icon="i-lucide-circle-check" hint="Status marked accepted" />
      <AdminStatCard label="Sent" :value="String(sentCount)" icon="i-lucide-send" hint="Awaiting customer response" />
      <AdminStatCard label="Expiring in 14 days" :value="String(expiringSoon)" icon="i-lucide-calendar-clock" hint="Draft or sent" />
    </div>

    <AdminPanel :padded="false">
      <template #actions>
        <p class="text-[10px] text-muted">Showing <strong class="font-semibold text-ink">{{ filtered.length }}</strong> of {{ quotes.length }}</p>
      </template>

      <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
        <div class="grid gap-2 md:grid-cols-[minmax(0,1fr)_11rem_12rem]">
          <div class="relative">
            <label for="quote-search" class="sr-only">Search quotations</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="quote-search" v-model="search" type="search" class="field-base !py-2 pl-8 text-[12px]" placeholder="Search reference, customer or phone…" />
          </div>
          <div>
            <label for="quote-status" class="sr-only">Filter by status</label>
            <select id="quote-status" v-model="status" class="field-base !py-2 text-[12px]">
              <option value="all">All statuses</option>
              <option v-for="option in quoteStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div>
            <label for="quote-owner" class="sr-only">Filter by owner</label>
            <select id="quote-owner" v-model="owner" class="field-base !py-2 text-[12px]">
              <option v-for="name in ownerOptions" :key="name" :value="name">{{ name === 'all' ? 'All owners' : name }}</option>
            </select>
          </div>
        </div>
        <button
          v-if="search || status !== 'all' || owner !== 'all'"
          type="button"
          class="mt-2 text-[10px] font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-600"
          @click="resetFilters"
        >
          Clear filters
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[60rem] text-left">
          <caption class="sr-only">Demo quotations with status and validity</caption>
          <thead>
            <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
              <th scope="col" class="px-4 py-2.5 font-semibold">Reference</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Customer</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Line items</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Subtotal</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Installation</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Total</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Valid until</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Owner</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-forest-900/[0.06]">
            <tr v-for="quote in filtered" :key="quote.id" class="hover:bg-cream-deep/20">
              <td class="px-4 py-3">
                <p class="text-[11px] font-semibold text-ink">{{ quote.reference }}</p>
                <p class="text-[9px] text-muted">{{ formatDate(quote.createdAt) }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="text-[11px] font-medium text-ink">{{ quote.customer }}</p>
                <p class="text-[9.5px] text-muted">{{ quote.phone }}</p>
              </td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ quote.items }}</td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ formatNaira(quote.subtotal, { compact: true }) }}</td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ formatNaira(quote.install, { compact: true }) }}</td>
              <td class="px-4 py-3 text-[11px] font-semibold text-ink">{{ formatNaira(quote.total, { compact: true }) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1" :class="quoteStatusTone(quote.status)">
                  {{ quoteStatusLabel(quote.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-[10.5px]" :class="expiryClass(quote.validUntil, quote.status)">{{ formatDate(quote.validUntil) }}</td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ quote.owner }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-semibold text-forest-800 hover:bg-forest-50"
                  @click="openEdit(quote)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="!filtered.length"
        icon="i-lucide-file-x"
        title="No quotations match"
        description="Clear the filters, or create a demo quotation to see it appear in this register."
      >
        <div class="flex flex-wrap justify-center gap-2">
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="resetFilters">Clear filters</AppButton>
          <AppButton size="sm" icon="i-lucide-plus" @click="openNew()">New quotation</AppButton>
        </div>
      </EmptyState>
    </AdminPanel>

    <AdminModal
      v-model:open="modalOpen"
      :title="editingId ? 'Edit demo quotation' : 'New demo quotation'"
      description="Totals are added together locally. No PDF is generated, no email is sent and no payment can be taken."
      size="lg"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="form.customer" label="Customer name" required :error="errors.customer" placeholder="e.g. Adeola Balogun" />
          <AppInput v-model="form.phone" label="Phone" type="tel" inputmode="tel" :error="errors.phone" placeholder="+234 803 555 0100" hint="Used for display only." />
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div>
            <label for="quote-items" class="mb-1.5 block text-[13px] font-semibold text-ink">Line items <span class="text-red-700" aria-hidden="true">*</span></label>
            <input id="quote-items" v-model.number="form.items" type="number" min="1" step="1" class="field-base text-[13px]" :aria-invalid="errors.items ? 'true' : undefined" />
            <p v-if="errors.items" class="mt-1 text-xs font-medium text-red-700">{{ errors.items }}</p>
          </div>
          <div>
            <label for="quote-subtotal" class="mb-1.5 block text-[13px] font-semibold text-ink">Equipment subtotal (₦)</label>
            <input id="quote-subtotal" v-model.number="form.subtotal" type="number" min="0" step="1000" class="field-base text-[13px]" :aria-invalid="errors.subtotal ? 'true' : undefined" />
            <p v-if="errors.subtotal" class="mt-1 text-xs font-medium text-red-700">{{ errors.subtotal }}</p>
          </div>
          <div>
            <label for="quote-install" class="mb-1.5 block text-[13px] font-semibold text-ink">Installation (₦)</label>
            <input id="quote-install" v-model.number="form.install" type="number" min="0" step="1000" class="field-base text-[13px]" :aria-invalid="errors.install ? 'true' : undefined" />
            <p v-if="errors.install" class="mt-1 text-xs font-medium text-red-700">{{ errors.install }}</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div>
            <label for="quote-form-status" class="mb-1.5 block text-[13px] font-semibold text-ink">Status</label>
            <select id="quote-form-status" v-model="form.status" class="field-base text-[13px]">
              <option v-for="option in quoteStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div>
            <label for="quote-valid" class="mb-1.5 block text-[13px] font-semibold text-ink">Valid until <span class="text-red-700" aria-hidden="true">*</span></label>
            <input id="quote-valid" v-model="form.validUntil" type="date" class="field-base text-[13px]" :aria-invalid="errors.validUntil ? 'true' : undefined" />
            <p v-if="errors.validUntil" class="mt-1 text-xs font-medium text-red-700">{{ errors.validUntil }}</p>
          </div>
          <div>
            <label for="quote-form-owner" class="mb-1.5 block text-[13px] font-semibold text-ink">Owner</label>
            <select id="quote-form-owner" v-model="form.owner" class="field-base text-[13px]">
              <option v-for="name in adminOwnerOptions" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>
        </div>

        <div class="rounded-xl border border-forest-900/10 bg-white p-3">
          <div class="flex items-baseline justify-between gap-4">
            <p class="text-[11px] font-semibold text-muted">Demo total</p>
            <p class="font-display text-xl font-bold text-ink">{{ formatNaira(draftTotal) }}</p>
          </div>
          <p class="mt-1 text-[10px] leading-4 text-muted">
            {{ form.items }} line item{{ form.items === 1 ? '' : 's' }}. Indicative only — excludes VAT, transport and site-specific works unless entered above.
          </p>
        </div>

        <div v-if="editingId" class="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-[10.5px] leading-5 text-sky-900">
          Editing {{ quotes.find((quote) => quote.id === editingId)?.reference }}. Changing the status does not notify anyone.
        </div>
      </form>

      <template #footer>
        <AppButton variant="ghost" size="sm" @click="modalOpen = false">Cancel</AppButton>
        <AppButton size="sm" icon="i-lucide-check" @click="save">{{ editingId ? 'Save changes' : 'Create local quotation' }}</AppButton>
      </template>
    </AdminModal>
  </div>
</template>
