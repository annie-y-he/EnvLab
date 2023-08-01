<script setup>
const pages = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/pages?_embed').data
</script>

<template>
  <Background />

  <div class="overlay">

    <div class="text">
      <CustomHeader />

      <div id="teamPage" class="content" v-html="pages.find(page => page.slug === 'team').content.rendered"></div>
        
      <CustomFooter class="footer"/>
    </div>

  </div>

  <Physics />
</template>

<style lang="scss">
@import '@/styles/media.scss';

</style>