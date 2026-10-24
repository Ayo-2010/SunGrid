<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    eyebrow?: string
    description?: string
    badge?: string
  }>(),
  { badge: '' },
)
</script>

<template>
  <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2">
        <p v-if="eyebrow" class="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-700">{{ eyebrow }}</p>
        <AppBadge v-if="badge" tone="warning">{{ badge }}</AppBadge>
      </div>
      <h1 class="mt-1.5 font-display text-[1.65rem] font-bold leading-tight text-ink sm:text-3xl">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-2xl text-[12.5px] leading-6 text-muted">{{ description }}</p>
      <div v-if="$slots.meta" class="mt-3">
        <slot name="meta" />
      </div>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
