<script setup lang="ts">
import { site } from '~/data/site'

usePageMeta({
  title: 'Website terms',
  description:
    'Terms for using the SunGrid Energy demonstration website, including catalogue pricing, calculator estimates, quotation requests and limitation of liability.',
  image: '/images/meeting.jpg',
})

interface LegalSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

const lastUpdated = '23 October 2026'

const sections: LegalSection[] = [
  {
    id: 'demo',
    title: '1. This is a demonstration website',
    paragraphs: [
      'SunGrid Energy is a fictional brand created for a frontend portfolio project. The catalogue, prices, projects, team, dashboard records and contact details are illustrative. Nothing on this site is a real commercial offer, and no order, payment, delivery, warranty or service contract can be created through it.',
      'By using the site you accept that it is a demo. If you are looking for a real solar installer, verify the company, registration, references and certifications independently.',
    ],
  },
  {
    id: 'use',
    title: '2. Permitted use',
    bullets: [
      'You may browse the pages, use the calculator and submit demo forms for evaluation purposes.',
      'Do not enter real personal, financial or confidential information into any form.',
      'Do not attempt to disrupt the site, probe it for vulnerabilities, or use it to distribute malware.',
      'Do not present the demo brand, content or pricing as your own commercial offering.',
    ],
  },
  {
    id: 'pricing',
    title: '3. Catalogue and pricing',
    paragraphs: [
      'Product names, model numbers and brands are real market references used to structure a realistic catalogue. Prices, stock positions, warranties and specifications are illustrative and may be incomplete, out of date or incorrect. They must be verified against current distributor documentation before any purchase decision.',
      'A “price on request” item has no demo price. An indicative price excludes installation, transport, mounting, protection, VAT and any site-specific work unless explicitly stated.',
      'The enquiry list and quote forms do not create an order or reserve stock. A binding quotation would require a separate written offer from a real business, signed by both parties.',
    ],
  },
  {
    id: 'calculator',
    title: '4. Calculator and guidance',
    paragraphs: [
      'The solar calculator uses the appliances, quantities, hours and assumptions you enter. It applies simplified engineering rules of thumb to estimate daily energy, inverter size, battery capacity and array size. It is a planning aid, not a design or a guarantee.',
      'Real systems require a site assessment covering roof structure, shading, cable routes, earthing, protection, distribution board capacity, generator behaviour, three-phase balance and local requirements. Results can change materially once those factors are known.',
      'Articles, FAQs and guides are general information for a Nigerian audience. They are not professional engineering, legal, financial or tax advice.',
    ],
  },
  {
    id: 'savings',
    title: '5. No savings, payback or performance promise',
    paragraphs: [
      'The demo does not promise bill reductions, generator-fuel savings, payback periods, uptime, autonomy or specific generation. Output depends on weather, equipment, installation quality, maintenance, load behaviour and grid conditions.',
      'Any figures described as illustrative are exactly that. They should not be relied on for a financial decision.',
    ],
  },
  {
    id: 'availability',
    title: '6. Availability and installation',
    paragraphs: [
      'Service coverage, lead times, installation dates and product availability shown in the demo are illustrative. Nothing on the site commits a real business to attend a site, supply equipment or meet a date.',
      'The installation and service pages describe a typical process for demonstration. They do not create a safety, warranty or maintenance obligation.',
    ],
  },
  {
    id: 'ip',
    title: '7. Intellectual property',
    paragraphs: [
      'The site design, written content and custom illustrations were created for this demonstration. Product names and trademarks belong to their respective owners and are used only to describe compatible equipment categories.',
      'Images are sourced from Unsplash under the Unsplash licence and are used for demonstration. Replace them with licensed brand photography before a commercial launch.',
    ],
  },
  {
    id: 'third-party',
    title: '8. Third-party links and services',
    paragraphs: [
      'Links to WhatsApp, Google Fonts, Unsplash and other external destinations are provided for convenience. This demo does not control those services and is not responsible for their content, availability or privacy practices.',
      'Opening a WhatsApp link or composing an email does not create a support ticket or a contractual relationship.',
    ],
  },
  {
    id: 'liability',
    title: '9. Limitation of liability',
    paragraphs: [
      'The site is provided “as is” for demonstration. To the extent permitted by law, no warranty is given about accuracy, completeness, availability or fitness for a particular purpose. No liability is accepted for loss arising from reliance on demo content, calculator output or catalogue data.',
      'Nothing in these terms excludes liability that cannot lawfully be excluded.',
    ],
  },
  {
    id: 'privacy',
    title: '10. Privacy and browser storage',
    paragraphs: [
      'Form submissions, saved lists, calculator briefs and admin edits are stored in your browser. They are not sent to a server. Read the privacy notice for the full list of storage keys and how to clear them.',
    ],
  },
  {
    id: 'changes',
    title: '11. Changes and governing law',
    paragraphs: [
      'These terms may change as the demo evolves. The date at the top shows the current version.',
      'A production version of this site would need terms reviewed against Nigerian consumer protection, electronic commerce and data protection law, with the real company’s registered details inserted. The placeholder identity and address on this demo are not a legal entity.',
    ],
  },
  {
    id: 'contact',
    title: '12. Contact',
    paragraphs: [
      `The demo contact address is ${site.email}. It is not monitored. For a real project, contact a verified installer and ask for written terms, a site-specific design and proof of insurance and competence.`,
    ],
  },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Legal"
      title="Website terms"
      description="The ground rules for using this demonstration site, and the limits of its catalogue, calculator and service information."
      :breadcrumbs="[{ label: 'Terms' }]"
      size="compact"
    >
      <template #actions>
        <AppBadge tone="warning">Demo terms — not a live contract</AppBadge>
      </template>
    </PageHero>

    <section class="bg-cream">
      <div class="page-container py-10 lg:py-16">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <article class="card-surface p-6 sm:p-8 lg:p-10">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-forest-900/10 pb-5">
              <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-forest-700">Last updated</p>
              <p class="text-[12px] text-muted">{{ lastUpdated }}</p>
              <span class="hidden h-3 w-px bg-forest-900/15 sm:block" aria-hidden="true" />
              <p class="text-[12px] text-muted">Fictional brand · demonstration only</p>
            </div>

            <div class="mt-7 space-y-9">
              <section v-for="section in sections" :id="section.id" :key="section.id" class="scroll-mt-28">
                <h2 class="font-display text-xl font-bold text-ink">{{ section.title }}</h2>
                <div v-if="section.paragraphs" class="mt-3 space-y-3">
                  <p v-for="(paragraph, index) in section.paragraphs" :key="index" class="text-[13.5px] leading-7 text-ink-soft">
                    {{ paragraph }}
                  </p>
                </div>
                <ul v-if="section.bullets" class="mt-3 space-y-2">
                  <li v-for="(bullet, index) in section.bullets" :key="index" class="flex gap-2.5 text-[13px] leading-6 text-ink-soft">
                    <UIcon name="i-lucide-minus" class="mt-2.5 size-3 shrink-0 text-forest-600" aria-hidden="true" />
                    <span>{{ bullet }}</span>
                  </li>
                </ul>
              </section>
            </div>

            <div class="mt-10 rounded-xl border border-forest-900/10 bg-cream-deep/60 p-4">
              <div class="flex items-start gap-2.5">
                <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden="true" />
                <p class="text-[12px] leading-6 text-ink-soft">
                  <strong class="font-semibold text-ink">Plain-language summary:</strong>
                  nothing here is for sale, no price is final, the calculator is an estimate, and no real installation or payment can be arranged through this demo.
                </p>
              </div>
            </div>
          </article>

          <aside class="space-y-4 lg:sticky lg:top-24">
            <nav aria-labelledby="terms-contents" class="card-surface p-4">
              <h2 id="terms-contents" class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">On this page</h2>
              <ol class="mt-3 space-y-1">
                <li v-for="section in sections" :key="section.id">
                  <a :href="`#${section.id}`" class="block rounded-lg px-2 py-1.5 text-[11px] leading-4 text-muted transition-colors hover:bg-forest-50 hover:text-forest-800">
                    {{ section.title }}
                  </a>
                </li>
              </ol>
            </nav>

            <div class="rounded-2xl bg-forest-950 p-4 text-cream">
              <UIcon name="i-lucide-file-text" class="size-5 text-solar-300" aria-hidden="true" />
              <p class="mt-2 font-display text-[15px] font-bold text-cream">Related reading</p>
              <div class="mt-2 space-y-2">
                <NuxtLink to="/privacy" class="flex items-center justify-between gap-2 text-[10.5px] font-medium text-cream/70 hover:text-solar-300">
                  Privacy notice
                  <UIcon name="i-lucide-arrow-up-right" class="size-3" aria-hidden="true" />
                </NuxtLink>
                <NuxtLink to="/faq" class="flex items-center justify-between gap-2 text-[10.5px] font-medium text-cream/70 hover:text-solar-300">
                  Frequently asked questions
                  <UIcon name="i-lucide-arrow-up-right" class="size-3" aria-hidden="true" />
                </NuxtLink>
                <NuxtLink to="/contact" class="flex items-center justify-between gap-2 text-[10.5px] font-medium text-cream/70 hover:text-solar-300">
                  Contact the demo team
                  <UIcon name="i-lucide-arrow-up-right" class="size-3" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
