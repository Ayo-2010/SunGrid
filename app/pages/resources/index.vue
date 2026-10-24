<script setup lang="ts">
import { articleCategories, articles } from '~/data/articles'

usePageMeta({
  title: 'Solar resources and buying guides',
  description:
    'Practical guides on solar sizing, batteries, installation costs, maintenance and energy use for Nigerian homes and businesses. Educational content, not site-specific engineering advice.',
  image: '/images/system-design.jpg',
})

const category = ref<string>('All articles')
const search = ref('')

const featured = articles[0]!

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return articles.filter((article) => {
    if (category.value !== 'All articles' && article.category !== category.value) return false
    if (!term) return true
    return `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(term)
  })
})

function reset() {
  category.value = 'All articles'
  search.value = ''
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="Resources"
      title="Better questions make better solar decisions."
      description="Plain-language guides on load sizing, inverters, batteries, installation cost drivers and maintenance. Written for Nigerian conditions, with the limits of each answer stated."
      :breadcrumbs="[{ label: 'Resources' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/calculator" icon="i-lucide-calculator">Use the calculator</AppButton>
        <AppButton to="/faq" variant="on-dark" icon-right="i-lucide-arrow-right">Browse FAQs</AppButton>
      </template>
    </PageHero>

    <section class="bg-cream">
      <div class="page-container py-8 lg:py-12">
        <!-- Featured -->
        <NuxtLink
          :to="`/resources/${featured.slug}`"
          class="group grid overflow-hidden rounded-2xl border border-forest-900/10 bg-white lg:grid-cols-[1.1fr_1fr]"
        >
          <div class="relative min-h-[220px] overflow-hidden lg:min-h-[340px]">
            <img
              :src="featured.image"
              :alt="featured.imageAlt"
              width="1200"
              height="800"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span class="absolute left-4 top-4 rounded-full bg-forest-950/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-solar-300 backdrop-blur-sm">
              Featured guide
            </span>
          </div>
          <div class="flex flex-col justify-center p-6 sm:p-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">{{ featured.category }}</p>
            <h2 class="mt-3 font-display text-2xl font-bold leading-tight text-ink group-hover:text-forest-800 sm:text-3xl">{{ featured.title }}</h2>
            <p class="mt-3 text-[12.5px] leading-6 text-muted">{{ featured.excerpt }}</p>
            <div class="mt-5 flex items-center gap-3 text-[10px] text-muted">
              <span>{{ formatDate(featured.date) }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ featured.readingTime }} min read</span>
              <span aria-hidden="true">·</span>
              <span>Illustrative article</span>
            </div>
            <span class="mt-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-forest-800">
              Read the guide
              <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </NuxtLink>

        <div class="mt-8 flex flex-col gap-3 rounded-2xl border border-forest-900/10 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter articles by category">
            <button
              v-for="entry in articleCategories"
              :key="entry"
              type="button"
              class="rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition-colors"
              :class="category === entry ? 'border-forest-900 bg-forest-900 text-cream' : 'border-forest-900/12 text-ink-soft hover:border-forest-900/30 hover:bg-forest-50'"
              :aria-pressed="category === entry"
              @click="category = entry"
            >
              {{ entry }}
            </button>
          </div>
          <div class="relative sm:w-56">
            <label for="resource-search" class="sr-only">Search resources</label>
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="resource-search" v-model="search" type="search" placeholder="Search guides…" class="field-base !py-2 pl-9 text-[11.5px]" />
          </div>
        </div>

        <div class="mt-5 flex items-center justify-between gap-3">
          <p class="text-[11px] text-muted" aria-live="polite">
            <strong class="font-semibold text-ink">{{ filtered.length }}</strong>
            {{ filtered.length === 1 ? 'guide' : 'guides' }}
            <template v-if="category !== 'All articles'"> · {{ category }}</template>
          </p>
          <button v-if="category !== 'All articles' || search" type="button" class="text-[10.5px] font-medium text-muted underline underline-offset-2 hover:text-ink" @click="reset">
            Clear filters
          </button>
        </div>

        <div v-if="filtered.length" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="article in filtered"
            :key="article.slug"
            :to="`/resources/${article.slug}`"
            class="group flex flex-col overflow-hidden rounded-2xl border border-forest-900/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="article.image"
                :alt="article.imageAlt"
                width="1000"
                height="625"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-forest-900 backdrop-blur-sm">
                {{ article.category }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-4">
              <h2 class="font-display text-[15px] font-bold leading-snug text-ink group-hover:text-forest-800">{{ article.title }}</h2>
              <p class="mt-2 flex-1 text-[11.5px] leading-5 text-muted">{{ article.excerpt }}</p>
              <div class="mt-4 flex items-center justify-between border-t border-forest-900/[0.07] pt-2.5 text-[9.5px] text-muted">
                <span>{{ formatDate(article.date) }}</span>
                <span>{{ article.readingTime }} min read</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <EmptyState
          v-else
          icon="i-lucide-file-search"
          title="No guides match that filter"
          description="Try a broader search term or clear the category filter."
        >
          <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="reset">Clear filters</AppButton>
        </EmptyState>

        <p class="mt-6 text-[9.5px] leading-4 text-muted">
          These articles are part of a frontend demonstration. Publication dates, bylines and reading times are illustrative.
          Content is general guidance and is not a substitute for a site-specific design.
        </p>
      </div>
    </section>

    <section class="section-pad border-y border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <SectionHeading
            eyebrow="Editorial principles"
            title="No miracle claims, no invented payback periods."
            description="Our guides aim to explain the trade-off, not to sell a specific product. Where a number depends on the site, we say so."
          />
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <UIcon name="i-lucide-scale" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">Assumptions shown</p>
              <p class="mt-1 text-[10.5px] leading-5 text-muted">Calculations expose the sun hours, efficiency and depth of discharge used.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <UIcon name="i-lucide-ban" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">No fake proof</p>
              <p class="mt-1 text-[10.5px] leading-5 text-muted">We do not publish invented testimonials, certifications or savings figures.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <UIcon name="i-lucide-refresh-cw" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">Built to be corrected</p>
              <p class="mt-1 text-[10.5px] leading-5 text-muted">Equipment specifications change. Verify against the current datasheet before buying.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <UIcon name="i-lucide-graduation-cap" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">Education, not design</p>
              <p class="mt-1 text-[10.5px] leading-5 text-muted">An article cannot inspect your roof, earthing or distribution board.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
