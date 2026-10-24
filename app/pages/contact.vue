<script setup lang="ts">
import { faqs } from '~/data/faqs'
import { site } from '~/data/site'

usePageMeta({
  title: 'Contact SunGrid Energy',
  description:
    'Talk to the SunGrid Energy team about a solar system, product availability or installation support. Demo contact details and browser-only demo form.',
  image: '/images/meeting.jpg',
})

const supportFaqs = faqs
  .filter((faq) => faq.category === 'Support & warranty' || faq.category === 'Installation')
  .slice(0, 3)

const channels = [
  {
    title: 'Call the demo line',
    value: site.phoneDisplay,
    href: site.phoneHref,
    note: 'Mon–Fri, 8:30–17:30 · Demo number',
    icon: 'i-lucide-phone',
    cta: 'Start a call',
  },
  {
    title: 'WhatsApp',
    value: site.whatsappDisplay,
    href: `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Hello SunGrid Energy, I would like to ask about a solar system.')}`,
    note: 'External link to WhatsApp · Demo number',
    icon: 'i-lucide-message-circle',
    cta: 'Open WhatsApp',
    external: true,
  },
  {
    title: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    note: 'Demo email address — not monitored',
    icon: 'i-lucide-mail',
    cta: 'Compose email',
  },
  {
    title: 'Support',
    value: site.supportEmail,
    href: `mailto:${site.supportEmail}`,
    note: 'For existing installations · Demo only',
    icon: 'i-lucide-headset',
    cta: 'Email support',
  },
]

const coverageGroups = [
  { region: 'Primary coverage', states: ['Lagos', 'FCT — Abuja', 'Rivers (Port Harcourt)'], note: 'Site assessments can be scheduled directly.' },
  { region: 'Secondary coverage', states: ['Oyo', 'Ogun', 'Edo', 'Enugu', 'Kano', 'Kaduna'], note: 'By arrangement; mobilisation may apply.' },
  { region: 'Other states', states: ['All remaining states'], note: 'Assessed case by case before a commitment is made.' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Start with the problem, not the product."
      description="Tell us what is failing, what you want to power or what you are trying to decide. A clear description saves a lot of back-and-forth."
      :breadcrumbs="[{ label: 'Contact' }]"
      size="compact"
    >
      <template #actions>
        <AppButton to="/quote" variant="on-dark" icon-right="i-lucide-arrow-right">Request a quote</AppButton>
        <AppButton href="#contact-form" variant="on-dark" icon="i-lucide-message-square">Send a message</AppButton>
      </template>
    </PageHero>

    <section class="border-b border-forest-900/[0.08] bg-cream-deep/50">
      <div class="page-container py-8">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            v-for="channel in channels"
            :key="channel.title"
            :href="channel.href"
            :target="channel.external ? '_blank' : undefined"
            :rel="channel.external ? 'noopener noreferrer' : undefined"
            class="group rounded-xl border border-forest-900/10 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-forest-900/20 hover:shadow-soft"
          >
            <div class="flex items-center justify-between">
              <span class="grid size-8 place-items-center rounded-lg bg-forest-50 text-forest-700">
                <UIcon :name="channel.icon" class="size-4" aria-hidden="true" />
              </span>
              <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
            <p class="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{{ channel.title }}</p>
            <p class="mt-1 truncate text-[12px] font-semibold text-ink">{{ channel.value }}</p>
            <p class="mt-1 text-[10px] leading-4 text-muted">{{ channel.note }}</p>
          </a>
        </div>
      </div>
    </section>

    <section id="contact-form" class="section-pad bg-cream scroll-mt-24">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Send a message"
              title="A demo form that tells you exactly what it does."
              description="Nothing is transmitted. The message is stored in this browser so the demo dashboard has something real to display."
            />

            <div class="mt-6 space-y-3">
              <div class="rounded-xl border border-forest-900/10 bg-white p-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-forest-700">Office hours</p>
                <dl class="mt-2 space-y-1.5">
                  <div v-for="entry in site.hours" :key="entry.days" class="flex items-baseline justify-between gap-3 text-[11px]">
                    <dt class="text-muted">{{ entry.days }}</dt>
                    <dd class="text-right font-medium text-ink">{{ entry.time }}</dd>
                  </div>
                </dl>
              </div>

              <div class="rounded-xl border border-forest-900/10 bg-white p-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-forest-700">Office</p>
                <p class="mt-2 text-[11.5px] leading-5 text-ink-soft">{{ site.address.line1 }}</p>
                <p class="text-[11.5px] text-muted">{{ site.address.line2 }}</p>
                <p class="mt-1.5 text-[10px] leading-4 text-amber-800">{{ site.address.note }}</p>
              </div>

              <div class="rounded-xl border border-forest-900/10 bg-cream/60 p-4">
                <p class="flex items-start gap-2 text-[10.5px] leading-5 text-muted">
                  <UIcon name="i-lucide-shield-check" class="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden="true" />
                  Please do not send passwords, payment details or personal documents. This demo stores form entries in
                  local browser storage, not in an encrypted database.
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-forest-900/10 bg-white p-5 shadow-soft sm:p-7">
            <div class="mb-5 flex items-start justify-between gap-3 border-b border-forest-900/[0.08] pb-4">
              <div>
                <h2 class="font-display text-lg font-bold text-ink">Message the demo team</h2>
                <p class="mt-0.5 text-[11px] text-muted">Stored in this browser · No email is sent</p>
              </div>
              <DemoNotice compact label="Demo" detail="Browser storage only" />
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>

    <section id="coverage" class="section-pad scroll-mt-24 border-y border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Service coverage"
              title="Where a site visit is realistic."
              description="Coverage is planned around three primary regions, with other states handled case by case. Travel and mobilisation may affect pricing."
            />
            <div class="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p class="flex items-start gap-2 text-[11px] leading-5 text-amber-950/85">
                <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{{ site.serviceNote }}</span>
              </p>
            </div>
            <div class="mt-5 flex flex-wrap gap-2">
              <AppButton to="/quote" size="sm" icon-right="i-lucide-arrow-right">Check my location in a quote</AppButton>
              <AppButton :href="`https://wa.me/${site.whatsappNumber}`" external size="sm" variant="outline" icon="i-lucide-message-circle">Ask on WhatsApp</AppButton>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="group in coverageGroups" :key="group.region" class="rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <div class="flex items-center justify-between gap-3">
                <p class="text-[11.5px] font-semibold text-forest-900">{{ group.region }}</p>
                <AppBadge :tone="group.region === 'Primary coverage' ? 'success' : group.region === 'Secondary coverage' ? 'warning' : 'neutral'">
                  {{ group.region === 'Primary coverage' ? 'Direct' : group.region === 'Secondary coverage' ? 'By arrangement' : 'Case by case' }}
                </AppBadge>
              </div>
              <p class="mt-2 text-[11px] leading-5 text-ink-soft">{{ group.states.join(' · ') }}</p>
              <p class="mt-1 text-[10px] leading-4 text-muted">{{ group.note }}</p>
            </div>
            <p class="px-1 text-[9.5px] leading-4 text-muted">
              Coverage lists are part of this prototype and do not represent a confirmed logistics network.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Before you write"
            title="A few answers may save you a message."
            description="These are the questions we see most often about installation, support and warranty."
          >
            <template #actions>
              <AppButton to="/faq" variant="outline" size="sm" icon-right="i-lucide-arrow-right">All FAQs</AppButton>
            </template>
          </SectionHeading>

          <div class="space-y-2.5">
            <details v-for="faq in supportFaqs" :key="faq.question" class="group rounded-xl border border-forest-900/10 bg-white">
              <summary class="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3.5 text-[12px] font-semibold text-ink marker:hidden">
                {{ faq.question }}
                <UIcon name="i-lucide-plus" class="mt-0.5 size-4 shrink-0 text-muted transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p class="border-t border-forest-900/[0.07] px-4 py-3.5 text-[11.5px] leading-6 text-muted">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
