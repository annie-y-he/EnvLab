<script>

export default {
  setup() {
    const siteTitle = useFetch('http://44.207.42.197/wp-json/wp/v2/site_title').data
    const menu = useFetch('http://44.207.42.197/wp-json/wp/v2/my_menu').data

    const isActive = computed(() => {
      return (routeName) => useRoute().path === new URL(routeName).pathname;
    });

    return {
      menu,
      siteTitle,
      isActive,
    }
  },
  mounted() {
    const title = document.getElementById("title");

    console.log(title.scrollHeight);
    console.log(title.clientHeight);

    const getTitle = () => {
      if (title.scrollHeight > title.clientHeight) {
        return this.siteTitle.split(" ").map(word => word.charAt(0)).join("");
      } else {
        return this.siteTitle;
      }
    };

    title.textContent = getTitle();

    var resizeHandler = function() {
      title.textContent = getTitle();
    };

    window.addEventListener('resize', resizeHandler);
  },
};

</script>

<template>
  <div id="header">
    <a  href="http://44.207.42.197:3000" id="title" :title="siteTitle">
      {{ siteTitle }}
    </a>
    <p id="menu">
      <a :href="item.url" v-for="item in menu" :class="{ active: isActive(item.url) }" :title="item.url">{{ item.title }}</a>
    </p>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/media.scss';

#header {
  display: flex;
  position: relative;
  align-items: center;
  height: 8em;
  justify-content: space-between;
  width: 100%;
  color: white;
  @media (max-width: $bpw-phone) {
    padding-left: 20px;
    padding-right: 20px;
  }

  #title {
    font-size: 34px;
    display: block;
    min-width: 50px;
    margin-right: 50px;
    text-transform: uppercase;
    text-decoration: none;
    align-self: left;
    height: 1.5em;

    &:hover {
      font-weight: bold;
    }
  }
  #menu {
    display: flex;
    min-width: fit-content;
    font-size: 16px;
    white-space: nowrap;

    > :not(:last-child) {
      margin-right: 20px;
    }

    .active {
      color: $hover-color;
    }

    a {
      // display: block;
      text-decoration: none;
      text-transform: lowercase;

      @media (max-width: $bpw-phone) {
        font-size: 8px;
      }
    }
  }


}
</style>