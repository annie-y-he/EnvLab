<script>

export default {
  setup() {
    const pages = useFetch('http://44.207.42.197/wp-json/wp/v2/pages?_embed').data
    const isActive = computed(() => {
      return (routeName) => useRoute().name === routeName;
    });

    return {
      pages,
      isActive,
    }
  },
  mounted() {

    const title = document.getElementById("title");

    const getTitle = () => {
      if (window.innerWidth > 900) {
        return this.pages.find(page => page.slug === 'home').title.rendered;
      } else {
        return this.pages.find(page => page.slug === 'home').title.rendered.split(" ").map(word => word.charAt(0)).join("");
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
        <a  href="http://44.207.42.197:3000" id="title">
          {{ pages.find(page => page.slug === 'home').title.rendered }}
        </a>
        <p id="menu">
          <a :href="pages.find(page => page.slug === 'about').link" :class="{ active: isActive('about') }">
            {{ pages.find(page => page.slug === 'about').title.rendered }}
          </a>
          <a :href="pages.find(page => page.slug === 'jjs').link" :class="{ active: isActive('jjs') }">
            {{ pages.find(page => page.slug === 'jjs').title.rendered }}
          </a>
          <a :href="pages.find(page => page.slug === 'publications').link" :class="{ active: isActive('publications') }">
            {{ pages.find(page => page.slug === 'publications').title.rendered }}
          </a>
          <a :href="pages.find(page => page.slug === 'team').link" :class="{ active: isActive('team') }">
            {{ pages.find(page => page.slug === 'team').title.rendered }}
          </a>
        </p>
      </div>
</template>

<style scoped lang="scss">
@import '@/styles/media.scss';

#header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 5em;
  justify-content: center;
  width: 100%;
  color: white;
  @media (max-width: $bpw-phone) {
    padding-left: 10px;
    padding-right: 10px;
  }

  #title {
    font-size: 26px;
    display: block;
    min-width: 50px;
    margin-right: 50px;
    text-transform: uppercase;
    text-decoration: none;

    &:hover {
      font-weight: bold;
    }
  }
  #menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    text-align: center;

    .active {
      color: rgb(255, 128, 0);
    }

    p {
      width: fit-content;
      height: fit-content;
    }

    a {
      display: block;
      width: fit-content;
      height: fit-content;
      text-align: right;
      padding-right: 10px;
      text-decoration: none;
      text-transform: uppercase;

      @media (max-width: $bpw-phone) {
        font-size: 8px;
      }

      &:hover {
        color: rgb(255, 128, 0);
      }
    }
  }
}

</style>