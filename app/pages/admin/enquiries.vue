<script setup lang="ts">
import type { DemoEnquiry, EnquiryStatus } from '#shared/types'
import { adminOwnerOptions } from '~/utils/admin'
import { enquiryStatusOptions } from '~/utils/status'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin enquiries',
  description: 'Demonstration enquiry inbox. Assign owners, update statuses and add notes in the browser only.',
  noindex: true,
})

const store = useEnquiries()
const admin = useAdminData()
const route = useRoute()
const toast = useToast()

const search = ref('')
const status = ref<'all' | EnquiryStatus>('all')
const owner = ref('all')

const detailOpen = ref(false)
const selectedId = ref<string | null>(null)
const noteDraft = ref('')
const statusDraft = ref<EnquiryStatus>('new')
const ownerDraft = ref('Unassigned')
const followUpDraft = ref('')

const selected = computed(() => store.enquiries.value.find((item) => item.id === selectedId.value) ?? null)

const whatsappUrl = computed(() => {
  const digits = selected.value?.phone.replace(/\D/g, '').replace(/^0/, '234') ?? ''
  return `https://wa.me/${digits || '2347045033528'}`
})

const ownerOptions = computed(() => {
  const names = new Set<string>(adminOwnerOptions)
  admin.state.value.team.forEach((member) => names.add(member.name))
  store.enquiries.value.forEach((item) => names.add(item.assignedTo))
  return ['all', ...Array.from(names).sort()]
})

const teamOwnerOptions = computed(() => {
  const names = new Set<string>(adminOwnerOptions)
  admin.state.value.team.filter((member) => member.status !== 'disabled').forEach((member) => names.add(member.name))
  return Array.from(names)
})

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return store.enquiries.value.filter((enquiry) => {
    if (status.value !== 'all' && enquiry.status !== status.value) return false
    if (owner.value !== 'all' && enquiry.assignedTo !== owner.value) return false
    if (!term) return true
    return `${enquiry.fullName} ${enquiry.reference} ${enquiry.phone} ${enquiry.email} ${enquiry.city} ${enquiry.state} ${enquiry.projectType} ${enquiry.loadDescription}`
      .toLowerCase()
      .includes(term)
  })
})

const openCount = computed(() => store.enquiries.value.filter((item) => item.status !== 'won' && item.status !== 'lost').length)
const unassignedCount = computed(() => store.enquiries.value.filter((item) => item.assignedTo === 'Unassigned').length)
const wonCount = computed(() => store.enquiries.value.filter((item) => item.status === 'won').length)
const dueFollowUps = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return store.enquiries.value.filter(
    (item) => item.followUpDate && item.followUpDate <= today && item.status !== 'won' && item.status !== 'lost',
  ).length
})

function openEnquiry(enquiry: DemoEnquiry) {
  selectedId.value = enquiry.id
  statusDraft.value = enquiry.status
  ownerDraft.value = enquiry.assignedTo
  followUpDraft.value = enquiry.followUpDate ?? ''
  noteDraft.value = ''
  detailOpen.value = true
}

function saveDetails() {
  if (!selected.value) return
  store.updateEnquiry(selected.value.id, {
    status: statusDraft.value,
    assignedTo: ownerDraft.value,
    followUpDate: followUpDraft.value || null,
  })
  toast.add({
    title: 'Enquiry updated',
    description: `${selected.value.reference} saved in this browser.`,
    color: 'success',
  })
}

function addNote() {
  if (!selected.value || !noteDraft.value.trim()) return
  store.addNote(selected.value.id, noteDraft.value, 'Abdullah Abdulwahab')
  noteDraft.value = ''
  toast.add({ title: 'Note added', description: 'The note is stored locally with this enquiry.', color: 'success' })
}

function createQuote() {
  if (!selected.value) return
  const enquiry = selected.value
  detailOpen.value = false
  navigateTo(
    `/admin/quotations?new=1&customer=${encodeURIComponent(enquiry.fullName)}&phone=${encodeURIComponent(enquiry.phone)}&enquiry=${encodeURIComponent(enquiry.reference)}`,
  )
}

function exportCsv() {
  const ok = downloadCsv('sungrid-demo-enquiries.csv', filtered.value, [
    { key: 'reference', label: 'Reference' },
    { key: 'fullName', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'projectType', label: 'Project type' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'status', label: 'Status', value: (row) => enquiryStatusLabel(row.status) },
    { key: 'assignedTo', label: 'Owner' },
    { key: 'budget', label: 'Budget' },
    { key: 'createdAt', label: 'Received' },
    { key: 'followUpDate', label: 'Follow-up' },
  ])
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${filtered.value.length} enquiry records exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}

function resetFilters() {
  search.value = ''
  status.value = 'all'
  owner.value = 'all'
}

onMounted(() => {
  const focus = route.query.focus
  if (typeof focus !== 'string') return
  const match = store.find(focus)
  if (match) openEnquiry(match)
})
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Sales inbox"
      title="Enquiries"
      description="Quote requests from the demo website plus seeded records. Status, ownership and notes are kept in this browser; no email or notification is sent."
      badge="Mock inbox"
    >
      <template #actions>
        <AppButton to="/quote" variant="outline" size="sm" icon="i-lucide-external-link">Open public quote form</AppButton>
        <AppButton size="sm" icon="i-lucide-download" @click="exportCsv">Export CSV</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Open enquiries" :value="String(openCount)" icon="i-lucide-inbox" hint="Excludes won and lost" />
      <AdminStatCard label="Unassigned" :value="String(unassignedCount)" icon="i-lucide-user-round-x" hint="Needs an owner" />
      <AdminStatCard label="Follow-ups due" :value="String(dueFollowUps)" icon="i-lucide-calendar-clock" hint="Due today or overdue" />
      <AdminStatCard label="Won (demo)" :value="String(wonCount)" icon="i-lucide-circle-check" hint="Seeded records only" />
    </div>

    <AdminPanel :padded="false">
      <template #actions>
        <p class="text-[10px] text-muted">Showing <strong class="font-semibold text-ink">{{ filtered.length }}</strong> of {{ store.enquiries.value.length }}</p>
      </template>

      <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
        <div class="grid gap-2 md:grid-cols-[minmax(0,1fr)_11rem_12rem]">
          <div class="relative">
            <label for="enquiry-search" class="sr-only">Search enquiries</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="enquiry-search"
              v-model="search"
              type="search"
              class="field-base !py-2 pl-8 text-[12px]"
              placeholder="Search name, reference, phone, location…"
            />
          </div>
          <div>
            <label for="enquiry-status" class="sr-only">Filter by status</label>
            <select id="enquiry-status" v-model="status" class="field-base !py-2 text-[12px]">
              <option value="all">All statuses</option>
              <option v-for="option in enquiryStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div>
            <label for="enquiry-owner" class="sr-only">Filter by owner</label>
            <select id="enquiry-owner" v-model="owner" class="field-base !py-2 text-[12px]">
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
        <table class="w-full min-w-[58rem] text-left">
          <caption class="sr-only">Demo enquiries with status and ownership</caption>
          <thead>
            <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
              <th scope="col" class="px-4 py-2.5 font-semibold">Customer</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Contact</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Project</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Owner</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Follow-up</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-forest-900/[0.06]">
            <tr v-for="enquiry in filtered" :key="enquiry.id" class="align-top hover:bg-cream-deep/20">
              <td class="px-4 py-3">
                <p class="text-[11.5px] font-semibold text-ink">{{ enquiry.fullName }}</p>
                <p class="mt-0.5 text-[9.5px] text-muted">{{ enquiry.reference }} · {{ enquiry.source }}</p>
                <p class="text-[9.5px] text-muted">{{ formatDate(enquiry.createdAt) }}</p>
              </td>
              <td class="px-4 py-3">
                <a :href="`tel:${enquiry.phone.replace(/\s/g, '')}`" class="block text-[10.5px] font-medium text-forest-800 hover:underline">{{ enquiry.phone }}</a>
                <p class="mt-0.5 max-w-[11rem] truncate text-[9.5px] text-muted">{{ enquiry.email || 'No email provided' }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="text-[10.5px] text-ink-soft">{{ enquiry.projectType }} · {{ enquiry.systemType }}</p>
                <p class="text-[9.5px] text-muted">{{ enquiry.city }}, {{ enquiry.state }} · {{ enquiry.backupHours }}h backup</p>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1" :class="enquiryStatusTone(enquiry.status)">
                  {{ enquiryStatusLabel(enquiry.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ enquiry.assignedTo }}</td>
              <td class="px-4 py-3 text-[10.5px]">
                <span v-if="enquiry.followUpDate" :class="enquiry.followUpDate <= new Date().toISOString().slice(0, 10) && enquiry.status !== 'won' && enquiry.status !== 'lost' ? 'font-semibold text-amber-800' : 'text-muted'">
                  {{ formatDate(enquiry.followUpDate) }}
                </span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-semibold text-forest-800 hover:bg-forest-50"
                  @click="openEnquiry(enquiry)"
                >
                  Open
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="!filtered.length"
        icon="i-lucide-inbox"
        title="No enquiries match"
        description="Try a different search term, status or owner. New demo quote requests appear here after the public form is submitted in this browser."
      >
        <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="resetFilters">Clear filters</AppButton>
      </EmptyState>
    </AdminPanel>

    <AdminModal
      v-model:open="detailOpen"
      :title="selected ? `${selected.fullName} · ${selected.reference}` : 'Enquiry'"
      description="Update the demo record or add an internal note. Nothing is emailed and no task is created."
      size="xl"
    >
      <div v-if="selected" class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div class="space-y-4">
          <div class="grid gap-2 sm:grid-cols-2">
            <div class="rounded-xl border border-forest-900/10 bg-white p-3">
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Contact</p>
              <a :href="`tel:${selected.phone.replace(/\s/g, '')}`" class="mt-1 block text-[11.5px] font-semibold text-forest-800 hover:underline">{{ selected.phone }}</a>
              <a v-if="selected.email" :href="`mailto:${selected.email}`" class="mt-0.5 block truncate text-[10.5px] text-muted hover:underline">{{ selected.email }}</a>
              <p v-else class="mt-0.5 text-[10.5px] text-muted">No email provided</p>
              <p class="mt-2 text-[10px] text-muted">{{ selected.address }}</p>
              <p class="text-[10px] text-muted">{{ selected.city }}, {{ selected.state }}</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-white p-3">
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Project brief</p>
              <p class="mt-1 text-[11px] font-semibold text-ink">{{ selected.projectType }} · {{ selected.systemType }}</p>
              <p class="mt-0.5 text-[10px] text-muted">Budget: {{ selected.budget }}</p>
              <p class="text-[10px] text-muted">Backup: {{ selected.backupHours }} hours</p>
              <p class="mt-1 text-[10px] text-muted">Received {{ formatDate(selected.createdAt) }} via {{ selected.source }}</p>
            </div>
          </div>

          <div class="rounded-xl border border-forest-900/10 bg-white p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Load description</p>
            <p class="mt-1 text-[11px] leading-5 text-ink-soft">{{ selected.loadDescription }}</p>
          </div>

          <div v-if="selected.selectedProducts?.length" class="rounded-xl border border-forest-900/10 bg-white p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Products in enquiry list</p>
            <ul class="mt-1.5 space-y-1">
              <li v-for="item in selected.selectedProducts" :key="item.productId" class="flex justify-between gap-3 text-[10.5px] text-ink-soft">
                <span>{{ item.name }}</span>
                <span class="shrink-0 text-muted">× {{ item.quantity }}</span>
              </li>
            </ul>
          </div>

          <div v-if="selected.calculatorSummary" class="rounded-xl border border-forest-700/20 bg-forest-50 p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-forest-700">Calculator brief</p>
            <p class="mt-1 whitespace-pre-line text-[10.5px] leading-5 text-forest-900">{{ selected.calculatorSummary }}</p>
          </div>

          <div>
            <div class="flex items-center justify-between gap-2">
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Internal notes</p>
              <span class="text-[9px] text-muted">{{ selected.notes.length }} note{{ selected.notes.length === 1 ? '' : 's' }}</span>
            </div>
            <div v-if="selected.notes.length" class="mt-2 space-y-2">
              <div v-for="note in selected.notes" :key="note.id" class="rounded-lg border border-forest-900/[0.08] bg-white p-2.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-[10px] font-semibold text-ink">{{ note.author }}</p>
                  <p class="text-[9px] text-muted">{{ relativeTime(note.createdAt) }}</p>
                </div>
                <p class="mt-1 text-[10.5px] leading-5 text-ink-soft">{{ note.body }}</p>
              </div>
            </div>
            <p v-else class="mt-2 rounded-lg border border-dashed border-forest-900/15 px-3 py-3 text-[10.5px] text-muted">
              No internal notes yet.
            </p>

            <AppTextarea v-model="noteDraft" label="Add a note" :rows="3" placeholder="Site visit findings, call outcome, next step…" class="mt-3" />
            <div class="mt-2 flex justify-end">
              <AppButton size="sm" variant="outline" icon="i-lucide-plus" :disabled="!noteDraft.trim()" @click="addNote">Add note</AppButton>
            </div>
          </div>
        </div>

        <aside class="space-y-3">
          <div class="rounded-xl border border-forest-900/10 bg-white p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Workflow</p>
            <div class="mt-2 space-y-3">
              <div>
                <label for="detail-status" class="mb-1 block text-[10.5px] font-semibold text-ink">Status</label>
                <select id="detail-status" v-model="statusDraft" class="field-base !py-1.5 text-[11px]">
                  <option v-for="option in enquiryStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
              <div>
                <label for="detail-owner" class="mb-1 block text-[10.5px] font-semibold text-ink">Assigned to</label>
                <select id="detail-owner" v-model="ownerDraft" class="field-base !py-1.5 text-[11px]">
                  <option v-for="name in teamOwnerOptions" :key="name" :value="name">{{ name }}</option>
                </select>
              </div>
              <div>
                <label for="detail-followup" class="mb-1 block text-[10.5px] font-semibold text-ink">Follow-up date</label>
                <input id="detail-followup" v-model="followUpDraft" type="date" class="field-base !py-1.5 text-[11px]" />
              </div>
              <AppButton block size="sm" icon="i-lucide-save" @click="saveDetails">Save changes</AppButton>
            </div>
          </div>

          <div class="rounded-xl border border-forest-900/10 bg-cream-deep/50 p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Next step</p>
            <p class="mt-1 text-[10px] leading-4 text-muted">
              Turn this enquiry into a demo quotation. The customer name and phone are carried across; totals are entered manually.
            </p>
            <AppButton block size="sm" variant="secondary" class="mt-2" icon="i-lucide-file-plus-2" @click="createQuote">
              Create quotation
            </AppButton>
          </div>

          <div class="rounded-xl border border-amber-300/60 bg-amber-50 p-3">
            <p class="text-[10px] font-semibold text-amber-950">Stored in this browser</p>
            <p class="mt-0.5 text-[9.5px] leading-4 text-amber-900/80">
              Do not add real customer information. Clearing site data removes this record.
            </p>
          </div>
        </aside>
      </div>

      <template #footer>
        <AppButton
          v-if="selected"
          :href="whatsappUrl"
          external
          variant="ghost"
          size="sm"
          icon="i-lucide-message-circle"
          class="mr-auto"
        >
          WhatsApp demo number
        </AppButton>
        <AppButton variant="ghost" size="sm" @click="detailOpen = false">Close</AppButton>
        <AppButton size="sm" icon="i-lucide-save" @click="saveDetails">Save changes</AppButton>
      </template>
    </AdminModal>
  </div>
</template>
