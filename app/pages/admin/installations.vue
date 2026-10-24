<script setup lang="ts">
import type { AdminInstallation, ProjectStage } from '#shared/types'
import { nextInstallationStage } from '~/utils/admin'
import { stageOptions } from '~/utils/status'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin installations',
  description: 'Demonstration installation board. Move mock projects through delivery stages; changes stay in the browser.',
  noindex: true,
})

const admin = useAdminData()
const toast = useToast()

const search = ref('')
const tech = ref('all')

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const errors = reactive<Record<string, string>>({})

const form = reactive({
  customer: '',
  location: '',
  capacity: '',
  stage: 'assessment' as ProjectStage,
  tech: 'Unassigned',
  startDate: new Date().toISOString().slice(0, 10),
  targetDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
  nextAction: '',
})

const installations = computed(() => admin.state.value.installations)

const techOptions = computed(() => {
  const names = new Set<string>(['Unassigned'])
  admin.state.value.team.filter((member) => member.role === 'Installation Technician').forEach((member) => names.add(member.name))
  installations.value.forEach((item) => names.add(item.tech))
  return Array.from(names).sort()
})

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return installations.value.filter((item) => {
    if (tech.value !== 'all' && item.tech !== tech.value) return false
    if (!term) return true
    return `${item.customer} ${item.reference} ${item.location} ${item.capacity} ${item.tech} ${item.nextAction}`
      .toLowerCase()
      .includes(term)
  })
})

const board = computed(() =>
  stageOptions.map((stage) => ({
    ...stage,
    items: filtered.value.filter((item) => item.stage === stage.value),
  })),
)

const active = computed(() => installations.value.filter((item) => item.stage !== 'complete').length)
const onSite = computed(() => installations.value.filter((item) => item.stage === 'installation' || item.stage === 'commissioning').length)
const completed = computed(() => installations.value.filter((item) => item.stage === 'complete').length)
const averageProgress = computed(() => {
  const activeJobs = installations.value.filter((item) => item.stage !== 'complete')
  if (!activeJobs.length) return 0
  return Math.round(activeJobs.reduce((total, item) => total + item.progress, 0) / activeJobs.length)
})

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function openNew() {
  editingId.value = null
  clearErrors()
  form.customer = ''
  form.location = ''
  form.capacity = ''
  form.stage = 'assessment'
  form.tech = 'Unassigned'
  form.startDate = new Date().toISOString().slice(0, 10)
  form.targetDate = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
  form.nextAction = ''
  modalOpen.value = true
}

function openEdit(installation: AdminInstallation) {
  editingId.value = installation.id
  clearErrors()
  form.customer = installation.customer
  form.location = installation.location
  form.capacity = installation.capacity
  form.stage = installation.stage
  form.tech = installation.tech
  form.startDate = installation.startDate
  form.targetDate = installation.targetDate
  form.nextAction = installation.nextAction
  modalOpen.value = true
}

function validate(): boolean {
  clearErrors()
  if (!form.customer.trim()) errors.customer = 'Enter the customer or site name.'
  if (!form.location.trim()) errors.location = 'Enter the site location.'
  if (!form.capacity.trim()) errors.capacity = 'Describe the system size, e.g. 5.5 kWp / 10.24 kWh.'
  if (!form.startDate) errors.startDate = 'Choose a start date.'
  if (!form.targetDate) errors.targetDate = 'Choose a target date.'
  else if (form.startDate && form.targetDate < form.startDate) errors.targetDate = 'Target date cannot be before the start date.'
  return Object.keys(errors).length === 0
}

function save() {
  if (!validate()) return
  if (editingId.value) {
    admin.updateInstallation(editingId.value, {
      customer: form.customer.trim(),
      location: form.location.trim(),
      capacity: form.capacity.trim(),
      stage: form.stage,
      tech: form.tech,
      startDate: form.startDate,
      targetDate: form.targetDate,
      nextAction: form.nextAction.trim() || 'Confirm next step with the customer',
    })
    toast.add({ title: 'Installation updated', description: 'Stage and progress saved in this browser.', color: 'success' })
  } else {
    const created = admin.addInstallation({
      customer: form.customer.trim(),
      location: form.location.trim(),
      capacity: form.capacity.trim(),
      stage: form.stage,
      tech: form.tech,
      startDate: form.startDate,
      targetDate: form.targetDate,
      nextAction: form.nextAction.trim(),
    })
    toast.add({ title: `${created.reference} added`, description: 'Demo installation created locally. No crew was scheduled.', color: 'success' })
  }
  modalOpen.value = false
}

function advance(installation: AdminInstallation) {
  const next = admin.advanceInstallation(installation.id)
  if (!next) return
  toast.add({
    title: next === 'complete' ? 'Installation marked complete' : `Moved to ${stageLabel(next)}`,
    description: `${installation.customer} · progress updated to ${installation.progress}%. Local demo only.`,
    color: 'success',
  })
}

function nextStageLabel(stage: ProjectStage): string {
  return stageLabel(nextInstallationStage(stage))
}

function exportCsv() {
  const ok = downloadCsv('sungrid-demo-installations.csv', filtered.value, [
    { key: 'reference', label: 'Reference' },
    { key: 'customer', label: 'Customer' },
    { key: 'location', label: 'Location' },
    { key: 'capacity', label: 'System size' },
    { key: 'stage', label: 'Stage', value: (row) => stageLabel(row.stage) },
    { key: 'progress', label: 'Progress (%)' },
    { key: 'tech', label: 'Technician' },
    { key: 'startDate', label: 'Start date' },
    { key: 'targetDate', label: 'Target date' },
    { key: 'nextAction', label: 'Next action' },
  ])
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${filtered.value.length} installation records exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Delivery"
      title="Installations"
      description="A stage board for demo projects. Moving a card updates its stage and progress locally; it does not schedule a crew or notify a customer."
      badge="Mock projects"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" icon="i-lucide-download" @click="exportCsv">Export CSV</AppButton>
        <AppButton size="sm" icon="i-lucide-plus" @click="openNew">New installation</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Active projects" :value="String(active)" icon="i-lucide-hammer" hint="Not yet complete" />
      <AdminStatCard label="On site" :value="String(onSite)" icon="i-lucide-hard-hat" hint="Installation or commissioning" />
      <AdminStatCard label="Completed" :value="String(completed)" icon="i-lucide-circle-check" hint="Seeded and local records" />
      <AdminStatCard label="Average progress" :value="`${averageProgress}%`" icon="i-lucide-gauge" hint="Across active projects" />
    </div>

    <div class="rounded-2xl border border-forest-900/10 bg-white p-3.5 shadow-soft sm:p-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <label for="installation-search" class="sr-only">Search installations</label>
          <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="installation-search"
            v-model="search"
            type="search"
            class="field-base !py-2 pl-8 text-[12px]"
            placeholder="Search customer, reference, location or size…"
          />
        </div>
        <div class="sm:w-52">
          <label for="installation-tech" class="sr-only">Filter by technician</label>
          <select id="installation-tech" v-model="tech" class="field-base !py-2 text-[12px]">
            <option value="all">All technicians</option>
            <option v-for="name in techOptions" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <p class="text-[10px] text-muted sm:ml-2">{{ filtered.length }} of {{ installations.length }} records</p>
      </div>
    </div>

    <div class="flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-6 xl:overflow-visible">
      <section
        v-for="stage in board"
        :key="stage.value"
        class="flex w-[15.5rem] shrink-0 flex-col rounded-2xl border border-forest-900/10 bg-white xl:w-auto"
        :aria-labelledby="`stage-${stage.value}`"
      >
        <header class="flex items-center justify-between gap-2 border-b border-forest-900/[0.07] px-3 py-2.5">
          <h2 :id="`stage-${stage.value}`" class="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink">
            <span class="size-1.5 rounded-full" :class="stageTone(stage.value).includes('amber') ? 'bg-amber-500' : stageTone(stage.value).includes('sky') ? 'bg-sky-500' : stageTone(stage.value).includes('violet') ? 'bg-violet-500' : stageTone(stage.value).includes('green') ? 'bg-green-500' : stageTone(stage.value).includes('forest') ? 'bg-forest-500' : 'bg-stone-400'" />
            {{ stage.label }}
          </h2>
          <span class="rounded-full bg-cream-deep px-1.5 py-0.5 text-[9px] font-semibold text-muted">{{ stage.items.length }}</span>
        </header>

        <div class="flex-1 space-y-2 p-2">
          <article
            v-for="project in stage.items"
            :key="project.id"
            class="rounded-xl border border-forest-900/[0.09] bg-cream/40 p-2.5"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-[10px] font-semibold text-forest-700">{{ project.reference }}</p>
              <button
                type="button"
                class="text-[9px] font-medium text-muted underline underline-offset-2 hover:text-forest-700"
                @click="openEdit(project)"
              >
                Edit
              </button>
            </div>
            <p class="mt-0.5 text-[11.5px] font-semibold leading-4 text-ink">{{ project.customer }}</p>
            <p class="mt-0.5 flex items-center gap-1 text-[9.5px] text-muted">
              <UIcon name="i-lucide-map-pin" class="size-2.5 shrink-0" aria-hidden="true" />
              {{ project.location }}
            </p>
            <p class="mt-1 text-[9.5px] font-medium text-ink-soft">{{ project.capacity }}</p>

            <div class="mt-2 flex items-center gap-1.5">
              <div class="h-1 flex-1 overflow-hidden rounded-full bg-forest-900/[0.08]">
                <div class="h-full rounded-full bg-forest-600" :style="{ width: `${project.progress}%` }" />
              </div>
              <span class="text-[8.5px] font-semibold text-muted">{{ project.progress }}%</span>
            </div>

            <div class="mt-2 space-y-0.5 text-[9px] text-muted">
              <p class="flex items-center gap-1">
                <UIcon name="i-lucide-user" class="size-2.5 shrink-0" aria-hidden="true" />
                {{ project.tech }}
              </p>
              <p class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" class="size-2.5 shrink-0" aria-hidden="true" />
                Target {{ formatDate(project.targetDate) }}
              </p>
            </div>

            <p class="mt-2 line-clamp-2 rounded-md bg-white px-1.5 py-1 text-[8.5px] leading-3.5 text-muted">
              {{ project.nextAction }}
            </p>

            <button
              v-if="project.stage !== 'complete'"
              type="button"
              class="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-forest-900 px-2 py-1 text-[9px] font-semibold text-cream transition-colors hover:bg-forest-800"
              @click="advance(project)"
            >
              Move to {{ nextStageLabel(project.stage) }}
              <UIcon name="i-lucide-arrow-right" class="size-2.5" aria-hidden="true" />
            </button>
            <p v-else class="mt-2 flex items-center justify-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-800">
              <UIcon name="i-lucide-check" class="size-2.5" aria-hidden="true" />
              Complete
            </p>
          </article>

          <p v-if="!stage.items.length" class="rounded-lg border border-dashed border-forest-900/15 px-2 py-5 text-center text-[9.5px] text-muted">
            No projects
          </p>
        </div>
      </section>
    </div>

    <p class="text-[10px] leading-4 text-muted">
      Moving a card is a local demo action. Progress follows a fixed schedule per stage. Use <strong class="font-semibold text-ink">Edit</strong> to adjust dates, technician or the next action.
    </p>

    <AdminModal
      v-model:open="modalOpen"
      :title="editingId ? 'Edit demo installation' : 'New demo installation'"
      description="No crew, calendar invite or customer notification is created. The record is saved in this browser."
      size="lg"
    >
      <form class="space-y-3" @submit.prevent="save">
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="form.customer" label="Customer or site" required :error="errors.customer" placeholder="e.g. Grace Nwankwo" />
          <AppInput v-model="form.location" label="Location" required :error="errors.location" placeholder="e.g. Bodija, Ibadan" />
        </div>
        <AppInput v-model="form.capacity" label="System size" required :error="errors.capacity" placeholder="e.g. 10 kWp / 10.24 kWh" hint="Use Wp, kWp or kWh as appropriate." />

        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label for="install-stage" class="mb-1.5 block text-[13px] font-semibold text-ink">Stage</label>
            <select id="install-stage" v-model="form.stage" class="field-base text-[13px]">
              <option v-for="stage in stageOptions" :key="stage.value" :value="stage.value">{{ stage.label }}</option>
            </select>
          </div>
          <div>
            <label for="install-tech" class="mb-1.5 block text-[13px] font-semibold text-ink">Technician</label>
            <select id="install-tech" v-model="form.tech" class="field-base text-[13px]">
              <option v-for="name in techOptions" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label for="install-start" class="mb-1.5 block text-[13px] font-semibold text-ink">Start date <span class="text-red-700" aria-hidden="true">*</span></label>
            <input id="install-start" v-model="form.startDate" type="date" class="field-base text-[13px]" :aria-invalid="errors.startDate ? 'true' : undefined" />
            <p v-if="errors.startDate" class="mt-1 text-xs font-medium text-red-700">{{ errors.startDate }}</p>
          </div>
          <div>
            <label for="install-target" class="mb-1.5 block text-[13px] font-semibold text-ink">Target date <span class="text-red-700" aria-hidden="true">*</span></label>
            <input id="install-target" v-model="form.targetDate" type="date" class="field-base text-[13px]" :aria-invalid="errors.targetDate ? 'true' : undefined" />
            <p v-if="errors.targetDate" class="mt-1 text-xs font-medium text-red-700">{{ errors.targetDate }}</p>
          </div>
        </div>

        <AppTextarea v-model="form.nextAction" label="Next action" :rows="2" placeholder="e.g. Confirm equipment delivery date" />
      </form>

      <template #footer>
        <AppButton variant="ghost" size="sm" @click="modalOpen = false">Cancel</AppButton>
        <AppButton size="sm" icon="i-lucide-check" @click="save">{{ editingId ? 'Save changes' : 'Create installation' }}</AppButton>
      </template>
    </AdminModal>
  </div>
</template>
