import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  console.log('Runtime config', useRuntimeConfig().public.my)
})
