<script setup lang="ts">
import type { CalculatorAppliance } from '#shared/types'

const props = defineProps<{
  appliance: CalculatorAppliance
  index: number
}>()

const emit = defineEmits<{
  update: [id: string, patch: Partial<CalculatorAppliance>]
  remove: [id: string]
}>()

const dailyKwh = computed(
  () => (props.appliance.watts * props.appliance.quantity * props.appliance.hours) / 1000,
)

function numberValue(event: Event): number {
  return Number((event.target as HTMLInputElement).value)
}

function patch(patchValue: Partial<CalculatorAppliance>) {
  emit('update', props.appliance.id, patchValue)
}

function clamp(event: Event, min: number, max: number, field: 'watts' | 'quantity' | 'hours') {
  const raw = numberValue(event)
  const value = Number.isFinite(raw) ? Math.min(max, Math.max(min, raw)) : min
  patch({ [field]: value })
}

const waveLabel: Record<string, string> = {
  resistive: 'Resistive',
  inductive: 'Motor / compressor',
  electronic: 'Electronic',
}
</script>

<template>
  <div class="rounded-xl border border-forest-900/10 bg-white p-3.5 transition-colors hover:border-forest-900/20">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <label :for="`name-${appliance.id}`" class="sr-only">Appliance {{ index + 1 }} name</label>
        <input
          :id="`name-${appliance.id}`"
          :value="appliance.name"
          type="text"
          maxlength="60"
          class="w-full rounded-lg border border-transparent bg-transparent px-1 py-1 font-display text-[13.5px] font-semibold text-ink hover:border-forest-900/15 focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/15"
          @input="patch({ name: ($event.target as HTMLInputElement).value })"
        />
        <div class="mt-1 flex flex-wrap items-center gap-1.5 pl-1">
          <span class="inline-flex items-center gap-1 rounded-full bg-forest-900/[0.05] px-1.5 py-0.5 text-[9.5px] font-medium text-forest-800">
            <UIcon name="i-lucide-activity" class="size-2.5" aria-hidden="true" />
            {{ waveLabel[appliance.wave] ?? appliance.wave }}
          </span>
          <span class="text-[10px] text-muted">{{ dailyKwh.toFixed(2) }} kWh/day</span>
        </div>
      </div>

      <button
        type="button"
        class="grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-700"
        :aria-label="`Remove ${appliance.name}`"
        @click="emit('remove', appliance.id)"
      >
        <UIcon name="i-lucide-trash-2" class="size-3.5" aria-hidden="true" />
      </button>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <div>
        <label :for="`watts-${appliance.id}`" class="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">Watts each</label>
        <div class="relative">
          <input
            :id="`watts-${appliance.id}`"
            :value="appliance.watts"
            type="number"
            inputmode="numeric"
            min="1"
            max="30000"
            step="5"
            class="field-base !py-1.5 !pr-7 text-[12px]"
            @change="clamp($event, 1, 30000, 'watts')"
          />
          <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9.5px] text-muted">W</span>
        </div>
      </div>
      <div>
        <label :for="`qty-${appliance.id}`" class="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">Quantity</label>
        <input
          :id="`qty-${appliance.id}`"
          :value="appliance.quantity"
          type="number"
          inputmode="numeric"
          min="1"
          max="200"
          step="1"
          class="field-base !py-1.5 text-[12px]"
          @change="clamp($event, 1, 200, 'quantity')"
        />
      </div>
      <div>
        <label :for="`hours-${appliance.id}`" class="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">Hours/day</label>
        <div class="relative">
          <input
            :id="`hours-${appliance.id}`"
            :value="appliance.hours"
            type="number"
            inputmode="decimal"
            min="0.1"
            max="24"
            step="0.5"
            class="field-base !py-1.5 !pr-6 text-[12px]"
            @change="clamp($event, 0.1, 24, 'hours')"
          />
          <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9.5px] text-muted">h</span>
        </div>
      </div>
      <div class="col-span-2 flex items-end sm:col-span-1">
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-forest-900/10 px-2.5 py-2 text-[10.5px] font-medium text-ink-soft transition-colors hover:bg-forest-50">
          <input
            type="checkbox"
            :checked="appliance.essential"
            class="size-3.5 rounded border-forest-900/30 accent-forest-800"
            @change="patch({ essential: ($event.target as HTMLInputElement).checked })"
          />
          Essential
        </label>
      </div>
    </div>
  </div>
</template>
