<script setup lang="ts">
import { placeholderStats } from '~/data/site'
</script>

<template>
  <section aria-label="Company facts" class="border-b border-forest-900/[0.08] bg-cream">
    <div class="page-container py-8 sm:py-10">
      <div class="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="(stat, index) in placeholderStats"
          :key="stat.label"
          class="lg:border-l lg:border-forest-900/10 lg:pl-6"
          :class="index === 0 ? 'lg:border-l-0 lg:pl-0' : ''"
        >
          <p class="font-display text-2xl font-bold tracking-tight text-forest-900 sm:text-[1.7rem]">
            {{ stat.value }}<span v-if="stat.note === 'illustrative'" class="text-solar-500">*</span>
          </p>
          <p class="mt-1 max-w-[15rem] text-[11.5px] leading-4 text-muted">{{ stat.label }}</p>
          <p v-if="stat.note !== 'illustrative'" class="mt-1 text-[10px] text-muted/70">{{ stat.note }}</p>
        </div>
      </div>
      <p class="mt-6 flex items-start gap-1.5 text-[10px] leading-4 text-muted/70">
        <UIcon name="i-lucide-info" class="mt-px size-3 shrink-0" aria-hidden="true" />
        <span>
          *Company figures are illustrative placeholders pending verification. Warranty duration depends
          on the specific equipment supplied. Service coverage must be confirmed for your location.
        </span>
      </p>
    </div>
  </section>
</template>
