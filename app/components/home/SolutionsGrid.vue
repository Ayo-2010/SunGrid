<script setup lang="ts">
const featured = [
  {
    title: 'Residential solar',
    body: 'Essential-load backup, whole-home designs and battery storage for houses and apartments.',
    image: '/images/install-roof.jpg',
    imageAlt: 'Technician fixing solar panels to a residential roof',
    to: '/solutions/residential',
    tag: 'Homes',
    span: 'lg:col-span-6',
    large: true,
  },
  {
    title: 'Commercial solar',
    body: 'Daytime solar, three-phase systems and backup for shops, clinics, offices and hospitality.',
    image: '/images/commercial-building.jpg',
    imageAlt: 'Modern commercial office space with glazed partitions',
    to: '/solutions/commercial',
    tag: 'Business',
    span: 'lg:col-span-6',
    large: true,
  },
  {
    title: 'Industrial solar',
    body: 'Larger loads, generator integration and site-specific engineering proposals.',
    icon: 'i-lucide-factory',
    to: '/solutions/industrial',
    tag: 'Industry',
    span: 'lg:col-span-3',
  },
  {
    title: 'Inverter systems',
    body: 'Hybrid, off-grid and grid-tied inverters matched to your load profile.',
    icon: 'i-lucide-zap',
    to: '/products?category=hybrid-inverters',
    tag: 'Equipment',
    span: 'lg:col-span-3',
  },
  {
    title: 'Battery storage',
    body: 'LiFePO₄ and lead-acid options compared on usable capacity and life.',
    icon: 'i-lucide-battery-charging',
    to: '/products?category=lithium-batteries',
    tag: 'Storage',
    span: 'lg:col-span-3',
  },
  {
    title: 'Solar water pumping',
    body: 'Borehole and irrigation systems designed around head, flow and daily demand.',
    icon: 'i-lucide-droplets',
    to: '/solutions/solar-water-pumping',
    tag: 'Agriculture',
    span: 'lg:col-span-3',
  },
]
</script>

<template>
  <section id="solutions" class="section-pad bg-cream">
    <div class="page-container">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Solar solutions"
          title="A system built around your load — not a box on a shelf."
          description="Different buildings, budgets and backup needs require different architectures. Explore the categories, then let a load assessment settle the details."
        />
        <AppButton to="/solutions" variant="outline" class="shrink-0" icon-right="i-lucide-arrow-right">
          All solutions
        </AppButton>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <template v-for="item in featured" :key="item.title">
          <NuxtLink
            v-if="item.large"
            :to="item.to"
            class="group relative min-h-[340px] overflow-hidden rounded-2xl bg-forest-950 sm:min-h-[380px]"
            :class="item.span"
          >
            <img
              :src="item.image ?? ''"
              :alt="item.imageAlt ?? ''"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 to-forest-950/5" aria-hidden="true" />
            <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <AppBadge tone="solar">{{ item.tag }}</AppBadge>
              <h3 class="mt-3 font-display text-2xl font-bold text-cream">{{ item.title }}</h3>
              <p class="mt-2 max-w-md text-[13px] leading-6 text-cream/65">{{ item.body }}</p>
              <span class="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-solar-300">
                Explore {{ item.title.toLowerCase() }}
                <UIcon name="i-lucide-arrow-up-right" class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            v-else
            :to="item.to"
            class="group relative flex flex-col rounded-2xl border border-forest-900/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-900/20 hover:shadow-soft sm:p-6"
            :class="item.span"
          >
            <div class="flex items-start justify-between gap-4">
              <span class="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800 transition-colors group-hover:bg-forest-900 group-hover:text-solar-300">
                <UIcon :name="item.icon ?? 'i-lucide-zap'" class="size-5" aria-hidden="true" />
              </span>
              <span class="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted/60">{{ item.tag }}</span>
            </div>
            <h3 class="mt-5 font-display text-lg font-bold text-ink">{{ item.title }}</h3>
            <p class="mt-2 flex-1 text-[12.5px] leading-5 text-muted">{{ item.body }}</p>
            <span class="mt-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-forest-800">
              Learn more
              <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>
