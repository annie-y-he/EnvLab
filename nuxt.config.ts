// https://nuxt.com/docs/api/configuration/nuxt-config
const domain = '44.207.42.197';

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
    host: domain,
  },
};
