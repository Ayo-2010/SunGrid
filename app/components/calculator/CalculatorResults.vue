<script setup lang="ts">
import type { CalculatorInputs, SizingResult } from '#shared/types'

const props = defineProps<{
  inputs: CalculatorInputs
  result: SizingResult
}>()

const emit = defineEmits<{
  send: []
  copy: []
}>()

const essentialShare = computed(() => {
  if (!props.result.dailyWh) return 0
  return Math.round((props.result.essentialWh / props.result.dailyWh) * 100)
})
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-forest-900/10 bg-forest-950 text-cream shadow-panel">
    <div class="border-b border-white/10 px-5 py-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-solar-300">Preliminary estimate</p>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-cream/60">
          <span class="size-1.5 rounded-full bg-solar-400" aria-hidden="true" />
          Live
        </span>
      </div>
      <p class="mt-2 font-display text-xl font-bold text-cream">
        {{ result.inverterKw }} kW inverter
      </p>
      <p class="mt-1 text-[11px] leading-5 text-cream/50">
        Sized from {{ inputs.appliances.length }} declared load{{ inputs.appliances.length === 1 ? '' : 's' }}.
        Not an engineering design.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-px bg-white/10">
      <div class="bg-forest-950 px-5 py-4">
        <p class="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cream/45">Daily energy</p>
        <p class="mt-1 font-display text-2xl font-extrabold text-cream">
          {{ (result.dailyWh / 1000).toFixed(1) }}<span class="ml-0.5 text-sm font-semibold text-cream/50">kWh</span>
        </p>
        <p class="mt-1 text-[10px] text-cream/45">{{ essentialShare }}% essential</p>
      </div>
      <div class="bg-forest-950 px-5 py-4">
        <p class="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cream/45">Battery (nominal)</p>
        <p class="mt-1 font-display text-2xl font-extrabold text-cream">
          {{ result.batteryNominalKwh }}<span class="ml-0.5 text-sm font-semibold text-cream/50">kWh</span>
        </p>
        <p class="mt-1 text-[10px] text-cream/45">~{{ result.batteryUsableKwh }} kWh usable</p>
      </div>
      <div class="bg-forest-950 px-5 py-4">
        <p class="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cream/45">Solar array</p>
        <p class="mt-1 font-display text-2xl font-extrabold text-cream">
          {{ result.solarKwp }}<span class="ml-0.5 text-sm font-semibold text-cream/50">kWp</span>
        </p>
        <p class="mt-1 text-[10px] text-cream/45">~{{ result.panelCount }} × 580 Wp panels</p>
      </div>
      <div class="bg-forest-950 px-5 py-4">
        <p class="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cream/45">Connected load</p>
        <p class="mt-1 font-display text-2xl font-extrabold text-cream">
          {{ (result.peakWatts / 1000).toFixed(1) }}<span class="ml-0.5 text-sm font-semibold text-cream/50">kW</span>
        </p>
        <p class="mt-1 text-[10px] text-cream/45">Surge ≈ {{ (result.largestSurgeWatts / 1000).toFixed(1) }} kW</p>
      </div>
    </div>

    <div class="border-b border-white/10 px-5 py-4">
      <div class="flex items-center justify-between text-[10px] text-cream/50">
        <span>Essential load</span>
        <span>{{ (result.essentialWh / 1000).toFixed(1) }} kWh/day</span>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div class="h-full rounded-full bg-solar-400 transition-all duration-500" :style="{ width: `${essentialShare}%` }" />
      </div>
      <p class="mt-2 text-[10px] leading-4 text-cream/40">
        {{ inputs.backupHours }} h backup window · {{ inputs.state }} · grid {{ inputs.gridAvailability }}
      </p>
    </div>

    <div v-if="result.warnings.length" class="space-y-2 border-b border-white/10 px-5 py-4">
      <div v-for="warning in result.warnings" :key="warning" class="flex items-start gap-2 text-[10.5px] leading-4 text-amber-200/85">
        <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>{{ warning }}</span>
      </div>
    </div>

    <div v-if="result.recommendations.length" class="space-y-2 border-b border-white/10 px-5 py-4">
      <div v-for="recommendation in result.recommendations.slice(0, 3)" :key="recommendation" class="flex items-start gap-2 text-[10.5px] leading-4 text-cream/60">
        <UIcon name="i-lucide-lightbulb" class="mt-0.5 size-3.5 shrink-0 text-solar-300/80" aria-hidden="true" />
        <span>{{ recommendation }}</span>
      </div>
    </div>

    <div class="space-y-2 px-5 py-4">
      <AppButton block :disabled="!inputs.appliances.length" icon-right="i-lucide-arrow-right" @click="emit('send')">
        Send to quote request
      </AppButton>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 py-2 text-[11px] font-semibold text-cream/70 transition-colors hover:bg-white/5 hover:text-cream disabled:opacity-40"
        :disabled="!inputs.appliances.length"
        @click="emit('copy')"
      >
        <UIcon name="i-lucide-copy" class="size-3.5" aria-hidden="true" />
        Copy estimate summary
      </button>
      <p class="text-center text-[9.5px] leading-4 text-cream/35">
        Preliminary only. Final sizing requires a site assessment and verified equipment data.
      </p>
    </div>
  </div>
</template>
