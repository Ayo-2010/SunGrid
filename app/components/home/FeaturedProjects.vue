<script setup lang="ts">
import { demoProjectNotice, projects } from '~/data/projects'

const showcase = projects.slice(0, 3)
</script>

<template>
  <section class="section-pad bg-cream">
    <div class="page-container">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Projects"
          title="Demonstration case studies, not bragging rights."
          description="These sample records show how we document a challenge, a proposed solution and the limits of what can be claimed without measurement."
        />
        <AppButton to="/projects" variant="outline" class="shrink-0" icon-right="i-lucide-arrow-right">
          All projects
        </AppButton>
      </div>

      <div class="mt-9 grid gap-5 md:grid-cols-3">
        <NuxtLink
          v-for="project in showcase"
          :key="project.slug"
          :to="`/projects/${project.slug}`"
          class="group overflow-hidden rounded-2xl border border-forest-900/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
        >
          <div class="relative aspect-[4/3] overflow-hidden">
            <img
              :src="project.image"
              :alt="project.imageAlt"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div class="absolute left-3 top-3 flex gap-1.5">
              <AppBadge tone="forest">{{ toTitleCase(project.category) }}</AppBadge>
              <AppBadge tone="solar">Demo</AppBadge>
            </div>
          </div>
          <div class="p-5">
            <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
              <UIcon name="i-lucide-map-pin" class="size-3.5 text-solar-500" aria-hidden="true" />
              {{ project.location }}
            </p>
            <h3 class="mt-2 font-display text-[17px] font-bold leading-snug text-ink group-hover:text-forest-800">
              {{ project.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-[12.5px] leading-5 text-muted">{{ project.summary }}</p>
            <div class="mt-4 flex items-center justify-between border-t border-forest-900/[0.07] pt-3 text-[11.5px]">
              <span class="font-semibold text-forest-800">{{ project.capacity }}</span>
              <span class="text-muted">{{ project.battery }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-5 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3">
        <UIcon name="i-lucide-flask-conical" class="mt-0.5 size-4 shrink-0 text-amber-800" aria-hidden="true" />
        <p class="text-[10.5px] leading-5 text-amber-950/70">{{ demoProjectNotice }}</p>
      </div>
    </div>
  </section>
</template>
