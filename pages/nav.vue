<script>

export default {
  setup() {
    const nav = useFetch('http://44.207.42.197/wp-json/wp/v2/navigation').data
    const menu = useFetch('http://44.207.42.197/wp-json/wp/v2/tagline').data

    return {
      nav,
      menu,
    }
  },
  mounted() {
    console.log(this.menu);

  }
}
</script>

<template>

<div v-html="menu"></div>

</template>