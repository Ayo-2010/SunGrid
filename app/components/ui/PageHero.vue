<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    breadcrumbs?: { label: string; to?: string }[]
    align?: 'left' | 'center'
    size?: 'default' | 'compact'
  }>(),
  {
    align: 'left',
    size: 'default',
  },
)
</script>

<template>
  <section class="relative overflow-hidden bg-forest-950 text-cream">
    <div class="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-solar-400/10"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-10 top-10 size-48 rounded-full border border-solar-400/10"
      aria-hidden="true"
    />
    <div class="page-container relative" :class="size === 'compact' ? 'py-10 sm:py-12' : 'py-12 sm:py-16 lg:py-20'">
      <Breadcrumbs v-if="breadcrumbs?.length" :items="breadcrumbs" tone="dark" />
      <div
        class="mt-6"
        :class="align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'"
      >
        <p v-if="eyebrow" class="eyebrow eyebrow-on-dark">{{ eyebrow }}</p>
        <h1
          class="display-title mt-4 text-4xl text-cream sm:text-5xl"
          :class="size === 'default' && 'lg:text-[3.65rem]'"
        >
          {{ title }}
        </h1>
        <p v-if="description" class="mt-5 max-w-2xl text-[15px] leading-7 text-cream/70 sm:text-base" :class="align === 'center' && 'mx-auto'">
          {{ description }}
        </p>
        <div v-if="$slots.actions" class="mt-7 flex flex-wrap items-center gap-3" :class="align === 'center' && 'justify-center'">
          <slot name="actions" />
        </div>
      </div>
      <slot />
    </div>
  </section>
</template>
