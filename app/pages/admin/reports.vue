<script setup lang="ts">
import { enquiryTrend, productDemand, revenueSeries } from '~/data/admin'
import { quoteStatusOptions, stageOptions } from '~/utils/status'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin reports',
  description: 'Demonstration reports built from seeded data. Export or print a mock summary; no analytics platform is connected.',
  noindex: true,
})

const admin = useAdminData()
const toast = useToast()

const range = ref<'3' | '6'>('6')
const generatedOn = ref('')

const months = computed(() => Number(range.value))

const trendSlice = computed(() => enquiryTrend.slice(-months.value))
const revenueSlice = computed(() => revenueSeries.slice(-months.value))

const labels = computed(() => trendSlice.value.map((entry) => entry.month))

const totalEnquiries = computed(() => trendSlice.value.reduce((total, entry) => total + entry.enquiries, 0))
const totalQuotes = computed(() => trendSlice.value.reduce((total, entry) => total + entry.quotes, 0))
const totalWon = computed(() => trendSlice.value.reduce((total, entry) => total + entry.won, 0))
const conversion = computed(() => (totalEnquiries.value ? Math.round((totalWon.value / totalEnquiries.value) * 100) : 0))
const totalRevenue = computed(() => revenueSlice.value.reduce((total, entry) => total + entry.value, 0) * 1_000_000)

function latestChange(values: number[]): { text: string; trend: 'up' | 'down' | 'flat' } {
  if (values.length < 2) return { text: 'Single month', trend: 'flat' }
  const latest = values.at(-1) ?? 0
  const previous = values.at(-2) ?? 0
  if (!previous) return { text: 'No prior month', trend: 'flat' }
  const change = Math.round(((latest - previous) / previous) * 100)
  return {
    text: `${change > 0 ? '+' : ''}${change}% vs ${trendSlice.value.at(-2)?.month ?? 'previous'}`,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
  }
}

const enquiryChange = computed(() => latestChange(trendSlice.value.map((entry) => entry.enquiries)))
const quoteChange = computed(() => latestChange(trendSlice.value.map((entry) => entry.quotes)))
const winChange = computed(() => latestChange(trendSlice.value.map((entry) => entry.won)))

const revenueSeriesData = computed(() => [
  {
    label: 'Illustrative revenue',
    values: revenueSlice.value.map((entry) => entry.value * 1_000_000),
    color: '#f0ac08',
  },
])

const quoteCounts = computed(() =>
  quoteStatusOptions.map((option) => {
    const matching = admin.state.value.quotes.filter((quote) => quote.status === option.value)
    return {
      status: option.value,
      label: option.label,
      count: matching.length,
      total: matching.reduce((total, quote) => total + quote.total, 0),
    }
  }),
)

const installCounts = computed(() =>
  stageOptions.map((stage) => ({
    ...stage,
    count: admin.state.value.installations.filter((installation) => installation.stage === stage.value).length,
  })),
)

const maxDemand = computed(() => Math.max(1, ...productDemand.map((entry) => entry.share)))

const reportRows = computed(() =>
  trendSlice.value.map((entry, index) => ({
    month: entry.month,
    enquiries: entry.enquiries,
    quotes: entry.quotes,
    won: entry.won,
    revenue: Math.round((revenueSlice.value[index]?.value ?? 0) * 1_000_000),
  })),
)

function exportReport() {
  const ok = downloadCsv(`sungrid-demo-report-${range.value}m.csv`, reportRows.value, [
    { key: 'month', label: 'Month' },
    { key: 'enquiries', label: 'Enquiries' },
    { key: 'quotes', label: 'Quotations' },
    { key: 'won', label: 'Won' },
    { key: 'revenue', label: 'Illustrative revenue (NGN)' },
  ])
  toast.add({
    title: ok ? 'Report exported' : 'Export unavailable',
    description: ok ? `Last ${range.value} months of seeded demo data exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}

function printReport() {
  if (import.meta.client) window.print()
}

onMounted(() => {
  generatedOn.value = formatDate(new Date(), 'long')
})
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Reporting"
      title="Reports"
      description="A seeded reporting surface for demonstration. Figures are not live, not audited and do not reconcile to real bank records. Exports contain demo data only."
      badge="Seeded figures"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" icon="i-lucide-printer" @click="printReport">Print</AppButton>
        <AppButton size="sm" icon="i-lucide-download" @click="exportReport">Export report</AppButton>
      </template>
    </AdminPageHeader>

    <div class="rounded-2xl border border-forest-900/10 bg-white p-3.5 shadow-soft">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <label for="report-range" class="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Reporting period</label>
          <select id="report-range" v-model="range" class="field-base !w-auto !py-1.5 text-[11px]">
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
          </select>
        </div>
        <p class="text-[10px] text-muted">
          <template v-if="generatedOn">Generated {{ generatedOn }} · </template>
          seeded demo dataset
        </p>
      </div>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Total enquiries"
        :value="String(totalEnquiries)"
        icon="i-lucide-inbox"
        :change="enquiryChange.text"
        :trend="enquiryChange.trend"
        :hint="`Last ${range} months`"
      />
      <AdminStatCard
        label="Quotations issued"
        :value="String(totalQuotes)"
        icon="i-lucide-file-text"
        :change="quoteChange.text"
        :trend="quoteChange.trend"
        :hint="`Last ${range} months`"
      />
      <AdminStatCard
        label="Projects won"
        :value="String(totalWon)"
        icon="i-lucide-circle-check"
        :change="winChange.text"
        :trend="winChange.trend"
        :hint="`Last ${range} months`"
      />
      <AdminStatCard
        label="Enquiry-to-win rate"
        :value="`${conversion}%`"
        icon="i-lucide-percent"
        change="Demo metric"
        trend="flat"
        hint="Won ÷ enquiries"
      />
    </div>

    <div class="grid gap-5 xl:grid-cols-2">
      <AdminPanel title="Enquiry performance" description="Monthly seeded counts. Hover a bar for its value.">
        <template #actions>
          <AppBadge tone="warning">Illustrative</AppBadge>
        </template>
        <AdminBarChart
          title="Enquiries, quotations and wins by month"
          :labels="labels"
          :series="[
            { label: 'Enquiries', values: trendSlice.map((entry) => entry.enquiries) },
            { label: 'Quotations', values: trendSlice.map((entry) => entry.quotes) },
            { label: 'Won', values: trendSlice.map((entry) => entry.won) },
          ]"
        />
      </AdminPanel>

      <AdminPanel title="Illustrative revenue" description="Seeded values, in naira. Not connected to invoices or payments.">
        <template #actions>
          <span class="font-display text-sm font-bold text-ink">{{ formatNaira(totalRevenue, { compact: true }) }}</span>
        </template>
        <AdminBarChart
          title="Illustrative monthly revenue"
          :labels="labels"
          :series="revenueSeriesData"
          format="currency"
        />
        <p class="mt-3 rounded-lg bg-cream-deep/50 px-3 py-2 text-[10px] leading-4 text-muted">
          Revenue is a demonstration series. No payment provider, bank feed or accounting system is connected.
        </p>
      </AdminPanel>
    </div>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <AdminPanel title="Product demand" description="Seeded unit interest, not live orders.">
        <div class="space-y-3">
          <div v-for="product in productDemand" :key="product.name">
            <div class="flex items-center justify-between gap-2 text-[10.5px]">
              <span class="font-medium text-ink-soft">{{ product.name }}</span>
              <span class="font-semibold text-ink">{{ product.units }} units</span>
            </div>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-forest-900/[0.06]">
              <div class="h-full rounded-full bg-forest-600" :style="{ width: `${(product.share / maxDemand) * 100}%` }" />
            </div>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Quotation pipeline" description="Calculated from local demo quotations.">
        <div class="space-y-2.5">
          <div v-for="entry in quoteCounts" :key="entry.status" class="flex items-center justify-between gap-3 text-[10.5px]">
            <div class="flex items-center gap-2">
              <span class="inline-flex rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide ring-1" :class="quoteStatusTone(entry.status)">
                {{ entry.label }}
              </span>
              <span class="text-muted">{{ entry.count }}</span>
            </div>
            <span class="font-semibold text-ink">{{ formatNaira(entry.total, { compact: true }) }}</span>
          </div>
        </div>
        <div class="mt-3 border-t border-forest-900/[0.07] pt-3">
          <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">Total pipeline</p>
          <p class="mt-0.5 font-display text-lg font-bold text-ink">{{ formatNaira(admin.state.value.quotes.reduce((total, quote) => total + quote.total, 0), { compact: true }) }}</p>
        </div>
      </AdminPanel>

      <AdminPanel title="Installation stages" description="Current demo delivery board.">
        <div class="space-y-2">
          <div v-for="stage in installCounts" :key="stage.value" class="flex items-center justify-between gap-2 text-[10.5px]">
            <span class="flex items-center gap-2 text-ink-soft">
              <span class="size-1.5 rounded-full bg-forest-500" aria-hidden="true" />
              {{ stage.label }}
            </span>
            <span class="rounded-full bg-cream-deep px-1.5 py-0.5 text-[9px] font-semibold text-ink">{{ stage.count }}</span>
          </div>
        </div>
        <NuxtLink to="/admin/installations" class="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-forest-700 underline underline-offset-2">
          Open installation board
          <UIcon name="i-lucide-arrow-right" class="size-3" aria-hidden="true" />
        </NuxtLink>
      </AdminPanel>
    </div>

    <AdminPanel title="Report notes" description="Read before using any figure outside this prototype.">
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-forest-900/[0.08] p-3">
          <p class="text-[10px] font-bold uppercase tracking-[0.1em] text-forest-700">Data source</p>
          <p class="mt-1 text-[10.5px] leading-5 text-muted">All trend and revenue values are seeded constants in the demo dataset. They do not change when you edit enquiries or quotes.</p>
        </div>
        <div class="rounded-xl border border-forest-900/[0.08] p-3">
          <p class="text-[10px] font-bold uppercase tracking-[0.1em] text-forest-700">No guarantees</p>
          <p class="mt-1 text-[10.5px] leading-5 text-muted">Past or illustrative performance does not predict future results. No savings, payback or revenue commitment is implied.</p>
        </div>
        <div class="rounded-xl border border-forest-900/[0.08] p-3">
          <p class="text-[10px] font-bold uppercase tracking-[0.1em] text-forest-700">Export scope</p>
          <p class="mt-1 text-[10.5px] leading-5 text-muted">CSV export covers the selected period only and is generated in your browser. The file is not uploaded anywhere.</p>
        </div>
      </div>
    </AdminPanel>
  </div>
</template>
