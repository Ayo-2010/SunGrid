<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

useSeoMeta({ title: 'Page not found', robots: 'noindex' })

const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex flex-1 items-center py-20">
      <div class="page-container">
        <div class="mx-auto max-w-xl text-center">
          <p class="font-display text-[7rem] font-extrabold leading-none tracking-tighter text-forest-900/10">
            {{ error.statusCode }}
          </p>
          <h1 class="display-title -mt-8 text-3xl text-ink sm:text-4xl">
            {{ is404 ? 'This page could not be found' : 'Something went wrong' }}
          </h1>
          <p class="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
            {{ is404
              ? 'The page may have moved, or the link may be incorrect. Try the catalogue, solutions or contact page.'
              : 'An unexpected error occurred. Please try again, or contact us if the problem continues.' }}
          </p>
          <div class="mt-7 flex flex-wrap justify-center gap-2.5">
            <AppButton to="/" icon="i-lucide-house">Back to home</AppButton>
            <AppButton to="/products" variant="outline">Browse products</AppButton>
            <AppButton to="/contact" variant="ghost">Contact us</AppButton>
          </div>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
