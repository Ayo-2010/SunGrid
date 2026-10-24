<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { size: 'md' },
)

const open = defineModel<boolean>('open', { default: false })

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const titleId = `admin-modal-title-${useId()}`
const descriptionId = `admin-modal-description-${useId()}`
let lastFocused: HTMLElement | null = null

const widthClass = computed(
  () =>
    ({
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    })[props.size],
)

function close() {
  open.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key !== 'Tab' || !panel.value) return
  const focusables = panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  if (!focusables.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(open, async (isOpen) => {
  if (!import.meta.client) return
  if (isOpen) {
    lastFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
    await nextTick()
    closeButton.value?.focus()
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
    lastFocused?.focus?.()
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[70] bg-forest-950/50 backdrop-blur-[2px]" aria-hidden="true" @click="close" />
    </Transition>

    <Transition
      enter-active-class="transition duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="translate-y-3 opacity-0 sm:scale-[0.98]"
      enter-to-class="translate-y-0 opacity-100 sm:scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 sm:scale-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[71] overflow-y-auto p-3 sm:p-6"
        role="presentation"
        @click.self="close"
      >
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="description ? descriptionId : undefined"
          class="mx-auto my-auto flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-forest-900/10 bg-cream shadow-lift sm:max-h-[calc(100dvh-3rem)]"
          :class="widthClass"
        >
          <header class="flex items-start justify-between gap-4 border-b border-forest-900/10 bg-white px-4 py-4 sm:px-5">
            <div class="min-w-0">
              <h2 :id="titleId" class="font-display text-lg font-bold text-ink">{{ title }}</h2>
              <p v-if="description" :id="descriptionId" class="mt-1 text-[11.5px] leading-5 text-muted">{{ description }}</p>
            </div>
            <button
              ref="closeButton"
              type="button"
              class="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-forest-900/5 hover:text-ink"
              aria-label="Close dialog"
              @click="close"
            >
              <UIcon name="i-lucide-x" class="size-4.5" aria-hidden="true" />
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="flex flex-wrap items-center justify-end gap-2 border-t border-forest-900/10 bg-white px-4 py-3 sm:px-5">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
