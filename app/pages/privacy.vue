<script setup lang="ts">
import { site } from '~/data/site'

usePageMeta({
  title: 'Privacy notice',
  description:
    'How this SunGrid Energy demonstration website handles form data, browser storage and third-party requests. This is a demo notice, not a legal policy for a live business.',
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
    id: 'scope',
    title: '1. About this notice',
    paragraphs: [
      'This is a demonstration website built to show how a solar energy company could present its products and services. It has no backend, database, account system or payment provider. This notice explains what happens to information you type into the demo and what remains in your browser.',
      'SunGrid Energy Ltd. is a placeholder business identity used for the demo. The contact details on this site are not monitored. Replace this notice with a reviewed policy, and insert the real company name, registration details and contact information, before using the site commercially.',
    ],
  },
  {
    id: 'data',
    title: '2. Information you enter',
    paragraphs: [
      'The quote form, contact form, installation form and service enquiry form ask for details such as your name, phone number, email address, location, project description and budget range. The quote form can also record the name, size and type of any file you attach.',
      'In this demo, that information is written to your browser’s local storage. It is not transmitted to a server, emailed to anyone, or added to a CRM. File contents are never read or uploaded; only the file name, size and type are recorded so the interface can show an attachment.',
      'Because the data stays in your browser, anyone with access to this browser profile may be able to read it. Do not enter real personal, financial or sensitive information into this demo.',
    ],
  },
  {
    id: 'storage',
    title: '3. Browser storage used',
    paragraphs: [
      'The demo uses local storage and session storage for the following purposes. You can clear all of it through your browser’s site-data settings.',
    ],
    bullets: [
      'Enquiry list — the products you add to a quote request (session storage, cleared when the tab closes).',
      'Product comparison — up to four products selected for comparison (session storage).',
      'Calculator brief — the sizing summary you choose to carry into the quote form (session storage).',
      'Demo enquiries — quote requests submitted through the demo, so the admin dashboard can show them (local storage).',
      'Demo messages — contact, installation and service enquiries, visible in the admin content inbox (local storage).',
      'Admin workspace — demo records, notes, status changes and catalogue edits made in the dashboard (local storage).',
      'Colour preference — the selected light theme setting (local storage).',
    ],
  },
  {
    id: 'cookies',
    title: '4. Cookies and analytics',
    paragraphs: [
      'This demo does not set advertising cookies and does not include an analytics, session-recording or heat-mapping tool. It does not use a consent banner because it does not run non-essential tracking.',
      'The site loads Inter and Plus Jakarta Sans from Google Fonts. That request shares your IP address and basic browser information with Google, as any external font request does. If you deploy this site, consider self-hosting the fonts to avoid that third-party request.',
      'Links to WhatsApp, telephone numbers and email addresses take you to third-party services. Their privacy practices apply once you leave this site.',
    ],
  },
  {
    id: 'use',
    title: '5. How demo information is used',
    paragraphs: [
      'Information entered in the demo is used only to render the interface: to prefill a quote request, display an enquiry in the admin dashboard, or show a success state. No profiling, marketing, automated decision-making or sale of data takes place.',
      'The admin dashboard is an unprotected prototype. It has no authentication, so do not treat anything in it as private or production-ready.',
    ],
  },
  {
    id: 'retention',
    title: '6. Retention and deletion',
    paragraphs: [
      'Demo data remains in your browser until you clear it. Use your browser’s “clear site data” option, or the reset controls where provided, to remove it. Because nothing is sent to a server, there is no server-side copy to delete.',
      'If this site is later connected to a backend, this notice must be replaced with a policy that explains retention periods, lawful basis, processors, cross-border transfers and how to exercise your rights under the Nigeria Data Protection Act and other applicable law.',
    ],
  },
  {
    id: 'rights',
    title: '7. Your choices',
    bullets: [
      'You can use the catalogue, calculator and most pages without submitting a form.',
      'You can clear browser storage at any time to remove demo submissions and saved lists.',
      'You can avoid external requests by blocking Google Fonts or using a browser that does not load them.',
      'You can contact the placeholder address below with questions, but expect no response — it is a demo identity.',
    ],
  },
  {
    id: 'children',
    title: '8. Children',
    paragraphs: [
      'The site is intended for adults researching solar equipment and services. It does not knowingly collect information from children. The demo forms should not be used by children.',
    ],
  },
  {
    id: 'changes',
    title: '9. Changes to this notice',
    paragraphs: [
      'This notice may be updated as the demo develops. The date at the top shows the current version. Material changes should be highlighted before a production launch.',
    ],
  },
  {
    id: 'contact',
    title: '10. Contact',
    paragraphs: [
      `Questions about this demo can be addressed to ${site.email}. The registered address is a placeholder and appears on the contact page. No correspondence will be monitored.`,
    ],
  },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Legal"
      title="Privacy notice"
      description="What this demonstration site does with the information you type, where it is stored, and what it deliberately does not do."
      :breadcrumbs="[{ label: 'Privacy' }]"
      size="compact"
    >
      <template #actions>
        <AppBadge tone="warning">Demo notice — not a production policy</AppBadge>
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
              <p class="text-[12px] text-muted">Applies to this demonstration website only</p>
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
                    <UIcon name="i-lucide-check" class="mt-1 size-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                    <span>{{ bullet }}</span>
                  </li>
                </ul>
              </section>
            </div>

            <div class="mt-10 rounded-xl border border-amber-300/60 bg-amber-50 p-4">
              <div class="flex items-start gap-2.5">
                <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0 text-amber-800" aria-hidden="true" />
                <p class="text-[12px] leading-6 text-amber-950">
                  <strong class="font-semibold">Do not enter real personal data.</strong>
                  This notice is a demonstration artefact, not legal advice. A production launch needs a reviewed privacy policy, a lawful basis for processing, processor agreements and a working route for data-subject requests.
                </p>
              </div>
            </div>
          </article>

          <aside class="space-y-4 lg:sticky lg:top-24">
            <nav aria-labelledby="privacy-contents" class="card-surface p-4">
              <h2 id="privacy-contents" class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">On this page</h2>
              <ol class="mt-3 space-y-1">
                <li v-for="section in sections" :key="section.id">
                  <a :href="`#${section.id}`" class="block rounded-lg px-2 py-1.5 text-[11px] leading-4 text-muted transition-colors hover:bg-forest-50 hover:text-forest-800">
                    {{ section.title }}
                  </a>
                </li>
              </ol>
            </nav>

            <div class="rounded-2xl bg-forest-950 p-4 text-cream">
              <UIcon name="i-lucide-shield-check" class="size-5 text-solar-300" aria-hidden="true" />
              <p class="mt-2 font-display text-[15px] font-bold text-cream">No backend, no account</p>
              <p class="mt-1 text-[10.5px] leading-5 text-cream/55">
                Forms store their contents in this browser. Nothing is emailed, uploaded or saved to a server.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
