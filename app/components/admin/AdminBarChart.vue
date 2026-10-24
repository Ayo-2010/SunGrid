<script setup lang="ts">
interface ChartSeries {
  label: string
  values: number[]
  color?: string
}

const props = withDefaults(
  defineProps<{
    labels: string[]
    series: ChartSeries[]
    format?: 'number' | 'currency'
    height?: number
    title?: string
  }>(),
  { format: 'number', height: 190, title: 'Chart' },
)

const palette = ['#0d3b2c', '#f0ac08', '#57a981', '#8a4a0e']

const maxValue = computed(() => {
  const values = props.series.flatMap((entry) => entry.values)
  return Math.max(1, ...values)
})

function barHeight(value: number): string {
  const percentage = Math.max(0, (value / maxValue.value) * 100)
  return `${Math.max(value > 0 ? 3 : 0, percentage)}%`
}

function display(value: number): string {
  if (props.format === 'currency') return formatNaira(value, { compact: true })
  return formatNumber(value)
}

const summary = computed(
  () =>
    `${props.title}. ${props.series
      .map((entry) => `${entry.label}: ${entry.values.map((value, index) => `${props.labels[index] ?? ''} ${display(value)}`).join(', ')}`)
      .join('. ')}`,
)
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span v-for="(entry, index) in series" :key="entry.label" class="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted">
        <span class="size-2 rounded-sm" :style="{ background: entry.color ?? palette[index % palette.length] }" aria-hidden="true" />
        {{ entry.label }}
      </span>
    </div>

    <div class="mt-4 flex items-end gap-2 sm:gap-3" :style="{ height: `${height}px` }" role="img" :aria-label="summary">
      <div v-for="(label, index) in labels" :key="label" class="flex h-full min-w-0 flex-1 flex-col justify-end">
        <div class="flex h-full items-end justify-center gap-[3px]">
          <div
            v-for="(entry, seriesIndex) in series"
            :key="entry.label"
            class="group relative min-w-[4px] flex-1 rounded-t-[3px] transition-opacity hover:opacity-80"
            :style="{
              height: barHeight(entry.values[index] ?? 0),
              background: entry.color ?? palette[seriesIndex % palette.length],
            }"
            :title="`${label} · ${entry.label}: ${display(entry.values[index] ?? 0)}`"
          />
        </div>
      </div>
    </div>

    <div class="mt-2 flex gap-2 sm:gap-3">
      <div v-for="label in labels" :key="label" class="min-w-0 flex-1 text-center text-[9.5px] font-medium text-muted">
        {{ label }}
      </div>
    </div>

    <table class="sr-only">
      <caption>{{ title }}</caption>
      <thead>
        <tr>
          <th scope="col">Period</th>
          <th v-for="entry in series" :key="entry.label" scope="col">{{ entry.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(label, index) in labels" :key="label">
          <th scope="row">{{ label }}</th>
          <td v-for="entry in series" :key="entry.label">{{ display(entry.values[index] ?? 0) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
