<script setup>
const pages = useFetch('http://184.72.214.248/wp-json/wp/v2/pages?_embed').data
</script>

<template>

  <div class="overlay">

    <div class="text">
      <CustomHeader />

      <div id="aboutPage" class="content" v-html="pages.find(page => page.slug === 'about').content.rendered"></div>
        
      <CustomFooter class="footer"/>
    </div>

  </div>

  <Physics />

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>
</template>

<style lang="scss">
@import '@/styles/media.scss';

#aboutPage {
  display: flex;

  @media (max-width: $bpw-phone) {
    flex-direction: column;
  }

  > p {
    flex-basis: 50%;
    padding: 20px;
  }
  
  img {
    width: 100%;
    height: auto;
  }
}

</style>