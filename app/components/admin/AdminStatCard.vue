<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string
    icon?: string
    change?: string
    trend?: 'up' | 'down' | 'flat'
    hint?: string
  }>(),
  { icon: 'i-lucide-activity', trend: 'flat' },
)
</script>

<template>
  <div class="rounded-2xl border border-forest-900/10 bg-white p-4 shadow-soft">
    <div class="flex items-start justify-between gap-3">
      <p class="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">{{ label }}</p>
      <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
        <UIcon :name="icon" class="size-4" aria-hidden="true" />
      </span>
    </div>
    <p class="mt-2 font-display text-[1.6rem] font-bold leading-none text-ink">{{ value }}</p>
    <div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
      <span
        v-if="change"
        class="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
        :class="{
          'bg-green-50 text-green-800': trend === 'up',
          'bg-red-50 text-red-700': trend === 'down',
          'bg-stone-100 text-stone-600': trend === 'flat',
        }"
      >
        <UIcon
          :name="trend === 'up' ? 'i-lucide-trending-up' : trend === 'down' ? 'i-lucide-trending-down' : 'i-lucide-minus'"
          class="size-3"
          aria-hidden="true"
        />
        {{ change }}
      </span>
      <p v-if="hint" class="text-[10px] leading-4 text-muted">{{ hint }}</p>
    </div>
  </div>
</template>
