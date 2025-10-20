import { tryUseNuxt } from "@nuxt/kit"

export const someFeature = (meta) => {
    const nuxt = tryUseNuxt()
    if (nuxt) {
        console.log(nuxt.options.runtimeConfig, meta)
    }
}