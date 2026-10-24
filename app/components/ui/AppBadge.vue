<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'forest' | 'solar' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
    size?: 'sm' | 'md'
    dot?: boolean
  }>(),
  {
    tone: 'neutral',
    size: 'sm',
    dot: false,
  },
)

const toneClasses: Record<string, string> = {
  forest: 'bg-forest-900 text-cream',
  solar: 'bg-solar-300 text-forest-950',
  neutral: 'bg-stone-100 text-stone-700 ring-1 ring-stone-200',
  success: 'bg-green-50 text-green-800 ring-1 ring-green-200',
  warning: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-1 ring-red-200',
  info: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
  outline: 'border border-current/25 bg-transparent',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide"
    :class="[
      toneClasses[tone],
      size === 'sm' ? 'px-2.5 py-1 text-[10.5px] uppercase' : 'px-3 py-1.5 text-xs',
    ]"
  >
    <span v-if="dot" class="size-1.5 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>
