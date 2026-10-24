<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section class="bg-cream pb-14 pt-4 sm:pb-20">
    <div class="page-container">
      <div class="relative overflow-hidden rounded-[1.75rem] bg-forest-900 px-6 py-12 text-cream sm:px-10 lg:px-14 lg:py-16">
        <div class="pointer-events-none absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
        <div class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-solar-400/15" aria-hidden="true" />
        <div class="pointer-events-none absolute -right-8 top-0 size-44 rounded-full border border-solar-400/10" aria-hidden="true" />
        <div class="pointer-events-none absolute -bottom-10 right-24 size-28 rounded-full bg-solar-400/10 blur-2xl" aria-hidden="true" />

        <div class="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="eyebrow eyebrow-on-dark">Start with a conversation</p>
            <h2 class="display-title mt-4 text-3xl text-cream sm:text-4xl lg:text-5xl">
              Ready to take control of your power?
            </h2>
            <p class="mt-4 max-w-xl text-[14px] leading-7 text-cream/65">
              Tell us what needs to keep running and we will help you decide whether solar, storage,
              generator integration — or a smaller first step — makes sense.
            </p>
            <div class="mt-7 flex flex-wrap items-center gap-3">
              <AppButton to="/quote" size="lg" icon-right="i-lucide-arrow-up-right">Request a Quote</AppButton>
              <AppButton
                :href="`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Hello SunGrid Energy, I would like to discuss a solar system.')}`"
                external
                variant="on-dark"
                size="lg"
                icon="i-lucide-message-circle"
              >
                Chat on WhatsApp
              </AppButton>
            </div>
          </div>

          <div class="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-4 lg:max-w-[240px]">
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-cream/45">Talk to a person</p>
            <a :href="site.phoneHref" class="mt-2 block font-display text-lg font-bold text-cream transition-colors hover:text-solar-300">
              {{ site.phoneDisplay }}
            </a>
            <p class="mt-2 text-[10.5px] leading-4 text-cream/45">
              Mon–Fri, 8:30–17:30. Demo number — replace with your verified business line.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
