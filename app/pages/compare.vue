<script setup lang="ts">
import { products, productCategories, demoCatalogueNotice } from '~/data/products'

usePageMeta({
  title: 'Compare solar products',
  description:
    'Compare up to four solar panels, inverters or batteries side by side — pricing, key ratings, warranty and compatibility considerations. Demo catalogue data.',
})

const compare = useCompare()
const quoteList = useQuoteList()
const toast = useToast()

const selected = computed(() => compare.selected.value)

const suggested = computed(() =>
  products
    .filter((product) => !compare.has(product.id))
    .slice(0, 4),
)

const categoryName = (slug: string) => productCategories.find((entry) => entry.slug === slug)?.name ?? slug

const rows = computed(() => [
  { label: 'Category', values: selected.value.map((product) => categoryName(product.category)) },
  { label: 'Brand', values: selected.value.map((product) => product.brand) },
  { label: 'Model', values: selected.value.map((product) => product.model) },
  { label: 'Key rating', values: selected.value.map((product) => product.keySpec) },
  {
    label: 'Rated capacity',
    values: selected.value.map((product) =>
      product.capacity !== undefined ? `${product.capacity} ${product.capacityUnit ?? ''}`.trim() : '—',
    ),
  },
  {
    label: 'Indicative price',
    values: selected.value.map((product) => (product.price === null ? 'Request price' : formatNaira(product.price))),
  },
  {
    label: 'Availability',
    values: selected.value.map((product) => availabilityLabel(product.availability)),
  },
  { label: 'Best suited to', values: selected.value.map((product) => product.bestFor) },
  { label: 'Warranty', values: selected.value.map((product) => product.warranty) },
])

const specLabels = computed(() => {
  const counts = new Map<string, number>()
  for (const product of selected.value) {
    for (const spec of product.specs) {
      counts.set(spec.label, (counts.get(spec.label) ?? 0) + 1)
    }
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([label]) => label).slice(0, 12)
})

function specValue(productId: string, label: string): string {
  return products.find((product) => product.id === productId)?.specs.find((spec) => spec.label === label)?.value ?? '—'
}

function addAll() {
  let added = 0
  for (const product of selected.value) {
    if (quoteList.add(product)) added += 1
  }
  toast.add({
    title: added ? `Added ${added} product${added === 1 ? '' : 's'}` : 'Already in your enquiry list',
    description: 'Review quantities and request a combined quote.',
    color: 'success',
    icon: 'i-lucide-circle-check',
  })
  if (added) quoteList.open()
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="Compare"
      title="Compare equipment before you commit."
      description="Side-by-side ratings, prices and compatibility notes. Up to four products, stored only for this browsing session."
      :breadcrumbs="[{ label: 'Products', to: '/products' }, { label: 'Compare' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/products" variant="on-dark" icon="i-lucide-plus">Add more products</AppButton>
        <AppButton v-if="selected.length" variant="on-dark" icon="i-lucide-trash-2" @click="compare.clear()">Clear comparison</AppButton>
      </template>
    </PageHero>

    <section class="bg-cream py-10 sm:py-14">
      <div class="page-container">
        <div v-if="selected.length" class="overflow-hidden rounded-2xl border border-forest-900/10 bg-white">
          <div class="flex flex-col gap-3 border-b border-forest-900/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-[12px] text-muted">
              Comparing <span class="font-semibold text-ink">{{ selected.length }}</span> of {{ compare.max }} products
            </p>
            <div class="flex flex-wrap gap-2">
              <AppButton size="sm" variant="outline" to="/products">Add another</AppButton>
              <AppButton size="sm" icon="i-lucide-shopping-basket" @click="addAll">Add all to enquiry list</AppButton>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[720px] border-collapse text-left">
              <caption class="sr-only">Product comparison table</caption>
              <thead>
                <tr>
                  <th scope="col" class="w-40 border-b border-forest-900/[0.08] bg-cream/50 p-4 align-top">
                    <span class="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Comparison</span>
                  </th>
                  <th
                    v-for="product in selected"
                    :key="product.id"
                    scope="col"
                    class="min-w-[190px] border-b border-l border-forest-900/[0.08] p-4 align-top"
                  >
                    <div class="relative overflow-hidden rounded-lg">
                      <ProductVisual :category="product.category" size="mini" />
                    </div>
                    <p class="mt-3 text-[10px] font-semibold uppercase tracking-wide text-muted">{{ product.brand }}</p>
                    <NuxtLink :to="`/products/${product.slug}`" class="mt-1 block font-display text-[13px] font-bold leading-5 text-ink hover:text-forest-700">
                      {{ product.name }}
                    </NuxtLink>
                    <p class="mt-1.5 font-display text-sm font-bold text-forest-900">
                      {{ product.price === null ? 'Request price' : formatNaira(product.price) }}
                    </p>
                    <div class="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        class="rounded-full border border-forest-900/15 px-2.5 py-1 text-[10px] font-medium text-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                        :aria-label="`Remove ${product.name} from comparison`"
                        @click="compare.remove(product.id)"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in rows" :key="row.label" :class="index % 2 === 0 ? 'bg-white' : 'bg-cream/40'">
                  <th scope="row" class="border-b border-forest-900/[0.06] p-4 text-[11px] font-semibold text-muted">{{ row.label }}</th>
                  <td v-for="(value, valueIndex) in row.values" :key="valueIndex" class="border-b border-l border-forest-900/[0.06] p-4 text-[11.5px] leading-5 text-ink-soft">
                    {{ value }}
                  </td>
                </tr>
                <tr v-for="label in specLabels" :key="label" class="bg-cream/20">
                  <th scope="row" class="border-b border-forest-900/[0.06] p-4 text-[11px] font-semibold text-muted">{{ label }}</th>
                  <td v-for="product in selected" :key="product.id" class="border-b border-l border-forest-900/[0.06] p-4 text-[11.5px] leading-5 text-ink-soft">
                    {{ specValue(product.id, label) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-forest-900/[0.08] p-4">
            <p class="max-w-3xl text-[10px] leading-4 text-muted/80">
              {{ demoCatalogueNotice }} Compatibility must be checked against the full system design.
              Comparing equipment does not confirm that it can be safely paired.
            </p>
          </div>
        </div>

        <EmptyState
          v-else
          icon="i-lucide-git-compare"
          title="Nothing selected for comparison yet"
          description="Open a product and choose Compare, or add one of the suggestions below. Up to four products can be compared at a time."
        >
          <AppButton to="/products" icon="i-lucide-arrow-right">Browse the catalogue</AppButton>
        </EmptyState>

        <div v-if="suggested.length" class="mt-10">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="eyebrow">Suggestions</p>
              <h2 class="mt-2 font-display text-xl font-bold text-ink">Add a product to the comparison</h2>
            </div>
            <NuxtLink to="/products" class="text-[12px] font-semibold text-forest-800 hover:text-forest-600">All products</NuxtLink>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="product in suggested" :key="product.id" class="rounded-xl border border-forest-900/10 bg-white p-3">
              <div class="flex items-start gap-3">
                <div class="w-14 shrink-0 overflow-hidden rounded-lg">
                  <ProductVisual :category="product.category" size="mini" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[9px] font-semibold uppercase tracking-wide text-muted">{{ product.brand }}</p>
                  <p class="mt-0.5 line-clamp-2 text-[11.5px] font-semibold leading-4 text-ink">{{ product.name }}</p>
                  <button
                    type="button"
                    class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-forest-800 hover:text-forest-600"
                    :disabled="compare.isFull.value"
                    @click="compare.toggle(product)"
                  >
                    <UIcon name="i-lucide-plus" class="size-3" aria-hidden="true" />
                    {{ compare.isFull.value ? 'Compare full' : 'Compare' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 rounded-xl border border-forest-900/10 bg-white p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="max-w-2xl text-[11.5px] leading-5 text-muted">
              Not sure whether two items are compatible? Send us the models you are considering and we
              will check voltage, communication protocol and system limits.
            </p>
            <AppButton to="/contact" variant="outline" size="sm" icon="i-lucide-message-circle">Ask a compatibility question</AppButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
