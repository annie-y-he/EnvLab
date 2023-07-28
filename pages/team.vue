<script setup>
const pages = useFetch('http://44.207.42.197/wp-json/wp/v2/pages?_embed').data
</script>

<template>
  <div class="overlay">

    <div class="text">
      <CustomHeader />

      <div id="teamPage" class="content" v-html="pages.find(page => page.slug === 'team').content.rendered"></div>
        
      <CustomFooter class="footer"/>
    </div>

  </div>

  <Physics />

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/media.scss';
</style>