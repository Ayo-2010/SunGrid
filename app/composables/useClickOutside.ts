import type { Ref } from 'vue'

/**
 * Calls `handler` when a pointer event lands outside the target element.
 * Used by the admin topbar menus so they behave like real dropdowns.
 */
export function useClickOutside(target: Ref<HTMLElement | null>, handler: () => void) {
  function onPointerDown(event: PointerEvent) {
    const element = target.value
    if (!element) return
    if (!element.contains(event.target as Node)) handler()
  }

  onMounted(() => document.addEventListener('pointerdown', onPointerDown))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
}
