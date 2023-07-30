<script>

export default {
  setup() {
    const nav = useFetch('http://44.207.42.197/wp-json/wp/v2/navigation').data
    const menu = useFetch('http://44.207.42.197/wp-json/wp/v2/menu-items').data

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

<span v-html="nav[0].content.rendered"></span>

</template>