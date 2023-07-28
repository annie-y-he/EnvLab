<script setup>
const pages = useFetch('http://54.197.76.189/wp-json/wp/v2/pages?_embed').data
const posts = useFetch('http://54.197.76.189/wp-json/wp/v2/posts').data
console.log(posts);
</script>

<template>
  <div class="overlay">

    <div class="text">
      <CustomHeader />

      <div id="publicationsPage" class="content">
        <div v-for="post in posts" :key="post.id">
          <div class="title">{{ post.title.rendered }}</div>
          <span v-html="post.content.rendered" class="article"></span>
        </div>
      </div>
        
      <CustomFooter class="footer" />
    </div>

  </div>

  <Physics />

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>
</template>

<style scoped lang="scss">

#publicationsPage {
  
  .title {
    display: block;
    font-size: 22px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: bold;
  }

}

</style>