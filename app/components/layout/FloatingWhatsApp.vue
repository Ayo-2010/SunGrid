<script setup lang="ts">
import { site } from '~/data/site'

const href = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  'Hello SunGrid Energy, I would like to discuss a solar system.',
)}`
</script>

<template>
  <div class="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
    <a
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      class="group flex items-center gap-2.5 rounded-full border border-forest-900/10 bg-white py-2 pl-2 pr-4 shadow-lift transition-transform duration-200 hover:-translate-y-0.5"
      aria-label="Chat with SunGrid Energy on WhatsApp (opens in a new tab)"
    >
      <span class="relative grid size-9 place-items-center rounded-full bg-[#25D366] text-white">
        <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
          <path
            d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
          />
          <path
            d="M12.05 2.05a9.9 9.9 0 0 0-8.4 15.18L2.1 22l4.9-1.53a9.87 9.87 0 0 0 5.05 1.38h.01a9.94 9.94 0 0 0 0-19.8Zm5.85 15.7a8.24 8.24 0 0 1-5.85 2.42 8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.97.99-3.03-.2-.31a8.23 8.23 0 1 1 12.64 1.27Z"
          />
        </svg>
        <span class="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-green-500" aria-hidden="true" />
      </span>
      <span class="hidden text-[12px] font-semibold text-forest-950 sm:block">Chat with us</span>
    </a>
  </div>
</template>
