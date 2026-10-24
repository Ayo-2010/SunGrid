<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light' | 'on-dark'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariant
    size?: ButtonSize
    icon?: string
    iconRight?: string
    loading?: boolean
    disabled?: boolean
    block?: boolean
    external?: boolean
    ariaLabel?: string
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
    external: false,
  },
)

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-solar-400 text-forest-950 hover:bg-solar-300 hover:shadow-[0_8px_24px_-10px_rgba(240,172,8,0.65)] active:translate-y-px',
  secondary: 'bg-forest-900 text-cream hover:bg-forest-800 active:translate-y-px',
  outline:
    'border border-forest-900/20 bg-transparent text-forest-950 hover:border-forest-900/40 hover:bg-forest-900/[0.04]',
  ghost: 'text-forest-900 hover:bg-forest-900/[0.06]',
  light: 'bg-cream text-forest-950 hover:bg-white',
  'on-dark': 'border border-white/25 bg-white/5 text-cream hover:bg-white/10',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55',
  props.block ? 'w-full' : '',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
  >
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" aria-hidden="true" />
    <span><slot /></span>
    <UIcon v-if="iconRight" :name="iconRight" class="size-4 shrink-0" aria-hidden="true" />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    :aria-label="ariaLabel"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" aria-hidden="true" />
    <span><slot /></span>
    <UIcon v-if="iconRight" :name="iconRight" class="size-4 shrink-0" aria-hidden="true" />
  </a>

  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading || undefined"
  >
    <UIcon
      v-if="loading"
      name="i-lucide-loader-circle"
      class="size-4 shrink-0 animate-spin"
      aria-hidden="true"
    />
    <UIcon v-else-if="icon" :name="icon" class="size-4 shrink-0" aria-hidden="true" />
    <span><slot /></span>
    <UIcon v-if="iconRight && !loading" :name="iconRight" class="size-4 shrink-0" aria-hidden="true" />
  </button>
</template>
