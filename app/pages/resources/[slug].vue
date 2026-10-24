<script setup lang="ts">
import { getArticleBySlug, getRelatedArticles } from '~/data/articles'

const route = useRoute()
const article = getArticleBySlug(String(route.params.slug))

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

usePageMeta({
  title: article.title,
  description: article.excerpt,
  image: article.image,
  type: 'article',
})

const related = getRelatedArticles(article, 3)
const toast = useToast()
const currentUrl = ref('')

const toc = article.sections
  .map((section, index) => ({ id: `section-${index + 1}`, heading: section.heading }))
  .filter((entry): entry is { id: string; heading: string } => Boolean(entry.heading))

const shareHref = computed(() => {
  const url = currentUrl.value || 'https://sungrid.example.com'
  return `https://wa.me/?text=${encodeURIComponent(`${article.title} — ${url}`)}`
})

const readingProgress = ref(0)
const articleEl = ref<HTMLElement | null>(null)

function updateProgress() {
  if (!articleEl.value) return
  const rect = articleEl.value.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
  readingProgress.value = total > 0 ? Math.round((scrolled / total) * 100) : 0
}

onMounted(() => {
  currentUrl.value = window.location.href
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(currentUrl.value || window.location.href)
    toast.add({ title: 'Link copied', description: 'You can paste it into a message.', color: 'success' })
  } catch {
    toast.add({ title: 'Copy unavailable', description: 'Your browser blocked clipboard access.', color: 'warning' })
  }
}
</script>

<template>
  <div v-if="article" ref="articleEl">
    <div class="sticky top-0 z-40 h-0.5 w-full bg-forest-900/10" aria-hidden="true">
      <div class="h-full bg-solar-500 transition-[width] duration-150" :style="{ width: `${readingProgress}%` }" />
    </div>

    <PageHero
      eyebrow="Resources · Demo article"
      :title="article.title"
      :description="article.excerpt"
      :breadcrumbs="[{ label: 'Resources', to: '/resources' }, { label: article.title }]"
      size="compact"
    >
      <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10.5px] text-cream/55">
        <span>{{ article.category }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ formatDate(article.date, 'long') }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ article.readingTime }} min read</span>
        <span aria-hidden="true">·</span>
        <span>{{ article.author }}</span>
        <AppBadge tone="solar" class="ml-1">Illustrative publication</AppBadge>
      </div>
    </PageHero>

    <section class="bg-cream">
      <div class="page-container py-8 lg:py-12">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <article>
            <div class="overflow-hidden rounded-2xl border border-forest-900/10">
              <img
                :src="article.image"
                :alt="article.imageAlt"
                width="1400"
                height="800"
                class="aspect-[16/9] w-full object-cover"
              />
            </div>
            <p class="mt-2 text-right text-[9px] text-muted">Stock photograph used for demonstration.</p>

            <div class="article-prose mt-7 rounded-2xl border border-forest-900/10 bg-white p-5 sm:p-8">
              <p class="rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 !text-[10.5px] !leading-5 text-amber-950/85">
                <strong class="font-semibold">Editorial note:</strong> this is demonstration content.
                Publication date, byline and reading time are illustrative. Use it as general guidance, not as a
                substitute for a site-specific design or a current datasheet.
              </p>

              <template v-for="(section, index) in article.sections" :key="index">
                <div v-if="section.heading" :id="`section-${index + 1}`" class="scroll-mt-28">
                  <h2>{{ section.heading }}</h2>
                </div>
                <p v-for="(paragraph, paragraphIndex) in section.paragraphs ?? []" :key="`p-${paragraphIndex}`">
                  {{ paragraph }}
                </p>
                <ul v-if="section.bullets?.length">
                  <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
                </ul>
              </template>

              <div class="!mt-8 rounded-xl border border-forest-900/10 bg-cream/60 p-4 !text-[11px] !leading-5">
                <p class="font-semibold text-ink">Need this applied to your site?</p>
                <p class="mt-1 text-muted">
                  The calculator gives a preliminary size from your appliance list. A site assessment is still required
                  before equipment, protection and cable sizes are fixed.
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <AppButton to="/calculator" size="sm" variant="secondary" icon="i-lucide-calculator">Open calculator</AppButton>
                  <AppButton to="/quote" size="sm" icon-right="i-lucide-arrow-right">Request a quote</AppButton>
                </div>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-900/10 bg-white px-4 py-3">
              <p class="text-[10px] text-muted">Share this guide</p>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="inline-flex items-center gap-1.5 rounded-full border border-forest-900/12 px-3 py-1.5 text-[10.5px] font-semibold text-forest-900 hover:bg-forest-50" @click="copyLink">
                  <UIcon name="i-lucide-link" class="size-3.5" aria-hidden="true" />
                  Copy link
                </button>
                <a :href="shareHref" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 rounded-full border border-forest-900/12 px-3 py-1.5 text-[10.5px] font-semibold text-forest-900 hover:bg-forest-50">
                  <UIcon name="i-lucide-message-circle" class="size-3.5" aria-hidden="true" />
                  Share on WhatsApp
                </a>
                <NuxtLink to="/resources" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold text-muted hover:bg-forest-900/5 hover:text-ink">
                  All resources
                </NuxtLink>
              </div>
            </div>
          </article>

          <aside class="space-y-4">
            <div v-if="toc.length" class="rounded-2xl border border-forest-900/10 bg-white p-4 lg:sticky lg:top-24">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">In this guide</p>
              <nav class="mt-3" aria-label="Article contents">
                <ol class="space-y-1.5">
                  <li v-for="entry in toc" :key="entry.id">
                    <a :href="`#${entry.id}`" class="block rounded px-1 py-1 text-[10.5px] leading-4 text-muted transition-colors hover:text-forest-800">
                      {{ entry.heading }}
                    </a>
                  </li>
                </ol>
              </nav>
              <div class="mt-4 border-t border-forest-900/[0.07] pt-3">
                <p class="text-[9.5px] leading-4 text-muted">Reading progress: {{ readingProgress }}%</p>
                <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-forest-900/10">
                  <div class="h-full rounded-full bg-forest-700 transition-[width] duration-150" :style="{ width: `${readingProgress}%` }" />
                </div>
              </div>
            </div>

            <div class="rounded-2xl bg-forest-950 p-4 text-cream">
              <UIcon name="i-lucide-drafting-compass" class="size-5 text-solar-300" aria-hidden="true" />
              <p class="mt-2 font-display text-[14px] font-bold text-cream">Applying this to a real site?</p>
              <p class="mt-1 text-[10.5px] leading-4 text-cream/55">
                Roof condition, earthing and surge loads need to be inspected. A guide cannot do that.
              </p>
              <AppButton to="/quote" size="sm" class="mt-3" icon-right="i-lucide-arrow-right">Start a request</AppButton>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section-pad border-t border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Keep reading" title="Related guides." />
          <AppButton to="/resources" variant="outline" size="sm" icon-right="i-lucide-arrow-right">All resources</AppButton>
        </div>
        <div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="entry in related" :key="entry.slug" :to="`/resources/${entry.slug}`" class="group overflow-hidden rounded-xl border border-forest-900/10 bg-white">
            <img :src="entry.image" :alt="entry.imageAlt" width="800" height="500" loading="lazy" decoding="async" class="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div class="p-4">
              <p class="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">{{ entry.category }}</p>
              <p class="mt-1 text-[12px] font-semibold leading-5 text-ink group-hover:text-forest-800">{{ entry.title }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
