import type { Product } from '#shared/types'
import { products } from '~/data/products'

interface QuoteListItem {
  productId: string
  quantity: number
}

const STORAGE_KEY = 'sungrid-enquiry-list-v1'

export function useQuoteList() {
  const items = useState<QuoteListItem[]>('sungrid-quote-items', () => [])
  const hydrated = useState<boolean>('sungrid-quote-hydrated', () => false)
  const drawerOpen = useState<boolean>('sungrid-quote-drawer', () => false)

  onMounted(() => {
    if (hydrated.value) return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          items.value = parsed
            .filter(
              (entry): entry is QuoteListItem =>
                typeof entry === 'object' &&
                entry !== null &&
                typeof (entry as QuoteListItem).productId === 'string' &&
                typeof (entry as QuoteListItem).quantity === 'number',
            )
            .slice(0, 30)
        }
      }
    } catch {
      items.value = []
    }
    hydrated.value = true
  })

  if (import.meta.client) {
    watch(
      items,
      (value) => {
        if (!hydrated.value) return
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* Session storage can be unavailable in private browsing. */
        }
      },
      { deep: true },
    )
  }

  const detailed = computed(() =>
    items.value
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId)
        return product ? { ...item, product } : null
      })
      .filter((entry): entry is QuoteListItem & { product: Product } => entry !== null),
  )

  const count = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const productCount = computed(() => items.value.length)

  function has(productId: string): boolean {
    return items.value.some((item) => item.productId === productId)
  }

  function add(product: Product, quantity = 1): boolean {
    const existing = items.value.find((item) => item.productId === product.id)
    if (existing) {
      existing.quantity = Math.min(20, existing.quantity + quantity)
      return false
    }
    items.value.push({ productId: product.id, quantity: Math.min(20, Math.max(1, quantity)) })
    return true
  }

  function remove(productId: string) {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  function setQuantity(productId: string, quantity: number) {
    const item = items.value.find((entry) => entry.productId === productId)
    if (!item) return
    item.quantity = Math.min(20, Math.max(1, Number.isFinite(quantity) ? Math.round(quantity) : 1))
  }

  function clear() {
    items.value = []
  }

  function open() {
    drawerOpen.value = true
  }

  function close() {
    drawerOpen.value = false
  }

  return {
    items,
    detailed,
    count,
    productCount,
    drawerOpen,
    has,
    add,
    remove,
    setQuantity,
    clear,
    open,
    close,
  }
}
