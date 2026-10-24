<script setup lang="ts">
import type { Availability, CategorySlug, Product } from '#shared/types'
import { productCategories, products } from '~/data/products'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin products',
  description: 'Demonstration product catalogue management. Local price and availability edits are stored in the browser only.',
  noindex: true,
})

const admin = useAdminData()
const route = useRoute()
const toast = useToast()

const initialQuery = typeof route.query.q === 'string' ? route.query.q : ''
const search = ref(initialQuery)
const category = ref<'all' | CategorySlug>('all')
const availability = ref<'all' | Availability>('all')
const sort = ref('name-asc')
const visibleCount = ref(10)

const editOpen = ref(false)
const selected = ref<Product | null>(null)
const priceDraft = ref('')
const availabilityDraft = ref<Availability>('in-stock')
const featuredDraft = ref(false)
const priceError = ref('')

const availabilityOptions: { value: Availability; label: string }[] = [
  { value: 'in-stock', label: 'In stock' },
  { value: 'limited', label: 'Limited stock' },
  { value: 'pre-order', label: 'Pre-order' },
  { value: 'quote-only', label: 'Quote only' },
]

const overrideCount = computed(() => Object.keys(admin.state.value.productOverrides).length)

function effectivePrice(product: Product): number | null {
  const override = admin.state.value.productOverrides[product.id]
  return override && 'price' in override ? (override.price ?? null) : product.price
}

function effectiveAvailability(product: Product): Availability {
  return admin.state.value.productOverrides[product.id]?.availability ?? product.availability
}

function effectiveFeatured(product: Product): boolean {
  const override = admin.state.value.productOverrides[product.id]
  return override && 'featured' in override ? Boolean(override.featured) : Boolean(product.featured)
}

function hasOverride(product: Product): boolean {
  return Boolean(admin.state.value.productOverrides[product.id])
}

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  const results = products.filter((product) => {
    if (category.value !== 'all' && product.category !== category.value) return false
    if (availability.value !== 'all' && effectiveAvailability(product) !== availability.value) return false
    if (!term) return true
    return `${product.name} ${product.brand} ${product.sku} ${product.model} ${product.keySpec} ${product.category}`
      .toLowerCase()
      .includes(term)
  })

  return [...results].sort((a, b) => {
    if (sort.value === 'price-asc') return (effectivePrice(a) ?? Number.POSITIVE_INFINITY) - (effectivePrice(b) ?? Number.POSITIVE_INFINITY)
    if (sort.value === 'price-desc') return (effectivePrice(b) ?? -1) - (effectivePrice(a) ?? -1)
    if (sort.value === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    return a.name.localeCompare(b.name)
  })
})

const visibleProducts = computed(() => filtered.value.slice(0, visibleCount.value))

const inStockCount = computed(() => products.filter((product) => effectiveAvailability(product) === 'in-stock').length)
const quoteOnlyCount = computed(() => products.filter((product) => effectiveAvailability(product) === 'quote-only').length)

watch([search, category, availability, sort], () => {
  visibleCount.value = 10
})

function openEdit(product: Product) {
  selected.value = product
  const currentPrice = effectivePrice(product)
  priceDraft.value = currentPrice === null ? '' : String(currentPrice)
  availabilityDraft.value = effectiveAvailability(product)
  featuredDraft.value = effectiveFeatured(product)
  priceError.value = ''
  editOpen.value = true
}

function saveEdit() {
  if (!selected.value) return
  const trimmed = priceDraft.value.trim()
  const numeric = Number(trimmed.replace(/,/g, ''))
  if (trimmed && (!Number.isFinite(numeric) || numeric < 0)) {
    priceError.value = 'Enter a positive number, or leave the field blank for “price on request”.'
    return
  }
  priceError.value = ''
  admin.setProductOverride(selected.value.id, {
    price: trimmed ? Math.round(numeric) : null,
    availability: availabilityDraft.value,
    featured: featuredDraft.value,
  })
  editOpen.value = false
  toast.add({
    title: 'Catalogue record updated',
    description: `${selected.value.name} was saved in this browser only.`,
    color: 'success',
  })
}

function resetOverride() {
  if (!selected.value) return
  const product = selected.value
  admin.clearProductOverride(product.id)
  priceDraft.value = product.price === null ? '' : String(product.price)
  availabilityDraft.value = product.availability
  featuredDraft.value = Boolean(product.featured)
  priceError.value = ''
  toast.add({
    title: 'Local edit removed',
    description: 'The seeded catalogue values are showing again.',
    color: 'success',
  })
}

function resetAllOverrides() {
  if (!import.meta.client || !overrideCount.value) return
  if (!window.confirm(`Remove all ${overrideCount.value} local catalogue edits and return to the seeded demo values?`)) return
  Object.keys(admin.state.value.productOverrides).forEach((id) => admin.clearProductOverride(id))
  toast.add({ title: 'Catalogue reset', description: 'All local product edits were removed.', color: 'success' })
}

function exportCsv() {
  const ok = downloadCsv(
    'sungrid-demo-products.csv',
    filtered.value,
    [
      { key: 'sku', label: 'SKU' },
      { key: 'name', label: 'Product' },
      { key: 'brand', label: 'Brand' },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price (NGN)', value: (row) => effectivePrice(row) ?? 'On request' },
      { key: 'availability', label: 'Availability', value: (row) => effectiveAvailability(row) },
      { key: 'featured', label: 'Featured', value: (row) => (effectiveFeatured(row) ? 'Yes' : 'No') },
      { key: 'override', label: 'Local edit', value: (row) => (hasOverride(row) ? 'Yes' : 'No') },
    ],
  )
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${filtered.value.length} product records exported from this browser.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}

function categoryLabel(value: CategorySlug): string {
  return productCategories.find((entry) => entry.slug === value)?.name ?? value
}
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Catalogue"
      title="Products"
      description="The seeded demo catalogue with local price and availability edits. Changes here are stored in this browser and do not alter the public product pages."
      badge="Local edits"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" :disabled="!overrideCount" @click="resetAllOverrides">
          Reset edits ({{ overrideCount }})
        </AppButton>
        <AppButton size="sm" icon="i-lucide-download" @click="exportCsv">Export CSV</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Catalogue records" :value="String(products.length)" icon="i-lucide-package" hint="Seeded demo products" />
      <AdminStatCard label="In stock" :value="String(inStockCount)" icon="i-lucide-circle-check" hint="Effective local status" />
      <AdminStatCard label="Quote only" :value="String(quoteOnlyCount)" icon="i-lucide-message-circle-question" hint="No demo price shown" />
      <AdminStatCard label="Local edits" :value="String(overrideCount)" icon="i-lucide-pencil" hint="Stored in this browser" />
    </div>

    <AdminPanel :padded="false">
      <template #actions>
        <p class="text-[10px] text-muted">
          Showing <strong class="font-semibold text-ink">{{ visibleProducts.length }}</strong> of {{ filtered.length }}
        </p>
      </template>

      <div class="border-b border-forest-900/[0.07] p-3.5 sm:p-4">
        <div class="grid gap-2 md:grid-cols-[minmax(0,1fr)_11rem_10rem_10rem]">
          <div class="relative">
            <label for="product-search" class="sr-only">Search products</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="product-search"
              v-model="search"
              type="search"
              class="field-base !py-2 pl-8 text-[12px]"
              placeholder="Search name, brand, model or SKU…"
            />
          </div>
          <div>
            <label for="product-category" class="sr-only">Filter by category</label>
            <select id="product-category" v-model="category" class="field-base !py-2 text-[12px]">
              <option value="all">All categories</option>
              <option v-for="entry in productCategories" :key="entry.slug" :value="entry.slug">{{ entry.name }}</option>
            </select>
          </div>
          <div>
            <label for="product-availability" class="sr-only">Filter by availability</label>
            <select id="product-availability" v-model="availability" class="field-base !py-2 text-[12px]">
              <option value="all">All availability</option>
              <option v-for="entry in availabilityOptions" :key="entry.value" :value="entry.value">{{ entry.label }}</option>
            </select>
          </div>
          <div>
            <label for="product-sort" class="sr-only">Sort products</label>
            <select id="product-sort" v-model="sort" class="field-base !py-2 text-[12px]">
              <option value="name-asc">Name A–Z</option>
              <option value="price-asc">Price low–high</option>
              <option value="price-desc">Price high–low</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
        <p class="mt-2 text-[10px] text-muted" aria-live="polite">
          {{ filtered.length }} product{{ filtered.length === 1 ? '' : 's' }} match the current filters.
          Prices are illustrative and exclude installation, transport and VAT.
        </p>
      </div>

      <div class="hidden overflow-x-auto md:block">
        <table class="w-full min-w-[52rem] text-left">
          <caption class="sr-only">Demo product catalogue with local overrides</caption>
          <thead>
            <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
              <th scope="col" class="px-4 py-2.5 font-semibold">Product</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Category</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Demo price</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Availability</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Featured</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-forest-900/[0.06]">
            <tr v-for="product in visibleProducts" :key="product.id" class="align-top hover:bg-cream-deep/20">
              <td class="px-4 py-3">
                <div class="flex items-start gap-2">
                  <div class="min-w-0">
                    <p class="text-[11.5px] font-semibold leading-4 text-ink">{{ product.name }}</p>
                    <p class="mt-0.5 text-[9.5px] text-muted">{{ product.brand }} · {{ product.sku }} · {{ product.keySpec }}</p>
                    <div class="mt-1 flex flex-wrap gap-1">
                      <span v-if="hasOverride(product)" class="rounded bg-solar-100 px-1.5 py-0.5 text-[8.5px] font-semibold text-solar-900">Local edit</span>
                      <span v-if="product.datasheetAvailable === false" class="rounded bg-stone-100 px-1.5 py-0.5 text-[8.5px] text-stone-600">Datasheet unavailable</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-[10.5px] text-muted">{{ categoryLabel(product.category) }}</td>
              <td class="px-4 py-3">
                <p class="text-[11px] font-semibold text-ink">{{ effectivePrice(product) === null ? 'On request' : formatNaira(effectivePrice(product)) }}</p>
              </td>
              <td class="px-4 py-3">
                <AppBadge :tone="availabilityTone(effectiveAvailability(product))">
                  {{ availabilityLabel(effectiveAvailability(product)) }}
                </AppBadge>
              </td>
              <td class="px-4 py-3">
                <UIcon
                  :name="effectiveFeatured(product) ? 'i-lucide-star' : 'i-lucide-minus'"
                  class="size-3.5"
                  :class="effectiveFeatured(product) ? 'text-solar-500' : 'text-muted/40'"
                  :aria-label="effectiveFeatured(product) ? 'Featured locally' : 'Not featured'"
                />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-3">
                  <NuxtLink
                    :to="`/products/${product.slug}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[10px] font-medium text-muted underline underline-offset-2 hover:text-forest-700"
                  >
                    Preview
                  </NuxtLink>
                  <button
                    type="button"
                    class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-semibold text-forest-800 hover:bg-forest-50"
                    @click="openEdit(product)"
                  >
                    Edit local
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-forest-900/[0.06] md:hidden">
        <div v-for="product in visibleProducts" :key="product.id" class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[12px] font-semibold leading-5 text-ink">{{ product.name }}</p>
              <p class="mt-0.5 text-[10px] text-muted">{{ product.brand }} · {{ product.sku }}</p>
            </div>
            <AppBadge :tone="availabilityTone(effectiveAvailability(product))">{{ availabilityLabel(effectiveAvailability(product)) }}</AppBadge>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-muted">
            <span class="font-semibold text-ink">{{ effectivePrice(product) === null ? 'On request' : formatNaira(effectivePrice(product)) }}</span>
            <span>{{ categoryLabel(product.category) }}</span>
            <span v-if="hasOverride(product)" class="rounded bg-solar-100 px-1.5 py-0.5 text-[8.5px] font-semibold text-solar-900">Local edit</span>
          </div>
          <div class="mt-2.5 flex items-center gap-2">
            <button type="button" class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-semibold text-forest-800 hover:bg-forest-50" @click="openEdit(product)">
              Edit local
            </button>
            <NuxtLink :to="`/products/${product.slug}`" target="_blank" rel="noopener noreferrer" class="text-[10px] font-medium text-muted underline underline-offset-2">
              Preview
            </NuxtLink>
          </div>
        </div>
      </div>

      <EmptyState
        v-if="!filtered.length"
        icon="i-lucide-package-search"
        title="No products match"
        description="Clear the search or choose a different category and availability filter."
      >
        <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="search = ''; category = 'all'; availability = 'all'">
          Clear filters
        </AppButton>
      </EmptyState>

      <div v-if="visibleProducts.length < filtered.length" class="flex justify-center border-t border-forest-900/[0.07] p-4">
        <AppButton variant="outline" size="sm" icon="i-lucide-chevron-down" @click="visibleCount += 10">
          Load more products
        </AppButton>
      </div>
    </AdminPanel>

    <AdminModal
      v-model:open="editOpen"
      title="Edit catalogue record"
      description="These edits persist in this browser only. The public catalogue is generated from static demo data and will not change."
      size="md"
    >
      <div v-if="selected" class="space-y-4">
        <div class="rounded-xl border border-forest-900/10 bg-white p-3">
          <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{{ selected.brand }} · {{ selected.sku }}</p>
          <p class="mt-1 text-[13px] font-semibold text-ink">{{ selected.name }}</p>
          <p class="mt-0.5 text-[10.5px] text-muted">{{ selected.keySpec }} · {{ categoryLabel(selected.category) }}</p>
        </div>

        <AppInput
          v-model="priceDraft"
          label="Indicative price (₦)"
          type="number"
          inputmode="numeric"
          min="0"
          prefix="₦"
          :error="priceError"
          hint="Leave blank to show “Price on request”. Demo figures only — no quote or order is created."
        />

        <div>
          <label for="edit-availability" class="mb-1.5 block text-[13px] font-semibold text-ink">Availability</label>
          <select id="edit-availability" v-model="availabilityDraft" class="field-base text-[13px]">
            <option v-for="entry in availabilityOptions" :key="entry.value" :value="entry.value">{{ entry.label }}</option>
          </select>
          <p class="mt-1.5 text-xs leading-5 text-muted">Local status used by this dashboard only.</p>
        </div>

        <AppCheckbox v-model="featuredDraft" label="Mark as featured in the local admin preview" />

        <div class="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-950">
          This is not connected to a database. A refresh keeps the edit; clearing browser storage removes it.
        </div>
      </div>

      <template #footer>
        <button
          v-if="selected && hasOverride(selected)"
          type="button"
          class="mr-auto text-[11px] font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900"
          @click="resetOverride"
        >
          Reset this record
        </button>
        <AppButton variant="ghost" size="sm" @click="editOpen = false">Cancel</AppButton>
        <AppButton size="sm" icon="i-lucide-check" @click="saveEdit">Save local edit</AppButton>
      </template>
    </AdminModal>
  </div>
</template>
