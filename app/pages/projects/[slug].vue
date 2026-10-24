<script setup lang="ts">
import { demoProjectNotice, getProjectBySlug, projects } from '~/data/projects'

const route = useRoute()
const project = getProjectBySlug(String(route.params.slug))

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

usePageMeta({
  title: project.title,
  description: `${project.summary} Demonstration case study — not a verified customer reference.`,
  image: project.image,
  type: 'article',
})

const related = projects
  .filter((entry) => entry.slug !== project.slug)
  .sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category))
  .slice(0, 3)

const facts = [
  { label: 'Location', value: project.location, icon: 'i-lucide-map-pin' },
  { label: 'Array', value: project.capacity, icon: 'i-lucide-sun' },
  { label: 'Storage', value: project.battery, icon: 'i-lucide-battery-charging' },
  { label: 'Illustrative date', value: project.date, icon: 'i-lucide-calendar' },
]

const categoryLabel: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  'off-grid': 'Off-grid',
  hybrid: 'Hybrid',
}
</script>

<template>
  <div v-if="project">
    <PageHero
      eyebrow="Demonstration case study"
      :title="project.title"
      :description="project.summary"
      :breadcrumbs="[{ label: 'Projects', to: '/projects' }, { label: project.title }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/quote" icon-right="i-lucide-arrow-right">Discuss a similar brief</AppButton>
        <AppButton to="/projects" variant="on-dark" icon="i-lucide-arrow-left">All projects</AppButton>
      </template>
    </PageHero>

    <section class="bg-cream">
      <div class="page-container py-8 lg:py-10">
        <div class="overflow-hidden rounded-2xl border border-forest-900/10">
          <div class="relative">
            <img
              :src="project.image"
              :alt="project.imageAlt"
              width="1600"
              height="900"
              class="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
            />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/70 to-transparent p-4 pt-16 sm:p-6">
              <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-solar-300">Illustrative image · Demo project</p>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div v-for="fact in facts" :key="fact.label" class="rounded-xl border border-forest-900/10 bg-white p-3.5">
            <UIcon :name="fact.icon" class="size-4 text-forest-700" aria-hidden="true" />
            <p class="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">{{ fact.label }}</p>
            <p class="mt-0.5 text-[11.5px] font-semibold text-ink">{{ fact.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-cream pb-12">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <article class="rounded-2xl border border-forest-900/10 bg-white p-5 sm:p-8">
            <div class="flex flex-wrap items-center gap-2">
              <AppBadge tone="forest">{{ categoryLabel[project.category] }}</AppBadge>
              <AppBadge tone="warning">Demonstration only</AppBadge>
            </div>

            <div class="mt-6 space-y-8">
              <div>
                <h2 class="flex items-center gap-2 font-display text-xl font-bold text-ink">
                  <span class="grid size-7 place-items-center rounded-lg bg-forest-50 text-forest-800"><UIcon name="i-lucide-target" class="size-4" aria-hidden="true" /></span>
                  The brief
                </h2>
                <p class="mt-3 text-[13px] leading-7 text-muted">{{ project.summary }}</p>
              </div>

              <div>
                <h2 class="flex items-center gap-2 font-display text-xl font-bold text-ink">
                  <span class="grid size-7 place-items-center rounded-lg bg-forest-50 text-forest-800"><UIcon name="i-lucide-triangle-alert" class="size-4" aria-hidden="true" /></span>
                  The constraint
                </h2>
                <p class="mt-3 text-[13px] leading-7 text-muted">{{ project.challenge }}</p>
              </div>

              <div>
                <h2 class="flex items-center gap-2 font-display text-xl font-bold text-ink">
                  <span class="grid size-7 place-items-center rounded-lg bg-forest-50 text-forest-800"><UIcon name="i-lucide-drafting-compass" class="size-4" aria-hidden="true" /></span>
                  The design direction
                </h2>
                <p class="mt-3 text-[13px] leading-7 text-muted">{{ project.solution }}</p>

                <h3 class="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-forest-800">Equipment schedule</h3>
                <ul class="mt-2 grid gap-1.5 sm:grid-cols-2">
                  <li v-for="item in project.equipment" :key="item" class="flex items-start gap-2 rounded-lg bg-cream/60 px-2.5 py-2 text-[11px] leading-5 text-ink-soft">
                    <UIcon name="i-lucide-check" class="mt-0.5 size-3 shrink-0 text-forest-700" aria-hidden="true" />
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div>
                <h2 class="flex items-center gap-2 font-display text-xl font-bold text-ink">
                  <span class="grid size-7 place-items-center rounded-lg bg-forest-50 text-forest-800"><UIcon name="i-lucide-line-chart" class="size-4" aria-hidden="true" /></span>
                  What the outcome does — and does not — show
                </h2>
                <p class="mt-3 text-[13px] leading-7 text-muted">{{ project.outcome }}</p>
              </div>

              <div class="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <p class="flex items-start gap-2 text-[11px] leading-5 text-amber-950/85">
                  <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong class="font-semibold">This is a demonstration project.</strong>
                    {{ demoProjectNotice }} No savings, payback period, customer testimonial or independent performance verification is claimed.
                  </span>
                </p>
              </div>
            </div>
          </article>

          <aside class="space-y-4">
            <div class="rounded-2xl border border-forest-900/10 bg-white p-4 lg:sticky lg:top-24">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Planning a similar site?</p>
              <p class="mt-2 text-[11px] leading-5 text-muted">
                A useful brief includes a load list, photos of the roof and distribution board, and the backup priority. The calculator is a good starting point.
              </p>
              <div class="mt-3 space-y-2">
                <AppButton to="/calculator" block size="sm" variant="secondary" icon="i-lucide-calculator">Estimate your load</AppButton>
                <AppButton to="/quote" block size="sm" icon-right="i-lucide-arrow-right">Request a quote</AppButton>
              </div>
              <p class="mt-3 border-t border-forest-900/[0.07] pt-3 text-[9.5px] leading-4 text-muted">
                Do not rely on this page for engineering decisions. Final design requires a site assessment.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section-pad border-t border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="More demonstrations" title="Other project briefs." />
          <AppButton to="/projects" variant="outline" size="sm" icon-right="i-lucide-arrow-right">View all</AppButton>
        </div>
        <div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="entry in related" :key="entry.slug" :to="`/projects/${entry.slug}`" class="group overflow-hidden rounded-xl border border-forest-900/10 bg-white">
            <img :src="entry.image" :alt="entry.imageAlt" width="800" height="500" loading="lazy" decoding="async" class="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div class="p-4">
              <p class="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">{{ categoryLabel[entry.category] }} · {{ entry.location }}</p>
              <p class="mt-1 text-[12px] font-semibold leading-5 text-ink group-hover:text-forest-800">{{ entry.title }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
