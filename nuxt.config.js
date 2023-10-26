// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true,

        timeline: {
            enabled: true
        }
    },
    // ssr: false,
    plugins: [
        { src: '~/plugins/auth.js' }
    ],

    router: {
        middleware: ['auth']
    },

    runtimeConfig: {
        azure: {
            clientId: '', // can override with envvar NUXT_AZURE_CLIENT_ID
            clientSecret: '', // can override with envvar NUXT_AZURE_CLIENT_SECRET
            tenantId: '', // can override with envvar NUXT_AZURE_TENANT_ID
            redirectUri: 'http://localhost:3000/blank.html', // can override with envvar NUXT_AZURE_REDIRECT_URI
        }
    },

    build: {
        extend(config, ctx) {
            if (ctx) {
                config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
            }
        }
    }
})