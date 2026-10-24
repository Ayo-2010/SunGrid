<script setup lang="ts">
import { adminNav } from '~/utils/admin'
import { products } from '~/data/products'

interface SearchResult {
  label: string
  description: string
  to: string
  icon: string
  group: string
}

const route = useRoute()
const admin = useAdminData()
const enquiriesStore = useEnquiries()
const messagesStore = useDemoMessages()
const toast = useToast()

const collapsed = ref(false)
const mobileOpen = ref(false)
const mobileSearchOpen = ref(false)
const searchActive = ref(false)
const query = ref('')
const notificationsOpen = ref(false)
const profileOpen = ref(false)

const searchRoot = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const notificationsRoot = ref<HTMLElement | null>(null)
const profileRoot = ref<HTMLElement | null>(null)

const currentNav = computed(
  () => adminNav.find((item) => item.to === route.path) ?? { label: 'Overview', to: '/admin', icon: 'i-lucide-layout-dashboard', description: '' },
)

const newEnquiries = computed(() => enquiriesStore.enquiries.value.filter((item) => item.status === 'new').length)
const unreadMessages = computed(() => messagesStore.messages.value.filter((item) => !item.read).length)

function badgeFor(to: string): number {
  if (to === '/admin/enquiries') return newEnquiries.value
  if (to === '/admin/content') return unreadMessages.value
  return 0
}

const searchResults = computed<SearchResult[]>(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return []

  const navMatches = adminNav
    .filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(term))
    .slice(0, 3)
    .map((item) => ({ label: item.label, description: item.description, to: item.to, icon: item.icon, group: 'Admin' }))

  const productMatches = products
    .filter((product) => `${product.name} ${product.brand} ${product.sku} ${product.category}`.toLowerCase().includes(term))
    .slice(0, 4)
    .map((product) => ({
      label: product.name,
      description: `${product.brand} · ${product.sku} · ${formatNaira(product.price, { compact: true })}`,
      to: `/admin/products?q=${encodeURIComponent(product.name)}`,
      icon: 'i-lucide-package',
      group: 'Catalogue',
    }))

  const enquiryMatches = enquiriesStore.enquiries.value
    .filter((item) => `${item.fullName} ${item.reference} ${item.phone} ${item.city}`.toLowerCase().includes(term))
    .slice(0, 4)
    .map((item) => ({
      label: `${item.fullName} · ${item.reference}`,
      description: `${item.projectType} · ${item.city}, ${item.state}`,
      to: `/admin/enquiries?focus=${encodeURIComponent(item.id)}`,
      icon: 'i-lucide-inbox',
      group: 'Enquiries',
    }))

  const quoteMatches = admin.state.value.quotes
    .filter((item) => `${item.customer} ${item.reference}`.toLowerCase().includes(term))
    .slice(0, 3)
    .map((item) => ({
      label: `${item.reference} · ${item.customer}`,
      description: `${item.status} · ${formatNaira(item.total, { compact: true })}`,
      to: `/admin/quotations?q=${encodeURIComponent(item.reference)}`,
      icon: 'i-lucide-file-text',
      group: 'Quotations',
    }))

  return [...navMatches, ...enquiryMatches, ...quoteMatches, ...productMatches]
})

const notificationTargets: Record<string, string> = {
  enquiry: '/admin/enquiries',
  quote: '/admin/quotations',
  installation: '/admin/installations',
  system: '/admin',
}

const notificationIcons: Record<string, string> = {
  enquiry: 'i-lucide-inbox',
  quote: 'i-lucide-file-text',
  installation: 'i-lucide-hammer',
  system: 'i-lucide-shield-alert',
}

useClickOutside(searchRoot, () => {
  searchActive.value = false
})

useClickOutside(notificationsRoot, () => {
  notificationsOpen.value = false
})

useClickOutside(profileRoot, () => {
  profileOpen.value = false
})

function chooseResult(result: SearchResult) {
  searchActive.value = false
  mobileSearchOpen.value = false
  query.value = ''
  navigateTo(result.to)
}

function submitSearch() {
  const first = searchResults.value[0]
  if (first) chooseResult(first)
}

function openNotification(type: string, id: string) {
  admin.markNotification(id)
  notificationsOpen.value = false
  navigateTo(notificationTargets[type] ?? '/admin')
}

function resetDemoData() {
  if (!import.meta.client) return
  const confirmed = window.confirm(
    'Reset the demo admin workspace? Status changes, notes, new records and catalogue edits will be discarded. Form messages and enquiries are separate and will remain.',
  )
  if (!confirmed) return
  admin.resetDemoState()
  profileOpen.value = false
  toast.add({
    title: 'Demo workspace reset',
    description: 'Admin records are back to their seeded state.',
    color: 'success',
  })
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
  event.preventDefault()
  searchInput.value?.focus()
}

watch(query, (value) => {
  searchActive.value = value.trim().length > 0
})

watch(mobileOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    mobileSearchOpen.value = false
    searchActive.value = false
    notificationsOpen.value = false
    profileOpen.value = false
    query.value = ''
  },
)

onMounted(() => {
  try {
    collapsed.value = localStorage.getItem('sungrid-admin-sidebar') === 'collapsed'
  } catch {
    /* Ignore unavailable storage. */
  }
  document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleGlobalKeydown)
  }
})

watch(collapsed, (value) => {
  try {
    localStorage.setItem('sungrid-admin-sidebar', value ? 'collapsed' : 'expanded')
  } catch {
    /* Ignore unavailable storage. */
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#f4f1e9]">
    <a
      href="#admin-main"
      class="sr-only z-[100] rounded-full bg-solar-400 px-4 py-2 text-sm font-semibold text-forest-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to dashboard content
    </a>

    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 bg-forest-950/50 backdrop-blur-[1px] lg:hidden"
        aria-hidden="true"
        @click="mobileOpen = false"
      />
    </Transition>

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-forest-950 text-cream transition-all duration-200"
      :class="[
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'lg:w-20' : 'lg:w-64',
      ]"
      aria-label="Admin navigation"
    >
      <div class="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
        <LogoMark to="/admin" variant="light" class="hidden lg:inline-flex" :show-wordmark="!collapsed" />
        <LogoMark to="/admin" variant="light" class="lg:hidden" />
        <button
          type="button"
          class="grid size-8 shrink-0 place-items-center rounded-lg text-cream/60 hover:bg-white/10 hover:text-cream lg:hidden"
          aria-label="Close admin navigation"
          @click="mobileOpen = false"
        >
          <UIcon name="i-lucide-x" class="size-4.5" aria-hidden="true" />
        </button>
      </div>

      <div class="flex items-center gap-2 px-4 pb-3 pt-4" :class="collapsed ? 'lg:justify-center lg:px-0' : ''">
        <span class="size-1.5 shrink-0 rounded-full bg-solar-400" aria-hidden="true" />
        <p class="text-[9.5px] font-bold uppercase tracking-[0.17em] text-cream/45" :class="collapsed ? 'lg:hidden' : ''">
          Demo workspace
        </p>
      </div>

      <nav class="hide-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Admin sections">
        <NuxtLink
          v-for="item in adminNav"
          :key="item.to"
          :to="item.to"
          :title="collapsed ? item.label : undefined"
          class="group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors"
          :class="[
            route.path === item.to
              ? 'bg-white/10 text-cream'
              : 'text-cream/60 hover:bg-white/[0.06] hover:text-cream',
            collapsed ? 'lg:justify-center lg:px-0' : '',
          ]"
          :aria-current="route.path === item.to ? 'page' : undefined"
          @click="mobileOpen = false"
        >
          <span
            v-if="route.path === item.to"
            class="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-solar-400"
            aria-hidden="true"
          />
          <UIcon :name="item.icon" class="size-4 shrink-0" :class="route.path === item.to ? 'text-solar-300' : ''" aria-hidden="true" />
          <span class="min-w-0 flex-1 truncate" :class="collapsed ? 'lg:hidden' : ''">{{ item.label }}</span>
          <span
            v-if="badgeFor(item.to)"
            class="grid min-w-4 place-items-center rounded-full bg-solar-400 px-1 py-0.5 text-[9px] font-bold leading-none text-forest-950"
            :class="collapsed ? 'lg:hidden' : ''"
          >
            {{ badgeFor(item.to) }}
          </span>
        </NuxtLink>
      </nav>

      <div class="shrink-0 space-y-2 border-t border-white/10 p-3">
        <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3" :class="collapsed ? 'lg:hidden' : ''">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-lucide-flask-conical" class="size-3.5 text-solar-300" aria-hidden="true" />
            <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-cream/70">Prototype</p>
          </div>
          <p class="mt-1.5 text-[10px] leading-4 text-cream/45">
            No authentication, database or payments. Data stays in this browser.
          </p>
        </div>

        <NuxtLink
          to="/"
          class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-cream/55 transition-colors hover:bg-white/[0.06] hover:text-cream"
          :class="collapsed ? 'lg:justify-center lg:px-0' : ''"
          :title="collapsed ? 'View public website' : undefined"
        >
          <UIcon name="i-lucide-external-link" class="size-3.5 shrink-0" aria-hidden="true" />
          <span :class="collapsed ? 'lg:hidden' : ''">View public website</span>
        </NuxtLink>
      </div>
    </aside>

    <div class="flex min-h-screen flex-col transition-[padding] duration-200" :class="collapsed ? 'lg:pl-20' : 'lg:pl-64'">
      <header class="sticky top-0 z-30 border-b border-forest-900/10 bg-white/95 backdrop-blur">
        <div class="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            class="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-forest-900/5 hover:text-ink lg:hidden"
            aria-label="Open admin navigation"
            @click="mobileOpen = true"
          >
            <UIcon name="i-lucide-menu" class="size-4.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="hidden size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-forest-900/5 hover:text-ink lg:grid"
            :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            :aria-pressed="collapsed"
            @click="collapsed = !collapsed"
          >
            <UIcon :name="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'" class="size-4.5" aria-hidden="true" />
          </button>

          <nav aria-label="Breadcrumb" class="hidden min-w-0 items-center gap-1.5 text-[11px] sm:flex">
            <NuxtLink to="/admin" class="font-medium text-muted transition-colors hover:text-forest-800">Admin</NuxtLink>
            <UIcon name="i-lucide-chevron-right" class="size-3 shrink-0 text-muted/60" aria-hidden="true" />
            <span class="truncate font-semibold text-ink" aria-current="page">{{ currentNav.label }}</span>
          </nav>

          <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div ref="searchRoot" class="relative hidden md:block">
              <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                ref="searchInput"
                v-model="query"
                type="search"
                class="field-base !w-52 !rounded-lg !py-2 pl-8 pr-12 text-[12px] lg:!w-64"
                placeholder="Search workspace…"
                aria-label="Search the admin workspace"
                @focus="searchActive = query.trim().length > 0"
                @keydown.enter.prevent="submitSearch"
                @keydown.escape="searchActive = false"
              />
              <kbd class="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-forest-900/10 bg-cream px-1 py-0.5 text-[9px] font-medium text-muted lg:block">
                Ctrl K
              </kbd>

              <div
                v-if="searchActive"
                class="absolute right-0 top-full z-40 mt-2 w-[22rem] overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-lift"
              >
                <p class="border-b border-forest-900/[0.07] px-3 py-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">
                  {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }}
                </p>
                <div v-if="searchResults.length" class="max-h-80 overflow-y-auto py-1">
                  <NuxtLink
                    v-for="result in searchResults"
                    :key="result.to"
                    :to="result.to"
                    class="flex items-start gap-2.5 px-3 py-2 transition-colors hover:bg-forest-50"
                    @click="chooseResult(result)"
                  >
                    <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-forest-50 text-forest-700">
                      <UIcon :name="result.icon" class="size-3.5" aria-hidden="true" />
                    </span>
                    <span class="min-w-0">
                      <span class="block truncate text-[11.5px] font-semibold text-ink">{{ result.label }}</span>
                      <span class="block truncate text-[10px] text-muted">{{ result.group }} · {{ result.description }}</span>
                    </span>
                  </NuxtLink>
                </div>
                <p v-else class="px-3 py-5 text-center text-[11px] text-muted">No matching records or pages.</p>
              </div>
            </div>

            <button
              type="button"
              class="grid size-8 place-items-center rounded-lg text-muted hover:bg-forest-900/5 hover:text-ink md:hidden"
              :aria-expanded="mobileSearchOpen"
              aria-label="Open search"
              @click="mobileSearchOpen = !mobileSearchOpen"
            >
              <UIcon :name="mobileSearchOpen ? 'i-lucide-x' : 'i-lucide-search'" class="size-4" aria-hidden="true" />
            </button>

            <div ref="notificationsRoot" class="relative">
              <button
                type="button"
                class="relative grid size-8 place-items-center rounded-lg text-muted hover:bg-forest-900/5 hover:text-ink"
                :aria-expanded="notificationsOpen"
                aria-haspopup="true"
                :aria-label="`Notifications${admin.unreadNotifications.value ? `, ${admin.unreadNotifications.value} unread` : ''}`"
                @click="notificationsOpen = !notificationsOpen; profileOpen = false"
              >
                <UIcon name="i-lucide-bell" class="size-4" aria-hidden="true" />
                <span
                  v-if="admin.unreadNotifications.value"
                  class="absolute right-1 top-1 grid min-w-3.5 place-items-center rounded-full bg-solar-500 px-1 text-[8px] font-bold leading-[14px] text-forest-950"
                >
                  {{ admin.unreadNotifications.value }}
                </span>
              </button>

              <Transition
                enter-active-class="transition duration-150"
                enter-from-class="-translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="notificationsOpen"
                  class="absolute right-0 top-full z-40 mt-2 w-[21rem] overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-lift"
                >
                  <div class="flex items-center justify-between gap-3 border-b border-forest-900/[0.07] px-3.5 py-3">
                    <p class="text-[11px] font-bold text-ink">Notifications</p>
                    <button
                      type="button"
                      class="text-[10px] font-semibold text-forest-700 hover:text-forest-600 disabled:opacity-40"
                      :disabled="!admin.unreadNotifications.value"
                      @click="admin.markAllNotificationsRead()"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div class="max-h-80 divide-y divide-forest-900/[0.06] overflow-y-auto">
                    <button
                      v-for="notification in admin.state.value.notifications"
                      :key="notification.id"
                      type="button"
                      class="flex w-full items-start gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-cream-deep/50"
                      :class="!notification.read ? 'bg-solar-50/40' : ''"
                      @click="openNotification(notification.type, notification.id)"
                    >
                      <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-forest-50 text-forest-700">
                        <UIcon :name="notificationIcons[notification.type]" class="size-3.5" aria-hidden="true" />
                      </span>
                      <span class="min-w-0 flex-1">
                        <span class="flex items-start gap-1.5">
                          <span class="flex-1 text-[11px] font-semibold leading-4 text-ink">{{ notification.title }}</span>
                          <span v-if="!notification.read" class="mt-1 size-1.5 shrink-0 rounded-full bg-solar-500" aria-label="Unread" />
                        </span>
                        <span class="mt-0.5 block text-[10px] leading-4 text-muted">{{ notification.body }}</span>
                        <span class="mt-1 block text-[9px] text-muted/70">{{ relativeTime(notification.time) }}</span>
                      </span>
                    </button>
                  </div>
                  <p class="border-t border-forest-900/[0.07] bg-cream-deep/40 px-3.5 py-2 text-[9.5px] text-muted">
                    Demo notifications. Opening one marks it read.
                  </p>
                </div>
              </Transition>
            </div>

            <div ref="profileRoot" class="relative">
              <button
                type="button"
                class="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 text-left hover:bg-forest-900/5"
                :aria-expanded="profileOpen"
                aria-haspopup="true"
                aria-label="Open profile menu"
                @click="profileOpen = !profileOpen; notificationsOpen = false"
              >
                <span class="grid size-7 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-solar-300">AA</span>
                <span class="hidden leading-tight lg:block">
                  <span class="block text-[10.5px] font-semibold text-ink">Abdullah Abdulwahab</span>
                  <span class="block text-[9px] text-muted">Super Administrator</span>
                </span>
                <UIcon name="i-lucide-chevron-down" class="hidden size-3 text-muted sm:block" aria-hidden="true" />
              </button>

              <Transition
                enter-active-class="transition duration-150"
                enter-from-class="-translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="profileOpen"
                  class="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-lift"
                >
                  <div class="border-b border-forest-900/[0.07] px-3.5 py-3">
                    <p class="text-[11.5px] font-semibold text-ink">Abdullah Abdulwahab</p>
                    <p class="truncate text-[10px] text-muted">abdullah@sungrid.example.com</p>
                    <span class="mt-1.5 inline-flex items-center gap-1 rounded-full bg-solar-100 px-2 py-0.5 text-[9px] font-semibold text-solar-900">
                      <UIcon name="i-lucide-shield-check" class="size-2.5" aria-hidden="true" />
                      Super Administrator · demo
                    </span>
                  </div>
                  <div class="py-1">
                    <NuxtLink
                      to="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-2 px-3.5 py-2 text-[11px] font-medium text-ink-soft hover:bg-forest-50 hover:text-forest-800"
                      @click="profileOpen = false"
                    >
                      <UIcon name="i-lucide-external-link" class="size-3.5" aria-hidden="true" />
                      View public website
                    </NuxtLink>
                    <NuxtLink
                      to="/admin/team"
                      class="flex items-center gap-2 px-3.5 py-2 text-[11px] font-medium text-ink-soft hover:bg-forest-50 hover:text-forest-800"
                      @click="profileOpen = false"
                    >
                      <UIcon name="i-lucide-users" class="size-3.5" aria-hidden="true" />
                      Team & roles
                    </NuxtLink>
                    <button
                      type="button"
                      class="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[11px] font-medium text-amber-800 hover:bg-amber-50"
                      @click="resetDemoData"
                    >
                      <UIcon name="i-lucide-rotate-ccw" class="size-3.5" aria-hidden="true" />
                      Reset demo workspace
                    </button>
                  </div>
                  <p class="border-t border-forest-900/[0.07] bg-cream-deep/40 px-3.5 py-2 text-[9.5px] leading-4 text-muted">
                    No authentication. This profile is illustrative.
                  </p>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div v-if="mobileSearchOpen" class="border-t border-forest-900/10 px-4 py-3 md:hidden">
          <label for="admin-mobile-search" class="sr-only">Search the admin workspace</label>
          <div class="relative">
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="admin-mobile-search"
              v-model="query"
              type="search"
              class="field-base !py-2 pl-8 text-[12px]"
              placeholder="Search pages, products, enquiries…"
              @focus="searchActive = query.trim().length > 0"
              @keydown.enter.prevent="submitSearch"
            />
          </div>
          <div v-if="query.trim()" class="mt-2 max-h-64 overflow-y-auto rounded-lg border border-forest-900/10 bg-white">
            <NuxtLink
              v-for="result in searchResults"
              :key="result.to"
              :to="result.to"
              class="flex items-start gap-2 border-b border-forest-900/[0.06] px-3 py-2 last:border-b-0 hover:bg-forest-50"
              @click="chooseResult(result)"
            >
              <UIcon :name="result.icon" class="mt-0.5 size-3.5 shrink-0 text-forest-700" aria-hidden="true" />
              <span class="min-w-0">
                <span class="block truncate text-[11px] font-semibold text-ink">{{ result.label }}</span>
                <span class="block truncate text-[9.5px] text-muted">{{ result.group }} · {{ result.description }}</span>
              </span>
            </NuxtLink>
            <p v-if="!searchResults.length" class="px-3 py-4 text-center text-[11px] text-muted">No matches.</p>
          </div>
        </div>
      </header>

      <div class="border-b border-amber-300/60 bg-amber-50 px-4 py-2 sm:px-6">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] leading-4 text-amber-950">
          <UIcon name="i-lucide-flask-conical" class="size-3.5 shrink-0 text-amber-800" aria-hidden="true" />
          <strong class="font-semibold">Demo workspace.</strong>
          <span class="text-amber-900/80">
            Mock records, catalogue edits and status changes are stored in this browser only. No sign-in, database or payment provider.
          </span>
        </div>
      </div>

      <main id="admin-main" class="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div class="mx-auto w-full max-w-[90rem]">
          <slot />
        </div>
      </main>

      <footer class="border-t border-forest-900/10 px-4 py-4 sm:px-6 lg:px-8">
        <div class="mx-auto flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-2 text-[10px] text-muted">
          <p>SunGrid Energy · demonstration admin</p>
          <p>All figures illustrative · values in Nigerian naira unless stated</p>
        </div>
      </footer>
    </div>
  </div>
</template>
