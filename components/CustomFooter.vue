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
  text-transform: uppercase;
  user-select: none;
  @media (min-width: $bpw-tabletH) {
    > :last-child {
      text-align: right;
    }
  }

  @media (max-width: $bpw-tabletH) {
    padding-left: 10px;
    padding-right: 10px;
    line-height: 1rem;
    flex-direction: column;
    text-align: center;
  }
  
}

</style>