import type { Product } from '#shared/types'
import { products } from '~/data/products'

const STORAGE_KEY = 'sungrid-compare-v1'
const MAX_COMPARE = 4

export function useCompare() {
  const ids = useState<string[]>('sungrid-compare-ids', () => [])
  const hydrated = useState<boolean>('sungrid-compare-hydrated', () => false)

  onMounted(() => {
    if (hydrated.value) return
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') as unknown
      if (Array.isArray(stored)) {
        ids.value = stored
          .filter((id): id is string => typeof id === 'string')
          .filter((id) => products.some((product) => product.id === id))
          .slice(0, MAX_COMPARE)
      }
    } catch {
      ids.value = []
    }
    hydrated.value = true
  })

  if (import.meta.client) {
    watch(
      ids,
      (value) => {
        if (!hydrated.value) return
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* Ignore unavailable storage. */
        }
      },
      { deep: true },
    )
  }

  const selected = computed(() =>
    ids.value
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product)),
  )
  const count = computed(() => ids.value.length)
  const isFull = computed(() => ids.value.length >= MAX_COMPARE)

  function has(productId: string): boolean {
    return ids.value.includes(productId)
  }

  function toggle(product: Product): 'added' | 'removed' | 'full' {
    if (has(product.id)) {
      ids.value = ids.value.filter((id) => id !== product.id)
      return 'removed'
    }
    if (ids.value.length >= MAX_COMPARE) return 'full'
    ids.value.push(product.id)
    return 'added'
  }

  function remove(productId: string) {
    ids.value = ids.value.filter((id) => id !== productId)
  }

  function clear() {
    ids.value = []
  }

  return { ids, selected, count, isFull, has, toggle, remove, clear, max: MAX_COMPARE }
}
