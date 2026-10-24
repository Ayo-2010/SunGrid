<script setup lang="ts">
import { enquiryTrend, seedActivities } from '~/data/admin'
import { quoteStatusOptions } from '~/utils/status'
import type { QuoteStatus } from '#shared/types'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin overview',
  description: 'Demonstration admin dashboard for SunGrid Energy. All records and metrics are mock data stored in the browser.',
  noindex: true,
})

const admin = useAdminData()
const enquiriesStore = useEnquiries()
const messagesStore = useDemoMessages()

const todayLabel = ref('')

const quotes = computed(() => admin.state.value.quotes)
const installations = computed(() => admin.state.value.installations)
const enquiries = computed(() => enquiriesStore.enquiries.value)

const newEnquiries = computed(() => enquiries.value.filter((item) => item.status === 'new').length)
const activeInstallations = computed(() => installations.value.filter((item) => item.stage !== 'complete').length)
const unreadMessages = computed(() => messagesStore.messages.value.filter((item) => !item.read).length)

const openPipelineValue = computed(() =>
  quotes.value
    .filter((quote) => quote.status === 'draft' || quote.status === 'sent')
    .reduce((total, quote) => total + quote.total, 0),
)

const dueThisWeek = computed(() => {
  const now = Date.now()
  const week = now + 7 * 86_400_000
  return installations.value.filter((item) => {
    const target = new Date(`${item.targetDate}T23:59:59`).getTime()
    return item.stage !== 'complete' && target >= now && target <= week
  }).length
})

const pipeline = computed(() =>
  quoteStatusOptions.map((option) => {
    const matching = quotes.value.filter((quote) => quote.status === option.value)
    return {
      status: option.value,
      label: option.label,
      count: matching.length,
      amount: matching.reduce((total, quote) => total + quote.total, 0),
    }
  }),
)

const pipelineTotal = computed(() => pipeline.value.reduce((total, item) => total + item.amount, 0))

const recentEnquiries = computed(() => enquiries.value.slice(0, 5))
const activeProjects = computed(() => installations.value.filter((item) => item.stage !== 'complete').slice(0, 4))

const chartLabels = enquiryTrend.map((entry) => entry.month)

const quickActions = [
  { label: 'Create a quotation', description: 'Draft a demo quote for a customer', to: '/admin/quotations?new=1', icon: 'i-lucide-file-plus-2' },
  { label: 'Review enquiries', description: 'Assign and follow up requests', to: '/admin/enquiries', icon: 'i-lucide-inbox' },
  { label: 'Update installations', description: 'Move jobs through delivery stages', to: '/admin/installations', icon: 'i-lucide-hammer' },
  { label: 'Read form messages', description: 'Contact and service submissions', to: '/admin/content', icon: 'i-lucide-message-square-text' },
]

function statusTone(status: QuoteStatus): string {
  return quoteStatusTone(status)
}

onMounted(() => {
  todayLabel.value = formatDate(new Date(), 'long')
})
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Dashboard"
      title="Welcome back, Ade."
      description="A working prototype of the SunGrid operations dashboard. Everything here is seeded or stored in this browser — no live customers, revenue or installations."
      badge="Mock data"
    >
      <template #meta>
        <p class="flex items-center gap-1.5 text-[11px] text-muted">
          <UIcon name="i-lucide-calendar-days" class="size-3.5" aria-hidden="true" />
          <span v-if="todayLabel">{{ todayLabel }}</span>
          <span v-else>Demo workspace</span>
          <span class="text-muted/50">·</span>
          <span>{{ enquiries.length }} enquiry records in this browser</span>
        </p>
      </template>
      <template #actions>
        <AppButton to="/" variant="outline" size="sm" icon="i-lucide-external-link">Public site</AppButton>
        <AppButton to="/admin/quotations?new=1" size="sm" icon="i-lucide-plus">New quotation</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="New enquiries"
        :value="String(newEnquiries)"
        icon="i-lucide-inbox"
        change="+27% vs Sep"
        trend="up"
        hint="Seeded + browser submissions"
      />
      <AdminStatCard
        label="Open pipeline"
        :value="formatNaira(openPipelineValue, { compact: true })"
        icon="i-lucide-wallet"
        change="Draft + sent"
        trend="flat"
        hint="Demo quotation values"
      />
      <AdminStatCard
        label="Active installations"
        :value="String(activeInstallations)"
        icon="i-lucide-hammer"
        :change="`${dueThisWeek} due within 7 days`"
        trend="flat"
        hint="Excludes completed jobs"
      />
      <AdminStatCard
        label="Unread form messages"
        :value="String(unreadMessages)"
        icon="i-lucide-message-square-text"
        change="Browser only"
        trend="flat"
        hint="Contact, service & installation forms"
      />
    </div>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
      <div class="space-y-5">
        <AdminPanel
          title="Enquiry trend"
          description="Demonstration monthly totals across the last six months. Seeded figures, not live analytics."
        >
          <template #actions>
            <AppBadge tone="warning">Illustrative</AppBadge>
          </template>
          <AdminBarChart
            title="Enquiries, quotations and wins by month"
            :labels="chartLabels"
            :series="[
              { label: 'Enquiries', values: enquiryTrend.map((entry) => entry.enquiries) },
              { label: 'Quotations', values: enquiryTrend.map((entry) => entry.quotes) },
              { label: 'Won', values: enquiryTrend.map((entry) => entry.won) },
            ]"
          />
          <div class="mt-4 grid gap-2 border-t border-forest-900/[0.07] pt-3 sm:grid-cols-3">
            <div>
              <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">October enquiries</p>
              <p class="mt-0.5 font-display text-lg font-bold text-ink">{{ enquiryTrend.at(-1)?.enquiries ?? 0 }}</p>
            </div>
            <div>
              <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">October quotes</p>
              <p class="mt-0.5 font-display text-lg font-bold text-ink">{{ enquiryTrend.at(-1)?.quotes ?? 0 }}</p>
            </div>
            <div>
              <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">October wins</p>
              <p class="mt-0.5 font-display text-lg font-bold text-ink">{{ enquiryTrend.at(-1)?.won ?? 0 }}</p>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel
          title="Quotation pipeline"
          description="Calculated from the demo quotation records in this browser."
          padded
        >
          <template #actions>
            <AppButton to="/admin/quotations" variant="ghost" size="sm" icon-right="i-lucide-arrow-right">Open</AppButton>
          </template>
          <div class="space-y-3">
            <div v-for="entry in pipeline" :key="entry.status">
              <div class="flex items-center justify-between gap-3 text-[11px]">
                <div class="flex items-center gap-2">
                  <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1" :class="statusTone(entry.status)">
                    {{ entry.label }}
                  </span>
                  <span class="text-muted">{{ entry.count }} record{{ entry.count === 1 ? '' : 's' }}</span>
                </div>
                <span class="font-semibold text-ink">{{ formatNaira(entry.amount, { compact: true }) }}</span>
              </div>
              <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-forest-900/[0.06]">
                <div
                  class="h-full rounded-full bg-forest-600"
                  :style="{ width: `${pipelineTotal ? Math.max(2, (entry.amount / pipelineTotal) * 100) : 0}%` }"
                />
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-baseline justify-between border-t border-forest-900/[0.07] pt-3">
            <p class="text-[10px] font-semibold uppercase tracking-wide text-muted">Total quoted value</p>
            <p class="font-display text-lg font-bold text-ink">{{ formatNaira(pipelineTotal, { compact: true }) }}</p>
          </div>
        </AdminPanel>

        <AdminPanel title="Recent enquiries" description="Newest first. Open a record to update status, owner or notes." :padded="false">
          <template #actions>
            <AppButton to="/admin/enquiries" variant="ghost" size="sm" icon-right="i-lucide-arrow-right">All enquiries</AppButton>
          </template>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[44rem] text-left">
              <caption class="sr-only">Five most recent demo enquiries</caption>
              <thead>
                <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
                  <th scope="col" class="px-4 py-2.5 font-semibold">Customer</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold">Project</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold">Owner</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold">Received</th>
                  <th scope="col" class="px-4 py-2.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-forest-900/[0.06]">
                <tr v-for="enquiry in recentEnquiries" :key="enquiry.id" class="hover:bg-cream-deep/20">
                  <td class="px-4 py-2.5">
                    <p class="text-[11.5px] font-semibold text-ink">{{ enquiry.fullName }}</p>
                    <p class="text-[10px] text-muted">{{ enquiry.reference }} · {{ enquiry.city }}</p>
                  </td>
                  <td class="px-4 py-2.5">
                    <p class="text-[11px] text-ink-soft">{{ enquiry.projectType }}</p>
                    <p class="text-[9.5px] text-muted">{{ enquiry.systemType }} · {{ enquiry.backupHours }}h backup</p>
                  </td>
                  <td class="px-4 py-2.5">
                    <span class="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1" :class="enquiryStatusTone(enquiry.status)">
                      {{ enquiryStatusLabel(enquiry.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-2.5 text-[10.5px] text-muted">{{ enquiry.assignedTo }}</td>
                  <td class="px-4 py-2.5 text-[10.5px] text-muted">{{ relativeTime(enquiry.createdAt) }}</td>
                  <td class="px-4 py-2.5 text-right">
                    <NuxtLink
                      :to="`/admin/enquiries?focus=${enquiry.id}`"
                      class="text-[10.5px] font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-600"
                    >
                      Open
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </AdminPanel>
      </div>

      <div class="space-y-5">
        <AdminPanel title="Quick actions">
          <div class="grid gap-2">
            <NuxtLink
              v-for="action in quickActions"
              :key="action.to"
              :to="action.to"
              class="group flex items-start gap-2.5 rounded-xl border border-forest-900/[0.08] p-3 transition-colors hover:border-forest-900/20 hover:bg-forest-50/50"
            >
              <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                <UIcon :name="action.icon" class="size-4" aria-hidden="true" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-[11.5px] font-semibold text-ink">{{ action.label }}</span>
                <span class="block text-[10px] leading-4 text-muted">{{ action.description }}</span>
              </span>
              <UIcon name="i-lucide-arrow-up-right" class="mt-1 size-3.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </NuxtLink>
          </div>
        </AdminPanel>

        <AdminPanel title="Active installations" description="Jobs currently in delivery.">
          <template #actions>
            <NuxtLink to="/admin/installations" class="text-[10.5px] font-semibold text-forest-700 hover:text-forest-600">View board</NuxtLink>
          </template>
          <div class="space-y-3">
            <div v-for="project in activeProjects" :key="project.id" class="rounded-xl border border-forest-900/[0.08] p-3">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-[11px] font-semibold text-ink">{{ project.customer }}</p>
                  <p class="truncate text-[9.5px] text-muted">{{ project.location }}</p>
                </div>
                <span class="shrink-0 rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide" :class="stageTone(project.stage)">
                  {{ stageLabel(project.stage) }}
                </span>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <div class="h-1 flex-1 overflow-hidden rounded-full bg-forest-900/[0.07]">
                  <div class="h-full rounded-full bg-solar-500" :style="{ width: `${project.progress}%` }" />
                </div>
                <span class="text-[9px] font-semibold text-muted">{{ project.progress }}%</span>
              </div>
            </div>
            <p v-if="!activeProjects.length" class="rounded-lg border border-dashed border-forest-900/15 px-3 py-4 text-center text-[10.5px] text-muted">
              No active installations.
            </p>
          </div>
        </AdminPanel>

        <AdminPanel title="Activity" description="Seeded audit trail for interface demonstration.">
          <ol class="relative space-y-3.5 before:absolute before:bottom-1 before:left-[13px] before:top-1 before:w-px before:bg-forest-900/10">
            <li v-for="activity in seedActivities.slice(0, 6)" :key="activity.id" class="relative flex gap-2.5">
              <span class="relative z-10 grid size-7 shrink-0 place-items-center rounded-full border border-forest-900/10 bg-white text-forest-700">
                <UIcon :name="activity.icon" class="size-3" aria-hidden="true" />
              </span>
              <div class="min-w-0 pt-0.5">
                <p class="text-[10.5px] leading-4 text-ink-soft">
                  <strong class="font-semibold text-ink">{{ activity.actor }}</strong>
                  {{ activity.action }}
                  <span class="font-medium text-forest-700">{{ activity.target }}</span>
                </p>
                <p class="text-[9px] text-muted">{{ relativeTime(activity.time) }}</p>
              </div>
            </li>
          </ol>
        </AdminPanel>
      </div>
    </div>
  </div>
</template>
