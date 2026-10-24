<script setup lang="ts">
import { solutions } from '~/data/solutions'

usePageMeta({
  title: 'Solar solutions for homes, businesses and industry',
  description:
    'Residential, commercial, industrial, off-grid, grid-tied and specialist solar solutions. Compare architectures, benefits and limitations before requesting a site assessment.',
  image: '/images/install-roof.jpg',
})

const architectures = [
  {
    type: 'Grid-tied',
    backup: 'No battery backup',
    bestFor: 'Stable grid, daytime loads',
    note: 'Lowest cost per kWp, but no power during an outage.',
    icon: 'i-lucide-transmission-line',
  },
  {
    type: 'Hybrid',
    backup: 'Selected circuit backup',
    bestFor: 'Homes and businesses with outages',
    note: 'Solar, grid and battery combined. Backup output is limited by design.',
    icon: 'i-lucide-zap',
  },
  {
    type: 'Off-grid',
    backup: 'Full site autonomy',
    bestFor: 'Sites without a usable grid',
    note: 'Requires array and storage sized for overnight and cloudy periods.',
    icon: 'i-lucide-sun',
  },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Solar solutions"
      title="The right architecture comes before the equipment list."
      description="Solar is not one product. A reliable design depends on whether you need backup, how your grid behaves, when you use power and what you can maintain."
      :breadcrumbs="[{ label: 'Solar Solutions' }]"
    >
      <template #actions>
        <AppButton to="/calculator" icon="i-lucide-calculator">Estimate your load</AppButton>
        <AppButton to="/quote" variant="on-dark" icon-right="i-lucide-arrow-right">Request a quote</AppButton>
      </template>
    </PageHero>

    <section class="border-b border-forest-900/[0.08] bg-cream">
      <div class="page-container py-10">
        <div class="grid gap-4 md:grid-cols-3">
          <div v-for="item in architectures" :key="item.type" class="rounded-xl border border-forest-900/10 bg-white p-5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">{{ item.type }}</span>
              <UIcon :name="item.icon" class="size-4 text-forest-600" aria-hidden="true" />
            </div>
            <p class="mt-3 text-[13px] font-semibold text-ink">{{ item.backup }}</p>
            <p class="mt-1 text-[11.5px] text-muted">Best for: {{ item.bestFor }}</p>
            <p class="mt-2.5 border-t border-forest-900/[0.07] pt-2.5 text-[11px] leading-4 text-muted">{{ item.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <SectionHeading
          eyebrow="Explore by need"
          title="Eight ways we approach solar."
          description="Each solution page explains who it suits, what it can do, and where its limits are. We do not pretend one design fits every customer."
        />

        <div class="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="solution in solutions"
            :key="solution.slug"
            :to="`/solutions/${solution.slug}`"
            class="group flex flex-col overflow-hidden rounded-2xl border border-forest-900/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="solution.image"
                :alt="solution.imageAlt"
                width="1200"
                height="750"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span class="absolute left-3 top-3 grid size-8 place-items-center rounded-lg bg-forest-950/80 text-solar-300 backdrop-blur-sm">
                <UIcon :name="solution.icon" class="size-4" aria-hidden="true" />
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <h2 class="font-display text-[17px] font-bold text-ink group-hover:text-forest-800">{{ solution.title }}</h2>
              <p class="mt-1.5 flex-1 text-[12.5px] leading-5 text-muted">{{ solution.tagline }}</p>
              <span class="mt-4 inline-flex items-center gap-1.5 border-t border-forest-900/[0.07] pt-3 text-[11.5px] font-semibold text-forest-800">
                Explore solution
                <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-8 rounded-2xl border border-forest-900/10 bg-white p-6 sm:p-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="max-w-2xl">
              <p class="eyebrow">Not sure where to start?</p>
              <h2 class="mt-3 font-display text-xl font-bold text-ink">Three questions decide most of the architecture.</h2>
              <p class="mt-2 text-[13px] leading-6 text-muted">
                Do you need power during an outage? How stable is the grid? And which loads must run at
                the same time? Answer those and the shortlist becomes much shorter.
              </p>
            </div>
            <div class="flex shrink-0 flex-wrap gap-2.5">
              <AppButton to="/calculator" variant="secondary">Use the calculator</AppButton>
              <AppButton to="/contact" variant="outline">Ask a question</AppButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
