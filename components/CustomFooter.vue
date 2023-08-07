<script setup>
const tagline = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/tagline').data
</script>

<template>
  <div>
    <div v-html="tagline" id="copyright"></div>
  </div>
</template>

<style lang="scss">
@import '@/styles/media.scss';

#copyright {
  font-size: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: white;
  text-transform: uppercase;
  user-select: none;
  @media (max-width: $bpw-tablet) {
    padding-left: 10px;
    padding-right: 10px;
  }
  
}

</style>