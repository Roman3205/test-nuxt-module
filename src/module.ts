import { defineNuxtModule, addPlugin, createResolver, addComponent, installModule, extendRouteRules, addServerTemplate, addServerHandler, useLogger, addServerPlugin, isNuxtMajorVersion, getNuxtVersion, addImportsDir, extendPages, addLayout } from '@nuxt/kit'
import { someFeature } from './runtime/functions/test'
import {defu} from 'defu';

export interface ModuleOptions {
  enabled: boolean
  test: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
    version: '0.0.1',
  },
  hooks: {
    'modules:done': () => {
      console.log('My module is ready!')
    },
  },
  onInstall() {
    console.log('My module has been installed!')
  },
  defaults: {
    enabled: true,
  },
  async setup(_options, _nuxt) {
    if (!_options.enabled || !isNuxtMajorVersion(4)) {
      return
    }

    const resolver = createResolver(import.meta.url)
    _nuxt.options.css.push(resolver.resolve('./runtime/assets/css/main.css'))
    _nuxt.options.runtimeConfig.public.my = defu(_nuxt.options.runtimeConfig.public.my, {test: _options.test})
    const logger = useLogger('my-module')
    logger.info(getNuxtVersion(_nuxt))

    await installModule('@nuxt/ui')
    addPlugin({src: resolver.resolve('./runtime/plugin.ts'), mode: 'all'})
    addComponent({
      filePath: resolver.resolve('./runtime/components/MyButton.vue'),
      name: 'MyButton',
    })
    addImportsDir(resolver.resolve('./runtime/composables'))
    someFeature(_options)
    extendPages((pages) => {
      pages.unshift({
        name: 'preview',
        path: '/preview',
        file: resolver.resolve('runtime/preview.vue'),
      })
    })

    addLayout({
      filename: 'custom.vue',
      src: resolver.resolve('./templates/custom.vue'),
    }, 'custom')

    extendRouteRules('/preview', {
      redirect: {
        to: '/',
        statusCode: 302,
      },
    })
    addServerHandler({
      route: '/api/test',
      method: 'get',
      handler: resolver.resolve('./runtime/server/api/test.get.ts'),
    })
    addServerPlugin(resolver.resolve('./runtime/nitro.ts'))
    addServerTemplate({
      filename: '#my-module/test.mjs',
      getContents() {
        return 'export const test = 123'
      },
    })
  },
})
