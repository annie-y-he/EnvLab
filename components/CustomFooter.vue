<script setup>
const tagline = useFetch('http://44.207.42.197/wp-json/wp/v2/tagline').data
</script>

<template>
  <div>
    <div v-html="tagline" id="copyright"></div>
  </div>
</template>

<style lang="scss">
@import '@/styles/media.scss';

#copyright {
  a {
    &:hover {
      color: $hover-color;
    }
  }
  font-size: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: white;
  text-transform: uppercase;
  
  @media (max-width: $bpw-phone) {
    padding-left: 10px;
    padding-right: 10px;
  }
  
}

</style>