<script setup>
const pages = useFetch('http://184.72.214.248/wp-json/wp/v2/pages?_embed').data
const posts = useFetch('http://184.72.214.248/wp-json/wp/v2/posts').data
console.log(posts);
</script>

<template>
  <div class="overlay">

    <div class="text">
      <CustomHeader />

      <div id="publicationsPage">
        <div v-for="post in posts" :key="post.id">
          <a :href="post.link" class="title">{{ post.title.rendered }}</a>
          <span v-html="post.excerpt.rendered" class="excerpt"></span>
        </div>
      </div>
        
      <CustomFooter class="footer" />
    </div>

  </div>

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>
</template>

<style scoped lang="scss">

#publicationsPage {
  color: black;
  background-color: white;
  border-radius: 10px;
  padding: 50px;
  
  .title {
    display: block;
    text-decoration: underline;
    font-size: 22px;
    margin-bottom: 10px;
  }

  .excerpt {
    > :last-child {
      margin-bottom: 20px;
    }
  }

}

</style>