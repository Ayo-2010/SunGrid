<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    detail?: string
    tone?: 'amber' | 'forest' | 'neutral'
    compact?: boolean
  }>(),
  {
    label: 'Demo data',
    detail: 'This prototype is not connected to a backend.',
    tone: 'amber',
    compact: false,
  },
)
</script>

<template>
  <div
    class="flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs leading-5"
    :class="{
      'border-amber-300/60 bg-amber-50 text-amber-950': tone === 'amber',
      'border-forest-800/40 bg-forest-950/40 text-cream/80': tone === 'forest',
      'border-stone-200 bg-stone-50 text-stone-700': tone === 'neutral',
    }"
  >
    <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <p>
      <strong class="font-semibold">{{ label }}</strong>
      <template v-if="detail">
        <span v-if="!compact"> — </span>
        <span v-else class="sr-only">: </span>
        {{ detail }}
      </template>
    </p>
  </div>
</template>
