<script setup lang="ts">
const quoteList = useQuoteList()

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const pricedTotal = computed(() =>
  quoteList.detailed.value.reduce(
    (total, item) => total + (item.product.price ?? 0) * item.quantity,
    0,
  ),
)

const quoteOnlyCount = computed(
  () => quoteList.detailed.value.filter((item) => item.product.price === null).length,
)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    quoteList.close()
    return
  }
  if (event.key !== 'Tab' || !panel.value) return

  const focusables = panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (!focusables.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => quoteList.drawerOpen.value,
  async (open) => {
    if (import.meta.client) {
      if (open) {
        lastFocused = document.activeElement as HTMLElement | null
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeydown)
        await nextTick()
        closeButton.value?.focus()
      } else {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeydown)
        lastFocused?.focus?.()
      }
    }
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeydown)
  }
})

async function goToQuote() {
  quoteList.close()
  await navigateTo('/quote')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="quoteList.drawerOpen.value"
        class="fixed inset-0 z-[60] bg-forest-950/45 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="quoteList.close()"
      />
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
        v-if="quoteList.drawerOpen.value"
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
        class="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-cream shadow-lift"
      >
        <header class="flex items-start justify-between gap-4 border-b border-forest-900/10 bg-white px-5 py-5 sm:px-6">
          <div>
            <div class="flex items-center gap-2">
              <h2 id="quote-drawer-title" class="font-display text-lg font-bold text-ink">Your enquiry list</h2>
              <AppBadge tone="solar">{{ quoteList.productCount.value }}</AppBadge>
            </div>
            <p class="mt-1 text-xs leading-5 text-muted">
              Products added here form an enquiry — this is not an order or payment.
            </p>
          </div>
          <button
            ref="closeButton"
            type="button"
            class="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-forest-900/5 hover:text-ink"
            aria-label="Close enquiry list"
            @click="quoteList.close()"
          >
            <UIcon name="i-lucide-x" class="size-5" aria-hidden="true" />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div v-if="quoteList.detailed.value.length" class="space-y-3">
            <div
              v-for="item in quoteList.detailed.value"
              :key="item.productId"
              class="rounded-xl border border-forest-900/10 bg-white p-3"
            >
              <div class="flex gap-3">
                <div class="w-16 shrink-0 overflow-hidden rounded-lg">
                  <ProductVisual :category="item.product.category" size="mini" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[10px] font-semibold uppercase tracking-wide text-muted">{{ item.product.brand }}</p>
                  <NuxtLink
                    :to="`/products/${item.product.slug}`"
                    class="mt-0.5 block text-[13px] font-semibold leading-5 text-ink hover:text-forest-700"
                    @click="quoteList.close()"
                  >
                    {{ item.product.name }}
                  </NuxtLink>
                  <p class="mt-1 text-xs text-muted">
                    {{ item.product.price === null ? 'Price on request' : formatNaira(item.product.price) }}
                  </p>
                </div>
                <button
                  type="button"
                  class="grid size-7 shrink-0 place-items-center self-start rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-700"
                  :aria-label="`Remove ${item.product.name} from enquiry list`"
                  @click="quoteList.remove(item.productId)"
                >
                  <UIcon name="i-lucide-trash-2" class="size-3.5" aria-hidden="true" />
                </button>
              </div>

              <div class="mt-3 flex items-center justify-between border-t border-forest-900/[0.07] pt-2.5">
                <div class="flex items-center rounded-full border border-forest-900/15 bg-cream">
                  <button
                    type="button"
                    class="grid size-7 place-items-center rounded-full text-muted hover:text-ink"
                    :aria-label="`Decrease ${item.product.name} quantity`"
                    @click="quoteList.setQuantity(item.productId, item.quantity - 1)"
                  >
                    <UIcon name="i-lucide-minus" class="size-3.5" aria-hidden="true" />
                  </button>
                  <span class="w-7 text-center text-xs font-semibold">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="grid size-7 place-items-center rounded-full text-muted hover:text-ink"
                    :aria-label="`Increase ${item.product.name} quantity`"
                    @click="quoteList.setQuantity(item.productId, item.quantity + 1)"
                  >
                    <UIcon name="i-lucide-plus" class="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <p class="text-xs font-semibold text-ink">
                  {{ item.product.price === null ? '—' : formatNaira(item.product.price * item.quantity) }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between px-1 pt-2 text-xs">
              <button type="button" class="font-medium text-muted underline underline-offset-2 hover:text-red-700" @click="quoteList.clear()">
                Clear list
              </button>
              <NuxtLink to="/products" class="font-semibold text-forest-800 hover:text-forest-600" @click="quoteList.close()">
                Add more products
              </NuxtLink>
            </div>
          </div>

          <EmptyState
            v-else
            icon="i-lucide-shopping-basket"
            title="Your enquiry list is empty"
            description="Add products from the catalogue to request pricing and compatibility guidance. You can also start with a project quote."
          >
            <div class="flex flex-wrap justify-center gap-2">
              <AppButton to="/products" size="sm" @click="quoteList.close()">Browse products</AppButton>
              <AppButton to="/quote" variant="outline" size="sm" @click="quoteList.close()">Project quote</AppButton>
            </div>
          </EmptyState>
        </div>

        <footer v-if="quoteList.detailed.value.length" class="border-t border-forest-900/10 bg-white px-5 py-4 sm:px-6">
          <div class="flex items-baseline justify-between gap-4">
            <div>
              <p class="text-xs text-muted">Indicative products total</p>
              <p class="font-display text-xl font-bold text-ink">{{ formatNaira(pricedTotal) }}</p>
            </div>
            <p v-if="quoteOnlyCount" class="max-w-[10rem] text-right text-[10.5px] leading-4 text-amber-800">
              {{ quoteOnlyCount }} item{{ quoteOnlyCount === 1 ? '' : 's' }} priced on request
            </p>
          </div>
          <p class="mt-1.5 text-[10.5px] leading-4 text-muted">
            Demo prices exclude installation, transport, VAT and any site-specific work. Not a final offer.
          </p>
          <AppButton class="mt-4" block size="md" icon-right="i-lucide-arrow-right" @click="goToQuote">
            Request a quote
          </AppButton>
          <p class="mt-2 text-center text-[10px] text-muted">Demo mode — no order or payment is created.</p>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>
