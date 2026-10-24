<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
  }>(),
  { icon: 'i-lucide-inbox' },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest-900/15 bg-white/60 px-6 py-14 text-center">
    <div class="grid size-12 place-items-center rounded-full bg-forest-50 text-forest-700">
      <UIcon :name="icon" class="size-5" aria-hidden="true" />
    </div>
    <h3 class="mt-4 font-display text-lg font-bold text-ink">{{ title }}</h3>
    <p v-if="description" class="mt-2 max-w-md text-sm leading-6 text-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
