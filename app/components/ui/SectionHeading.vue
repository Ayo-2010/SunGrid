<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    align?: 'left' | 'center'
    onDark?: boolean
    as?: 'h1' | 'h2' | 'h3'
  }>(),
  {
    align: 'left',
    onDark: false,
    as: 'h2',
  },
)
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'">
    <p v-if="eyebrow" class="eyebrow" :class="onDark && 'eyebrow-on-dark'">
      {{ eyebrow }}
    </p>
    <component
      :is="as"
      class="display-title mt-4"
      :class="[
        onDark ? 'text-cream' : 'text-ink',
        as === 'h1' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-[2.75rem]',
      ]"
    >
      {{ title }}
    </component>
    <p
      v-if="description"
      class="mt-5 text-[15px] leading-7 sm:text-base"
      :class="onDark ? 'text-cream/70' : 'text-muted'"
    >
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-7 flex flex-wrap items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
