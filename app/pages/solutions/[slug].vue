<script setup lang="ts">
import { getSolutionBySlug, solutions } from '~/data/solutions'
import { getProductBySlug } from '~/data/products'
import { site } from '~/data/site'

const route = useRoute()
const solution = getSolutionBySlug(String(route.params.slug))

if (!solution) {
  throw createError({ statusCode: 404, statusMessage: 'Solution not found' })
}

const relatedProducts = solution.relatedProducts
  .map((slug) => getProductBySlug(slug))
  .filter((product): product is NonNullable<typeof product> => Boolean(product))

const otherSolutions = solutions.filter((entry) => entry.slug !== solution.slug).slice(0, 4)

usePageMeta({
  title: solution.title,
  description: `${solution.summary} Explore benefits, limitations and typical components, then request a site assessment.`,
  image: solution.image,
})
</script>

<template>
  <div>
    <PageHero
      :eyebrow="`Solution · ${solution.navLabel}`"
      :title="solution.title"
      :description="solution.summary"
      :breadcrumbs="[{ label: 'Solar Solutions', to: '/solutions' }, { label: solution.navLabel }]"
    >
      <template #actions>
        <AppButton to="/quote" icon-right="i-lucide-arrow-up-right">Request a quote</AppButton>
        <AppButton
          :href="`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(`Hello SunGrid, I would like to discuss ${solution.title.toLowerCase()}.`)}`"
          external
          variant="on-dark"
          icon="i-lucide-message-circle"
        >
          Ask on WhatsApp
        </AppButton>
      </template>
    </PageHero>

    <section class="bg-cream pt-8 sm:pt-10">
      <div class="page-container">
        <div class="relative overflow-hidden rounded-2xl border border-forest-900/10">
          <img
            :src="solution.image"
            :alt="solution.imageAlt"
            width="1800"
            height="1000"
            loading="eager"
            decoding="async"
            class="aspect-[16/8] w-full object-cover"
          />
          <div class="absolute left-3 top-3 rounded-full bg-forest-950/70 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cream/75 backdrop-blur-sm">
            Illustrative photograph
          </div>
          <div class="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-forest-950/80 to-transparent p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <p class="max-w-xl text-[12.5px] font-medium leading-5 text-cream/90">{{ solution.tagline }}</p>
            <span class="inline-flex w-fit items-center gap-1.5 rounded-full bg-solar-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest-950">
              <UIcon name="i-lucide-clipboard-check" class="size-3" aria-hidden="true" />
              Site assessment required
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <div class="grid items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div class="min-w-0">
            <div class="rounded-2xl border border-forest-900/10 bg-white p-6 sm:p-8">
              <p class="eyebrow">Who it suits</p>
              <h2 class="mt-3 font-display text-2xl font-bold text-ink">Is this the right starting point?</h2>
              <ul class="mt-5 grid gap-2.5 sm:grid-cols-2">
                <li v-for="item in solution.idealFor" :key="item" class="flex items-start gap-2.5 text-[12.5px] leading-5 text-ink-soft">
                  <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-forest-600" aria-hidden="true" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <div class="mt-8 grid gap-5 md:grid-cols-2">
              <div class="rounded-2xl border border-forest-200/70 bg-forest-50/60 p-6">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-circle-check" class="size-4 text-forest-700" aria-hidden="true" />
                  <h2 class="font-display text-[17px] font-bold text-ink">What it can do</h2>
                </div>
                <ul class="mt-4 space-y-3">
                  <li v-for="benefit in solution.benefits" :key="benefit" class="flex items-start gap-2.5 text-[12px] leading-5 text-ink-soft">
                    <span class="mt-1.5 size-1 shrink-0 rounded-full bg-forest-600" aria-hidden="true" />
                    {{ benefit }}
                  </li>
                </ul>
              </div>

              <div class="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-circle-alert" class="size-4 text-amber-700" aria-hidden="true" />
                  <h2 class="font-display text-[17px] font-bold text-ink">What it does not do</h2>
                </div>
                <ul class="mt-4 space-y-3">
                  <li v-for="limitation in solution.limitations" :key="limitation" class="flex items-start gap-2.5 text-[12px] leading-5 text-amber-950/70">
                    <span class="mt-1.5 size-1 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                    {{ limitation }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-8 rounded-2xl border border-forest-900/10 bg-white p-6 sm:p-8">
              <p class="eyebrow">Typical components</p>
              <h2 class="mt-3 font-display text-2xl font-bold text-ink">What a system of this type usually includes</h2>
              <div class="mt-5 grid gap-2.5 sm:grid-cols-2">
                <div v-for="(component, index) in solution.components" :key="component" class="flex items-start gap-3 rounded-xl bg-cream/70 p-3.5">
                  <span class="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[10px] font-bold text-forest-800 shadow-sm">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <span class="text-[12px] leading-5 text-ink-soft">{{ component }}</span>
                </div>
              </div>
              <p class="mt-4 text-[10.5px] leading-4 text-muted">
                Components are indicative. Final equipment selection depends on the load schedule, site
                conditions and compatibility checks.
              </p>
            </div>

            <div class="mt-8 rounded-2xl border border-forest-900/10 bg-white p-6 sm:p-8">
              <p class="eyebrow">Design notes</p>
              <h2 class="mt-3 font-display text-2xl font-bold text-ink">How we approach the engineering</h2>
              <div class="mt-5 space-y-4">
                <div v-for="(note, index) in solution.designNotes" :key="note" class="flex gap-3.5">
                  <span class="grid size-7 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-solar-300">
                    {{ index + 1 }}
                  </span>
                  <p class="text-[12.5px] leading-6 text-ink-soft">{{ note }}</p>
                </div>
              </div>
            </div>

            <div v-if="relatedProducts.length" class="mt-10">
              <div class="flex items-end justify-between gap-4">
                <h2 class="font-display text-2xl font-bold text-ink">Related equipment</h2>
                <NuxtLink to="/products" class="text-[12px] font-semibold text-forest-800 hover:text-forest-600">All products</NuxtLink>
              </div>
              <div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <ProductCard v-for="product in relatedProducts" :key="product.id" :product="product" compact />
              </div>
            </div>

            <div class="mt-10 rounded-2xl border border-forest-900/10 bg-white p-6 sm:p-8">
              <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div class="max-w-xl">
                  <h2 class="font-display text-xl font-bold text-ink">Want this assessed on your site?</h2>
                  <p class="mt-2 text-[12.5px] leading-5 text-muted">
                    Share your location, loads and priorities. We will confirm whether the solution fits
                    before scheduling a visit.
                  </p>
                </div>
                <AppButton to="/quote" class="shrink-0" icon-right="i-lucide-arrow-right">Start a quote</AppButton>
              </div>
            </div>
          </div>

          <aside class="space-y-4 lg:sticky lg:top-24">
            <div class="rounded-2xl border border-forest-900/10 bg-forest-950 p-6 text-cream">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-solar-300">Talk to an engineer</p>
              <h2 class="mt-3 font-display text-xl font-bold text-cream">Get a preliminary recommendation</h2>
              <p class="mt-2 text-[11.5px] leading-5 text-cream/60">
                No obligation. We will tell you what information is missing before a real design can be
                prepared.
              </p>
              <div class="mt-5 space-y-2">
                <AppButton to="/quote" block icon-right="i-lucide-arrow-right">Request a quote</AppButton>
                <AppButton to="/calculator" variant="on-dark" block icon="i-lucide-calculator">Size your load</AppButton>
              </div>
              <div class="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-[11.5px]">
                <a :href="site.phoneHref" class="flex items-center gap-2.5 text-cream/70 hover:text-solar-300">
                  <UIcon name="i-lucide-phone" class="size-3.5" aria-hidden="true" />
                  {{ site.phoneDisplay }}
                </a>
                <a :href="`mailto:${site.email}`" class="flex items-center gap-2.5 text-cream/70 hover:text-solar-300">
                  <UIcon name="i-lucide-mail" class="size-3.5" aria-hidden="true" />
                  {{ site.email }}
                </a>
              </div>
              <p class="mt-4 text-[9.5px] leading-4 text-cream/35">Demo contact details — replace before launch.</p>
            </div>

            <div class="rounded-2xl border border-forest-900/10 bg-white p-5">
              <h2 class="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Other solutions</h2>
              <ul class="mt-3 space-y-1">
                <li v-for="entry in otherSolutions" :key="entry.slug">
                  <NuxtLink :to="`/solutions/${entry.slug}`" class="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-[12px] text-ink-soft transition-colors hover:bg-cream hover:text-forest-900">
                    {{ entry.navLabel }}
                    <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-muted" aria-hidden="true" />
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl border border-forest-900/10 bg-[#f4f0e6] p-5">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="size-4 text-forest-700" aria-hidden="true" />
                <p class="text-[11px] font-semibold text-forest-900">What happens next?</p>
              </div>
              <p class="mt-2 text-[10.5px] leading-5 text-muted">
                Preliminary review → site assessment → fixed-scope quotation. Final pricing depends on
                site conditions and equipment availability.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
