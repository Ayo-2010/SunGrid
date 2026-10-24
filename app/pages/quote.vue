<script setup lang="ts">
import type { CalculatorBrief, QuoteRequestPayload } from '#shared/types'
import { nigerianStates, site } from '~/data/site'
import { fileValidation, quoteSchema, quoteStepFields, validateFiles, zodErrors } from '~/utils/validation'

usePageMeta({
  title: 'Request a solar quote',
  description:
    'Share your load, site and backup priorities in a four-step quote request. Demo form — details are stored in your browser only and are not sent to a server.',
  image: '/images/solar-house.jpg',
})

const toast = useToast()
const { detailed, count, remove, setQuantity, clear: clearProducts } = useQuoteList()
const { addEnquiry } = useEnquiries()

const steps = [
  { title: 'Your details', caption: 'Who we should speak to' },
  { title: 'Project', caption: 'Load, site and backup' },
  { title: 'Requirements', caption: 'Budget and attachments' },
  { title: 'Review', caption: 'Check and submit' },
]

interface QuoteFormState {
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
  website: string
}

const form = reactive<QuoteFormState>({
  fullName: '',
  phone: '',
  email: '',
  customerType: '',
  projectType: '',
  address: '',
  state: '',
  city: '',
  powerSource: '',
  loadDescription: '',
  backupHours: 8,
  systemType: '',
  budget: '',
  timeframe: '',
  comments: '',
  consent: false,
  website: '',
})

const step = ref(0)
const errors = ref<Record<string, string>>({})
const brief = ref<CalculatorBrief | null>(null)
const files = ref<File[]>([])
const fileError = ref('')
const submitted = ref(false)
const reference = ref('')
const savedSummary = ref('')
const wizardTop = ref<HTMLElement | null>(null)

onMounted(() => {
  try {
    const raw = sessionStorage.getItem(CALCULATOR_BRIEF_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as CalculatorBrief
    if (typeof parsed.summary !== 'string') return
    brief.value = parsed
    form.state = parsed.state
    form.backupHours = parsed.backupHours
    form.budget = budgetLabelFor(parsed.budget)
    form.systemType = systemLabelFor(parsed.systemPreference)
  } catch {
    /* Ignore malformed or unavailable session storage. */
  }
})

const customerTypes = ['Homeowner', 'Tenant', 'Business owner', 'Property developer', 'Institution / NGO', 'Other']
const projectTypes = [
  'Residential',
  'Commercial',
  'Industrial',
  'Off-grid / remote site',
  'Solar water pumping',
  'Solar street lighting',
  'Repair or upgrade',
  'Not sure yet',
]
const powerSources = ['Grid only', 'Generator only', 'Grid and generator', 'Existing solar system', 'No power source', 'Other']
const systemTypes = ['Hybrid', 'Off-grid', 'Grid-tied', 'Not sure']
const timeframes = ['As soon as possible', 'Within 1 month', '1–3 months', '3–6 months', 'Just researching']
const budgetOptions = [
  { value: 'Under ₦1,000,000', label: 'Under ₦1,000,000' },
  { value: '₦1,000,000 – ₦3,000,000', label: '₦1,000,000 – ₦3,000,000' },
  { value: '₦3,000,000 – ₦6,000,000', label: '₦3,000,000 – ₦6,000,000' },
  { value: '₦6,000,000 – ₦12,000,000', label: '₦6,000,000 – ₦12,000,000' },
  { value: 'Above ₦12,000,000', label: 'Above ₦12,000,000' },
  { value: 'Not sure yet', label: 'Not sure yet' },
]

function budgetLabelFor(value: string): string {
  return (
    {
      'under-1m': 'Under ₦1,000,000',
      '1m-3m': '₦1,000,000 – ₦3,000,000',
      '3m-6m': '₦3,000,000 – ₦6,000,000',
      '6m-12m': '₦6,000,000 – ₦12,000,000',
      'above-12m': 'Above ₦12,000,000',
      unsure: 'Not sure yet',
    }[value] ?? ''
  )
}

function systemLabelFor(value: string): string {
  return (
    {
      hybrid: 'Hybrid',
      'off-grid': 'Off-grid',
      'grid-tied': 'Grid-tied',
      'not-sure': 'Not sure',
    }[value] ?? ''
  )
}

const stateOptions = nigerianStates.map((state) => ({ value: state, label: state }))
const customerOptions = customerTypes.map((value) => ({ value, label: value }))
const projectOptions = projectTypes.map((value) => ({ value, label: value }))

const selectedProducts = computed(() =>
  detailed.value.map((entry) => ({
    productId: entry.product.id,
    name: `${entry.product.brand} ${entry.product.name}`,
    quantity: entry.quantity,
  })),
)

const indicativeTotal = computed(() =>
  detailed.value.reduce((total, entry) => {
    if (entry.product.price === null) return total
    return total + entry.product.price * entry.quantity
  }, 0),
)

const hasQuoteOnly = computed(() => detailed.value.some((entry) => entry.product.price === null))

const stepFields = computed(() => quoteStepFields[step.value]?.map(String) ?? [])

function validateStep(): boolean {
  const parsed = quoteSchema.safeParse(form)
  const all = parsed.success ? {} : zodErrors(parsed.error)
  const current = new Set(stepFields.value)
  errors.value = Object.fromEntries(Object.entries(all).filter(([key]) => current.has(key)))
  return Object.keys(errors.value).length === 0
}

function next() {
  if (!validateStep()) return
  if (step.value < steps.length - 1) {
    step.value += 1
    scrollToTop()
  }
}

function back() {
  if (step.value > 0) {
    step.value -= 1
    scrollToTop()
  }
}

function goTo(target: number) {
  if (target <= step.value) {
    step.value = target
    errors.value = {}
    scrollToTop()
  }
}

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  wizardTop.value?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const incoming = Array.from(input.files ?? [])
  const combined = [...files.value, ...incoming].slice(0, fileValidation.maxFiles + 1)
  const nextFiles = combined.slice(0, fileValidation.maxFiles)
  const error = validateFiles(combined)
  fileError.value = error ?? ''
  if (!error) files.value = nextFiles
  input.value = ''
}

function removeFile(index: number) {
  files.value = files.value.filter((_, fileIndex) => fileIndex !== index)
  fileError.value = validateFiles(files.value) ?? ''
}

function printableSummary(): string {
  const lines = [
    'SunGrid Energy — demo quote request',
    `Reference: ${reference.value}`,
    `Created: ${new Date().toLocaleString('en-NG')}`,
    '',
    'This request was stored in the browser only. It was not transmitted to SunGrid Energy or any third party.',
    '',
    `Name: ${form.fullName}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email || 'Not provided'}`,
    `Customer type: ${form.customerType}`,
    `Project type: ${form.projectType}`,
    `Address: ${form.address}, ${form.city}, ${form.state}`,
    `Power source: ${form.powerSource}`,
    `Preferred system: ${form.systemType}`,
    `Backup window: ${form.backupHours} hours`,
    `Budget: ${form.budget}`,
    `Timeframe: ${form.timeframe}`,
    '',
    `Load description: ${form.loadDescription}`,
    form.comments ? `Comments: ${form.comments}` : '',
    '',
    selectedProducts.value.length
      ? `Selected products:\n${selectedProducts.value.map((item) => `- ${item.quantity} × ${item.name}`).join('\n')}`
      : 'Selected products: none',
    '',
    brief.value ? `Calculator estimate:\n${brief.value.summary}` : '',
  ]
  return lines.filter((line) => line !== null).join('\n')
}

function submit() {
  const parsed = quoteSchema.safeParse(form)
  if (!parsed.success) {
    errors.value = zodErrors(parsed.error)
    const firstField = Object.keys(errors.value)[0]
    const firstStep = Object.entries(quoteStepFields).find(([, fields]) =>
      fields.map(String).includes(firstField ?? ''),
    )
    if (firstStep) step.value = Number(firstStep[0])
    scrollToTop()
    toast.add({ title: 'Please check the highlighted fields', description: 'Some required information is missing or invalid.', color: 'error' })
    return
  }

  const payload: QuoteRequestPayload = {
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email ?? '',
    customerType: parsed.data.customerType,
    projectType: parsed.data.projectType,
    address: parsed.data.address,
    state: parsed.data.state,
    city: parsed.data.city,
    powerSource: parsed.data.powerSource,
    loadDescription: parsed.data.loadDescription,
    backupHours: parsed.data.backupHours,
    systemType: parsed.data.systemType,
    budget: parsed.data.budget,
    timeframe: parsed.data.timeframe,
    comments: parsed.data.comments ?? '',
    consent: true,
    selectedProducts: selectedProducts.value,
    calculatorSummary: brief.value?.summary,
    files: files.value.map((file) => ({ name: file.name, size: file.size, type: file.type })),
  }

  const enquiry = addEnquiry(payload)
  reference.value = enquiry.reference
  savedSummary.value = printableSummary()
  submitted.value = true
  toast.add({
    title: 'Demo request saved',
    description: `Reference ${enquiry.reference}. It is stored in this browser only.`,
    color: 'success',
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function downloadSummary() {
  const blob = new Blob([savedSummary.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${reference.value || 'sungrid-demo-request'}.txt`
  link.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'Summary downloaded', description: 'Keep this file for your records. It is a demo document.' })
}

function startAnother() {
  submitted.value = false
  step.value = 0
  errors.value = {}
  files.value = []
  brief.value = null
  form.fullName = ''
  form.phone = ''
  form.email = ''
  form.customerType = ''
  form.projectType = ''
  form.address = ''
  form.state = ''
  form.city = ''
  form.powerSource = ''
  form.loadDescription = ''
  form.backupHours = 8
  form.systemType = ''
  form.budget = ''
  form.timeframe = ''
  form.comments = ''
  form.consent = false
  form.website = ''
  clearProducts()
  try {
    sessionStorage.removeItem(CALCULATOR_BRIEF_STORAGE_KEY)
  } catch {
    /* Ignore unavailable storage. */
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="Request a quote"
      title="Tell us what must keep running."
      description="A useful quote starts with a load list, not a guess. Four short steps give us enough context to prepare a preliminary recommendation and plan a site assessment."
      :breadcrumbs="[{ label: 'Request a Quote' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/calculator" variant="on-dark" icon="i-lucide-calculator">Use the calculator first</AppButton>
        <AppButton :href="site.phoneHref" variant="on-dark" icon="i-lucide-phone">Call the demo line</AppButton>
      </template>
    </PageHero>

    <section class="bg-cream">
      <div ref="wizardTop" class="page-container py-8 lg:py-12">
        <!-- Success -->
        <div v-if="submitted" class="mx-auto max-w-3xl">
          <div class="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft sm:p-9">
            <div class="flex items-start gap-4">
              <span class="grid size-12 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">
                <UIcon name="i-lucide-check" class="size-6" aria-hidden="true" />
              </span>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-700">Demo request saved</p>
                <h1 class="mt-1.5 font-display text-2xl font-bold text-ink sm:text-3xl">Reference {{ reference }}</h1>
                <p class="mt-2 text-[13px] leading-6 text-muted">
                  Your request has been added to the demo dashboard in <strong class="font-semibold text-ink">this browser's local storage</strong>.
                  Nothing was emailed, transmitted or submitted to a real CRM. This prototype has no backend.
                </p>
              </div>
            </div>

            <div class="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <p class="flex items-start gap-2 text-[11.5px] leading-5 text-amber-950/85">
                <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  Do not use this form for a real emergency, order or payment. In a live deployment, submitting this form would create an enquiry and send an acknowledgement — neither happens here.
                </span>
              </p>
            </div>

            <dl class="mt-6 grid gap-3 rounded-xl border border-forest-900/10 bg-cream/50 p-4 text-[11.5px] sm:grid-cols-2">
              <div>
                <dt class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">Contact</dt>
                <dd class="mt-0.5 font-medium text-ink">{{ form.fullName }} · {{ form.phone }}</dd>
              </div>
              <div>
                <dt class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">Project</dt>
                <dd class="mt-0.5 font-medium text-ink">{{ form.projectType }} · {{ form.city }}, {{ form.state }}</dd>
              </div>
              <div>
                <dt class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">Backup</dt>
                <dd class="mt-0.5 font-medium text-ink">{{ form.backupHours }} hours · {{ form.systemType }}</dd>
              </div>
              <div>
                <dt class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">Saved items</dt>
                <dd class="mt-0.5 font-medium text-ink">{{ selectedProducts.length }} product line(s), {{ files.length }} file(s)</dd>
              </div>
            </dl>

            <div class="mt-6 flex flex-wrap gap-2.5">
              <AppButton to="/admin/enquiries" icon-right="i-lucide-arrow-right">Open the demo dashboard</AppButton>
              <AppButton variant="outline" icon="i-lucide-download" @click="downloadSummary">Download summary</AppButton>
              <AppButton variant="ghost" icon="i-lucide-rotate-ccw" @click="startAnother">Start another request</AppButton>
            </div>
            <p class="mt-4 text-[10px] leading-4 text-muted">
              File contents were never read or uploaded; only names and sizes are recorded in the local demo record.
              <NuxtLink to="/privacy" class="underline underline-offset-2 hover:text-ink">Privacy notice</NuxtLink>
            </p>
          </div>
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div>
            <!-- Stepper -->
            <nav aria-label="Quote request progress" class="rounded-2xl border border-forest-900/10 bg-white p-3 sm:p-4">
              <ol class="grid grid-cols-4 gap-1.5">
                <li v-for="(item, index) in steps" :key="item.title">
                  <button
                    type="button"
                    class="group w-full rounded-xl px-2 py-2 text-left transition-colors sm:px-3"
                    :class="index === step ? 'bg-forest-900 text-cream' : index < step ? 'bg-forest-50 text-forest-900 hover:bg-forest-100' : 'text-muted'"
                    :aria-current="index === step ? 'step' : undefined"
                    :disabled="index > step"
                    @click="goTo(index)"
                  >
                    <span class="flex items-center gap-1.5">
                      <span
                        class="grid size-5 shrink-0 place-items-center rounded-full text-[9.5px] font-bold"
                        :class="index === step ? 'bg-solar-400 text-forest-950' : index < step ? 'bg-forest-800 text-cream' : 'bg-forest-900/[0.07] text-muted'"
                      >
                        <UIcon v-if="index < step" name="i-lucide-check" class="size-3" aria-hidden="true" />
                        <template v-else>{{ index + 1 }}</template>
                      </span>
                      <span class="truncate text-[10.5px] font-semibold sm:text-[11.5px]">{{ item.title }}</span>
                    </span>
                    <span class="mt-1 hidden pl-6.5 text-[9.5px] opacity-65 sm:block">{{ item.caption }}</span>
                  </button>
                </li>
              </ol>
            </nav>

            <form class="mt-4 rounded-2xl border border-forest-900/10 bg-white p-5 sm:p-7" novalidate @submit.prevent="step === steps.length - 1 ? submit() : next()">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="eyebrow">Step {{ step + 1 }} of {{ steps.length }}</p>
                  <h2 class="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">{{ steps[step]?.title }}</h2>
                  <p class="mt-1 text-[12px] leading-5 text-muted">{{ steps[step]?.caption }}</p>
                </div>
                <AppBadge tone="neutral">Demo form</AppBadge>
              </div>

              <!-- Step 0 -->
              <div v-if="step === 0" class="mt-6 grid gap-4 sm:grid-cols-2">
                <AppInput
                  v-model="form.fullName"
                  label="Full name"
                  placeholder="e.g. Ada Obi"
                  autocomplete="name"
                  required
                  :error="errors.fullName"
                />
                <AppInput
                  v-model="form.phone"
                  label="Phone number"
                  type="tel"
                  inputmode="tel"
                  placeholder="0803 123 4567"
                  autocomplete="tel"
                  hint="Nigerian mobile number. Used for the demo record only."
                  required
                  :error="errors.phone"
                />
                <AppInput
                  v-model="form.email"
                  label="Email address"
                  type="email"
                  inputmode="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  :error="errors.email"
                />
                <AppSelect
                  v-model="form.customerType"
                  label="I am a…"
                  :options="customerOptions"
                  placeholder="Select one"
                  required
                  :error="errors.customerType"
                />
                <div class="sm:col-span-2 rounded-xl border border-forest-900/10 bg-cream/50 p-3.5">
                  <label class="flex cursor-pointer items-start gap-3">
                    <input v-model="form.consent" type="checkbox" class="mt-0.5 size-4 shrink-0 rounded border-forest-900/30 accent-forest-800" />
                    <span class="text-[11.5px] leading-5 text-ink-soft">
                      I agree that this demo may store my details in this browser.
                      Read the <NuxtLink to="/privacy" class="font-medium text-forest-800 underline underline-offset-2">privacy notice</NuxtLink>.
                    </span>
                  </label>
                  <p v-if="errors.consent" class="mt-1.5 pl-7 text-xs font-medium text-red-700">{{ errors.consent }}</p>
                </div>
                <div class="hidden" aria-hidden="true">
                  <label for="quote-website">Website</label>
                  <input id="quote-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
                </div>
              </div>

              <!-- Step 1 -->
              <div v-else-if="step === 1" class="mt-6 space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    v-model="form.projectType"
                    label="Project type"
                    :options="projectOptions"
                    placeholder="Select a project type"
                    required
                    :error="errors.projectType"
                  />
                  <AppSelect
                    v-model="form.state"
                    label="State"
                    :options="stateOptions"
                    placeholder="Select a state"
                    required
                    :error="errors.state"
                  />
                  <AppInput
                    v-model="form.address"
                    label="Installation address"
                    placeholder="Street, estate or building name"
                    autocomplete="street-address"
                    required
                    :error="errors.address"
                  />
                  <AppInput
                    v-model="form.city"
                    label="City or town"
                    placeholder="e.g. Lekki"
                    autocomplete="address-level2"
                    required
                    :error="errors.city"
                  />
                  <AppSelect
                    v-model="form.powerSource"
                    label="Current power source"
                    :options="powerSources.map((value) => ({ value, label: value }))"
                    placeholder="Select one"
                    required
                    :error="errors.powerSource"
                  />
                  <AppInput
                    v-model.number="form.backupHours"
                    label="Backup required (hours)"
                    type="number"
                    inputmode="numeric"
                    min="1"
                    max="72"
                    hint="How long essential loads should run without grid or solar input."
                    required
                    :error="errors.backupHours"
                  />
                </div>

                <AppTextarea
                  v-model="form.loadDescription"
                  label="What do you want to power?"
                  placeholder="List the main appliances or equipment, their approximate wattages and the hours they run each day."
                  :rows="5"
                  :maxlength="2000"
                  hint="Example: 1 × 1.5 HP air conditioner (6 h/day), fridge (24 h), 12 LED bulbs (6 h), router (24 h), 2 fans (8 h)."
                  required
                  :error="errors.loadDescription"
                />

                <div>
                  <span class="text-[13px] font-semibold text-ink">Preferred system type</span>
                  <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <button
                      v-for="option in systemTypes"
                      :key="option"
                      type="button"
                      class="rounded-xl border px-2.5 py-2.5 text-[11.5px] font-semibold transition-colors"
                      :class="form.systemType === option ? 'border-forest-800 bg-forest-50 text-forest-900 ring-1 ring-forest-800' : 'border-forest-900/12 text-ink-soft hover:border-forest-900/30'"
                      :aria-pressed="form.systemType === option"
                      @click="form.systemType = option"
                    >
                      {{ option }}
                    </button>
                  </div>
                  <p v-if="errors.systemType" class="mt-1.5 text-xs font-medium text-red-700">{{ errors.systemType }}</p>
                </div>
              </div>

              <!-- Step 2 -->
              <div v-else-if="step === 2" class="mt-6 space-y-5">
                <div class="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    v-model="form.budget"
                    label="Indicative budget"
                    :options="budgetOptions"
                    placeholder="Select a range"
                    required
                    :error="errors.budget"
                  />
                  <AppSelect
                    v-model="form.timeframe"
                    label="Preferred timeframe"
                    :options="timeframes.map((value) => ({ value, label: value }))"
                    placeholder="Select a timeframe"
                    required
                    :error="errors.timeframe"
                  />
                </div>

                <AppTextarea
                  v-model="form.comments"
                  label="Anything else we should know?"
                  placeholder="Roof type, generator details, three-phase supply, access restrictions, existing equipment…"
                  :rows="4"
                  :maxlength="2000"
                  :error="errors.comments"
                />

                <div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-[13px] font-semibold text-ink">Selected products</span>
                    <NuxtLink to="/products" class="rounded text-[10.5px] font-semibold text-forest-800 underline underline-offset-2 hover:text-forest-950">
                      Browse catalogue
                    </NuxtLink>
                  </div>
                  <div v-if="selectedProducts.length" class="mt-2 overflow-hidden rounded-xl border border-forest-900/10">
                    <div v-for="entry in detailed" :key="entry.product.id" class="flex flex-wrap items-center gap-3 border-b border-forest-900/[0.07] px-3 py-2.5 last:border-b-0">
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-[11.5px] font-semibold text-ink">{{ entry.product.brand }} {{ entry.product.name }}</p>
                        <p class="mt-0.5 text-[10px] text-muted">{{ entry.product.keySpec }} · {{ entry.product.price === null ? 'Price on request' : formatNaira(entry.product.price) }}</p>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <label :for="`qty-${entry.product.id}`" class="sr-only">Quantity for {{ entry.product.name }}</label>
                        <input
                          :id="`qty-${entry.product.id}`"
                          :value="entry.quantity"
                          type="number"
                          min="1"
                          max="20"
                          class="field-base !w-14 !px-2 !py-1 text-center text-[11px]"
                          @change="setQuantity(entry.product.id, Number(($event.target as HTMLInputElement).value))"
                        />
                        <button
                          type="button"
                          class="grid size-6 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                          :aria-label="`Remove ${entry.product.name}`"
                          @click="remove(entry.product.id)"
                        >
                          <UIcon name="i-lucide-x" class="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p v-else class="mt-2 rounded-xl border border-dashed border-forest-900/15 bg-cream/40 px-4 py-5 text-center text-[11px] text-muted">
                    No products selected. You can still request a system quote from your load description.
                  </p>
                  <p v-if="selectedProducts.length" class="mt-1.5 text-[9.5px] leading-4 text-muted">
                    Indicative demo prices only, not a quotation.
                    <template v-if="hasQuoteOnly"> Some items are quote-only.</template>
                    <template v-if="indicativeTotal"> Shown subtotal: {{ formatNaira(indicativeTotal) }} before installation and protection.</template>
                  </p>
                </div>

                <div>
                  <span class="text-[13px] font-semibold text-ink">Photos or documents</span>
                  <p class="mt-0.5 text-[10.5px] leading-4 text-muted">Optional. JPG, PNG, WebP or PDF, up to 3 files and 8 MB each. Files stay on your device.</p>
                  <label
                    for="quote-files"
                    class="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-forest-900/20 bg-cream/40 px-4 py-6 text-center transition-colors hover:border-forest-900/40 hover:bg-forest-50/60"
                  >
                    <UIcon name="i-lucide-upload-cloud" class="size-5 text-forest-700" aria-hidden="true" />
                    <span class="mt-2 text-[11.5px] font-semibold text-forest-900">Choose files from this device</span>
                    <span class="mt-0.5 text-[10px] text-muted">Nothing is uploaded — only file names and sizes are recorded</span>
                    <input id="quote-files" type="file" class="sr-only" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" @change="onFiles" />
                  </label>
                  <p v-if="fileError" class="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-700">
                    <UIcon name="i-lucide-circle-alert" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
                    {{ fileError }}
                  </p>
                  <ul v-if="files.length" class="mt-2 space-y-1.5">
                    <li v-for="(file, index) in files" :key="`${file.name}-${index}`" class="flex items-center gap-2 rounded-lg border border-forest-900/10 bg-white px-2.5 py-1.5">
                      <UIcon name="i-lucide-file" class="size-3.5 shrink-0 text-forest-700" aria-hidden="true" />
                      <span class="min-w-0 flex-1 truncate text-[10.5px] text-ink">{{ file.name }}</span>
                      <span class="text-[9.5px] text-muted">{{ (file.size / 1024 / 1024).toFixed(1) }} MB</span>
                      <button type="button" class="text-muted hover:text-red-700" :aria-label="`Remove ${file.name}`" @click="removeFile(index)">
                        <UIcon name="i-lucide-x" class="size-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  </ul>
                </div>

                <div v-if="brief" class="rounded-xl border border-forest-800/20 bg-forest-50/60 p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-2">
                      <UIcon name="i-lucide-calculator" class="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden="true" />
                      <div>
                        <p class="text-[11.5px] font-semibold text-forest-900">Calculator estimate attached</p>
                        <p class="mt-0.5 text-[10px] text-forest-800/70">
                          {{ brief.dailyKwh.toFixed(1) }} kWh/day · {{ brief.inverterKw }} kW inverter · {{ brief.batteryKwh }} kWh battery · {{ brief.arrayKwp }} kWp array
                        </p>
                      </div>
                    </div>
                    <NuxtLink to="/calculator" class="shrink-0 text-[10px] font-semibold text-forest-800 underline underline-offset-2">Edit</NuxtLink>
                  </div>
                  <pre class="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white/70 p-2.5 font-mono text-[9.5px] leading-4 text-ink-soft">{{ brief.summary }}</pre>
                </div>
              </div>

              <!-- Step 3 -->
              <div v-else class="mt-6 space-y-5">
                <div class="rounded-xl border border-forest-900/10">
                  <div class="flex items-center justify-between border-b border-forest-900/[0.07] px-4 py-2.5">
                    <h3 class="text-[11px] font-bold uppercase tracking-[0.12em] text-forest-800">Contact</h3>
                    <button type="button" class="text-[10px] font-semibold text-forest-800 underline underline-offset-2" @click="goTo(0)">Edit</button>
                  </div>
                  <dl class="grid gap-3 p-4 text-[11.5px] sm:grid-cols-2">
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Name</dt><dd class="mt-0.5 font-medium text-ink">{{ form.fullName || '—' }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Phone</dt><dd class="mt-0.5 font-medium text-ink">{{ form.phone || '—' }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Email</dt><dd class="mt-0.5 font-medium text-ink">{{ form.email || 'Not provided' }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Customer type</dt><dd class="mt-0.5 font-medium text-ink">{{ form.customerType || '—' }}</dd></div>
                  </dl>
                </div>

                <div class="rounded-xl border border-forest-900/10">
                  <div class="flex items-center justify-between border-b border-forest-900/[0.07] px-4 py-2.5">
                    <h3 class="text-[11px] font-bold uppercase tracking-[0.12em] text-forest-800">Project</h3>
                    <button type="button" class="text-[10px] font-semibold text-forest-800 underline underline-offset-2" @click="goTo(1)">Edit</button>
                  </div>
                  <dl class="grid gap-3 p-4 text-[11.5px] sm:grid-cols-2">
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Address</dt><dd class="mt-0.5 font-medium text-ink">{{ form.address }}, {{ form.city }}, {{ form.state }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Project type</dt><dd class="mt-0.5 font-medium text-ink">{{ form.projectType }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Power source</dt><dd class="mt-0.5 font-medium text-ink">{{ form.powerSource }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">System / backup</dt><dd class="mt-0.5 font-medium text-ink">{{ form.systemType }} · {{ form.backupHours }} h</dd></div>
                    <div class="sm:col-span-2"><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Load description</dt><dd class="mt-0.5 whitespace-pre-line leading-5 text-ink-soft">{{ form.loadDescription || '—' }}</dd></div>
                  </dl>
                </div>

                <div class="rounded-xl border border-forest-900/10">
                  <div class="flex items-center justify-between border-b border-forest-900/[0.07] px-4 py-2.5">
                    <h3 class="text-[11px] font-bold uppercase tracking-[0.12em] text-forest-800">Requirements</h3>
                    <button type="button" class="text-[10px] font-semibold text-forest-800 underline underline-offset-2" @click="goTo(2)">Edit</button>
                  </div>
                  <dl class="grid gap-3 p-4 text-[11.5px] sm:grid-cols-2">
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Budget</dt><dd class="mt-0.5 font-medium text-ink">{{ form.budget || '—' }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Timeframe</dt><dd class="mt-0.5 font-medium text-ink">{{ form.timeframe || '—' }}</dd></div>
                    <div class="sm:col-span-2"><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Comments</dt><dd class="mt-0.5 whitespace-pre-line leading-5 text-ink-soft">{{ form.comments || 'None' }}</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Products</dt><dd class="mt-0.5 font-medium text-ink">{{ selectedProducts.length }} line(s)</dd></div>
                    <div><dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-muted">Attachments</dt><dd class="mt-0.5 font-medium text-ink">{{ files.length }} file(s)</dd></div>
                  </dl>
                </div>

                <div v-if="brief" class="rounded-xl border border-forest-800/20 bg-forest-50/60 p-4">
                  <p class="text-[11px] font-bold text-forest-900">Calculator estimate included</p>
                  <p class="mt-1 text-[10px] leading-4 text-forest-800/70">
                    {{ brief.dailyKwh.toFixed(1) }} kWh/day · {{ brief.inverterKw }} kW inverter · {{ brief.batteryKwh }} kWh battery · {{ brief.arrayKwp }} kWp array.
                    The full editable summary travels with this demo request.
                  </p>
                </div>

                <div class="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="flex items-start gap-2 text-[11px] leading-5 text-amber-950/85">
                    <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      <strong class="font-semibold">Submitting does not contact SunGrid Energy.</strong>
                      The request is saved in this browser's local storage and appears on the demo dashboard. No email, SMS or quotation is generated.
                    </span>
                  </p>
                </div>

                <AppCheckbox v-model="form.consent" :error="errors.consent">
                  I confirm the information is accurate and agree that this demo may store it in this browser.
                  I have read the
                  <NuxtLink to="/privacy" class="font-medium text-forest-800 underline underline-offset-2">privacy notice</NuxtLink>.
                </AppCheckbox>

                <div class="hidden" aria-hidden="true">
                  <label for="quote-website-review">Website</label>
                  <input id="quote-website-review" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
                </div>
              </div>

              <div class="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/[0.08] pt-5">
                <button
                  v-if="step > 0"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold text-muted transition-colors hover:bg-forest-900/5 hover:text-ink"
                  @click="back"
                >
                  <UIcon name="i-lucide-arrow-left" class="size-3.5" aria-hidden="true" />
                  Back
                </button>
                <span v-else class="text-[10px] text-muted">Fields marked * are required.</span>

                <AppButton
                  v-if="step < steps.length - 1"
                  type="submit"
                  icon-right="i-lucide-arrow-right"
                >
                  Continue
                </AppButton>
                <AppButton v-else type="submit" icon="i-lucide-check">
                  Save demo request
                </AppButton>
              </div>
            </form>
          </div>

          <aside class="space-y-4 lg:sticky lg:top-24">
            <div class="rounded-2xl border border-forest-900/10 bg-white p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">What happens next</p>
              <ol class="mt-3 space-y-3">
                <li class="flex gap-2.5">
                  <span class="grid size-5 shrink-0 place-items-center rounded-full bg-forest-50 text-[9px] font-bold text-forest-800">1</span>
                  <p class="text-[10.5px] leading-4 text-muted">In this prototype, the request is stored locally and appears under <NuxtLink to="/admin/enquiries" class="font-medium text-forest-800 underline underline-offset-2">demo enquiries</NuxtLink>.</p>
                </li>
                <li class="flex gap-2.5">
                  <span class="grid size-5 shrink-0 place-items-center rounded-full bg-forest-50 text-[9px] font-bold text-forest-800">2</span>
                  <p class="text-[10.5px] leading-4 text-muted">In a live deployment, an engineer would review the load list and arrange a site assessment before pricing is confirmed.</p>
                </li>
                <li class="flex gap-2.5">
                  <span class="grid size-5 shrink-0 place-items-center rounded-full bg-forest-50 text-[9px] font-bold text-forest-800">3</span>
                  <p class="text-[10.5px] leading-4 text-muted">A fixed-scope quotation would follow only after equipment and site conditions are verified.</p>
                </li>
              </ol>
            </div>

            <div class="rounded-2xl border border-forest-900/10 bg-cream-deep/50 p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Prefer to talk?</p>
              <a :href="site.phoneHref" class="mt-2 block font-display text-base font-bold text-ink hover:text-forest-700">{{ site.phoneDisplay }}</a>
              <p class="mt-0.5 text-[10px] text-muted">Demo number · Mon–Fri, 8:30–17:30</p>
              <a
                :href="`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Hello SunGrid Energy, I would like help with a solar quote.')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-forest-800 underline underline-offset-2"
              >
                <UIcon name="i-lucide-message-circle" class="size-3.5" aria-hidden="true" />
                Message the demo WhatsApp
              </a>
            </div>

            <DemoNotice compact label="No backend" detail="Nothing is sent or charged. File contents never leave your device." />
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
