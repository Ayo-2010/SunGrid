<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    padded?: boolean
  }>(),
  { padded: true },
)
</script>

<template>
  <section class="rounded-2xl border border-forest-900/10 bg-white shadow-soft">
    <header v-if="title || $slots.actions" class="flex flex-wrap items-start justify-between gap-3 border-b border-forest-900/[0.07] px-4 py-3.5 sm:px-5">
      <div>
        <h2 class="font-display text-[15px] font-bold text-ink">{{ title }}</h2>
        <p v-if="description" class="mt-0.5 text-[11px] leading-4 text-muted">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div :class="padded ? 'p-4 sm:p-5' : ''">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="border-t border-forest-900/[0.07] px-4 py-3 sm:px-5">
      <slot name="footer" />
    </footer>
  </section>
</template>
