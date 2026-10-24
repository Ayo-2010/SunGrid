<script setup lang="ts">
import { expertise, processSteps, site, teamRoles, values } from '~/data/site'

usePageMeta({
  title: 'About SunGrid Energy',
  description:
    'SunGrid Energy designs and installs solar systems for Nigerian homes and businesses with load-first engineering, honest assumptions and after-sales support.',
  image: '/images/electrician.jpg',
})

const deliverySteps = [
  'Initial consultation',
  'Energy audit',
  'Site inspection',
  'System design',
  'Equipment supply',
  'Installation',
  'Testing & commissioning',
  'Customer handover',
  'Ongoing maintenance',
]

const coverageGroups = [
  { region: 'South West', states: ['Lagos', 'Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti'] },
  { region: 'Federal Capital & North Central', states: ['FCT — Abuja', 'Nasarawa', 'Niger', 'Kwara', 'Kogi', 'Benue', 'Plateau'] },
  { region: 'South South', states: ['Rivers', 'Delta', 'Edo', 'Akwa Ibom', 'Cross River', 'Bayelsa'] },
  { region: 'South East', states: ['Enugu', 'Anambra', 'Abia', 'Imo', 'Ebonyi'] },
  { region: 'North West', states: ['Kano', 'Kaduna', 'Katsina', 'Kebbi', 'Sokoto', 'Jigawa', 'Zamfara'] },
  { region: 'North East', states: ['Bauchi', 'Gombe', 'Adamawa', 'Taraba', 'Borno', 'Yobe'] },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="About SunGrid Energy"
      title="Solar systems built on evidence, not slogans."
      description="We are a Nigerian renewable energy company focused on solar power, storage and installation for homes, businesses and industry. Our work starts with a load assessment and ends with a system you can operate and maintain."
      :breadcrumbs="[{ label: 'About Us' }]"
    >
      <template #actions>
        <AppButton to="/quote" icon-right="i-lucide-arrow-up-right">Start a consultation</AppButton>
        <AppButton to="/projects" variant="on-dark">See demonstration projects</AppButton>
      </template>
    </PageHero>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p class="eyebrow">Who we are</p>
            <h2 class="display-title mt-4 text-3xl text-ink sm:text-4xl">
              A practical partner for an unreliable grid.
            </h2>
            <div class="mt-5 space-y-4 text-[14px] leading-7 text-muted">
              <p>
                SunGrid Energy provides solar panels, inverters, batteries and complete installation
                services for Nigerian homes, businesses and industrial facilities. We also support
                customers who already have a system that is underperforming, unsafe or poorly
                documented.
              </p>
              <p>
                Our approach is deliberately conservative. We separate essential loads from optional
                ones, distinguish running watts from start-up surges, and state the assumptions behind
                every battery and array estimate. A smaller system that performs predictably is better
                than a large one that was never engineered.
              </p>
              <p>
                This website is a frontend demonstration. Company history, certifications, team
                profiles and verified project outcomes will be published only when the supporting
                records exist.
              </p>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-forest-900/10 bg-white p-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Primary coverage</p>
                <p class="mt-1.5 text-[13px] font-medium text-ink">Lagos · Abuja · Port Harcourt</p>
                <p class="mt-1 text-[11px] leading-5 text-muted">Other states by arrangement.</p>
              </div>
              <div class="rounded-xl border border-forest-900/10 bg-white p-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Contact</p>
                <a :href="site.phoneHref" class="mt-1.5 block text-[13px] font-medium text-ink hover:text-forest-700">{{ site.phoneDisplay }}</a>
                <p class="mt-1 text-[11px] text-muted">Demo contact details</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="overflow-hidden rounded-2xl border border-forest-900/10">
              <img
                src="/images/worker-roof.jpg"
                alt="Technician in a hard hat working on an electrical installation"
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
                class="aspect-[4/3.5] w-full object-cover"
              />
            </div>
            <div class="absolute -bottom-4 left-4 right-8 rounded-xl border border-forest-900/10 bg-white p-4 shadow-soft sm:left-8">
              <div class="flex items-center gap-3">
                <span class="grid size-9 place-items-center rounded-full bg-solar-400/20 text-forest-800">
                  <UIcon name="i-lucide-hard-hat" class="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p class="text-[11px] font-semibold text-ink">Installation and handover</p>
                  <p class="text-[10.5px] text-muted">Testing, labelling and a walkthrough before we leave.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-forest-950 py-14 text-cream sm:py-16">
      <div class="page-container grid gap-8 md:grid-cols-2">
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-solar-300">Our mission</p>
          <h2 class="mt-3 font-display text-2xl font-bold text-cream">
            Make dependable power easier to understand and safer to own.
          </h2>
          <p class="mt-3 text-[13px] leading-6 text-cream/60">
            We do that by designing around real loads, explaining the trade-offs and refusing to sell
            equipment that the site or the budget cannot support responsibly.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-solar-300">Our vision</p>
          <h2 class="mt-3 font-display text-2xl font-bold text-cream">
            A market where solar promises are backed by engineering records.
          </h2>
          <p class="mt-3 text-[13px] leading-6 text-cream/60">
            We want customers to ask better questions — about surge loads, battery chemistry,
            protection and warranty conditions — and get straight answers.
          </p>
        </div>
      </div>
    </section>

    <section class="section-pad bg-white">
      <div class="page-container">
        <SectionHeading
          eyebrow="What we value"
          title="Values that show up in the installation, not just the brochure."
          align="center"
        />
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="value in values" :key="value.title" class="rounded-2xl border border-forest-900/[0.09] bg-cream/60 p-5 sm:p-6">
            <span class="grid size-10 place-items-center rounded-xl bg-white text-forest-800 shadow-sm">
              <UIcon :name="value.icon" class="size-5" aria-hidden="true" />
            </span>
            <h3 class="mt-4 font-display text-[16px] font-bold text-ink">{{ value.title }}</h3>
            <p class="mt-2 text-[12.5px] leading-6 text-muted">{{ value.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad border-y border-forest-900/[0.07] bg-[#f4f0e6]">
      <div class="page-container">
        <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Technical expertise"
              title="What we actually do."
              description="The scope of work we can take responsibility for — from first measurement to scheduled maintenance."
            />
            <div class="mt-6 rounded-xl border border-forest-900/10 bg-white p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">Credentials</p>
              <p class="mt-2 text-[11.5px] leading-5 text-muted">
                Certifications, registrations and manufacturer authorisations will be published here
                once verified. This prototype does not claim any.
              </p>
            </div>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="item in expertise" :key="item.title" class="rounded-xl border border-forest-900/10 bg-white p-4">
              <h3 class="text-[13px] font-semibold text-ink">{{ item.title }}</h3>
              <p class="mt-1.5 text-[11.5px] leading-5 text-muted">{{ item.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <SectionHeading
          eyebrow="Our process"
          title="A delivery process with handover built in."
          description="The four commercial steps below are supported by a nine-stage delivery workflow. Timelines depend on site conditions, equipment availability and project scope."
        />

        <div class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="step in processSteps" :key="step.step" class="rounded-2xl border border-forest-900/10 bg-white p-5">
            <div class="flex items-center justify-between">
              <span class="font-display text-2xl font-extrabold text-forest-900/15">{{ step.step }}</span>
              <UIcon :name="step.icon" class="size-4 text-forest-600" aria-hidden="true" />
            </div>
            <h3 class="mt-5 text-[13px] font-semibold text-ink">{{ step.title }}</h3>
            <p class="mt-1.5 text-[11.5px] leading-5 text-muted">{{ step.body }}</p>
          </div>
        </div>

        <div class="mt-8 rounded-2xl border border-forest-900/10 bg-white p-5 sm:p-6">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Detailed delivery stages</p>
          <ol class="mt-4 grid gap-x-6 gap-y-3 text-[12px] text-ink-soft sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="(step, index) in deliverySteps" :key="step" class="flex items-center gap-2.5">
              <span class="grid size-5 shrink-0 place-items-center rounded-full bg-forest-50 text-[9px] font-bold text-forest-800">
                {{ index + 1 }}
              </span>
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section-pad bg-white">
      <div class="page-container">
        <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The team"
              title="Named profiles, once they are approved."
              description="We have not published individual names or photographs in this prototype. The role groups below describe who handles what."
            />
            <div class="mt-6 space-y-3">
              <div v-for="role in teamRoles" :key="role.role" class="flex items-start gap-3 rounded-xl border border-forest-900/10 bg-cream/60 p-4">
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-forest-700">
                  <UIcon :name="role.icon" class="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p class="text-[12.5px] font-semibold text-ink">{{ role.role }}</p>
                  <p class="mt-0.5 text-[11.5px] leading-5 text-muted">{{ role.body }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Service coverage"
              title="Where we plan to work."
              description="Coverage is concentrated in three primary regions, with mobilisation to other states by arrangement."
            />
            <div class="mt-6 grid gap-2.5 sm:grid-cols-2">
              <div v-for="group in coverageGroups" :key="group.region" class="rounded-xl border border-forest-900/10 bg-cream/60 p-3.5">
                <p class="text-[10.5px] font-semibold text-forest-900">{{ group.region }}</p>
                <p class="mt-1 text-[10.5px] leading-4 text-muted">{{ group.states.join(' · ') }}</p>
              </div>
            </div>
            <div class="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p class="text-[11px] leading-5 text-amber-950/80">
                {{ site.serviceNote }} Travel and mobilisation may affect pricing outside primary areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
