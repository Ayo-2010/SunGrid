<script setup lang="ts">
import type { CategorySlug } from '#shared/types'
import type { CatalogueFilters, CatalogueSort } from '~/types/catalogue'
import { defaultCatalogueFilters } from '~/types/catalogue'
import { demoCatalogueNotice, productCategories, products } from '~/data/products'

usePageMeta({
  title: 'Solar product catalogue',
  description:
    'Browse solar panels, hybrid inverters, lithium batteries, mounting and accessories. Search and filter by category, brand, capacity and price, then add products to a quote request.',
  image: '/images/panels-closeup.jpg',
})

const route = useRoute()
const validCategory = productCategories.some((category) => category.slug === route.query.category)
const initialCategory = validCategory ? (route.query.category as CategorySlug) : 'all'

const filters = ref<CatalogueFilters>({ ...defaultCatalogueFilters, category: initialCategory })
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const sort = ref<CatalogueSort>('featured')
const visibleCount = ref(9)
const loading = ref(false)
const mobileFiltersOpen = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | undefined
let loadingTimer: ReturnType<typeof setTimeout> | undefined

watch(search, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    filters.value.search = value.trim()
  }, 280)
})

watch(
  filters,
  () => {
    visibleCount.value = 9
    loading.value = true
    clearTimeout(loadingTimer)
    loadingTimer = setTimeout(() => {
      loading.value = false
    }, 280)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  clearTimeout(loadingTimer)
  document.body.style.overflow = ''
})

const filteredProducts = computed(() => {
  const term = filters.value.search.toLowerCase()
  let result = products.filter((product) => {
    if (term) {
      const haystack = `${product.name} ${product.brand} ${product.model} ${product.sku} ${product.category}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    if (filters.value.category !== 'all' && product.category !== filters.value.category) return false
    if (filters.value.brands.length && !filters.value.brands.includes(product.brand)) return false

    const min = filters.value.capacityMin === '' ? null : Number(filters.value.capacityMin)
    const max = filters.value.capacityMax === '' ? null : Number(filters.value.capacityMax)
    if (min !== null || max !== null) {
      if (product.capacity === undefined) return false
      if (min !== null && !Number.isNaN(min) && product.capacity < min) return false
      if (max !== null && !Number.isNaN(max) && product.capacity > max) return false
    }

    if (filters.value.price !== 'all') {
      if (filters.value.price === 'quote-only') {
        if (product.price !== null) return false
      } else {
        if (product.price === null) return false
        if (filters.value.price === 'under-500k' && product.price >= 500000) return false
        if (filters.value.price === '500k-2m' && (product.price < 500000 || product.price > 2000000)) return false
        if (filters.value.price === '2m-5m' && (product.price < 2000000 || product.price > 5000000)) return false
        if (filters.value.price === 'above-5m' && product.price <= 5000000) return false
      }
    }

    return true
  })

  result = [...result]
  if (sort.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort.value === 'price-asc') {
    result.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER))
  } else if (sort.value === 'price-desc') {
    result.sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
  } else {
    result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }
  return result
})

const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))
const remaining = computed(() => Math.max(0, filteredProducts.value.length - visibleCount.value))

const selectedCategoryName = computed(
  () => productCategories.find((entry) => entry.slug === filters.value.category)?.name ?? 'All categories',
)

const activeChips = computed(() => {
  const chips: { label: string; clear: () => void }[] = []
  if (filters.value.search) {
    chips.push({
      label: `“${filters.value.search}”`,
      clear: () => {
        filters.value.search = ''
        search.value = ''
      },
    })
  }
  if (filters.value.category !== 'all') {
    chips.push({
      label: selectedCategoryName.value,
      clear: () => { filters.value.category = 'all' },
    })
  }
  for (const brand of filters.value.brands) {
    chips.push({
      label: brand,
      clear: () => { filters.value.brands = filters.value.brands.filter((entry) => entry !== brand) },
    })
  }
  if (filters.value.capacityMin || filters.value.capacityMax) {
    chips.push({
      label: `Capacity ${filters.value.capacityMin || '0'}–${filters.value.capacityMax || 'any'}`,
      clear: () => {
        filters.value.capacityMin = ''
        filters.value.capacityMax = ''
      },
    })
  }
  if (filters.value.price !== 'all') {
    const labels: Record<string, string> = {
      'under-500k': 'Under ₦500k',
      '500k-2m': '₦500k – ₦2m',
      '2m-5m': '₦2m – ₦5m',
      'above-5m': 'Above ₦5m',
      'quote-only': 'Quote only',
    }
    chips.push({
      label: labels[filters.value.price] ?? filters.value.price,
      clear: () => { filters.value.price = 'all' },
    })
  }
  return chips
})

function resetAll() {
  filters.value = { ...defaultCatalogueFilters }
  search.value = ''
}

function openMobileFilters() {
  mobileFiltersOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeMobileFilters() {
  mobileFiltersOpen.value = false
  document.body.style.overflow = ''
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && mobileFiltersOpen.value) closeMobileFilters()
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
</script>

<template>
  <div>
    <PageHero
      eyebrow="Product catalogue"
      title="Solar equipment, without the guesswork."
      description="Panels, inverters, batteries and balance-of-system equipment with specifications and compatibility notes. Demo pricing is indicative; quote-only items require a technical check."
      :breadcrumbs="[{ label: 'Products' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/calculator" variant="on-dark" icon="i-lucide-calculator">Size your system first</AppButton>
        <AppButton to="/compare" variant="on-dark" icon="i-lucide-git-compare">Compare products</AppButton>
      </template>
    </PageHero>

    <section class="border-b border-forest-900/[0.08] bg-cream">
      <div class="page-container py-8 lg:py-10">
        <div class="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside class="hidden lg:block">
            <div class="sticky top-24 rounded-2xl border border-forest-900/10 bg-white p-4">
              <ProductFilters v-model="filters" :products="products" :categories="productCategories" />
            </div>
          </aside>

          <div class="min-w-0">
            <div class="flex flex-col gap-3 rounded-2xl border border-forest-900/10 bg-white p-3.5 sm:flex-row sm:items-center">
              <div class="relative flex-1">
                <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <label for="catalogue-search" class="sr-only">Search products by name, model or SKU</label>
                <input
                  id="catalogue-search"
                  v-model="search"
                  type="search"
                  placeholder="Search by name, model, brand or SKU…"
                  class="field-base !py-2.5 pl-10 pr-9 text-[13px]"
                />
                <button
                  v-if="search"
                  type="button"
                  class="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
                  aria-label="Clear search"
                  @click="search = ''; filters.search = ''"
                >
                  <UIcon name="i-lucide-x" class="size-3.5" aria-hidden="true" />
                </button>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-3 py-2 text-[12px] font-medium text-forest-900 lg:hidden"
                  @click="openMobileFilters"
                >
                  <UIcon name="i-lucide-sliders-horizontal" class="size-3.5" aria-hidden="true" />
                  Filters
                  <span v-if="activeChips.length" class="rounded-full bg-forest-900 px-1.5 text-[9px] font-bold text-solar-300">{{ activeChips.length }}</span>
                </button>

                <label for="catalogue-sort" class="sr-only">Sort products</label>
                <select id="catalogue-sort" v-model="sort" class="field-base !w-auto !py-2 text-[12px]">
                  <option value="featured">Featured first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p class="text-[12px] text-muted" aria-live="polite">
                <span class="font-semibold text-ink">{{ filteredProducts.length }}</span>
                {{ filteredProducts.length === 1 ? 'product' : 'products' }}
                <span v-if="filters.category !== 'all'"> in {{ selectedCategoryName }}</span>
              </p>
              <div v-if="activeChips.length" class="flex flex-wrap items-center gap-1.5">
                <button
                  v-for="chip in activeChips"
                  :key="chip.label"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full bg-forest-900/[0.06] px-2.5 py-1 text-[10.5px] font-medium text-forest-900 transition-colors hover:bg-forest-900/[0.1]"
                  :aria-label="`Remove filter ${chip.label}`"
                  @click="chip.clear()"
                >
                  {{ chip.label }}
                  <UIcon name="i-lucide-x" class="size-3 text-muted" aria-hidden="true" />
                </button>
                <button type="button" class="px-1 text-[10.5px] font-medium text-muted underline underline-offset-2 hover:text-ink" @click="resetAll">
                  Clear all
                </button>
              </div>
            </div>

            <div v-if="loading" class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading products" aria-busy="true">
              <div v-for="index in 6" :key="index" class="overflow-hidden rounded-2xl border border-forest-900/10 bg-white">
                <div class="aspect-[4/3] animate-pulse bg-forest-900/[0.06]" />
                <div class="space-y-2.5 p-4">
                  <div class="h-2.5 w-1/3 animate-pulse rounded bg-forest-900/[0.08]" />
                  <div class="h-3.5 w-4/5 animate-pulse rounded bg-forest-900/[0.08]" />
                  <div class="h-2.5 w-full animate-pulse rounded bg-forest-900/[0.05]" />
                  <div class="h-2.5 w-2/3 animate-pulse rounded bg-forest-900/[0.05]" />
                </div>
              </div>
            </div>

            <div v-else-if="visibleProducts.length" class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
            </div>

            <EmptyState
              v-else
              icon="i-lucide-search-x"
              title="No products match those filters"
              description="Try a different category or brand, widen the capacity range, or clear the search term."
            >
              <AppButton variant="secondary" size="sm" icon="i-lucide-rotate-ccw" @click="resetAll">Clear all filters</AppButton>
            </EmptyState>

            <div v-if="!loading && visibleProducts.length" class="mt-8 flex flex-col items-center gap-3">
              <div class="h-px w-full bg-forest-900/[0.08]" />
              <p class="text-[11px] text-muted">
                Showing {{ visibleProducts.length }} of {{ filteredProducts.length }} products
              </p>
              <AppButton
                v-if="remaining > 0"
                variant="outline"
                icon-right="i-lucide-chevron-down"
                @click="visibleCount += 6"
              >
                Load {{ Math.min(6, remaining) }} more
              </AppButton>
              <p class="mt-1 max-w-xl text-center text-[10px] leading-4 text-muted/70">
                {{ demoCatalogueNotice }} Brand names are referenced for catalogue structure, not as a
                claim of authorised dealership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-white">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Compatibility matters"
            title="Do not pair equipment by wattage alone."
            description="Inverter PV limits, battery voltage, BMS protocols and surge loads all affect what will work together — and what will fail safely or expensively."
          />
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-forest-900/10 bg-cream/60 p-4">
              <UIcon name="i-lucide-plug-zap" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[12px] font-semibold text-ink">Battery & inverter pairing</p>
              <p class="mt-1 text-[11px] leading-5 text-muted">Confirm supported battery list and firmware before ordering.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-cream/60 p-4">
              <UIcon name="i-lucide-sun" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[12px] font-semibold text-ink">PV string limits</p>
              <p class="mt-1 text-[11px] leading-5 text-muted">Cold-weather Voc and MPPT windows must be calculated per string.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-cream/60 p-4">
              <UIcon name="i-lucide-shield-check" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[12px] font-semibold text-ink">Protection sizing</p>
              <p class="mt-1 text-[11px] leading-5 text-muted">Fuses, isolators, cable gauge and earthing are system-specific.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-cream/60 p-4">
              <UIcon name="i-lucide-message-square-text" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[12px] font-semibold text-ink">Ask before you buy</p>
              <p class="mt-1 text-[11px] leading-5 text-muted">Send us the equipment you are considering; we will flag incompatibilities.</p>
            </div>
          </div>
        </div>
        <div class="mt-8 flex flex-wrap gap-2.5">
          <AppButton to="/quote" icon-right="i-lucide-arrow-right">Request a technical quote</AppButton>
          <AppButton to="/contact" variant="outline" icon="i-lucide-message-circle">Ask a compatibility question</AppButton>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="mobileFiltersOpen" class="fixed inset-0 z-[70] bg-forest-950/50 backdrop-blur-[2px]" aria-hidden="true" @click="closeMobileFilters" />
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
          v-if="mobileFiltersOpen"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
          class="fixed inset-y-0 right-0 z-[71] flex w-full max-w-xs flex-col bg-cream"
        >
          <div class="flex items-center justify-between border-b border-forest-900/10 px-4 py-4">
            <h2 class="font-display text-base font-bold text-ink">Filter products</h2>
            <button type="button" class="grid size-8 place-items-center rounded-full text-muted hover:bg-forest-900/5" aria-label="Close filters" @click="closeMobileFilters">
              <UIcon name="i-lucide-x" class="size-5" aria-hidden="true" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <ProductFilters v-model="filters" :products="products" :categories="productCategories" />
          </div>
          <div class="border-t border-forest-900/10 bg-white p-4">
            <AppButton block size="sm" @click="closeMobileFilters">
              Show {{ filteredProducts.length }} products
            </AppButton>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
