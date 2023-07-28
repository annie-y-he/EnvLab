<template>
  
  <div class="overlay">
    <div id="text">
      Redirecting...
    </div>
  </div>
  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>
</template>

<script>
export default {
  setup() {
    const pages = useFetch('http://44.207.42.197/wp-json/wp/v2/pages?_embed').data

    return {
      pages,
    }
  },
  mounted() {
    window.location.href = 'https://jenniferjacquet.com';
  },
};
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  #text {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 15vh 15vw;
    border-radius: calc(min(100vh, 100vw) * 0.05);
    color: white;
  }
  z-index: 2;

}
.underlay {
  width: 100vw;
  height: 100vh;
  z-index: 1;
  .cover {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

</style>