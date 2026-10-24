<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')

usePageMeta({
  title: 'Solar power systems for Nigerian homes & businesses',
  description:
    'SunGrid Energy designs solar systems, inverters, battery storage and installation services for Nigerian homes, businesses and industry. Get an honest, load-first preliminary design and quote.',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            url: siteUrl,
            name: 'SunGrid Energy',
            description:
              'Solar power systems, storage and installation services for Nigerian homes, businesses and industry.',
            inLanguage: 'en-NG',
          },
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'SunGrid Energy',
            url: siteUrl,
            description:
              'Solar system design, equipment supply and installation for residential, commercial and industrial customers in Nigeria.',
            areaServed: 'Nigeria',
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <HeroSection />
    <TrustStrip />
    <SolutionsGrid />
    <FeaturedProducts />
    <HowItWorks />
    <FeaturedProjects />
    <WhySection />
    <CalculatorTeaser />
    <ResourcesPreview />
    <FinalCta />
  </div>
</template>
