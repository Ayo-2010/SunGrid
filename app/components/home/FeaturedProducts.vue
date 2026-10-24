<script setup lang="ts">
import { demoCatalogueNotice, featuredProducts } from '~/data/products'
</script>

<template>
  <section class="section-pad border-y border-forest-900/[0.07] bg-[#f4f0e6]">
    <div class="page-container">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Featured equipment"
          title="Real-world equipment, clearly presented."
          description="A curated selection from our demonstration catalogue. Prices and stock are indicative until verified with the distributor."
        />
        <AppButton to="/products" variant="outline" class="shrink-0" icon-right="i-lucide-arrow-right">
          View full catalogue
        </AppButton>
      </div>

      <div class="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>

      <p class="mt-5 flex items-start gap-2 text-[10.5px] leading-5 text-muted/80">
        <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {{ demoCatalogueNotice }} Brand names are referenced to demonstrate catalogue structure and do
        not imply an authorised dealership.
      </p>
    </div>
  </section>
</template>
