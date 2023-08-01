<script setup>
const pages = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/pages?_embed').data
const posts = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/posts').data
console.log(posts);
</script>

<template>

  <Background />

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


</template>

<style scoped lang="scss">

#publicationsPage {
  
  .title {
    display: block;
    font-size: 28px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: bold;
  }

}

</style>