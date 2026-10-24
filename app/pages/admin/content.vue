<script setup lang="ts">
import type { ContentStatus, DemoMessage, DemoMessageChannel } from '#shared/types'
import { articles } from '~/data/articles'
import { faqs } from '~/data/faqs'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin content',
  description: 'Demonstration content workspace: browser-only form messages, article previews and FAQ editorial status.',
  noindex: true,
})

const admin = useAdminData()
const messagesStore = useDemoMessages()
const toast = useToast()

const tab = ref<'inbox' | 'articles' | 'faqs'>('inbox')
const search = ref('')
const channel = ref<'all' | DemoMessageChannel>('all')

const messageOpen = ref(false)
const selectedMessageId = ref<string | null>(null)

const selectedMessage = computed(() => messagesStore.messages.value.find((message) => message.id === selectedMessageId.value) ?? null)

const messages = computed(() => messagesStore.messages.value)
const unreadCount = computed(() => messages.value.filter((message) => !message.read).length)
const articleSearch = computed(() => search.value.trim().toLowerCase())

const filteredMessages = computed(() => {
  const term = search.value.trim().toLowerCase()
  return messages.value.filter((message) => {
    if (channel.value !== 'all' && message.channel !== channel.value) return false
    if (!term) return true
    return `${message.reference} ${message.name} ${message.email} ${message.phone} ${message.subject} ${message.body}`
      .toLowerCase()
      .includes(term)
  })
})

const filteredArticles = computed(() => {
  const term = articleSearch.value
  return articles.filter((article) => {
    if (!term) return true
    return `${article.title} ${article.category} ${article.author} ${article.excerpt}`.toLowerCase().includes(term)
  })
})

const filteredFaqs = computed(() => {
  const term = articleSearch.value
  return faqs.filter((faq) => {
    if (!term) return true
    return `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase().includes(term)
  })
})

const tabs = computed(() => [
  { value: 'inbox' as const, label: 'Form inbox', count: unreadCount.value, icon: 'i-lucide-inbox' },
  { value: 'articles' as const, label: 'Articles', count: articles.length, icon: 'i-lucide-newspaper' },
  { value: 'faqs' as const, label: 'FAQs', count: faqs.length, icon: 'i-lucide-circle-help' },
])

const statusOptions: { value: ContentStatus; label: string }[] = [
  { value: 'published', label: 'Published' },
  { value: 'in-review', label: 'In review' },
  { value: 'draft', label: 'Draft' },
]

function channelLabel(value: DemoMessageChannel): string {
  return value === 'contact' ? 'Contact' : value === 'service' ? 'Service' : 'Installation'
}

function channelTone(value: DemoMessageChannel): 'forest' | 'info' | 'warning' {
  if (value === 'contact') return 'forest'
  if (value === 'service') return 'info'
  return 'warning'
}

function openMessage(message: DemoMessage) {
  selectedMessageId.value = message.id
  if (!message.read) messagesStore.markRead(message.id)
  messageOpen.value = true
}

function toggleRead(message: DemoMessage) {
  messagesStore.markRead(message.id, !message.read)
}

function markAllRead() {
  messages.value.filter((message) => !message.read).forEach((message) => messagesStore.markRead(message.id))
  toast.add({ title: 'Inbox marked read', description: 'All demo messages are now read.', color: 'success' })
}

function deleteMessage(message: DemoMessage) {
  if (!import.meta.client) return
  if (!window.confirm(`Delete demo message ${message.reference} from this browser?`)) return
  messagesStore.remove(message.id)
  if (selectedMessageId.value === message.id) {
    selectedMessageId.value = null
    messageOpen.value = false
  }
  toast.add({ title: 'Message deleted', description: 'Removed from this browser only.', color: 'success' })
}

function exportInbox() {
  const ok = downloadCsv('sungrid-demo-form-messages.csv', filteredMessages.value, [
    { key: 'reference', label: 'Reference' },
    { key: 'channel', label: 'Channel', value: (row) => channelLabel(row.channel) },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'body', label: 'Message' },
    { key: 'meta', label: 'Details' },
    { key: 'read', label: 'Read', value: (row) => (row.read ? 'Yes' : 'No') },
    { key: 'createdAt', label: 'Received' },
  ])
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${filteredMessages.value.length} messages exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}

function statusFor(key: string): ContentStatus {
  return admin.contentStatusFor(key)
}

function onStatusChange(key: string, event: Event) {
  const target = event.target as HTMLSelectElement
  admin.setContentStatus(key, target.value as ContentStatus)
  toast.add({ title: 'Editorial status saved locally', description: 'The public website is generated from static content and does not change.', color: 'success' })
}

function statusTone(status: ContentStatus): 'success' | 'warning' | 'neutral' {
  if (status === 'published') return 'success'
  if (status === 'in-review') return 'warning'
  return 'neutral'
}

function statusLabel(status: ContentStatus): string {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Editorial"
      title="Content"
      description="Real demo form submissions appear in the inbox. Article and FAQ statuses are local labels for interface demonstration and do not publish anything."
      badge="Browser storage"
    >
      <template #actions>
        <AppButton v-if="tab === 'inbox'" variant="outline" size="sm" icon="i-lucide-check-check" :disabled="!unreadCount" @click="markAllRead">
          Mark all read
        </AppButton>
        <AppButton v-if="tab === 'inbox'" size="sm" icon="i-lucide-download" @click="exportInbox">Export inbox</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Unread messages" :value="String(unreadCount)" icon="i-lucide-mail" hint="From the public forms" />
      <AdminStatCard label="Messages stored" :value="String(messages.length)" icon="i-lucide-inbox" hint="This browser only" />
      <AdminStatCard label="Articles" :value="String(articles.length)" icon="i-lucide-newspaper" hint="Static demo library" />
      <AdminStatCard label="FAQs" :value="String(faqs.length)" icon="i-lucide-circle-help" hint="Static demo library" />
    </div>

    <div class="rounded-2xl border border-forest-900/10 bg-white p-1.5 shadow-soft">
      <div class="flex gap-1" role="tablist" aria-label="Content sections">
        <button
          v-for="entry in tabs"
          :key="entry.value"
          type="button"
          role="tab"
          :aria-selected="tab === entry.value"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors sm:flex-none sm:px-4"
          :class="tab === entry.value ? 'bg-forest-900 text-cream' : 'text-muted hover:bg-forest-50 hover:text-forest-800'"
          @click="tab = entry.value"
        >
          <UIcon :name="entry.icon" class="size-3.5" aria-hidden="true" />
          {{ entry.label }}
          <span class="rounded-full px-1.5 py-0.5 text-[8.5px]" :class="tab === entry.value ? 'bg-white/15 text-cream' : 'bg-cream-deep text-muted'">{{ entry.count }}</span>
        </button>
      </div>
    </div>

    <template v-if="tab === 'inbox'">
      <AdminPanel :padded="false">
        <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
          <div class="grid gap-2 md:grid-cols-[minmax(0,1fr)_12rem]">
            <div class="relative">
              <label for="content-search" class="sr-only">Search form messages</label>
              <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="content-search" v-model="search" type="search" class="field-base !py-2 pl-8 text-[12px]" placeholder="Search reference, name, subject or message…" />
            </div>
            <div>
              <label for="content-channel" class="sr-only">Filter by channel</label>
              <select id="content-channel" v-model="channel" class="field-base !py-2 text-[12px]">
                <option value="all">All channels</option>
                <option value="contact">Contact form</option>
                <option value="service">Service enquiry</option>
                <option value="installation">Installation enquiry</option>
              </select>
            </div>
          </div>
          <p class="mt-2 text-[10px] text-muted" aria-live="polite">
            {{ filteredMessages.length }} message{{ filteredMessages.length === 1 ? '' : 's' }}.
            Messages are created when a public demo form is submitted in this browser.
          </p>
        </div>

        <div v-if="filteredMessages.length" class="overflow-x-auto">
          <table class="w-full min-w-[50rem] text-left">
            <caption class="sr-only">Demo form submissions</caption>
            <thead>
              <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
                <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Reference</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">From</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Subject</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Channel</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Received</th>
                <th scope="col" class="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-forest-900/[0.06]">
              <tr v-for="message in filteredMessages" :key="message.id" class="hover:bg-cream-deep/20" :class="!message.read ? 'bg-solar-50/30' : ''">
                <td class="px-4 py-3">
                  <span v-if="!message.read" class="inline-flex items-center gap-1 rounded-full bg-solar-100 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-solar-900">
                    <span class="size-1 rounded-full bg-solar-600" aria-hidden="true" />
                    Unread
                  </span>
                  <span v-else class="text-[9px] text-muted">Read</span>
                </td>
                <td class="px-4 py-3 text-[10.5px] font-semibold text-ink">{{ message.reference }}</td>
                <td class="px-4 py-3">
                  <p class="text-[11px] font-medium text-ink">{{ message.name }}</p>
                  <p class="text-[9.5px] text-muted">{{ message.email || message.phone }}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="max-w-[16rem] truncate text-[10.5px] text-ink-soft">{{ message.subject }}</p>
                  <p class="max-w-[16rem] truncate text-[9.5px] text-muted">{{ message.body }}</p>
                </td>
                <td class="px-4 py-3">
                  <AppBadge :tone="channelTone(message.channel)">{{ channelLabel(message.channel) }}</AppBadge>
                </td>
                <td class="px-4 py-3 text-[9.5px] text-muted">{{ formatDate(message.createdAt) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <button type="button" class="text-[9.5px] font-medium text-muted underline underline-offset-2 hover:text-forest-700" @click="toggleRead(message)">
                      Mark {{ message.read ? 'unread' : 'read' }}
                    </button>
                    <button type="button" class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-semibold text-forest-800 hover:bg-forest-50" @click="openMessage(message)">
                      Open
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState
          v-else-if="!messages.length"
          icon="i-lucide-mail-open"
          title="No form messages yet"
          description="Submit the contact, service or installation form on the public site in this browser, then return here to see the message."
        >
          <div class="flex flex-wrap justify-center gap-2">
            <AppButton to="/contact" size="sm" icon="i-lucide-message-square">Contact form</AppButton>
            <AppButton to="/installation" size="sm" variant="outline" icon="i-lucide-wrench">Installation enquiry</AppButton>
          </div>
        </EmptyState>

        <EmptyState
          v-else
          icon="i-lucide-search-x"
          title="No messages match"
          description="Try a broader search term or a different channel."
        >
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="search = ''; channel = 'all'">Clear filters</AppButton>
        </EmptyState>
      </AdminPanel>
    </template>

    <template v-else-if="tab === 'articles'">
      <AdminPanel :padded="false">
        <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
          <div class="relative max-w-xl">
            <label for="article-search" class="sr-only">Search articles</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="article-search" v-model="search" type="search" class="field-base !py-2 pl-8 text-[12px]" placeholder="Search articles by title, category or author…" />
          </div>
          <p class="mt-2 text-[10px] text-muted">
            {{ filteredArticles.length }} article{{ filteredArticles.length === 1 ? '' : 's' }}. Editorial status is a local demo label.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[52rem] text-left">
            <caption class="sr-only">Demo article library</caption>
            <thead>
              <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
                <th scope="col" class="px-4 py-2.5 font-semibold">Article</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Category</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Author</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Published</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Read</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Status (local)</th>
                <th scope="col" class="px-4 py-2.5 text-right font-semibold">Preview</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-forest-900/[0.06]">
              <tr v-for="article in filteredArticles" :key="article.slug" class="hover:bg-cream-deep/20">
                <td class="px-4 py-3">
                  <p class="max-w-[22rem] text-[11px] font-semibold leading-4 text-ink">{{ article.title }}</p>
                  <p class="mt-0.5 text-[9.5px] text-muted">/{{ article.slug }}</p>
                </td>
                <td class="px-4 py-3 text-[10px] text-muted">{{ article.category }}</td>
                <td class="px-4 py-3 text-[10px] text-muted">{{ article.author }}</td>
                <td class="px-4 py-3 text-[10px] text-muted">{{ formatDate(article.date) }}</td>
                <td class="px-4 py-3 text-[10px] text-muted">{{ article.readingTime }} min</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <select
                      :id="`article-status-${article.slug}`"
                      :value="statusFor(`article:${article.slug}`)"
                      class="field-base !w-auto !py-1 !text-[10px]"
                      :aria-label="`Editorial status for ${article.title}`"
                      @change="onStatusChange(`article:${article.slug}`, $event)"
                    >
                      <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                    </select>
                    <AppBadge :tone="statusTone(statusFor(`article:${article.slug}`))">{{ statusLabel(statusFor(`article:${article.slug}`)) }}</AppBadge>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <NuxtLink :to="`/resources/${article.slug}`" target="_blank" rel="noopener noreferrer" class="text-[10px] font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-600">
                    Open
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState v-if="!filteredArticles.length" icon="i-lucide-newspaper" title="No articles match" description="Try a different search term.">
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="search = ''">Clear search</AppButton>
        </EmptyState>
      </AdminPanel>
    </template>

    <template v-else>
      <AdminPanel :padded="false">
        <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
          <div class="relative max-w-xl">
            <label for="faq-search" class="sr-only">Search FAQs</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="faq-search" v-model="search" type="search" class="field-base !py-2 pl-8 text-[12px]" placeholder="Search FAQs by question, answer or category…" />
          </div>
          <p class="mt-2 text-[10px] text-muted">
            {{ filteredFaqs.length }} FAQ{{ filteredFaqs.length === 1 ? '' : 's' }}. Editorial status is a local demo label.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[52rem] text-left">
            <caption class="sr-only">Demo FAQ library</caption>
            <thead>
              <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
                <th scope="col" class="px-4 py-2.5 font-semibold">Question</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Category</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Answer preview</th>
                <th scope="col" class="px-4 py-2.5 font-semibold">Status (local)</th>
                <th scope="col" class="px-4 py-2.5 text-right font-semibold">Preview</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-forest-900/[0.06]">
              <tr v-for="(faq, index) in filteredFaqs" :key="faq.question" class="hover:bg-cream-deep/20">
                <td class="px-4 py-3">
                  <p class="max-w-[22rem] text-[11px] font-semibold leading-4 text-ink">{{ faq.question }}</p>
                </td>
                <td class="px-4 py-3 text-[10px] text-muted">{{ faq.category }}</td>
                <td class="px-4 py-3">
                  <p class="max-w-[18rem] truncate text-[9.5px] text-muted">{{ faq.answer }}</p>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <select
                      :id="`faq-status-${index}`"
                      :value="statusFor(`faq:${index}`)"
                      class="field-base !w-auto !py-1 !text-[10px]"
                      :aria-label="`Editorial status for ${faq.question}`"
                      @change="onStatusChange(`faq:${index}`, $event)"
                    >
                      <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                    </select>
                    <AppBadge :tone="statusTone(statusFor(`faq:${index}`))">{{ statusLabel(statusFor(`faq:${index}`)) }}</AppBadge>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <NuxtLink to="/faq" target="_blank" rel="noopener noreferrer" class="text-[10px] font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-600">
                    Open
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState v-if="!filteredFaqs.length" icon="i-lucide-circle-help" title="No FAQs match" description="Try a different search term.">
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="search = ''">Clear search</AppButton>
        </EmptyState>
      </AdminPanel>
    </template>

    <AdminModal
      v-model:open="messageOpen"
      :title="selectedMessage ? selectedMessage.subject : 'Message'"
      :description="selectedMessage ? `${selectedMessage.reference} · ${channelLabel(selectedMessage.channel)} · ${formatDate(selectedMessage.createdAt)}` : ''"
      size="lg"
    >
      <div v-if="selectedMessage" class="space-y-4">
        <div class="grid gap-2 sm:grid-cols-2">
          <div class="rounded-xl border border-forest-900/10 bg-white p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">From</p>
            <p class="mt-1 text-[12px] font-semibold text-ink">{{ selectedMessage.name }}</p>
            <a :href="`tel:${selectedMessage.phone.replace(/\s/g, '')}`" class="mt-0.5 block text-[10.5px] text-forest-800 hover:underline">{{ selectedMessage.phone }}</a>
            <a v-if="selectedMessage.email" :href="`mailto:${selectedMessage.email}`" class="block truncate text-[10.5px] text-muted hover:underline">{{ selectedMessage.email }}</a>
          </div>
          <div class="rounded-xl border border-forest-900/10 bg-white p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Context</p>
            <p class="mt-1 text-[10.5px] text-ink-soft">{{ selectedMessage.meta || 'No extra details supplied.' }}</p>
            <AppBadge :tone="channelTone(selectedMessage.channel)" class="mt-2">{{ channelLabel(selectedMessage.channel) }}</AppBadge>
          </div>
        </div>

        <div class="rounded-xl border border-forest-900/10 bg-white p-3">
          <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Message</p>
          <p class="mt-1.5 whitespace-pre-line text-[11.5px] leading-6 text-ink-soft">{{ selectedMessage.body }}</p>
        </div>

        <div class="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-[10.5px] leading-5 text-amber-950">
          This message exists only in this browser. No email was sent and no ticket was created. Delete it when you have finished reviewing the demo.
        </div>
      </div>

      <template #footer>
        <AppButton v-if="selectedMessage" variant="ghost" size="sm" icon="i-lucide-trash-2" class="mr-auto text-red-700" @click="deleteMessage(selectedMessage)">
          Delete
        </AppButton>
        <AppButton variant="ghost" size="sm" @click="messageOpen = false">Close</AppButton>
        <AppButton v-if="selectedMessage" size="sm" variant="outline" icon="i-lucide-mail" @click="toggleRead(selectedMessage)">
          Mark {{ selectedMessage.read ? 'unread' : 'read' }}
        </AppButton>
      </template>
    </AdminModal>
  </div>
</template>
