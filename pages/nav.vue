<script>

export default {
  setup() {
    const nav = useFetch('http://44.207.42.197/wp-json/wp/v2/navigation').data
    const menu = useFetch('http://44.207.42.197/wp-json/wp/v2/menu-items').data

    const url = 'http://44.207.42.197/wp-json/wp/v2/menu-items'

    const { data } = useFetch(url, {
      async beforeFetch({url, options, cancel}) {
        options.headers = {
          ...options.headers,
          Authorization: 'Basic ' + btoa('admin:admin'),
        }

        return {
          options,
        }
      },
    });


    return {
      nav,
      menu,
      data
    }
  },
  mounted() {
    console.log(this.data);

  }
}
</script>

<template>

<span v-html="nav[0].content.rendered"></span>

</template>