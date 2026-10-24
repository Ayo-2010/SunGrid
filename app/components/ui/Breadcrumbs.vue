<script setup lang="ts">
withDefaults(
  defineProps<{
    items: { label: string; to?: string }[]
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" :class="tone === 'dark' ? 'text-cream/55' : 'text-muted'">
      <li>
        <NuxtLink
          to="/"
          class="rounded transition-colors hover:text-solar-500"
          :class="tone === 'dark' && 'hover:text-solar-300'"
        >
          Home
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="flex items-center gap-2">
        <UIcon name="i-lucide-chevron-right" class="size-3 opacity-60" aria-hidden="true" />
        <NuxtLink
          v-if="item.to && index !== items.length - 1"
          :to="item.to"
          class="rounded transition-colors hover:text-solar-600"
          :class="tone === 'dark' && 'hover:text-solar-300'"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else aria-current="page" :class="tone === 'dark' ? 'text-cream/85' : 'text-ink'">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
