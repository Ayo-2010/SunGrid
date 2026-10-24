<script setup lang="ts">
const points = [
  {
    title: 'Load schedule before equipment',
    body: 'We list appliances, hours and surge behaviour first. The equipment list follows from the numbers.',
    icon: 'i-lucide-list-checks',
  },
  {
    title: 'Protection is not an optional extra',
    body: 'Earthing, isolation, surge protection and correctly sized cables are included in the scope we quote.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Documented assumptions',
    body: 'You can see what we assumed about sun hours, depth of discharge and system losses — and challenge it.',
    icon: 'i-lucide-file-search',
  },
  {
    title: 'A handover you can use',
    body: 'We explain the controls, label the boards and leave a record of what was installed and why.',
    icon: 'i-lucide-book-open-check',
  },
]
</script>

<template>
  <section class="border-t border-forest-900/[0.07] bg-white">
    <div class="page-container section-pad">
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="relative order-2 lg:order-1">
          <div class="overflow-hidden rounded-[1.5rem] border border-forest-900/10">
            <img
              src="/images/install-detail.jpg"
              alt="Technician connecting solar panels during an installation"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              class="aspect-[5/4] w-full object-cover"
            />
          </div>

          <div class="absolute -bottom-5 right-4 max-w-[260px] rounded-xl border border-forest-900/10 bg-cream p-4 shadow-lift sm:-right-6">
            <p class="text-[9.5px] font-bold uppercase tracking-[0.16em] text-forest-700">Our design standard</p>
            <p class="mt-2 text-[12px] font-medium leading-5 text-ink">
              If we cannot explain the assumption, we do not put it in the proposal.
            </p>
            <div class="mt-3 flex items-center gap-2 border-t border-forest-900/10 pt-2.5">
              <span class="grid size-6 place-items-center rounded-full bg-forest-900 text-solar-300">
                <UIcon name="i-lucide-check" class="size-3" aria-hidden="true" />
              </span>
              <span class="text-[10px] text-muted">Engineering-led proposals</span>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Why SunGrid"
            title="Competence is visible in the details."
            description="Solar is easy to sell with big numbers. It is harder to design a system that is safe, serviceable and honestly described."
          />

          <ul class="mt-8 space-y-5">
            <li v-for="point in points" :key="point.title" class="flex gap-3.5">
              <span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                <UIcon :name="point.icon" class="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 class="text-[13.5px] font-semibold text-ink">{{ point.title }}</h3>
                <p class="mt-1 text-[12.5px] leading-5 text-muted">{{ point.body }}</p>
              </div>
            </li>
          </ul>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <AppButton to="/about" variant="secondary" icon-right="i-lucide-arrow-right">About our approach</AppButton>
            <AppButton to="/installation" variant="ghost">Installation services</AppButton>
          </div>

          <p class="mt-6 flex items-start gap-2 text-[10.5px] leading-4 text-muted/75">
            <UIcon name="i-lucide-info" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
            Certifications, manufacturer partnerships and named team credentials are not published until
            they are verified. We do not use them as decoration.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
