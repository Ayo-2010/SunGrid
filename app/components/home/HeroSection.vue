<template>
  <section class="relative overflow-hidden bg-forest-950 text-cream">
    <div class="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
    <div class="pointer-events-none absolute -left-40 top-10 size-[36rem] rounded-full border border-solar-400/[0.08]" aria-hidden="true" />
    <div class="pointer-events-none absolute -left-20 top-24 size-[24rem] rounded-full border border-solar-400/[0.06]" aria-hidden="true" />

    <div class="page-container relative grid items-center gap-12 pb-14 pt-14 sm:pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 lg:pb-20 lg:pt-20">
      <div class="animate-fade-up">
        <div class="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-cream/70">
          <span class="size-1.5 rounded-full bg-solar-400" aria-hidden="true" />
          Solar systems · storage · installation
        </div>

        <h1 class="display-title mt-6 text-[2.65rem] leading-[1.03] text-cream sm:text-6xl lg:text-[4.1rem]">
          Power your world with
          <span class="relative whitespace-nowrap text-solar-300">
            reliable solar
            <svg
              class="absolute -bottom-2 left-0 w-full text-solar-400/50"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M2 8.5C72 3 150 2 298 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
          </span>
          energy.
        </h1>

        <p class="mt-6 max-w-xl text-[15px] leading-7 text-cream/70 sm:text-base">
          Dependable solar systems designed for Nigerian homes and businesses. From panels and
          inverters to complete installations, we help you take control of your power supply —
          with sizing assumptions you can actually see.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <AppButton to="/quote" size="lg" icon-right="i-lucide-arrow-up-right">
            Get a Free Consultation
          </AppButton>
          <AppButton to="/solutions" variant="on-dark" size="lg" icon-right="i-lucide-arrow-down-right">
            Explore Solar Solutions
          </AppButton>
        </div>

        <div class="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
          <span class="flex items-center gap-2 text-[11.5px] text-cream/55">
            <UIcon name="i-lucide-ruler" class="size-3.5 text-solar-400" aria-hidden="true" />
            Load-first system design
          </span>
          <span class="flex items-center gap-2 text-[11.5px] text-cream/55">
            <UIcon name="i-lucide-shield-check" class="size-3.5 text-solar-400" aria-hidden="true" />
            Safety and protection included
          </span>
          <span class="flex items-center gap-2 text-[11.5px] text-cream/55">
            <UIcon name="i-lucide-message-square-text" class="size-3.5 text-solar-400" aria-hidden="true" />
            Honest, documented assumptions
          </span>
        </div>
      </div>

      <div class="relative animate-fade-in lg:justify-self-end" style="animation-delay: 120ms">
        <div class="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-panel">
          <img
            src="/images/solar-house.jpg"
            alt="Rooftop solar array installed on a modern building at sunset"
            width="1800"
            height="1200"
            fetchpriority="high"
            decoding="async"
            class="aspect-[4/3] w-full object-cover lg:aspect-[4/4.35]"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-forest-950/5 to-transparent" aria-hidden="true" />

          <div class="absolute left-4 top-4 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-forest-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cream/80 backdrop-blur-sm">
              <span class="size-1.5 rounded-full bg-solar-400" />
              Illustrative configuration
            </span>
          </div>

          <div class="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-forest-950/80 p-4 backdrop-blur-md sm:p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-solar-300/80">Example residential system</p>
                <p class="mt-1 text-[13px] font-medium text-cream/80">Essential-load hybrid with battery backup</p>
              </div>
              <UIcon name="i-lucide-sun" class="size-6 shrink-0 text-solar-400/70" aria-hidden="true" />
            </div>
            <div class="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
              <div>
                <p class="font-display text-lg font-bold text-cream">5.5<span class="ml-0.5 text-[10px] font-medium text-cream/50">kWp</span></p>
                <p class="text-[9.5px] uppercase tracking-wide text-cream/45">Solar array</p>
              </div>
              <div class="border-l border-white/10 pl-3">
                <p class="font-display text-lg font-bold text-cream">10.2<span class="ml-0.5 text-[10px] font-medium text-cream/50">kWh</span></p>
                <p class="text-[9.5px] uppercase tracking-wide text-cream/45">Storage</p>
              </div>
              <div class="border-l border-white/10 pl-3">
                <p class="font-display text-lg font-bold text-cream">12<span class="ml-0.5 text-[10px] font-medium text-cream/50">hrs</span></p>
                <p class="text-[9.5px] uppercase tracking-wide text-cream/45">Backup window</p>
              </div>
            </div>
            <p class="mt-2.5 text-[9.5px] leading-4 text-cream/40">
              Not a quotation. Final sizing depends on your load profile, site and equipment.
            </p>
          </div>
        </div>

        <div class="absolute -bottom-5 -left-4 hidden rounded-xl border border-forest-900/10 bg-cream p-3 shadow-lift sm:block">
          <div class="flex items-center gap-2.5">
            <span class="grid size-8 place-items-center rounded-full bg-forest-900 text-solar-300">
              <UIcon name="i-lucide-wrench" class="size-4" aria-hidden="true" />
            </span>
            <div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-forest-700">Installation & support</p>
              <p class="text-[11px] text-muted">Documented handover included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
