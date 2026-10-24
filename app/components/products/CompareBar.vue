<script setup lang="ts">
const { count, selected, max, clear } = useCompare()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-6 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-6 opacity-0"
  >
    <div
      v-if="count > 0"
      class="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-3xl rounded-2xl border border-forest-800/50 bg-forest-950 p-3 text-cream shadow-lift sm:inset-x-6 sm:bottom-5 sm:p-4"
      role="region"
      aria-label="Product comparison tray"
    >
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span class="grid size-9 shrink-0 place-items-center rounded-full bg-solar-400/15 text-solar-300">
            <UIcon name="i-lucide-git-compare" class="size-4" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <p class="text-[13px] font-semibold">
              {{ count }} product{{ count === 1 ? '' : 's' }} selected
              <span class="text-cream/50">of {{ max }}</span>
            </p>
            <p class="truncate text-[11px] text-cream/55">
              {{ selected.map((product) => product.name).join(' · ') }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full px-3 py-2 text-[12px] font-medium text-cream/65 transition-colors hover:text-cream"
            @click="clear()"
          >
            Clear
          </button>
          <AppButton to="/compare" size="sm" icon-right="i-lucide-arrow-right">Compare</AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
