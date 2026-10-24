<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'dark' | 'light'
    compact?: boolean
    showWordmark?: boolean
    to?: string
  }>(),
  {
    variant: 'dark',
    compact: false,
    showWordmark: true,
    to: '/',
  },
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="group inline-flex items-center gap-2.5 rounded-lg"
    aria-label="SunGrid Energy — home"
  >
    <span
      class="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[11px] transition-transform duration-300 group-hover:-rotate-3"
      :class="variant === 'dark' ? 'bg-forest-900' : 'bg-cream'"
    >
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" class="size-10">
        <rect width="40" height="40" rx="11" :fill="variant === 'dark' ? '#0d3b2c' : '#faf7f0'" />
        <path
          d="M8 16h15M8 22h15M8 28h15M13 12v20M20.5 12v10"
          :stroke="variant === 'dark' ? '#faf7f0' : '#0d3b2c'"
          stroke-width="1.6"
          stroke-linecap="round"
          opacity="0.85"
        />
        <circle cx="28.5" cy="12.5" r="4.5" fill="#fbc51f" />
        <path
          d="M28.5 4.8v1.6M28.5 18.6v1.6M20.8 12.5h1.6M34.6 12.5h1.6M23 7l1.1 1.1M32.9 16.9 34 18M34 7l-1.1 1.1M24.1 16.9 23 18"
          stroke="#fbc51f"
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    </span>
    <span v-if="showWordmark" class="flex flex-col leading-none">
      <span
        class="font-display text-[19px] font-extrabold tracking-[-0.03em]"
        :class="variant === 'dark' ? 'text-forest-950' : 'text-cream'"
      >
        SunGrid
      </span>
      <span
        class="mt-1 text-[9px] font-semibold uppercase tracking-[0.32em]"
        :class="variant === 'dark' ? 'text-forest-700/70' : 'text-cream/60'"
      >
        Energy
      </span>
    </span>
  </NuxtLink>
</template>
