// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true,

        timeline: {
            enabled: true
        }
    },

    runtimeConfig: {
        azure: {
            clientId: '', // can override with envvar NUXT_AZURE_CLIENT_ID
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