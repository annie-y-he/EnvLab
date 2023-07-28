<script setup>
const pages = useFetch('http://184.72.214.248/wp-json/wp/v2/pages?_embed').data
</script>

<template>
  <div>
    <div v-html="pages.find(page => page.slug === 'home').content.rendered" id="copyright"></div>
  </div>
</template>

<style lang="scss">
@import '@/styles/media.scss';

#copyright {
  font-size: 10px;
  display: flex;
  width: 100%;
  flex-direction: row;
  color: white;
  text-transform: uppercase;
  
  @media (max-width: $bpw-phone) {
    padding-left: 10px;
    padding-right: 10px;
  }

  > *:not(:last-child) {
    margin-right: 10px;
  }
  
}

</style>