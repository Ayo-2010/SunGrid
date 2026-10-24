<script setup lang="ts">
import { demoCatalogueNotice, getProductBySlug, getRelatedProducts, productCategories } from '~/data/products'

const route = useRoute()
const productRecord = getProductBySlug(String(route.params.slug))

if (!productRecord) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

const product = productRecord

const category = productCategories.find((entry) => entry.slug === product.category)
const related = getRelatedProducts(product)
const quoteList = useQuoteList()
const compare = useCompare()
const toast = useToast()

const activeView = ref<'front' | 'detail' | 'context'>('front')
const views = [
  { id: 'front' as const, label: 'Full view', scale: 'scale-100' },
  { id: 'detail' as const, label: 'Detail', scale: 'scale-[1.45]' },
  { id: 'context' as const, label: 'Context', scale: 'scale-[0.82]' },
]

const inList = computed(() => quoteList.has(product.id))
const comparing = computed(() => compare.has(product.id))
const activeScale = computed(() =>
  activeView.value === 'detail' ? 'scale(1.45)' : activeView.value === 'context' ? 'scale(0.82)' : 'scale(1)',
)

function addToQuote() {
  const isNew = quoteList.add(product)
  toast.add({
    title: isNew ? 'Added to enquiry list' : 'Already in your list',
    description: isNew
      ? `${product.name} is ready to include in a quote request.`
      : 'Use the enquiry drawer to adjust the quantity.',
    color: 'success',
    icon: 'i-lucide-circle-check',
  })
  if (isNew) quoteList.open()
}

function toggleCompare() {
  const result = compare.toggle(product)
  if (result === 'full') {
    toast.add({ title: 'Comparison is full', description: `Remove a product to compare another (max ${compare.max}).`, color: 'warning', icon: 'i-lucide-triangle-alert' })
    return
  }
  toast.add({
    title: result === 'added' ? 'Added to comparison' : 'Removed from comparison',
    description: product.name,
    color: 'neutral',
    icon: 'i-lucide-git-compare',
  })
}

const enquiryLink = computed(() => `/contact?product=${encodeURIComponent(product.name)}`)

usePageMeta({
  title: `${product.name} — ${product.brand}`,
  description: `${product.shortDescription} ${product.keySpec}. Request pricing, compatibility guidance and a quote from SunGrid Energy.`,
  image: '/images/panels-closeup.jpg',
  type: 'product',
})
</script>

<template>
  <div>
    <section class="border-b border-forest-900/[0.08] bg-cream">
      <div class="page-container py-5">
        <Breadcrumbs
          :items="[
            { label: 'Products', to: '/products' },
            { label: category?.name ?? 'Category', to: `/products?category=${product.category}` },
            { label: product.name },
          ]"
        />
      </div>
    </section>

    <section class="bg-cream pb-12 pt-6 sm:pb-16">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <div class="overflow-hidden rounded-2xl border border-forest-900/10 bg-white">
              <div class="relative aspect-[4/3] overflow-hidden">
                <ProductVisual
                  :category="product.category"
                  :name="product.name"
                  size="detail"
                  class="h-full w-full transition-transform duration-500 ease-out"
                  :style="{ transform: activeScale }"
                />
                <div class="absolute right-3 top-3 flex gap-1.5">
                  <AppBadge tone="solar">Illustration</AppBadge>
                </div>
              </div>
              <div class="flex items-center gap-2 border-t border-forest-900/[0.07] p-3">
                <button
                  v-for="view in views"
                  :key="view.id"
                  type="button"
                  class="group relative w-20 overflow-hidden rounded-lg border-2 transition-all"
                  :class="activeView === view.id ? 'border-forest-800' : 'border-transparent opacity-70 hover:opacity-100'"
                  :aria-pressed="activeView === view.id"
                  :aria-label="`${view.label} view`"
                  @click="activeView = view.id"
                >
                  <div class="aspect-square overflow-hidden">
                    <ProductVisual :category="product.category" size="mini" class="transition-transform duration-500" :style="{ transform: view.scale === 'scale-[1.45]' ? 'scale(1.3)' : view.scale === 'scale-[0.82]' ? 'scale(0.85)' : 'scale(1)' }" />
                  </div>
                  <span class="block bg-white py-1 text-[8.5px] font-medium text-muted">{{ view.label }}</span>
                </button>
                <p class="ml-2 flex-1 text-[10px] leading-4 text-muted/80">
                  Product visuals are illustrations, not photographs. Confirm finish and dimensions with
                  the supplier.
                </p>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-xl border border-forest-900/10 bg-white p-3.5">
                <UIcon name="i-lucide-shield-check" class="size-4 text-forest-700" aria-hidden="true" />
                <p class="mt-1.5 text-[11px] font-semibold text-ink">Warranty</p>
                <p class="mt-0.5 text-[10.5px] leading-4 text-muted">{{ product.warranty }}</p>
              </div>
              <div class="rounded-xl border border-forest-900/10 bg-white p-3.5">
                <UIcon name="i-lucide-truck" class="size-4 text-forest-700" aria-hidden="true" />
                <p class="mt-1.5 text-[11px] font-semibold text-ink">Delivery</p>
                <p class="mt-0.5 text-[10.5px] leading-4 text-muted">Calculated at quote stage. Pickup options may be available.</p>
              </div>
              <div class="rounded-xl border border-forest-900/10 bg-white p-3.5">
                <UIcon name="i-lucide-package-open" class="size-4 text-forest-700" aria-hidden="true" />
                <p class="mt-1.5 text-[11px] font-semibold text-ink">In the box</p>
                <p class="mt-0.5 text-[10.5px] leading-4 text-muted">Accessories vary. Confirm contents before ordering.</p>
              </div>
            </div>
          </div>

          <div class="lg:sticky lg:top-24 lg:self-start">
            <div class="flex flex-wrap items-center gap-2">
              <AppBadge tone="forest">{{ category?.name }}</AppBadge>
              <AppBadge :tone="availabilityTone(product.availability)" dot>{{ availabilityLabel(product.availability) }}</AppBadge>
              <AppBadge tone="neutral">{{ product.brand }}</AppBadge>
            </div>

            <h1 class="display-title mt-4 text-3xl text-ink sm:text-4xl">{{ product.name }}</h1>
            <p class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-muted">
              <span>Model <strong class="font-semibold text-ink-soft">{{ product.model }}</strong></span>
              <span class="size-0.5 rounded-full bg-muted/60" aria-hidden="true" />
              <span>SKU <strong class="font-semibold text-ink-soft">{{ product.sku }}</strong></span>
            </p>

            <p class="mt-4 text-[13px] leading-6 text-muted">{{ product.shortDescription }}</p>

            <div class="mt-6 rounded-2xl border border-forest-900/10 bg-white p-5">
              <div class="flex items-end justify-between gap-3">
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Demo price</p>
                  <p class="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
                    {{ product.price === null ? 'Request price' : formatNaira(product.price) }}
                  </p>
                  <p v-if="product.price !== null" class="mt-1 text-[10.5px] text-muted">Indicative, excluding installation and VAT</p>
                  <p v-else class="mt-1 max-w-xs text-[10.5px] leading-4 text-muted">Pricing depends on configuration, compatibility and delivery.</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Key rating</p>
                  <p class="mt-1 text-[13px] font-semibold text-forest-800">{{ product.keySpec }}</p>
                </div>
              </div>

              <div class="mt-4 grid gap-2">
                <AppButton block :icon="inList ? 'i-lucide-check' : 'i-lucide-plus'" @click="addToQuote">
                  {{ inList ? 'In your enquiry list' : 'Add to quote request' }}
                </AppButton>
                <div class="grid grid-cols-2 gap-2">
                  <AppButton :to="enquiryLink" variant="outline" size="sm" icon="i-lucide-message-circle">Enquire</AppButton>
                  <AppButton variant="outline" size="sm" :icon="comparing ? 'i-lucide-check' : 'i-lucide-git-compare'" @click="toggleCompare">
                    {{ comparing ? 'Comparing' : 'Compare' }}
                  </AppButton>
                </div>
              </div>

              <div class="mt-4 rounded-lg bg-cream px-3 py-2.5">
                <p class="flex items-start gap-1.5 text-[10px] leading-4 text-muted">
                  <UIcon name="i-lucide-flask-conical" class="mt-px size-3 shrink-0" aria-hidden="true" />
                  {{ demoCatalogueNotice }} Adding to the list is an enquiry, not an order.
                </p>
              </div>
            </div>

            <div class="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-alert-triangle" class="size-4 text-amber-700" aria-hidden="true" />
                <p class="text-[11.5px] font-semibold text-ink">Compatibility notes</p>
              </div>
              <ul class="mt-2.5 space-y-2">
                <li v-for="note in product.compatibility" :key="note" class="flex items-start gap-2 text-[10.5px] leading-4 text-amber-950/75">
                  <span class="mt-1.5 size-1 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                  {{ note }}
                </li>
              </ul>
            </div>

            <div class="mt-4 space-y-2 text-[11px]">
              <a
                v-if="product.datasheetAvailable"
                :href="`/datasheets/${product.slug}.pdf`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-forest-800 hover:text-forest-600"
              >
                <UIcon name="i-lucide-file-down" class="size-3.5" aria-hidden="true" />
                Download datasheet
              </a>
              <NuxtLink v-else :to="enquiryLink" class="flex items-center gap-2 text-muted hover:text-forest-800">
                <UIcon name="i-lucide-file-clock" class="size-3.5" aria-hidden="true" />
                Datasheet pending verification — request a copy
              </NuxtLink>
              <NuxtLink to="/installation" class="flex items-center gap-2 text-muted hover:text-forest-800">
                <UIcon name="i-lucide-wrench" class="size-3.5" aria-hidden="true" />
                Installation and commissioning information
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-forest-900/[0.08] bg-white">
      <div class="page-container py-12 sm:py-14">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <h2 class="font-display text-2xl font-bold text-ink">Product overview</h2>
            <div class="mt-4 space-y-3">
              <p v-for="paragraph in product.description" :key="paragraph" class="text-[13px] leading-6 text-ink-soft/90">
                {{ paragraph }}
              </p>
            </div>

            <h3 class="mt-8 font-display text-lg font-bold text-ink">Features</h3>
            <ul class="mt-3 grid gap-2 sm:grid-cols-2">
              <li v-for="feature in product.features" :key="feature" class="flex items-start gap-2 rounded-lg bg-cream/70 px-3 py-2.5 text-[12px] leading-5 text-ink-soft">
                <UIcon name="i-lucide-check" class="mt-0.5 size-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                {{ feature }}
              </li>
            </ul>

            <div v-if="product.accessories?.length" class="mt-8">
              <h3 class="font-display text-lg font-bold text-ink">Available accessories</h3>
              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="accessory in product.accessories" :key="accessory" class="rounded-full border border-forest-900/10 bg-white px-3 py-1.5 text-[11px] text-muted">
                  {{ accessory }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 class="font-display text-2xl font-bold text-ink">Technical specifications</h2>
            <dl class="mt-4 overflow-hidden rounded-xl border border-forest-900/10">
              <div
                v-for="(item, index) in product.specs"
                :key="item.label"
                class="grid grid-cols-[1.1fr_1fr] gap-4 px-4 py-3 text-[12px]"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-cream/50'"
              >
                <dt class="text-muted">{{ item.label }}</dt>
                <dd class="font-medium text-ink">{{ item.value }}</dd>
              </div>
            </dl>
            <p class="mt-3 text-[10px] leading-4 text-muted/75">
              Specifications are demonstration values. Always confirm against the current manufacturer
              datasheet for the exact revision supplied.
            </p>

            <div class="mt-6 rounded-xl border border-forest-900/10 bg-cream/60 p-4">
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-700">Best suited to</p>
              <p class="mt-1.5 text-[12px] leading-5 text-ink-soft">{{ product.bestFor }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="bg-white pb-14">
      <div class="page-container">
        <div class="flex items-end justify-between gap-4 border-t border-forest-900/[0.08] pt-10">
          <div>
            <p class="eyebrow">Keep exploring</p>
            <h2 class="mt-2 font-display text-2xl font-bold text-ink">Related products</h2>
          </div>
          <NuxtLink to="/products" class="text-[12px] font-semibold text-forest-800 hover:text-forest-600">View catalogue</NuxtLink>
        </div>
        <div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ProductCard v-for="item in related" :key="item.id" :product="item" compact />
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
