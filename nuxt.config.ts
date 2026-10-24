export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'sungrid-color-mode',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-NG' },
      titleTemplate: '%s · SunGrid Energy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b3b2c' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://sungrid.example.com',
      whatsappNumber: '2347045033528',
      phoneNumber: '+234 704 503 3528',
      contactEmail: 'hello@sungrid.example.com',
      demoMode: true,
    },
  },
})
