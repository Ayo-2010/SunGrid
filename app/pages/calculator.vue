<script setup lang="ts">
import type { CalculatorAppliance, CalculatorBrief, CalculatorInputs, SystemTypePreference } from '#shared/types'
import { appliancePresets, calculateSizing, calculatorSummary, defaultCalculatorAppliances, defaultCalculatorInputs } from '~/utils/calculator'
import { nigerianStates, quoteAssumptions } from '~/data/site'

usePageMeta({
  title: 'Solar system calculator',
  description:
    'Estimate daily energy use, inverter size, battery capacity and solar array size from your appliances. Transparent assumptions for Nigerian homes and businesses. Preliminary only.',
  image: '/images/panels-closeup.jpg',
})

const toast = useToast()
const presetToAdd = ref('led-bulb')
const showAssumptions = ref(false)

const inputs = ref<CalculatorInputs>({
  ...defaultCalculatorInputs,
  appliances: defaultCalculatorAppliances.map((appliance) => ({ ...appliance })),
})

const result = computed(() => calculateSizing(inputs.value))
const summaryText = computed(() => calculatorSummary(inputs.value, result.value))

const budgetOptions = [
  { value: 'under-1m', label: 'Under ₦1,000,000' },
  { value: '1m-3m', label: '₦1,000,000 – ₦3,000,000' },
  { value: '3m-6m', label: '₦3,000,000 – ₦6,000,000' },
  { value: '6m-12m', label: '₦6,000,000 – ₦12,000,000' },
  { value: 'above-12m', label: 'Above ₦12,000,000' },
  { value: 'unsure', label: 'Not sure yet' },
]

const systemOptions: { value: SystemTypePreference; label: string; note: string; icon: string }[] = [
  { value: 'hybrid', label: 'Hybrid', note: 'Grid + battery + solar', icon: 'i-lucide-zap' },
  { value: 'off-grid', label: 'Off-grid', note: 'No grid reliance', icon: 'i-lucide-sun' },
  { value: 'grid-tied', label: 'Grid-tied', note: 'No battery backup', icon: 'i-lucide-transmission-line' },
  { value: 'not-sure', label: 'Not sure', note: 'Advise me', icon: 'i-lucide-help-circle' },
]

const gridOptions = [
  { value: 'reliable', label: 'Mostly stable', note: 'Few outages' },
  { value: 'unreliable', label: 'Unreliable', note: 'Frequent outages' },
  { value: 'none', label: 'No grid', note: 'Off-grid site' },
] as const

const quickPresets = ['led-bulb', 'fridge', 'ac-1hp', 'water-pump', 'router'].map(
  (id) => appliancePresets.find((preset) => preset.id === id)!,
)

const applianceSelectOptions = computed(() => [
  { value: 'custom', label: 'Custom appliance…' },
  ...appliancePresets.map((preset) => ({ value: preset.id, label: `${preset.name} · ${preset.watts} W` })),
])

const totalWatts = computed(() =>
  inputs.value.appliances.reduce((total, appliance) => total + appliance.watts * appliance.quantity, 0),
)

function addAppliance() {
  const presetId = presetToAdd.value
  if (presetId === 'custom') {
    inputs.value.appliances.push({
      id: `app-${Date.now()}`,
      presetId: 'custom',
      name: 'Custom appliance',
      watts: 100,
      quantity: 1,
      hours: 2,
      essential: true,
      wave: 'electronic',
    })
    toast.add({ title: 'Custom appliance added', description: 'Rename it and enter the rating from its label.', color: 'success' })
    return
  }
  const preset = appliancePresets.find((entry) => entry.id === presetId)
  if (!preset) return
  const existing = inputs.value.appliances.find((entry) => entry.presetId === preset.id)
  if (existing) {
    existing.quantity = Math.min(200, existing.quantity + 1)
    toast.add({ title: `${preset.name} quantity increased`, description: `Now ${existing.quantity} in the schedule.`, color: 'success' })
    return
  }
  inputs.value.appliances.push({
    id: `app-${Date.now()}`,
    presetId: preset.id,
    name: preset.name,
    watts: preset.watts,
    quantity: 1,
    hours: preset.defaultHours,
    essential: true,
    wave: preset.wave,
  })
  toast.add({ title: `${preset.name} added`, description: `Assumed ${preset.defaultHours} hours per day — adjust it below.`, color: 'success' })
}

function quickAdd(presetId: string) {
  presetToAdd.value = presetId
  addAppliance()
}

function updateAppliance(id: string, patch: Partial<CalculatorAppliance>) {
  const appliance = inputs.value.appliances.find((entry) => entry.id === id)
  if (appliance) Object.assign(appliance, patch)
}

function removeAppliance(id: string) {
  inputs.value.appliances = inputs.value.appliances.filter((entry) => entry.id !== id)
}

function loadExample() {
  inputs.value = {
    ...defaultCalculatorInputs,
    appliances: defaultCalculatorAppliances.map((appliance) => ({ ...appliance })),
  }
  toast.add({ title: 'Example load schedule restored', description: 'A typical home with lighting, refrigeration, fans, TV and internet.' })
}

function clearSchedule() {
  inputs.value.appliances = []
  toast.add({ title: 'Load schedule cleared', description: 'Add appliances to start a new estimate.' })
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(summaryText.value)
    toast.add({ title: 'Estimate copied', description: 'The summary is on your clipboard.', color: 'success' })
  } catch {
    toast.add({ title: 'Copy unavailable', description: 'Your browser blocked clipboard access. Select the assumptions text instead.', color: 'warning' })
  }
}

async function sendToQuote() {
  if (!inputs.value.appliances.length) return
  const brief: CalculatorBrief = {
    summary: summaryText.value,
    state: inputs.value.state,
    backupHours: inputs.value.backupHours,
    systemPreference: inputs.value.systemPreference,
    budget: inputs.value.budget,
    dailyKwh: result.value.dailyWh / 1000,
    essentialKwh: result.value.essentialWh / 1000,
    peakWatts: result.value.peakWatts,
    inverterKw: result.value.inverterKw,
    batteryKwh: result.value.batteryNominalKwh,
    arrayKwp: result.value.solarKwp,
    panelCount: result.value.panelCount,
    createdAt: new Date().toISOString(),
  }
  try {
    sessionStorage.setItem(CALCULATOR_BRIEF_STORAGE_KEY, JSON.stringify(brief))
  } catch {
    /* If storage is blocked, the quote form still opens without the brief. */
  }
  await navigateTo('/quote?from=calculator')
}

const stateOptions = nigerianStates.map((state) => ({ value: state, label: state }))

const sunLabel = computed(() => `${inputs.value.sunHours.toFixed(1)} peak sun hours/day`)
</script>

<template>
  <div>
    <PageHero
      eyebrow="Solar calculator"
      title="Estimate the system before you price the system."
      description="List what needs power, when it runs and for how long. The calculator turns that into an indicative inverter, battery and array size — with assumptions you can inspect and challenge."
      :breadcrumbs="[{ label: 'Solar Calculator' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/quote" variant="on-dark" icon-right="i-lucide-arrow-right">Skip to quote request</AppButton>
        <AppButton href="#method" variant="on-dark" icon="i-lucide-book-open">How the estimate works</AppButton>
      </template>
    </PageHero>

    <section class="bg-cream">
      <div class="page-container py-8 lg:py-12">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solar-500/30 bg-solar-50/70 px-4 py-3">
          <div class="flex items-start gap-2.5">
            <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0 text-solar-700" aria-hidden="true" />
            <p class="text-[11.5px] leading-5 text-amber-950/80">
              <strong class="font-semibold">Preliminary estimate only.</strong>
              This is not an engineering design or a quotation. Wattages are typical values — check your appliance labels.
            </p>
          </div>
          <span class="rounded-full border border-amber-300 bg-white/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-900">
            No data leaves this browser
          </span>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div class="space-y-5">
            <!-- Load schedule -->
            <section class="rounded-2xl border border-forest-900/10 bg-cream-deep/40 p-4 sm:p-6" aria-labelledby="load-heading">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p class="eyebrow">Step 1</p>
                  <h2 id="load-heading" class="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">What needs power?</h2>
                  <p class="mt-1.5 max-w-xl text-[12px] leading-5 text-muted">
                    Add each appliance once and set its quantity. Mark the circuits that must stay on during an outage as essential.
                  </p>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Connected</span>
                  <span class="rounded-full bg-forest-900 px-2.5 py-1 text-[11px] font-bold text-solar-300">{{ (totalWatts / 1000).toFixed(2) }} kW</span>
                </div>
              </div>

              <div class="mt-5 flex flex-col gap-2 sm:flex-row">
                <div class="flex-1">
                  <label for="preset-select" class="sr-only">Choose an appliance to add</label>
                  <select id="preset-select" v-model="presetToAdd" class="field-base text-[12.5px]">
                    <option v-for="option in applianceSelectOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <AppButton icon="i-lucide-plus" size="sm" class="sm:self-stretch" @click="addAppliance">Add appliance</AppButton>
              </div>

              <div class="mt-2.5 flex flex-wrap gap-1.5">
                <span class="py-1 text-[10px] text-muted">Common:</span>
                <button
                  v-for="preset in quickPresets"
                  :key="preset.id"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-forest-900/12 bg-white px-2 py-1 text-[10px] font-medium text-forest-800 transition-colors hover:border-forest-900/30 hover:bg-forest-50"
                  @click="quickAdd(preset.id)"
                >
                  <UIcon :name="preset.icon" class="size-3" aria-hidden="true" />
                  {{ preset.name }}
                </button>
              </div>

              <div class="mt-4 space-y-2">
                <ApplianceRow
                  v-for="(appliance, index) in inputs.appliances"
                  :key="appliance.id"
                  :appliance="appliance"
                  :index="index"
                  @update="updateAppliance"
                  @remove="removeAppliance"
                />
              </div>

              <div v-if="!inputs.appliances.length" class="mt-4 rounded-xl border border-dashed border-forest-900/20 bg-white/60 px-5 py-10 text-center">
                <UIcon name="i-lucide-plug" class="mx-auto size-6 text-forest-700/60" aria-hidden="true" />
                <p class="mt-3 font-display text-sm font-bold text-ink">Your load schedule is empty</p>
                <p class="mx-auto mt-1 max-w-sm text-[11.5px] leading-5 text-muted">Add an appliance above, or load a typical example to see how the estimate works.</p>
                <AppButton variant="outline" size="sm" class="mt-4" icon="i-lucide-rotate-ccw" @click="loadExample">Load example schedule</AppButton>
              </div>

              <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/[0.08] pt-3">
                <div class="flex items-center gap-3 text-[10.5px] text-muted">
                  <span><strong class="font-semibold text-ink">{{ inputs.appliances.length }}</strong> load lines</span>
                  <span aria-hidden="true">·</span>
                  <span><strong class="font-semibold text-ink">{{ (result.dailyWh / 1000).toFixed(1) }}</strong> kWh/day</span>
                </div>
                <div class="flex gap-2">
                  <button type="button" class="rounded text-[10.5px] font-medium text-muted underline decoration-forest-900/20 underline-offset-2 hover:text-ink" @click="loadExample">
                    Reset example
                  </button>
                  <button
                    v-if="inputs.appliances.length"
                    type="button"
                    class="rounded text-[10.5px] font-medium text-red-700/80 underline decoration-red-700/20 underline-offset-2 hover:text-red-800"
                    @click="clearSchedule"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </section>

            <!-- System context -->
            <section class="rounded-2xl border border-forest-900/10 bg-white p-4 sm:p-6" aria-labelledby="context-heading">
              <p class="eyebrow">Step 2</p>
              <h2 id="context-heading" class="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">Site and backup context</h2>
              <p class="mt-1.5 text-[12px] leading-5 text-muted">These answers change the storage and array recommendation, not the efficiency of your appliances.</p>

              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <AppSelect v-model="inputs.state" label="State" :options="stateOptions" required />
                <AppSelect v-model="inputs.budget" label="Indicative budget" :options="budgetOptions" required />
              </div>

              <div class="mt-5">
                <span class="text-[13px] font-semibold text-ink">Grid supply</span>
                <div class="mt-2 grid gap-2 sm:grid-cols-3">
                  <button
                    v-for="option in gridOptions"
                    :key="option.value"
                    type="button"
                    class="rounded-xl border px-3 py-2.5 text-left transition-colors"
                    :class="inputs.gridAvailability === option.value ? 'border-forest-800 bg-forest-50 ring-1 ring-forest-800' : 'border-forest-900/12 bg-white hover:border-forest-900/30'"
                    :aria-pressed="inputs.gridAvailability === option.value"
                    @click="inputs.gridAvailability = option.value"
                  >
                    <span class="block text-[12px] font-semibold text-ink">{{ option.label }}</span>
                    <span class="mt-0.5 block text-[10px] text-muted">{{ option.note }}</span>
                  </button>
                </div>
              </div>

              <div class="mt-5">
                <span class="text-[13px] font-semibold text-ink">Preferred system type</span>
                <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    v-for="option in systemOptions"
                    :key="option.value"
                    type="button"
                    class="rounded-xl border px-2.5 py-2.5 text-center transition-colors"
                    :class="inputs.systemPreference === option.value ? 'border-forest-800 bg-forest-50 ring-1 ring-forest-800' : 'border-forest-900/12 bg-white hover:border-forest-900/30'"
                    :aria-pressed="inputs.systemPreference === option.value"
                    @click="inputs.systemPreference = option.value"
                  >
                    <UIcon :name="option.icon" class="mx-auto size-4 text-forest-700" aria-hidden="true" />
                    <span class="mt-1 block text-[11px] font-semibold text-ink">{{ option.label }}</span>
                    <span class="mt-0.5 block text-[9.5px] leading-3.5 text-muted">{{ option.note }}</span>
                  </button>
                </div>
              </div>

              <div class="mt-5">
                <div class="flex items-baseline justify-between">
                  <label for="backup-hours" class="text-[13px] font-semibold text-ink">Backup window</label>
                  <span class="text-[12px] font-bold text-forest-800">{{ inputs.backupHours }} hours</span>
                </div>
                <input
                  id="backup-hours"
                  v-model.number="inputs.backupHours"
                  type="range"
                  min="2"
                  max="24"
                  step="1"
                  class="mt-2 w-full accent-forest-700"
                />
                <div class="flex justify-between text-[9.5px] text-muted">
                  <span>2 h</span>
                  <span>12 h</span>
                  <span>24 h</span>
                </div>
                <p class="mt-1 text-[10.5px] leading-4 text-muted">
                  How long essential circuits should run without solar input. Longer windows increase battery capacity quickly.
                </p>
              </div>

              <div class="mt-5 border-t border-forest-900/[0.08] pt-4">
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-2 text-left"
                  :aria-expanded="showAssumptions"
                  aria-controls="advanced-assumptions"
                  @click="showAssumptions = !showAssumptions"
                >
                  <span>
                    <span class="block text-[12.5px] font-semibold text-ink">Advanced assumptions</span>
                    <span class="mt-0.5 block text-[10.5px] text-muted">Sun hours, depth of discharge, system efficiency and surge margin.</span>
                  </span>
                  <UIcon :name="showAssumptions ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4 shrink-0 text-muted" aria-hidden="true" />
                </button>

                <div v-show="showAssumptions" id="advanced-assumptions" class="mt-4 grid gap-4 sm:grid-cols-2">
                  <div class="sm:col-span-2">
                    <div class="flex items-baseline justify-between">
                      <label for="sun-hours" class="text-[11.5px] font-semibold text-ink">Peak sun hours</label>
                      <span class="text-[11px] font-semibold text-forest-800">{{ sunLabel }}</span>
                    </div>
                    <input id="sun-hours" v-model.number="inputs.sunHours" type="range" min="3" max="6" step="0.1" class="mt-1.5 w-full accent-forest-700" />
                    <p class="text-[9.5px] leading-4 text-muted">A planning value, not a weather guarantee. Shading, dust and heat reduce output.</p>
                  </div>
                  <div>
                    <label for="dod" class="mb-1 block text-[11px] font-semibold text-ink">Battery depth of discharge</label>
                    <select id="dod" v-model.number="inputs.depthOfDischarge" class="field-base !py-2 text-[12px]">
                      <option :value="0.8">80% — conservative</option>
                      <option :value="0.9">90% — typical LiFePO₄</option>
                      <option :value="0.95">95% — optimistic</option>
                    </select>
                  </div>
                  <div>
                    <label for="efficiency" class="mb-1 block text-[11px] font-semibold text-ink">System efficiency allowance</label>
                    <select id="efficiency" v-model.number="inputs.systemEfficiency" class="field-base !py-2 text-[12px]">
                      <option :value="0.7">70% — cautious</option>
                      <option :value="0.75">75% — planning default</option>
                      <option :value="0.8">80% — good conditions</option>
                    </select>
                  </div>
                  <div class="sm:col-span-2">
                    <label for="surge" class="mb-1 block text-[11px] font-semibold text-ink">Inverter surge margin</label>
                    <select id="surge" v-model.number="inputs.surgeAllowance" class="field-base !py-2 text-[12px]">
                      <option :value="1.2">1.20 × connected load</option>
                      <option :value="1.25">1.25 × connected load</option>
                      <option :value="1.3">1.30 × connected load</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <div class="rounded-xl border border-forest-900/10 bg-white/60 p-4 text-[10.5px] leading-5 text-muted">
              <p class="font-semibold text-ink">Privacy note</p>
              <p class="mt-1">
                This calculator runs entirely in your browser. No appliance list, contact detail or estimate is sent to a server.
                The only thing stored is a temporary summary in this tab's session storage when you continue to the quote form.
              </p>
            </div>
          </div>

          <aside class="lg:sticky lg:top-24">
            <CalculatorResults :inputs="inputs" :result="result" @send="sendToQuote" @copy="copySummary" />

            <div class="mt-4 rounded-2xl border border-forest-900/10 bg-white p-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="size-4 text-forest-700" aria-hidden="true" />
                <p class="text-[11.5px] font-semibold text-ink">What the estimate assumes</p>
              </div>
              <ul class="mt-2.5 space-y-2">
                <li v-for="assumption in quoteAssumptions" :key="assumption" class="flex items-start gap-2 text-[10px] leading-4 text-muted">
                  <span class="mt-1.5 size-1 shrink-0 rounded-full bg-solar-500" aria-hidden="true" />
                  {{ assumption }}
                </li>
              </ul>
              <AppButton to="/faq" variant="ghost" size="sm" class="mt-2 !px-0" icon-right="i-lucide-arrow-right">
                Read sizing FAQs
              </AppButton>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section id="method" class="section-pad border-t border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <SectionHeading
          eyebrow="Transparent method"
          title="The arithmetic behind the recommendation."
          description="Four calculations produce the headline numbers. Each one uses a planning assumption that a site assessment can confirm or replace."
        />
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
            <span class="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-700">01 · Energy</span>
            <p class="mt-2 font-display text-[13px] font-bold text-ink">Daily watt-hours</p>
            <p class="mt-1.5 text-[11px] leading-5 text-muted">Watts × quantity × hours for every appliance. Essential and optional loads are tracked separately.</p>
            <p class="mt-3 rounded bg-white px-2 py-1.5 font-mono text-[9.5px] text-forest-900">Σ (W × qty × h)</p>
          </div>
          <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
            <span class="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-700">02 · Inverter</span>
            <p class="mt-2 font-display text-[13px] font-bold text-ink">Continuous + surge</p>
            <p class="mt-1.5 text-[11px] leading-5 text-muted">Connected load with a margin, checked against the largest motor start-up. Rounded up to a standard size.</p>
            <p class="mt-3 rounded bg-white px-2 py-1.5 font-mono text-[9.5px] text-forest-900">max(load × margin, surge)</p>
          </div>
          <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
            <span class="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-700">03 · Battery</span>
            <p class="mt-2 font-display text-[13px] font-bold text-ink">Usable storage</p>
            <p class="mt-1.5 text-[11px] leading-5 text-muted">Essential energy is scaled by the backup window, then grossed up for depth of discharge and inverter losses.</p>
            <p class="mt-3 rounded bg-white px-2 py-1.5 font-mono text-[9.5px] text-forest-900">kWh ÷ DoD ÷ 0.94</p>
          </div>
          <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
            <span class="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-700">04 · Array</span>
            <p class="mt-2 font-display text-[13px] font-bold text-ink">Solar yield</p>
            <p class="mt-1.5 text-[11px] leading-5 text-muted">Daily energy is divided by peak sun hours and a system efficiency allowance, then converted to kWp and panels.</p>
            <p class="mt-3 rounded bg-white px-2 py-1.5 font-mono text-[9.5px] text-forest-900">Wh ÷ sun hours ÷ efficiency</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p class="flex items-center gap-2 text-[11.5px] font-bold text-amber-950">
              <UIcon name="i-lucide-triangle-alert" class="size-4" aria-hidden="true" />
              What this calculator cannot tell you
            </p>
            <ul class="mt-3 grid gap-2 text-[11px] leading-5 text-amber-950/80 sm:grid-cols-2">
              <li v-for="limitation in [
                'Whether your roof or mounting area can hold the array',
                'Cable sizes, protection ratings or earthing requirements',
                'Actual battery runtime under temperature and ageing',
                'Final equipment compatibility and warranty conditions',
                'Installation cost, mobilisation or financing options',
                'Guaranteed savings or generator displacement',
              ]" :key="limitation" class="flex items-start gap-2">
                <span class="mt-1.5 size-1 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                {{ limitation }}
              </li>
            </ul>
          </div>
          <div class="flex flex-col justify-between rounded-2xl bg-forest-950 p-5 text-cream">
            <div>
              <p class="eyebrow eyebrow-on-dark">Next step</p>
              <p class="mt-2 font-display text-lg font-bold text-cream">Turn the estimate into a scoped review.</p>
              <p class="mt-2 text-[11px] leading-5 text-cream/60">
                Send the schedule with your quote request. A site assessment and verified equipment data are still required before pricing is fixed.
              </p>
            </div>
            <AppButton class="mt-4" size="sm" icon-right="i-lucide-arrow-right" @click="sendToQuote">Continue to quote</AppButton>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
