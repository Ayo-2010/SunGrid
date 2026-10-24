<script setup lang="ts">
import { footerLinks, site } from '~/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative overflow-hidden bg-forest-950 text-cream">
    <div class="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
    <div class="page-container relative">
      <div class="grid gap-12 border-b border-white/10 py-14 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8 lg:py-16">
        <div class="max-w-sm">
          <LogoMark variant="light" />
          <p class="mt-5 font-display text-lg font-semibold leading-snug text-cream">
            Reliable power. Brighter possibilities.
          </p>
          <p class="mt-3 text-[13px] leading-6 text-cream/60">
            Solar systems, storage and installation services designed around how Nigerian homes and
            businesses actually use power.
          </p>

          <div class="mt-6 space-y-2.5 text-[13px]">
            <a :href="site.phoneHref" class="flex items-center gap-2.5 text-cream/75 transition-colors hover:text-solar-300">
              <UIcon name="i-lucide-phone" class="size-4 text-solar-400/80" aria-hidden="true" />
              {{ site.phoneDisplay }}
            </a>
            <a :href="`mailto:${site.email}`" class="flex items-center gap-2.5 text-cream/75 transition-colors hover:text-solar-300">
              <UIcon name="i-lucide-mail" class="size-4 text-solar-400/80" aria-hidden="true" />
              {{ site.email }}
            </a>
            <p class="flex items-start gap-2.5 text-cream/60">
              <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0 text-solar-400/80" aria-hidden="true" />
              <span>{{ site.address.line1 }}, {{ site.address.line2 }}</span>
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cream/45">Solutions</h2>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in footerLinks.solutions" :key="link.to">
              <NuxtLink :to="link.to" class="text-[13px] text-cream/70 transition-colors hover:text-solar-300">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cream/45">Company</h2>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in footerLinks.company" :key="link.to">
              <NuxtLink :to="link.to" class="text-[13px] text-cream/70 transition-colors hover:text-solar-300">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cream/45">Tools & help</h2>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in footerLinks.tools" :key="link.to">
              <NuxtLink :to="link.to" class="text-[13px] text-cream/70 transition-colors hover:text-solar-300">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <p class="text-[11px] font-semibold text-cream/85">Business hours</p>
            <p class="mt-1.5 text-[11px] leading-5 text-cream/55">Mon–Fri 8:30–17:30<br />Sat 9:00–14:00</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 border-b border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cream/40">Service coverage</p>
          <div class="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[11.5px] text-cream/55">
            <span v-for="state in site.serviceAreas" :key="state">{{ state }}</span>
            <span class="text-cream/35">and other states by arrangement</span>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a
            :href="`https://wa.me/${site.whatsappNumber}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[12px] font-medium text-cream/80 transition-colors hover:border-solar-400/40 hover:text-solar-300"
          >
            <UIcon name="i-lucide-message-circle" class="size-4" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            :href="`mailto:${site.email}`"
            class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[12px] font-medium text-cream/80 transition-colors hover:border-solar-400/40 hover:text-solar-300"
          >
            <UIcon name="i-lucide-mail" class="size-4" aria-hidden="true" />
            Email us
          </a>
          <NuxtLink
            to="/quote"
            class="inline-flex items-center gap-2 rounded-full bg-solar-400 px-3.5 py-2 text-[12px] font-semibold text-forest-950 transition-colors hover:bg-solar-300"
          >
            Request a quote
            <UIcon name="i-lucide-arrow-right" class="size-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>

      <div class="py-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-2xl space-y-2">
            <p class="text-[11px] leading-5 text-cream/40">
              © {{ year }} {{ site.legalName }}. All rights reserved. Company name and contact details
              are placeholders for this demonstration.
            </p>
            <p class="rounded-lg border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2 text-[10.5px] leading-4 text-amber-100/60">
              Frontend demonstration. Product data, project records, testimonials (none published) and
              contact details are illustrative. No enquiry is transmitted to a backend, and no payment
              is processed by this site.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-cream/50">
            <NuxtLink to="/privacy" class="transition-colors hover:text-cream">Privacy</NuxtLink>
            <NuxtLink to="/terms" class="transition-colors hover:text-cream">Terms</NuxtLink>
            <NuxtLink to="/faq" class="transition-colors hover:text-cream">FAQs</NuxtLink>
            <NuxtLink to="/admin" class="transition-colors hover:text-cream">Staff demo</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
