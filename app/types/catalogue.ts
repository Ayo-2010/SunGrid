import type { CategorySlug } from '#shared/types'

export interface CatalogueFilters {
  search: string
  category: CategorySlug | 'all'
  brands: string[]
  capacityMin: string
  capacityMax: string
  price: 'all' | 'under-500k' | '500k-2m' | '2m-5m' | 'above-5m' | 'quote-only'
}

export const defaultCatalogueFilters: CatalogueFilters = {
  search: '',
  category: 'all',
  brands: [],
  capacityMin: '',
  capacityMax: '',
  price: 'all',
}

export type CatalogueSort = 'featured' | 'price-asc' | 'price-desc' | 'name'
