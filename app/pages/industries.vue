<script setup lang="ts">
import { industries, site } from '~/data/site'
import { solutions } from '~/data/solutions'

usePageMeta({
  title: 'Solar by industry',
  description:
    'Solar and storage considerations for homes, retail, healthcare, education, agriculture, manufacturing, property development and remote sites in Nigeria.',
  image: '/images/commercial-building.jpg',
})

const detail: Record<string, { image: string; alt: string; priorities: string[]; watchouts: string[] }> = {
  homes: {
    image: '/images/modern-home.jpg',
    alt: 'Modern Nigerian home with a roof suitable for solar modules',
    priorities: ['Essential circuits that stay on during an outage', 'Safe integration with an existing generator', 'Roof and battery space that can be expanded later'],
    watchouts: ['Whole-house backup is often far more expensive than an essential-load design', 'Roof age and waterproofing matter as much as panel efficiency'],
  },
  retail: {
    image: '/images/shopkeeper.jpg',
    alt: 'Shop staff serving a customer at a retail counter',
    priorities: ['Refrigeration and point-of-sale continuity', 'Daytime cooling and lighting', 'Quiet operation around customers'],
    watchouts: ['Trading hours and access constrain the installation window', 'Refrigeration start-up surges must be measured, not guessed'],
  },
  healthcare: {
    image: '/images/technician.jpg',
    alt: 'Technician working on electrical equipment',
    priorities: ['Cold chain and critical diagnostics', 'Lighting for treatment and circulation areas', 'Clear separation of essential and non-essential circuits'],
    watchouts: ['Some medical equipment needs power quality review or dedicated UPS support', 'Infection-control and patient-access rules shape the work schedule'],
  },
  education: {
    image: '/images/solar-roof-2.jpg',
    alt: 'Solar modules installed across a large roof',
    priorities: ['Classroom lighting, fans and computer labs', 'Water pumping across the campus', 'Security and perimeter lighting'],
    watchouts: ['Works may need to fit holiday periods', 'Multiple buildings require cable-route and metering decisions'],
  },
  agriculture: {
    image: '/images/solar-farm-aerial.jpg',
    alt: 'Aerial view of a large solar array in a rural setting',
    priorities: ['Irrigation and borehole pumping', 'Cold storage or processing loads', 'Farmhouse and security lighting'],
    watchouts: ['Borehole yield and pumping head must be tested', 'Seasonal demand can change the array and storage requirement'],
  },
  manufacturing: {
    image: '/images/industrial.jpg',
    alt: 'Industrial facility with electrical infrastructure',
    priorities: ['Three-phase process loads', 'Generator integration and changeover', 'A phased rollout that protects production'],
    watchouts: ['Power factor, harmonics and large motor starts need engineering review', 'Solar is rarely a like-for-like replacement for an industrial generator'],
  },
  'real-estate': {
    image: '/images/construction-site.jpg',
    alt: 'Construction site with buildings under development',
    priorities: ['Shared infrastructure and common areas', 'Solar-ready roof and plant-room design', 'Metering and maintenance responsibility'],
    watchouts: ['The estate operator and unit owners must agree who maintains what', 'Late design changes can compromise cable routes and inverter locations'],
  },
  'remote-sites': {
    image: '/images/solar-install.jpg',
    alt: 'Solar installation in an open outdoor setting',
    priorities: ['Autonomy through cloudy periods', 'Remote monitoring and fault alerts', 'Physical security and maintenance access'],
    watchouts: ['Theft and vandalism risk affects mounting and enclosure design', 'A remote site needs a maintenance plan before commissioning'],
  },
}

const enriched = industries.map((industry) => ({
  ...industry,
  ...detail[industry.slug]!,
  solutionLabel: solutions.find((solution) => solution.slug === industry.solution)?.title ?? 'Solar solution',
}))

const principles = [
  { title: 'Start with the load', body: 'Industry labels do not size systems. Operating hours, surge behaviour and the cost of downtime do.', icon: 'i-lucide-gauge' },
  { title: 'Match the architecture', body: 'Backup scope, grid stability and generator integration decide whether hybrid, off-grid or grid-tied is appropriate.', icon: 'i-lucide-layers' },
  { title: 'Plan the maintenance', body: 'Access, cleaning, battery replacement and fault response should be designed in, not discovered later.', icon: 'i-lucide-wrench' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Industries"
      title="Different buildings. Different reasons for needing power."
      description="A clinic, a factory and a family home do not share the same load profile, downtime cost or maintenance capacity. The engineering should reflect that."
      :breadcrumbs="[{ label: 'Industries' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/quote" icon-right="i-lucide-arrow-right">Describe your site</AppButton>
        <AppButton to="/solutions" variant="on-dark" icon="i-lucide-layers">Compare solutions</AppButton>
      </template>
    </PageHero>

    <section class="border-b border-forest-900/[0.08] bg-cream-deep/50">
      <div class="page-container py-7">
        <div class="grid gap-4 md:grid-cols-3">
          <div v-for="principle in principles" :key="principle.title" class="flex items-start gap-3 rounded-xl border border-forest-900/10 bg-white p-4">
            <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
              <UIcon :name="principle.icon" class="size-4" aria-hidden="true" />
            </span>
            <div>
              <p class="text-[11.5px] font-semibold text-ink">{{ principle.title }}</p>
              <p class="mt-0.5 text-[10.5px] leading-4 text-muted">{{ principle.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <SectionHeading
          eyebrow="Sector guide"
          title="Eight contexts, with the practical constraints stated."
          description="These are starting points for a conversation — not generic system packages. Each sector page in a live site would link to verified project evidence."
        />

        <div class="mt-9 space-y-5">
          <section
            v-for="(industry, index) in enriched"
            :id="industry.slug"
            :key="industry.slug"
            class="scroll-mt-24 overflow-hidden rounded-2xl border border-forest-900/10 bg-white"
          >
            <div class="grid lg:grid-cols-[0.85fr_1.15fr]" :class="index % 2 === 1 && 'lg:[&>div:first-child]:order-2'">
              <div class="relative min-h-[210px] lg:min-h-full">
                <img
                  :src="industry.image"
                  :alt="industry.alt"
                  width="1000"
                  height="700"
                  loading="lazy"
                  decoding="async"
                  class="absolute inset-0 h-full w-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-forest-950/10 to-transparent lg:bg-gradient-to-r" aria-hidden="true" />
                <div class="absolute left-4 top-4 flex items-center gap-2">
                  <span class="grid size-8 place-items-center rounded-lg bg-forest-950/75 text-solar-300 backdrop-blur-sm">
                    <UIcon :name="industry.icon" class="size-4" aria-hidden="true" />
                  </span>
                  <span class="rounded-full bg-forest-950/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-cream backdrop-blur-sm">
                    {{ industry.name }}
                  </span>
                </div>
              </div>

              <div class="p-5 sm:p-7">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h2 class="font-display text-xl font-bold text-ink">{{ industry.name }}</h2>
                  <AppBadge tone="neutral">{{ industry.solutionLabel }}</AppBadge>
                </div>
                <p class="mt-2 text-[12.5px] leading-6 text-muted">{{ industry.summary }}</p>

                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-forest-800">What usually matters</p>
                    <ul class="mt-2 space-y-1.5">
                      <li v-for="item in industry.priorities" :key="item" class="flex items-start gap-2 text-[10.5px] leading-4 text-ink-soft">
                        <UIcon name="i-lucide-check" class="mt-0.5 size-3 shrink-0 text-forest-700" aria-hidden="true" />
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-amber-800">Watch out for</p>
                    <ul class="mt-2 space-y-1.5">
                      <li v-for="item in industry.watchouts" :key="item" class="flex items-start gap-2 text-[10.5px] leading-4 text-muted">
                        <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3 shrink-0 text-amber-600" aria-hidden="true" />
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap gap-2 border-t border-forest-900/[0.07] pt-3">
                  <AppButton :to="`/solutions/${industry.solution}`" size="sm" variant="outline" icon-right="i-lucide-arrow-right">
                    {{ industry.solutionLabel }}
                  </AppButton>
                  <AppButton to="/calculator" size="sm" variant="ghost" icon="i-lucide-calculator">Estimate the load</AppButton>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-7 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p class="flex items-start gap-2 text-[10.5px] leading-5 text-amber-950/85">
            <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong class="font-semibold">Illustrative sector guidance.</strong>
              These descriptions are not case studies and do not claim experience in every sector. Project evidence will be published only when verified.
            </span>
          </p>
        </div>
      </div>
    </section>

    <section class="section-pad border-t border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="grid gap-8 rounded-2xl bg-forest-950 p-6 text-cream sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p class="eyebrow eyebrow-on-dark">Not listed?</p>
            <h2 class="display-title mt-3 text-2xl text-cream sm:text-3xl">The load profile matters more than the sector label.</h2>
            <p class="mt-3 max-w-2xl text-[12.5px] leading-6 text-cream/60">
              Tell us what runs, when it runs and what happens if it stops. If the site is unusual, we will say what
              information is missing before proposing equipment.
            </p>
          </div>
          <div class="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
            <AppButton to="/quote" block icon-right="i-lucide-arrow-right">Request a quote</AppButton>
            <AppButton :href="site.phoneHref" block variant="on-dark" icon="i-lucide-phone">Call the demo line</AppButton>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
