<script setup lang="ts">
const rows = [
  { label: 'Essential daily energy', value: '2.4 kWh' },
  { label: 'Indicative inverter', value: '3.6 kW' },
  { label: 'Indicative storage', value: '5.12 kWh' },
  { label: 'Array (580 Wp panels)', value: '6 panels' },
]
</script>

<template>
  <section class="border-t border-forest-900/[0.07] bg-[#f4f0e6]">
    <div class="page-container py-14 sm:py-16">
      <div class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p class="eyebrow">Preliminary sizing</p>
          <h2 class="display-title mt-4 text-3xl text-ink sm:text-4xl">
            A useful estimate starts with <span class="text-forest-700">your actual appliances.</span>
          </h2>
          <p class="mt-4 max-w-lg text-[14px] leading-7 text-muted">
            Add appliances, set the hours you use them and choose how long backup should last. The
            calculator shows the formula, the losses and the limits of the result — no black box.
          </p>

          <ul class="mt-6 space-y-2.5">
            <li v-for="item in ['Edit quantities, wattage and daily hours', 'Separate essential from optional loads', 'See battery depth-of-discharge and efficiency allowances', 'Send the result with your quote request for review']" :key="item" class="flex items-start gap-2.5 text-[12.5px] text-ink-soft">
              <UIcon name="i-lucide-circle-check" class="mt-0.5 size-4 shrink-0 text-forest-600" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>

          <div class="mt-7 flex flex-wrap gap-2.5">
            <AppButton to="/calculator" icon-right="i-lucide-arrow-right">Open the calculator</AppButton>
            <AppButton to="/resources/sizing-a-solar-inverter" variant="outline">Read the sizing guide</AppButton>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-2xl border border-forest-900/10 bg-white shadow-soft">
            <div class="flex items-center justify-between border-b border-forest-900/[0.07] px-5 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Example output</p>
                <p class="mt-1 text-[13px] font-semibold text-ink">3-bedroom home · essentials</p>
              </div>
              <AppBadge tone="solar">Illustrative</AppBadge>
            </div>
            <div class="px-5 py-4">
              <div class="space-y-2.5">
                <div v-for="row in rows" :key="row.label" class="flex items-center justify-between gap-4 text-[12.5px]">
                  <span class="text-muted">{{ row.label }}</span>
                  <span class="font-semibold text-ink">{{ row.value }}</span>
                </div>
              </div>
              <div class="mt-4 rounded-lg bg-cream px-3.5 py-3">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-info" class="size-3.5 text-forest-600" aria-hidden="true" />
                  <p class="text-[10.5px] font-semibold text-forest-900">Estimate only</p>
                </div>
                <p class="mt-1 text-[10.5px] leading-4 text-muted">
                  Based on 4.5 sun hours, 90% usable battery capacity and 75% system efficiency. A site
                  assessment is required before a final design.
                </p>
              </div>
            </div>
          </div>

          <div class="absolute -right-3 -top-3 hidden rotate-3 rounded-lg bg-solar-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-forest-950 shadow-sm sm:block">
            Transparent assumptions
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
