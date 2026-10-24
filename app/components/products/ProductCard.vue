<script setup lang="ts">
import type { Product } from '#shared/types'
import { productCategories } from '~/data/products'

const props = withDefaults(
  defineProps<{
    product: Product
    compact?: boolean
  }>(),
  { compact: false },
)

const quoteList = useQuoteList()
const compare = useCompare()
const toast = useToast()

const categoryLabel = computed(
  () => productCategories.find((category) => category.slug === props.product.category)?.shortName ?? '',
)
const added = computed(() => quoteList.has(props.product.id))
const comparing = computed(() => compare.has(props.product.id))

function addToQuote() {
  const isNew = quoteList.add(props.product)
  toast.add({
    title: isNew ? 'Added to your enquiry list' : 'Quantity updated',
    description: isNew
      ? `${props.product.brand} ${props.product.name} is ready to include in a quote request.`
      : `${props.product.name} quantity increased in your enquiry list.`,
    color: 'success',
    icon: 'i-lucide-circle-check',
  })
}

function toggleCompare() {
  const result = compare.toggle(props.product)
  if (result === 'full') {
    toast.add({
      title: 'Comparison is full',
      description: `You can compare up to ${compare.max} products. Remove one to add another.`,
      color: 'warning',
      icon: 'i-lucide-triangle-alert',
    })
    return
  }
  toast.add({
    title: result === 'added' ? 'Added to comparison' : 'Removed from comparison',
    description: props.product.name,
    color: 'neutral',
    icon: result === 'added' ? 'i-lucide-git-compare' : 'i-lucide-undo-2',
  })
}
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-forest-900/10 bg-white shadow-[0_1px_2px_rgba(6,37,28,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-900/20 hover:shadow-soft"
  >
    <NuxtLink :to="`/products/${product.slug}`" class="relative block overflow-hidden" tabindex="-1" aria-hidden="true">
      <ProductVisual
        :category="product.category"
        :name="product.name"
        class="transition-transform duration-500 group-hover:scale-[1.025]"
      />
    </NuxtLink>

    <div class="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
      <AppBadge tone="forest">{{ categoryLabel }}</AppBadge>
      <AppBadge v-if="product.price === null" tone="solar">Quote only</AppBadge>
    </div>

    <button
      type="button"
      class="absolute right-3.5 top-3.5 grid size-8 place-items-center rounded-full border transition-colors"
      :class="comparing ? 'border-forest-900 bg-forest-900 text-solar-300' : 'border-forest-900/10 bg-white/90 text-forest-900 hover:bg-white'"
      :aria-label="comparing ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`"
      :aria-pressed="comparing"
      @click="toggleCompare"
    >
      <UIcon name="i-lucide-git-compare" class="size-3.5" aria-hidden="true" />
    </button>

    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
        <span>{{ product.brand }}</span>
        <span class="size-0.5 rounded-full bg-muted/60" aria-hidden="true" />
        <span class="font-mono text-[10px] normal-case tracking-normal text-muted/80">{{ product.model }}</span>
      </p>

      <h3 class="mt-2 font-display text-[17px] font-bold leading-snug text-ink">
        <NuxtLink :to="`/products/${product.slug}`" class="rounded transition-colors hover:text-forest-700">
          {{ product.name }}
        </NuxtLink>
      </h3>

      <p class="mt-2 line-clamp-2 text-[12.5px] leading-5 text-muted">
        {{ product.shortDescription }}
      </p>

      <div v-if="!compact" class="mt-3 flex items-center gap-2 text-[12px] font-medium text-forest-800">
        <UIcon name="i-lucide-activity" class="size-3.5 shrink-0 text-forest-500" aria-hidden="true" />
        {{ product.keySpec }}
      </div>

      <div class="mt-4 flex items-end justify-between gap-3 border-t border-forest-900/[0.07] pt-3.5">
        <div>
          <p class="font-display text-lg font-bold tracking-tight text-ink">
            {{ product.price === null ? 'Request price' : formatNaira(product.price) }}
          </p>
          <p class="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted">
            <span
              class="size-1.5 rounded-full"
              :class="{
                'bg-green-600': product.availability === 'in-stock',
                'bg-amber-500': product.availability === 'limited' || product.availability === 'pre-order',
                'bg-forest-500': product.availability === 'quote-only',
              }"
            />
            {{ availabilityLabel(product.availability) }}
            <span class="text-muted/50">·</span>
            <span class="text-muted/80">{{ product.price === null ? 'indicative' : 'demo price' }}</span>
          </p>
        </div>
        <button
          type="button"
          class="grid size-9 place-items-center rounded-full border transition-all"
          :class="added ? 'border-forest-900 bg-forest-900 text-solar-300' : 'border-forest-900/15 text-forest-900 hover:border-forest-900 hover:bg-forest-900 hover:text-cream'"
          :aria-label="added ? `${product.name} is in your enquiry list` : `Add ${product.name} to enquiry list`"
          @click="addToQuote"
        >
          <UIcon :name="added ? 'i-lucide-check' : 'i-lucide-plus'" class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>
</template>
