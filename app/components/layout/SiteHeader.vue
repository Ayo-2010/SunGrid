<script setup lang="ts">
import { navLinks, site } from '~/data/site'
import { solutions } from '~/data/solutions'

const route = useRoute()
const quoteList = useQuoteList()
const compare = useCompare()

const mobileOpen = ref(false)
const mobileSolutionsOpen = ref(false)
const solutionsOpen = ref(false)
const scrolled = ref(false)
const dropdownRoot = ref<HTMLElement | null>(null)
const mobilePanel = ref<HTMLElement | null>(null)
const mobileCloseButton = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)

function handleScroll() {
  scrolled.value = window.scrollY > 8
}

function handleDocumentClick(event: MouseEvent) {
  if (!solutionsOpen.value) return
  if (dropdownRoot.value && !dropdownRoot.value.contains(event.target as Node)) {
    solutionsOpen.value = false
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  solutionsOpen.value = false
  if (mobileOpen.value) closeMobile()
}

function openMobile() {
  lastFocused = document.activeElement as HTMLElement | null
  mobileOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => mobileCloseButton.value?.focus())
}

function closeMobile() {
  mobileOpen.value = false
  document.body.style.overflow = ''
  nextTick(() => lastFocused?.focus?.())
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})

watch(
  () => route.fullPath,
  () => {
    solutionsOpen.value = false
    if (mobileOpen.value) closeMobile()
  },
)
</script>

<template>
  <div>
    <a
      href="#main-content"
      class="sr-only z-[100] rounded-full bg-solar-400 px-4 py-2 text-sm font-semibold text-forest-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>

    <!-- Utility bar -->
    <div class="bg-forest-950 text-cream/70">
      <div class="page-container flex h-9 items-center justify-between gap-4 text-[11px]">
        <p class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-solar-400" aria-hidden="true" />
          <span class="hidden sm:inline">Engineering-led solar for Nigerian homes, businesses and industry</span>
          <span class="sm:hidden">Solar systems · Lagos · Abuja · PH</span>
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/contact#coverage" class="hidden transition-colors hover:text-solar-300 md:inline">
            Service coverage
          </NuxtLink>
          <a :href="site.phoneHref" class="flex items-center gap-1.5 transition-colors hover:text-solar-300">
            <UIcon name="i-lucide-phone" class="size-3" aria-hidden="true" />
            {{ site.phoneDisplay }}
          </a>
          <a
            :href="`https://wa.me/${site.whatsappNumber}`"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden items-center gap-1.5 transition-colors hover:text-solar-300 sm:flex"
          >
            <UIcon name="i-lucide-message-circle" class="size-3" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>

    <!-- Main navigation -->
    <header
      class="sticky top-0 z-50 border-b border-forest-900/[0.08] bg-cream/95 backdrop-blur-md transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_8px_30px_-20px_rgba(6,37,28,0.35)]' : ''"
    >
      <div class="page-container flex h-[68px] items-center justify-between gap-4">
        <LogoMark />

        <nav ref="dropdownRoot" aria-label="Main navigation" class="hidden items-center gap-0.5 xl:flex">
          <div
            v-for="link in navLinks"
            :key="link.label"
            class="relative"
          >
            <button
              v-if="link.dropdown === 'solutions'"
              type="button"
              class="flex items-center gap-1 rounded-full px-2.5 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-forest-900/[0.05] hover:text-forest-900"
              :class="isActive(link.to) && 'text-forest-900'"
              :aria-expanded="solutionsOpen"
              aria-haspopup="true"
              @click.stop="solutionsOpen = !solutionsOpen"
            >
              {{ link.label }}
              <UIcon
                name="i-lucide-chevron-down"
                class="size-3.5 transition-transform"
                :class="solutionsOpen && 'rotate-180'"
                aria-hidden="true"
              />
            </button>
            <NuxtLink
              v-else
              :to="link.to"
              class="relative flex items-center rounded-full px-2.5 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-forest-900/[0.05] hover:text-forest-900"
              :class="isActive(link.to) && '!text-forest-900'"
              :aria-current="isActive(link.to) ? 'page' : undefined"
            >
              {{ link.label }}
              <span
                v-if="isActive(link.to)"
                class="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-solar-500"
                aria-hidden="true"
              />
            </NuxtLink>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <div
                v-if="link.dropdown === 'solutions' && solutionsOpen"
                class="absolute left-1/2 top-[calc(100%+12px)] w-[560px] -translate-x-1/2 rounded-2xl border border-forest-900/10 bg-white p-3 shadow-lift"
              >
                <div class="grid grid-cols-2 gap-1">
                  <NuxtLink
                    v-for="solution in solutions"
                    :key="solution.slug"
                    :to="`/solutions/${solution.slug}`"
                    class="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-cream"
                  >
                    <span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700 transition-colors group-hover:bg-forest-900 group-hover:text-solar-300">
                      <UIcon :name="solution.icon" class="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span class="block text-[13px] font-semibold text-ink">{{ solution.navLabel }}</span>
                      <span class="mt-0.5 block text-[11px] leading-4 text-muted">{{ solution.tagline }}</span>
                    </span>
                  </NuxtLink>
                </div>
                <div class="mt-2 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                  <p class="text-[11.5px] text-muted">Not sure which system fits?</p>
                  <NuxtLink to="/calculator" class="flex items-center gap-1 text-[12px] font-semibold text-forest-800 hover:text-forest-600">
                    Try the calculator
                    <UIcon name="i-lucide-arrow-right" class="size-3.5" aria-hidden="true" />
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>
        </nav>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <NuxtLink
            to="/compare"
            class="relative hidden size-9 place-items-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/[0.06] sm:grid"
            :aria-label="`Compare products${compare.count.value ? ` (${compare.count.value} selected)` : ''}`"
          >
            <UIcon name="i-lucide-git-compare" class="size-[18px]" aria-hidden="true" />
            <span
              v-if="compare.count.value"
              class="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-forest-900 text-[9px] font-bold text-solar-300"
            >
              {{ compare.count.value }}
            </span>
          </NuxtLink>

          <button
            type="button"
            class="relative grid size-9 place-items-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/[0.06]"
            :aria-label="`Open enquiry list (${quoteList.count.value} items)`"
            @click="quoteList.open()"
          >
            <UIcon name="i-lucide-shopping-basket" class="size-[18px]" aria-hidden="true" />
            <span
              v-if="quoteList.count.value"
              class="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-solar-400 text-[9px] font-bold text-forest-950"
            >
              {{ quoteList.count.value }}
            </span>
          </button>

          <AppButton to="/quote" size="sm" class="ml-1 hidden sm:inline-flex" icon-right="i-lucide-arrow-up-right">
            Get a Quote
          </AppButton>

          <button
            type="button"
            class="grid size-9 place-items-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/[0.06] xl:hidden"
            aria-label="Open navigation menu"
            :aria-expanded="mobileOpen"
            @click="openMobile"
          >
            <UIcon name="i-lucide-menu" class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile navigation -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-250"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="mobileOpen" class="fixed inset-0 z-[70] bg-forest-950/50 backdrop-blur-[2px]" aria-hidden="true" @click="closeMobile" />
      </Transition>
      <Transition
        enter-active-class="transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="mobileOpen"
          ref="mobilePanel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          class="fixed inset-y-0 right-0 z-[71] flex w-full max-w-sm flex-col bg-cream"
        >
          <div class="flex h-[68px] items-center justify-between border-b border-forest-900/10 px-5">
            <LogoMark />
            <button
              ref="mobileCloseButton"
              type="button"
              class="grid size-9 place-items-center rounded-full text-forest-900 hover:bg-forest-900/[0.06]"
              aria-label="Close navigation menu"
              @click="closeMobile"
            >
              <UIcon name="i-lucide-x" class="size-5" aria-hidden="true" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-5">
            <nav aria-label="Mobile navigation" class="space-y-0.5">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.label"
                :to="link.to"
                class="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-colors"
                :class="isActive(link.to) ? 'bg-white text-forest-900 shadow-sm' : 'text-ink-soft hover:bg-white/70'"
                :aria-current="isActive(link.to) ? 'page' : undefined"
                @click="closeMobile"
              >
                {{ link.label }}
                <UIcon name="i-lucide-chevron-right" class="size-4 text-muted/60" aria-hidden="true" />
              </NuxtLink>
            </nav>

            <div class="mt-4 rounded-xl border border-forest-900/10 bg-white/70 p-2">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold text-forest-900"
                :aria-expanded="mobileSolutionsOpen"
                @click="mobileSolutionsOpen = !mobileSolutionsOpen"
              >
                Solution categories
                <UIcon
                  name="i-lucide-chevron-down"
                  class="size-4 transition-transform"
                  :class="mobileSolutionsOpen && 'rotate-180'"
                  aria-hidden="true"
                />
              </button>
              <div v-if="mobileSolutionsOpen" class="grid grid-cols-2 gap-1 px-1 pb-2">
                <NuxtLink
                  v-for="solution in solutions"
                  :key="solution.slug"
                  :to="`/solutions/${solution.slug}`"
                  class="rounded-lg px-2.5 py-2 text-[12px] text-ink-soft transition-colors hover:bg-cream hover:text-forest-900"
                  @click="closeMobile"
                >
                  {{ solution.navLabel }}
                </NuxtLink>
              </div>
            </div>

            <div class="mt-5 space-y-2">
              <AppButton to="/quote" block size="md" @click="closeMobile">Get a Quote</AppButton>
              <AppButton to="/calculator" variant="outline" block size="md" icon="i-lucide-calculator" @click="closeMobile">
                Solar calculator
              </AppButton>
            </div>

            <div class="mt-6 space-y-3 border-t border-forest-900/10 pt-5 text-[13px]">
              <a :href="site.phoneHref" class="flex items-center gap-3 text-ink-soft hover:text-forest-900">
                <UIcon name="i-lucide-phone" class="size-4 text-forest-600" aria-hidden="true" />
                {{ site.phoneDisplay }}
              </a>
              <a
                :href="`https://wa.me/${site.whatsappNumber}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-ink-soft hover:text-forest-900"
              >
                <UIcon name="i-lucide-message-circle" class="size-4 text-forest-600" aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <a :href="`mailto:${site.email}`" class="flex items-center gap-3 text-ink-soft hover:text-forest-900">
                <UIcon name="i-lucide-mail" class="size-4 text-forest-600" aria-hidden="true" />
                {{ site.email }}
              </a>
            </div>
          </div>

          <div class="border-t border-forest-900/10 bg-white px-5 py-3">
            <NuxtLink to="/admin" class="text-[11px] text-muted hover:text-forest-900" @click="closeMobile">
              Staff dashboard (demo)
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
