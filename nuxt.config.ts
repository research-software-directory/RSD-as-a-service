/// //////////////////////////////////////////////
// Site config
// Domain where the website will be deployed
const productionUrl = 'MY-APP-DOMAIN.netlify.app'
const useLocalSupabase = false
const siteName = 'Ctw Nuxt Basis - Template'
// const siteShortName = 'Nuxt Template'
const siteDescription = 'Ctw Nuxt base template with TailwindCss, content RSS, Supabase Auth, Composition API and many other goodies'
const twitterUser = '@ctwhome'
// const isGithubPages = false // true if deployed to github pages
// const githubRepositoryName = 'nuxt'
/// //////////////////////////////////////////////
const isDev = process.env.NODE_ENV === 'development'

export default {
  // Environment variables
  env: {
    supabaseUrl: isDev && useLocalSupabase ? 'http://localhost:8000' : process.env.VITE_SUPABASE_URL,
    supabaseKey: isDev && useLocalSupabase
      // super-secret-jwt-token-with-at-least-32-characters-long
      ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJhdWQiOiIiLCJzdWIiOiIiLCJSb2xlIjoicG9zdGdyZXMifQ.magCcozTMKNrl76Tj2dsM7XTl_YH0v0ilajzAvIlw3U'
      : process.env.VITE_SUPABASE_KEY
  },

  // Debug local server from outside
  server: {
    host: '0' // default: localhost
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'RSD',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      // OG Social Media Cards
      { hid: 'description', name: 'description', content: siteDescription },
      { property: 'og:site_name', content: siteName },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: `https://${productionUrl}` },
      { hid: 'og:title', property: 'og:title', content: siteName },
      { hid: 'og:description', property: 'og:description', content: siteDescription },
      { hid: 'og:image', property: 'og:image', content: `https://${productionUrl}/OG-card.png` },
      { property: 'og:image:width', content: '740' },
      { property: 'og:image:height', content: '300' },
      { name: 'twitter:site', content: twitterUser },
      { name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:url', name: 'twitter:url', content: `https://${productionUrl}` },
      { hid: 'twitter:title', name: 'twitter:title', content: siteName },
      { hid: 'twitter:description', name: 'twitter:description', content: siteDescription },
      { hid: 'twitter:image', name: 'twitter:image', content: `https://${productionUrl}/OG-card.png` }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    htmlAttrs: {
      'data-theme': 'light' // https://daisyui.com/docs/default-themes
    }

  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/supabase', ssr: false }
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // we disable the type check and left it to `vue-tsc`
    ['@nuxt/typescript-build', { typeCheck: false }],
    'unplugin-icons/nuxt',
    // @vue/composition-api support,
    // which ships the `<script setup>` transformer out-of-box
    '@nuxtjs/composition-api/module',
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
