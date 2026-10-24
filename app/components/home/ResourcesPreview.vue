<script setup lang="ts">
import { articles } from '~/data/articles'

const latest = articles.slice(0, 3)
</script>

<template>
  <section class="section-pad bg-cream">
    <div class="page-container">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Resources"
          title="Understand the system before you buy it."
          description="Practical guides on sizing, costs, batteries and maintenance — written for Nigerian conditions and the questions customers actually ask."
        />
        <AppButton to="/resources" variant="outline" class="shrink-0" icon-right="i-lucide-arrow-right">
          All resources
        </AppButton>
      </div>

      <div class="mt-9 grid gap-5 md:grid-cols-3">
        <NuxtLink
          v-for="article in latest"
          :key="article.slug"
          :to="`/resources/${article.slug}`"
          class="group overflow-hidden rounded-2xl border border-forest-900/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
        >
          <div class="aspect-[16/10] overflow-hidden">
            <img
              :src="article.image"
              :alt="article.imageAlt"
              width="1200"
              height="750"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
          <div class="p-5">
            <div class="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              <span class="text-forest-700">{{ article.category }}</span>
              <span class="size-0.5 rounded-full bg-muted/60" aria-hidden="true" />
              <span>{{ article.readingTime }} min read</span>
            </div>
            <h3 class="mt-2.5 font-display text-[16px] font-bold leading-snug text-ink group-hover:text-forest-800">
              {{ article.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-[12.5px] leading-5 text-muted">{{ article.excerpt }}</p>
            <span class="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-forest-800">
              Read article
              <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
