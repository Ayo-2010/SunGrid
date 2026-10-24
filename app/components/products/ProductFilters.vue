<script setup lang="ts">
import type { CategorySlug, Product } from '#shared/types'
import type { CatalogueFilters } from '~/types/catalogue'
import { defaultCatalogueFilters } from '~/types/catalogue'

const props = defineProps<{
  products: Product[]
  categories: { slug: CategorySlug; name: string }[]
}>()

const model = defineModel<CatalogueFilters>({ required: true })

const activeCount = computed(() => {
  let count = 0
  if (model.value.category !== 'all') count += 1
  if (model.value.brands.length) count += 1
  if (model.value.capacityMin || model.value.capacityMax) count += 1
  if (model.value.price !== 'all') count += 1
  return count
})

function categoryCount(slug: CategorySlug | 'all'): number {
  if (slug === 'all') return props.products.length
  return props.products.filter((product) => product.category === slug).length
}

function toggleBrand(brand: string) {
  const brands = model.value.brands
  model.value.brands = brands.includes(brand)
    ? brands.filter((entry) => entry !== brand)
    : [...brands, brand]
}

function reset() {
  model.value = { ...defaultCatalogueFilters, search: model.value.search }
}

const brandList = computed(() => {
  const counts = new Map<string, number>()
  for (const product of props.products) {
    counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }))
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h2 class="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">Filters</h2>
        <span v-if="activeCount" class="rounded-full bg-forest-900 px-1.5 py-0.5 text-[9px] font-bold text-solar-300">{{ activeCount }}</span>
      </div>
      <button
        v-if="activeCount"
        type="button"
        class="rounded text-[10.5px] font-medium text-muted underline underline-offset-2 hover:text-forest-900"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <fieldset>
      <legend class="mb-2 text-[11px] font-semibold text-ink">Category</legend>
      <div class="space-y-0.5">
        <label class="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11.5px] transition-colors hover:bg-forest-900/[0.04]">
          <span class="flex items-center gap-2">
            <input v-model="model.category" type="radio" value="all" name="catalogue-category" class="size-3.5 accent-forest-800" />
            <span :class="model.category === 'all' ? 'font-semibold text-forest-900' : 'text-ink-soft'">All categories</span>
          </span>
          <span class="text-[10px] text-muted">{{ categoryCount('all') }}</span>
        </label>
        <label
          v-for="category in categories"
          :key="category.slug"
          class="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11.5px] transition-colors hover:bg-forest-900/[0.04]"
        >
          <span class="flex items-center gap-2">
            <input v-model="model.category" type="radio" :value="category.slug" name="catalogue-category" class="size-3.5 accent-forest-800" />
            <span :class="model.category === category.slug ? 'font-semibold text-forest-900' : 'text-ink-soft'">{{ category.name }}</span>
          </span>
          <span class="text-[10px] text-muted">{{ categoryCount(category.slug) }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="border-t border-forest-900/10 pt-5">
      <legend class="mb-2 text-[11px] font-semibold text-ink">Brand</legend>
      <div class="max-h-48 space-y-0.5 overflow-y-auto pr-1">
        <label
          v-for="brand in brandList"
          :key="brand.name"
          class="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11.5px] transition-colors hover:bg-forest-900/[0.04]"
        >
          <span class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="model.brands.includes(brand.name)"
              class="size-3.5 rounded accent-forest-800"
              @change="toggleBrand(brand.name)"
            />
            <span :class="model.brands.includes(brand.name) ? 'font-semibold text-forest-900' : 'text-ink-soft'">{{ brand.name }}</span>
          </span>
          <span class="text-[10px] text-muted">{{ brand.count }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="border-t border-forest-900/10 pt-5">
      <legend class="mb-2 text-[11px] font-semibold text-ink">Capacity</legend>
      <div class="flex items-center gap-2">
        <input
          v-model="model.capacityMin"
          type="number"
          min="0"
          step="0.1"
          placeholder="Min"
          aria-label="Minimum capacity"
          class="field-base !py-1.5 !text-[11.5px]"
        />
        <span class="text-xs text-muted">to</span>
        <input
          v-model="model.capacityMax"
          type="number"
          min="0"
          step="0.1"
          placeholder="Max"
          aria-label="Maximum capacity"
          class="field-base !py-1.5 !text-[11.5px]"
        />
      </div>
      <p class="mt-1.5 text-[10px] leading-4 text-muted">
        Rated value in the product’s own unit (kW, kWh or A). Leave blank for any.
      </p>
    </fieldset>

    <fieldset class="border-t border-forest-900/10 pt-5">
      <legend class="mb-2 text-[11px] font-semibold text-ink">Price</legend>
      <select v-model="model.price" aria-label="Filter by price" class="field-base !py-2 !text-[11.5px]">
        <option value="all">Any price</option>
        <option value="under-500k">Under ₦500,000</option>
        <option value="500k-2m">₦500,000 – ₦2,000,000</option>
        <option value="2m-5m">₦2,000,000 – ₦5,000,000</option>
        <option value="above-5m">Above ₦5,000,000</option>
        <option value="quote-only">Quote only</option>
      </select>
    </fieldset>

    <div class="rounded-xl border border-amber-200/70 bg-amber-50/60 p-3">
      <p class="flex items-start gap-1.5 text-[10px] leading-4 text-amber-950/70">
        <UIcon name="i-lucide-flask-conical" class="mt-px size-3 shrink-0" aria-hidden="true" />
        Catalogue data is demonstrative. Confirm price, stock and compatibility before ordering.
      </p>
    </div>
  </div>
</template>
