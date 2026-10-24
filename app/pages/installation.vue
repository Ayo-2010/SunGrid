<script setup lang="ts">
import { processSteps, site } from '~/data/site'

usePageMeta({
  title: 'Solar installation and maintenance services',
  description:
    'Installation, commissioning, upgrades, fault diagnosis and maintenance for solar and storage systems in Nigeria. Documented handover and safety-led workmanship.',
  image: '/images/worker-roof.jpg',
})

const services = [
  {
    title: 'New system installation',
    body: 'Roof or ground mounting, DC and AC wiring, protection, earthing, changeover and commissioning for residential and commercial systems.',
    icon: 'i-lucide-hard-hat',
  },
  {
    title: 'Upgrades and expansion',
    body: 'Add battery capacity, increase array size or move essential circuits onto a backup board without compromising the existing installation.',
    icon: 'i-lucide-plug-zap',
  },
  {
    title: 'Fault diagnosis and repair',
    body: 'Structured troubleshooting for underperforming arrays, inverter faults, battery communication errors and repeated breaker trips.',
    icon: 'i-lucide-wrench',
  },
  {
    title: 'Preventive maintenance',
    body: 'Inspection of terminations, torque checks, cleaning where safe, firmware review, battery health and performance records.',
    icon: 'i-lucide-calendar-check',
  },
  {
    title: 'Energy audits',
    body: 'Appliance-level measurement and load profiling to establish what a system actually needs to carry — before equipment is ordered.',
    icon: 'i-lucide-gauge',
  },
  {
    title: 'Relocation and decommissioning',
    body: 'Safe isolation, dismantling, transport and reinstallation of existing equipment, subject to condition and compatibility checks.',
    icon: 'i-lucide-package-open',
  },
]

const qualityChecks = [
  'Load schedule and diversity assumptions agreed before ordering',
  'Roof condition, fixing method and waterproofing reviewed',
  'String voltage and current checked against inverter MPPT limits',
  'DC isolators, fuses, SPDs and AC protection correctly rated',
  'Earthing and bonding verified and documented',
  'Cable routes protected, supported and labelled at both ends',
  'Terminations torqued to manufacturer specification',
  'Insulation resistance, polarity and continuity tests recorded',
  'Battery BMS communication and charge profile verified',
  'Changeover, backup circuits and generator integration tested',
  'Owner walkthrough, isolation procedure and documentation handover',
  'Maintenance schedule and support route explained in writing',
]

const exclusions = [
  'Structural roof repairs or building works',
  'Planning permits and statutory approvals',
  'Generator servicing or mechanical repairs',
  'Rewiring an unsafe existing installation beyond the agreed scope',
  'Landscaping, trenching beyond the quoted route, or estate access fees',
]

const stages = [
  { step: '01', title: 'Assess', body: 'Load measurement, roof/site inspection, distribution board review and photographs.' },
  { step: '02', title: 'Design', body: 'Equipment selection, string design, protection schedule and a fixed-scope proposal.' },
  { step: '03', title: 'Prepare', body: 'Confirm access, delivery, storage, isolation windows and site readiness.' },
  { step: '04', title: 'Install', body: 'Mounting, wiring, protection, labelling and making good, with daily site checks.' },
  { step: '05', title: 'Commission', body: 'Test, measure, configure and verify backup, generation and changeover behaviour.' },
  { step: '06', title: 'Hand over', body: 'Walkthrough, isolation instructions, documentation and maintenance schedule.' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Installation services"
      title="A system is only as good as its worst termination."
      description="Installation quality decides whether a solar system lasts or becomes a maintenance problem. We plan the mounting, protection, cabling and handover before a single panel goes on the roof."
      :breadcrumbs="[{ label: 'Installation' }]"
      size="compact"
    >
      <template #actions>
        <AppButton href="#service-form" icon="i-lucide-wrench">Request a service visit</AppButton>
        <AppButton to="/quote" variant="on-dark" icon-right="i-lucide-arrow-right">Quote a new system</AppButton>
      </template>
    </PageHero>

    <section class="border-b border-forest-900/[0.08] bg-cream-deep/50">
      <div class="page-container py-8">
        <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-forest-900/10 bg-white p-4">
              <UIcon name="i-lucide-clipboard-check" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">Documented scope</p>
              <p class="mt-1 text-[10px] leading-4 text-muted">What is included, excluded and still to be confirmed.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-white p-4">
              <UIcon name="i-lucide-shield-check" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">Safety-led work</p>
              <p class="mt-1 text-[10px] leading-4 text-muted">Isolation, earthing, protection and testing before energising.</p>
            </div>
            <div class="rounded-xl border border-forest-900/10 bg-white p-4">
              <UIcon name="i-lucide-book-open-check" class="size-4 text-forest-700" aria-hidden="true" />
              <p class="mt-2 text-[11.5px] font-semibold text-ink">Real handover</p>
              <p class="mt-1 text-[10px] leading-4 text-muted">Controls, isolation and support explained to the owner.</p>
            </div>
          </div>
          <div class="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
            <p class="text-[10.5px] leading-5 text-amber-950/85">
              <strong class="font-semibold">Prototype note:</strong> installation photographs, certifications and project records on this site are illustrative.
              Formal accreditations will be published only when verified.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <SectionHeading
          eyebrow="What we install and fix"
          title="From a first array to a stubborn fault."
          description="The scope covers domestic rooftop systems, commercial three-phase installations, storage retrofits and the unglamorous work of keeping an existing system safe."
        />
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="service in services" :key="service.title" class="rounded-2xl border border-forest-900/10 bg-white p-5">
            <span class="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800">
              <UIcon :name="service.icon" class="size-5" aria-hidden="true" />
            </span>
            <h2 class="mt-4 font-display text-[15px] font-bold text-ink">{{ service.title }}</h2>
            <p class="mt-1.5 text-[11.5px] leading-5 text-muted">{{ service.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad border-y border-forest-900/[0.07] bg-white">
      <div class="page-container">
        <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Method"
              title="Six stages, with evidence at each one."
              description="The exact sequence depends on site conditions, but the handover is never skipped."
            />
            <div class="mt-6 overflow-hidden rounded-2xl border border-forest-900/10">
              <img
                src="/images/install-detail.jpg"
                alt="Technician connecting solar equipment during an installation"
                width="900"
                height="700"
                loading="lazy"
                decoding="async"
                class="aspect-[4/3] w-full object-cover"
              />
              <p class="bg-cream/60 px-3 py-2 text-[9.5px] text-muted">Illustrative photograph. Not a specific SunGrid project.</p>
            </div>
          </div>

          <div class="space-y-2.5">
            <div v-for="stage in stages" :key="stage.step" class="flex gap-4 rounded-xl border border-forest-900/10 bg-cream/50 p-4">
              <span class="font-display text-xl font-extrabold text-forest-900/20">{{ stage.step }}</span>
              <div>
                <p class="text-[12px] font-semibold text-ink">{{ stage.title }}</p>
                <p class="mt-0.5 text-[11px] leading-5 text-muted">{{ stage.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-[#f4f0e6]">
      <div class="page-container">
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Workmanship checklist"
              title="What we check before calling a system complete."
              description="This is not a claim that every step is visible on every job — it is the standard the handover should be measured against."
            />
            <ul class="mt-6 grid gap-2">
              <li v-for="check in qualityChecks" :key="check" class="flex items-start gap-2.5 rounded-lg bg-white/70 px-3 py-2">
                <UIcon name="i-lucide-check" class="mt-0.5 size-3.5 shrink-0 text-forest-700" aria-hidden="true" />
                <span class="text-[11px] leading-5 text-ink-soft">{{ check }}</span>
              </li>
            </ul>
          </div>

          <div>
            <SectionHeading
              eyebrow="Scope boundaries"
              title="Things a solar contract does not automatically cover."
              description="Being explicit about exclusions prevents unpleasant surprises after work begins."
            />
            <div class="mt-6 space-y-2.5">
              <div v-for="item in exclusions" :key="item" class="flex items-start gap-2.5 rounded-xl border border-forest-900/10 bg-white p-4">
                <UIcon name="i-lucide-minus-circle" class="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
                <p class="text-[11.5px] leading-5 text-ink-soft">{{ item }}</p>
              </div>
            </div>
            <div class="mt-5 rounded-xl border border-forest-900/10 bg-forest-950 p-5 text-cream">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-solar-300">Talk to a person</p>
              <p class="mt-2 text-[12px] leading-5 text-cream/70">
                For an existing installation, have the inverter model, battery type and a photo of the distribution board ready.
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <AppButton :href="site.phoneHref" size="sm" icon="i-lucide-phone">Call demo line</AppButton>
                <AppButton href="#service-form" size="sm" variant="on-dark">Use the form</AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="page-container">
        <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Process, from first call"
              title="How an installation usually begins."
              description="A useful first conversation covers the load, the site, the budget and the backup priority. The four-step commercial process is below; the technical stages follow after a site assessment."
            />
            <div class="mt-6 grid gap-2.5 sm:grid-cols-2">
              <div v-for="step in processSteps" :key="step.step" class="rounded-xl border border-forest-900/10 bg-white p-4">
                <div class="flex items-center justify-between">
                  <span class="font-display text-lg font-extrabold text-forest-900/20">{{ step.step }}</span>
                  <UIcon :name="step.icon" class="size-4 text-forest-600" aria-hidden="true" />
                </div>
                <p class="mt-3 text-[12px] font-semibold text-ink">{{ step.title }}</p>
                <p class="mt-1 text-[10.5px] leading-4 text-muted">{{ step.body }}</p>
              </div>
            </div>
            <div class="mt-5 flex flex-wrap gap-2">
              <AppButton to="/projects" variant="outline" size="sm" icon-right="i-lucide-arrow-right">See demonstration projects</AppButton>
              <AppButton to="/faq" variant="ghost" size="sm">Read installation FAQs</AppButton>
            </div>
          </div>

          <div id="service-form" class="scroll-mt-24 rounded-2xl border border-forest-900/10 bg-white p-5 shadow-soft sm:p-7">
            <div class="mb-5 flex items-start justify-between gap-3 border-b border-forest-900/[0.08] pb-4">
              <div>
                <h2 class="font-display text-xl font-bold text-ink">Request an installation or service visit</h2>
                <p class="mt-1 text-[11px] leading-5 text-muted">Demo form · saved in this browser only · no booking is created</p>
              </div>
              <DemoNotice compact label="Demo" detail="No dispatch" />
            </div>
            <ServiceEnquiryForm default-service="New installation" compact />
          </div>
        </div>
      </div>
    </section>

    <FinalCta />
  </div>
</template>
