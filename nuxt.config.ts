// https://nuxt.com/docs/api/configuration/nuxt-config
const domain = 'jacquetlab.com';

export default defineNuxtConfig({
  devtools: { enabled: false },
})

module.exports = {
  runtimeConfig: {
    public: {
      domain: domain,
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
};
