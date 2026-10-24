<script setup lang="ts">
import { faqCategories, faqs } from '~/data/faqs'

usePageMeta({
  title: 'Frequently asked questions',
  description:
    'Answers about solar sizing, costs, equipment, installation, warranties and payments in Nigeria. Search the SunGrid Energy FAQ library.',
  image: '/images/rooftop-panels.jpg',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }),
    },
  ],
})

const search = ref('')
const category = ref<string>('All')
const openIndex = ref<number | null>(0)

const categories = computed(() => ['All', ...faqCategories])

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return faqs.filter((faq) => {
    if (category.value !== 'All' && faq.category !== category.value) return false
    if (!term) return true
    return `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase().includes(term)
  })
})

watch([search, category], () => {
  openIndex.value = 0
})

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

function reset() {
  search.value = ''
  category.value = 'All'
}

const popular = [
  { label: 'What drives installation cost?', to: '/resources/solar-installation-cost-nigeria' },
  { label: 'Lithium vs lead-acid batteries', to: '/resources/lithium-vs-lead-acid' },
  { label: 'Do I need a site visit?', to: '/installation' },
  { label: 'What size system do I need?', to: '/calculator' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Support centre"
      title="Straight answers, including the inconvenient ones."
      description="Sizing, cost drivers, battery life, warranty conditions and installation realities. If an answer depends on the site, we say so rather than inventing a number."
      :breadcrumbs="[{ label: 'FAQs' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/contact" variant="on-dark" icon="i-lucide-message-circle">Ask a different question</AppButton>
        <AppButton to="/quote" variant="on-dark" icon-right="i-lucide-arrow-right">Request a quote</AppButton>
      </template>
    </PageHero>

    <section class="bg-cream">
      <div class="page-container py-8 lg:py-12">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <div>
            <div class="rounded-2xl border border-forest-900/10 bg-white p-4 sm:p-5">
              <label for="faq-search" class="sr-only">Search the FAQs</label>
              <div class="relative">
                <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="faq-search"
                  v-model="search"
                  type="search"
                  placeholder="Search questions, e.g. battery, inverter, warranty, cost…"
                  class="field-base !py-3 pl-10 pr-10 text-[13px]"
                />
                <button
                  v-if="search"
                  type="button"
                  class="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-forest-900/5 hover:text-ink"
                  aria-label="Clear search"
                  @click="search = ''"
                >
                  <UIcon name="i-lucide-x" class="size-4" aria-hidden="true" />
                </button>
              </div>

              <div class="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter FAQs by category">
                <button
                  v-for="entry in categories"
                  :key="entry"
                  type="button"
                  class="rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition-colors"
                  :class="category === entry ? 'border-forest-900 bg-forest-900 text-cream' : 'border-forest-900/12 text-ink-soft hover:border-forest-900/30 hover:bg-forest-50'"
                  :aria-pressed="category === entry"
                  @click="category = entry"
                >
                  {{ entry }}
                  <span
                    v-if="entry === 'All'"
                    class="ml-1 text-[9px]"
                    :class="category === entry ? 'text-solar-300' : 'text-muted'"
                  >{{ faqs.length }}</span>
                </button>
              </div>
            </div>

            <p class="mt-4 text-[11px] text-muted" aria-live="polite">
              <strong class="font-semibold text-ink">{{ filtered.length }}</strong>
              {{ filtered.length === 1 ? 'answer' : 'answers' }}
              <template v-if="category !== 'All'"> in {{ category }}</template>
              <template v-if="search"> for “{{ search }}”</template>
            </p>

            <div v-if="filtered.length" class="mt-3 space-y-2.5">
              <div
                v-for="(faq, index) in filtered"
                :key="faq.question"
                class="overflow-hidden rounded-xl border transition-colors"
                :class="openIndex === index ? 'border-forest-800/30 bg-white shadow-soft' : 'border-forest-900/10 bg-white'"
              >
                <h2>
                  <button
                    :id="`faq-button-${index}`"
                    type="button"
                    class="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
                    :aria-expanded="openIndex === index"
                    :aria-controls="`faq-panel-${index}`"
                    @click="toggle(index)"
                  >
                    <span class="flex items-start gap-3">
                      <span class="mt-0.5 rounded-full bg-forest-50 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.08em] text-forest-800">
                        {{ faq.category }}
                      </span>
                      <span class="text-[12.5px] font-semibold leading-5 text-ink sm:text-[13px]">{{ faq.question }}</span>
                    </span>
                    <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-forest-900/10 text-muted">
                      <UIcon :name="openIndex === index ? 'i-lucide-minus' : 'i-lucide-plus'" class="size-3.5" aria-hidden="true" />
                    </span>
                  </button>
                </h2>
                <div v-show="openIndex === index" :id="`faq-panel-${index}`" role="region" :aria-labelledby="`faq-button-${index}`">
                  <p class="border-t border-forest-900/[0.07] px-4 pb-4 pt-3 text-[12px] leading-6 text-muted sm:px-5">{{ faq.answer }}</p>
                </div>
              </div>
            </div>

            <EmptyState
              v-else
              icon="i-lucide-search-x"
              title="No answers match that search"
              description="Try a broader term, choose a different category, or send the question directly to the demo team."
            >
              <div class="flex flex-wrap justify-center gap-2">
                <AppButton variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="reset">Clear filters</AppButton>
                <AppButton to="/contact" size="sm" variant="secondary">Ask the team</AppButton>
              </div>
            </EmptyState>
          </div>

          <aside class="space-y-4 lg:sticky lg:top-24">
            <div class="rounded-2xl border border-forest-900/10 bg-white p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Popular starting points</p>
              <ul class="mt-3 space-y-2">
                <li v-for="item in popular" :key="item.label">
                  <NuxtLink :to="item.to" class="group flex items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-[11px] font-medium text-ink-soft hover:text-forest-800">
                    {{ item.label }}
                    <UIcon name="i-lucide-arrow-up-right" class="size-3.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl bg-forest-950 p-4 text-cream">
              <UIcon name="i-lucide-message-square-text" class="size-5 text-solar-300" aria-hidden="true" />
              <p class="mt-2 font-display text-[15px] font-bold text-cream">Still not answered?</p>
              <p class="mt-1 text-[10.5px] leading-4 text-cream/55">
                Send the details and we will explain the trade-off instead of guessing. Demo messages stay in this browser.
              </p>
              <AppButton to="/contact" size="sm" class="mt-3" icon-right="i-lucide-arrow-right">Contact us</AppButton>
            </div>

            <div class="rounded-2xl border border-forest-900/10 bg-cream-deep/50 p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Before you buy</p>
              <p class="mt-2 text-[10.5px] leading-4 text-muted">
                Read the sizing guide before comparing inverter prices. The cheapest unit is rarely the cheapest system.
              </p>
              <NuxtLink to="/resources/sizing-a-solar-inverter" class="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-forest-800 underline underline-offset-2">
                Read the inverter sizing guide
                <UIcon name="i-lucide-arrow-right" class="size-3" aria-hidden="true" />
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
