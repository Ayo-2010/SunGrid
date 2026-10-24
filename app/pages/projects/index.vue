<script setup lang="ts">
import type { ProjectCategory } from '#shared/types'
import { demoProjectNotice, projectFilters, projects } from '~/data/projects'

usePageMeta({
  title: 'Solar projects and case studies',
  description:
    'Explore demonstration solar case studies for Nigerian homes, businesses and off-grid sites. Every project on this page is illustrative, not a verified customer reference.',
  image: '/images/install-roof.jpg',
})

const route = useRoute()
const validCategory = projectFilters.some((entry) => entry.value === route.query.category)
const category = ref<string>(validCategory ? String(route.query.category) : 'all')
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return projects.filter((project) => {
    if (category.value !== 'all' && project.category !== (category.value as ProjectCategory)) return false
    if (!term) return true
    return `${project.title} ${project.location} ${project.summary} ${project.equipment.join(' ')}`
      .toLowerCase()
      .includes(term)
  })
})

const categoryLabel: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  'off-grid': 'Off-grid',
  hybrid: 'Hybrid',
}

function reset() {
  category.value = 'all'
  search.value = ''
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="Projects"
      title="Case studies that separate design intent from verified outcome."
      description="Each demonstration below explains the brief, the constraints and the design direction. None of them claims a measured saving or a verified customer endorsement."
      :breadcrumbs="[{ label: 'Projects' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/quote" icon-right="i-lucide-arrow-right">Discuss your project</AppButton>
        <AppButton to="/solutions" variant="on-dark" icon="i-lucide-layers">Explore solutions</AppButton>
      </template>
    </PageHero>

    <section class="border-b border-forest-900/[0.08] bg-cream-deep/50">
      <div class="page-container py-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by category">
            <button
              v-for="filter in projectFilters"
              :key="filter.value"
              type="button"
              class="rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition-colors"
              :class="category === filter.value ? 'border-forest-900 bg-forest-900 text-cream' : 'border-forest-900/12 bg-white text-ink-soft hover:border-forest-900/30'"
              :aria-pressed="category === filter.value"
              @click="category = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="relative sm:w-64">
            <label for="project-search" class="sr-only">Search projects</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="project-search" v-model="search" type="search" placeholder="Search location or equipment…" class="field-base !py-2 pl-9 text-[11.5px]" />
          </div>
        </div>
      </div>
    </section>

    <section class="bg-cream">
      <div class="page-container py-8 lg:py-12">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p class="text-[11px] text-muted" aria-live="polite">
            <strong class="font-semibold text-ink">{{ filtered.length }}</strong>
            demonstration {{ filtered.length === 1 ? 'project' : 'projects' }}
            <template v-if="category !== 'all'"> · {{ categoryLabel[category] }}</template>
          </p>
          <button v-if="category !== 'all' || search" type="button" class="text-[10.5px] font-medium text-muted underline underline-offset-2 hover:text-ink" @click="reset">
            Clear filters
          </button>
        </div>

        <div v-if="filtered.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="project in filtered"
            :key="project.slug"
            :to="`/projects/${project.slug}`"
            class="group flex flex-col overflow-hidden rounded-2xl border border-forest-900/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="project.image"
                :alt="project.imageAlt"
                width="1200"
                height="750"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span class="absolute left-3 top-3 rounded-full bg-forest-950/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-solar-300 backdrop-blur-sm">
                {{ categoryLabel[project.category] }}
              </span>
              <span class="absolute bottom-3 right-3 rounded bg-white/90 px-2 py-1 text-[9px] font-semibold text-forest-900">
                Demo case study
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{{ project.location }} · {{ project.date }}</p>
              <h2 class="mt-2 font-display text-[16px] font-bold leading-snug text-ink group-hover:text-forest-800">{{ project.title }}</h2>
              <p class="mt-2 flex-1 text-[11.5px] leading-5 text-muted">{{ project.summary }}</p>
              <div class="mt-4 flex items-center justify-between border-t border-forest-900/[0.07] pt-3">
                <span class="text-[10.5px] text-muted">{{ project.capacity }} · {{ project.battery }}</span>
                <UIcon name="i-lucide-arrow-right" class="size-3.5 text-forest-700 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </div>
          </NuxtLink>
        </div>

        <EmptyState
          v-else
          icon="i-lucide-search-x"
          title="No demonstration projects match"
          description="Try another category or clear the search. The portfolio is intentionally small and labelled as illustrative."
        >
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="reset">Clear filters</AppButton>
        </EmptyState>

        <div class="mt-7 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p class="flex items-start gap-2 text-[10.5px] leading-5 text-amber-950/85">
            <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span><strong class="font-semibold">Demo portfolio.</strong> {{ demoProjectNotice }}</span>
          </p>
        </div>
      </div>
    </section>

    <section class="section-pad border-t border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="How to read a case study"
            title="Look for the constraints, not just the capacity."
            description="A kilowatt figure tells you very little. The useful questions are about the load, the site, the equipment limits and what was actually measured after handover."
          />
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="item in [
              { title: 'The brief', body: 'What the customer needed to keep running, and for how long.' },
              { title: 'The constraint', body: 'Roof, phase, shading, access, budget or grid behaviour that shaped the design.' },
              { title: 'The design', body: 'Equipment, architecture and protection — with compatibility notes.' },
              { title: 'The evidence', body: 'What was measured, what was assumed and what remains unverified.' },
            ]" :key="item.title" class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <p class="text-[11.5px] font-semibold text-ink">{{ item.title }}</p>
              <p class="mt-1 text-[10.5px] leading-5 text-muted">{{ item.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
