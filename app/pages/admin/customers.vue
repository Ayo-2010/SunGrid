<script setup lang="ts">
import type { AdminCustomer } from '#shared/types'
import { nigerianStates } from '~/data/site'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin customers',
  description: 'Demonstration customer records for the SunGrid Energy admin prototype. All names and contact details are mock data.',
  noindex: true,
})

const admin = useAdminData()
const toast = useToast()

const search = ref('')
const type = ref('all')
const stateFilter = ref('all')

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const errors = reactive<Record<string, string>>({})

const form = reactive({
  name: '',
  type: 'Homeowner',
  phone: '',
  email: '',
  city: '',
  state: 'Lagos',
})

const baseTypes = ['Homeowner', 'Tenant', 'Business', 'Developer', 'Institution', 'School', 'Pharmacy', 'Restaurant', 'Factory', 'Other']

const customers = computed(() => admin.state.value.customers)

const typeOptions = computed(() => {
  const types = new Set<string>(baseTypes)
  customers.value.forEach((customer) => types.add(customer.type))
  return ['all', ...Array.from(types).sort()]
})

const stateOptions = computed(() => {
  const states = new Set<string>(nigerianStates)
  customers.value.forEach((customer) => states.add(customer.state))
  return ['all', ...Array.from(states).sort()]
})

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return customers.value.filter((customer) => {
    if (type.value !== 'all' && customer.type !== type.value) return false
    if (stateFilter.value !== 'all' && customer.state !== stateFilter.value) return false
    if (!term) return true
    return `${customer.name} ${customer.phone} ${customer.email} ${customer.city} ${customer.state} ${customer.type}`
      .toLowerCase()
      .includes(term)
  })
})

const withProjects = computed(() => customers.value.filter((customer) => customer.projects > 0).length)
const totalSpend = computed(() => customers.value.reduce((total, customer) => total + customer.totalSpend, 0))
const newThisMonth = computed(() => {
  const month = new Date().toISOString().slice(0, 7)
  return customers.value.filter((customer) => customer.joined.startsWith(month)).length
})

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function openNew() {
  editingId.value = null
  clearErrors()
  form.name = ''
  form.type = 'Homeowner'
  form.phone = ''
  form.email = ''
  form.city = ''
  form.state = 'Lagos'
  modalOpen.value = true
}

function openEdit(customer: AdminCustomer) {
  editingId.value = customer.id
  clearErrors()
  form.name = customer.name
  form.type = customer.type
  form.phone = customer.phone
  form.email = customer.email
  form.city = customer.city
  form.state = customer.state
  modalOpen.value = true
}

function validate(): boolean {
  clearErrors()
  if (!form.name.trim()) errors.name = 'Enter the customer name.'
  if (!form.phone.trim()) errors.phone = 'Enter a phone number.'
  else if (!/^\+?[0-9 ()-]{7,20}$/.test(form.phone.trim())) errors.phone = 'Use a format such as +234 803 555 0100.'
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.city.trim()) errors.city = 'Enter a city or town.'
  return Object.keys(errors).length === 0
}

function save() {
  if (!validate()) return
  if (editingId.value) {
    admin.updateCustomer(editingId.value, {
      name: form.name.trim(),
      type: form.type,
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      state: form.state,
    })
    toast.add({ title: 'Customer updated', description: 'Changes are stored in this browser only.', color: 'success' })
  } else {
    const created = admin.addCustomer({
      name: form.name.trim(),
      type: form.type,
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      state: form.state,
    })
    toast.add({ title: `${created.name} added`, description: 'Demo customer record saved locally. No invitation was sent.', color: 'success' })
  }
  modalOpen.value = false
}

function exportCsv() {
  const ok = downloadCsv('sungrid-demo-customers.csv', filtered.value, [
    { key: 'name', label: 'Customer' },
    { key: 'type', label: 'Type' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'joined', label: 'Joined' },
    { key: 'projects', label: 'Projects' },
    { key: 'totalSpend', label: 'Recorded spend (NGN)' },
    { key: 'lastContact', label: 'Last contact' },
  ])
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${filtered.value.length} customer records exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}

function resetFilters() {
  search.value = ''
  type.value = 'all'
  stateFilter.value = 'all'
}
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="CRM"
      title="Customers"
      description="A small demo customer register. Recorded spend and project counts are seeded examples, not real transactions."
      badge="Mock records"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" icon="i-lucide-download" @click="exportCsv">Export CSV</AppButton>
        <AppButton size="sm" icon="i-lucide-user-plus" @click="openNew">Add customer</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Customer records" :value="String(customers.length)" icon="i-lucide-users" hint="Browser demo data" />
      <AdminStatCard label="With projects" :value="String(withProjects)" icon="i-lucide-folder-check" hint="At least one recorded project" />
      <AdminStatCard label="Recorded spend" :value="formatNaira(totalSpend, { compact: true })" icon="i-lucide-banknote" hint="Illustrative totals" />
      <AdminStatCard label="Added this month" :value="String(newThisMonth)" icon="i-lucide-user-round-plus" hint="Based on joined date" />
    </div>

    <AdminPanel :padded="false">
      <template #actions>
        <p class="text-[10px] text-muted">Showing <strong class="font-semibold text-ink">{{ filtered.length }}</strong> of {{ customers.length }}</p>
      </template>

      <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
        <div class="grid gap-2 md:grid-cols-[minmax(0,1fr)_11rem_11rem]">
          <div class="relative">
            <label for="customer-search" class="sr-only">Search customers</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="customer-search" v-model="search" type="search" class="field-base !py-2 pl-8 text-[12px]" placeholder="Search name, phone, email or city…" />
          </div>
          <div>
            <label for="customer-type" class="sr-only">Filter by customer type</label>
            <select id="customer-type" v-model="type" class="field-base !py-2 text-[12px]">
              <option v-for="entry in typeOptions" :key="entry" :value="entry">{{ entry === 'all' ? 'All customer types' : entry }}</option>
            </select>
          </div>
          <div>
            <label for="customer-state" class="sr-only">Filter by state</label>
            <select id="customer-state" v-model="stateFilter" class="field-base !py-2 text-[12px]">
              <option v-for="entry in stateOptions" :key="entry" :value="entry">{{ entry === 'all' ? 'All states' : entry }}</option>
            </select>
          </div>
        </div>
        <button
          v-if="search || type !== 'all' || stateFilter !== 'all'"
          type="button"
          class="mt-2 text-[10px] font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-600"
          @click="resetFilters"
        >
          Clear filters
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[58rem] text-left">
          <caption class="sr-only">Demo customer register</caption>
          <thead>
            <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
              <th scope="col" class="px-4 py-2.5 font-semibold">Customer</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Contact</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Location</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Joined</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Projects</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Recorded spend</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Last contact</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-forest-900/[0.06]">
            <tr v-for="customer in filtered" :key="customer.id" class="hover:bg-cream-deep/20">
              <td class="px-4 py-3">
                <p class="text-[11.5px] font-semibold text-ink">{{ customer.name }}</p>
                <p class="mt-0.5 inline-flex rounded bg-forest-50 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-wide text-forest-800">{{ customer.type }}</p>
              </td>
              <td class="px-4 py-3">
                <a :href="`tel:${customer.phone.replace(/\s/g, '')}`" class="block text-[10.5px] font-medium text-forest-800 hover:underline">{{ customer.phone }}</a>
                <p class="mt-0.5 max-w-[12rem] truncate text-[9.5px] text-muted">{{ customer.email }}</p>
              </td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ customer.city }}, {{ customer.state }}</td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ formatDate(customer.joined) }}</td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ customer.projects }}</td>
              <td class="px-4 py-3 text-[10.5px] font-semibold text-ink">{{ customer.totalSpend ? formatNaira(customer.totalSpend, { compact: true }) : '—' }}</td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ formatDate(customer.lastContact) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/quotations?new=1&customer=${encodeURIComponent(customer.name)}&phone=${encodeURIComponent(customer.phone)}`"
                    class="text-[10px] font-medium text-muted underline underline-offset-2 hover:text-forest-700"
                  >
                    Quote
                  </NuxtLink>
                  <button
                    type="button"
                    class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-semibold text-forest-800 hover:bg-forest-50"
                    @click="openEdit(customer)"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="!filtered.length"
        icon="i-lucide-users"
        title="No customers match"
        description="Clear the filters or add a demo customer record to get started."
      >
        <div class="flex flex-wrap justify-center gap-2">
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="resetFilters">Clear filters</AppButton>
          <AppButton size="sm" icon="i-lucide-user-plus" @click="openNew">Add customer</AppButton>
        </div>
      </EmptyState>
    </AdminPanel>

    <AdminModal
      v-model:open="modalOpen"
      :title="editingId ? 'Edit demo customer' : 'Add demo customer'"
      description="Names, phone numbers and emails should be fictional. Records stay in this browser and are not sent anywhere."
      size="md"
    >
      <form class="space-y-3" @submit.prevent="save">
        <AppInput v-model="form.name" label="Full name or organisation" required :error="errors.name" placeholder="e.g. Adeola Balogun" />
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="form.phone" label="Phone" type="tel" inputmode="tel" required :error="errors.phone" placeholder="+234 803 555 0100" />
          <AppInput v-model="form.email" label="Email" type="email" inputmode="email" :error="errors.email" placeholder="name@example.com" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label for="customer-form-type" class="mb-1.5 block text-[13px] font-semibold text-ink">Customer type</label>
            <select id="customer-form-type" v-model="form.type" class="field-base text-[13px]">
              <option v-for="entry in baseTypes" :key="entry" :value="entry">{{ entry }}</option>
            </select>
          </div>
          <div>
            <label for="customer-form-state" class="mb-1.5 block text-[13px] font-semibold text-ink">State</label>
            <select id="customer-form-state" v-model="form.state" class="field-base text-[13px]">
              <option v-for="entry in nigerianStates" :key="entry" :value="entry">{{ entry }}</option>
            </select>
          </div>
        </div>
        <AppInput v-model="form.city" label="City or town" required :error="errors.city" placeholder="e.g. Lekki" />
      </form>

      <template #footer>
        <AppButton variant="ghost" size="sm" @click="modalOpen = false">Cancel</AppButton>
        <AppButton size="sm" icon="i-lucide-check" @click="save">{{ editingId ? 'Save changes' : 'Add customer' }}</AppButton>
      </template>
    </AdminModal>
  </div>
</template>
