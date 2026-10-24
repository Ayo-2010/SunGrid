<script setup lang="ts">
import { processSteps } from '~/data/site'
</script>

<template>
  <section class="relative overflow-hidden bg-forest-950 text-cream">
    <div class="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
    <div class="page-container relative section-pad">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="How it works"
          title="From “what do I need?” to a system you understand."
          description="A clear process, with each assumption written down before money changes hands."
          on-dark
        />
        <AppButton to="/installation" variant="on-dark" class="shrink-0" icon-right="i-lucide-arrow-right">
          Installation process
        </AppButton>
      </div>

      <ol class="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, index) in processSteps"
          :key="step.step"
          class="relative bg-forest-950 p-6 transition-colors hover:bg-forest-900/60 sm:p-7"
        >
          <div class="flex items-start justify-between">
            <span class="font-display text-[2.6rem] font-extrabold leading-none text-white/10">{{ step.step }}</span>
            <span class="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-solar-300">
              <UIcon :name="step.icon" class="size-4" aria-hidden="true" />
            </span>
          </div>
          <h3 class="mt-8 font-display text-[16px] font-bold text-cream">{{ step.title }}</h3>
          <p class="mt-2 text-[12.5px] leading-6 text-cream/55">{{ step.body }}</p>
          <span
            v-if="index < processSteps.length - 1"
            class="absolute right-0 top-1/2 hidden size-px bg-white/10 lg:block"
            aria-hidden="true"
          />
        </li>
      </ol>

      <div class="mt-8 flex flex-col gap-4 rounded-xl border border-solar-400/15 bg-solar-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[11.5px] leading-5 text-cream/60">
          Final system sizing depends on your load profile, backup requirements, site conditions and
          equipment specifications. Nothing here is an engineering design until a site assessment is done.
        </p>
        <NuxtLink to="/calculator" class="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-solar-300 hover:text-solar-200">
          <UIcon name="i-lucide-calculator" class="size-4" aria-hidden="true" />
          Try the calculator
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
