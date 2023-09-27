<script>

export default {
  setup() {
    const siteTitle = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/site_title').data
    const menu = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/my_menu').data


    const isActive = (routeName) => {
      return useRoute().path.replace(/^\/+|\/+$/g, '') === new URL(routeName).pathname.replace(/^\/+|\/+$/g, '') && useRuntimeConfig().public.domain === new URL(routeName).hostname;
    };
    
    const isExternal = (routeName) => {
      return useRuntimeConfig().public.domain !== new URL(routeName).hostname;
    };
    
    const isHome = () => {
      return useRoute().name === "index";
    };

    const toggleMenu = () => {
      const menu = document.querySelector("#menuMobile");
      const open = document.querySelector("#open");
      const close = document.querySelector("#close");

      if (menu.style.display == "") {
        menu.style.display = "flex";
        open.style.display = "none";
        close.style.display = "block";

      } else if (menu.style.display = "flex") {
        menu.style.removeProperty("display");
        open.style.removeProperty("display");
        close.style.removeProperty("display");
      }
    }

    return {
      menu,
      siteTitle,
      isActive,
      isExternal,
      isHome,
      toggleMenu,
    }
  },
  mounted() {
  },
};

</script>

<template>
  <div id="header">
    <a :href="'http://' + useRuntimeConfig().public.domain + ':3000'" id="title" :title="siteTitle">
      {{ siteTitle }}
    </a>
    <p id="menu">
      <a :href="item.url" v-for="item in menu" :class="{ active: isActive(item.url) }" :title="item.url" :target="isExternal(item.url) ? '_blank' : null" :rel="isExternal(item.url) ? 'noopener noreferrer' : null">{{ item.title }}</a>
    </p>
    <!-- <a id="burger" :class="{ hidden: isHome() }" href="#" @click="toggleMenu();">
      <div id="close">×</div>
      <div id="open">≡</div>
    </a> -->
  </div>
  <!-- <p id="menuMobile">
    <a :href="item.url" v-for="item in menu" :class="{ active: isActive(item.url) }" :title="item.url" :target="isExternal(item.url) ? '_blank' : null" :rel="isExternal(item.url) ? 'noopener noreferrer' : null">{{ item.title }}</a>
  </p> -->
  <p id="menuMobile">
    <template v-for="(item) in menu">
      <a :href="item.url" 
        :class="{ active: isActive(item.url) }"
        :title="item.url" 
        :target="isExternal(item.url) ? '_blank' : null"
        :rel="isExternal(item.url) ? 'noopener noreferrer' : null">
        {{ item.title }}
      </a>
      <hr/>
    </template>
  </p>
</template>

<style scoped lang="scss">
@import '@/styles/media.scss';

@import url('https://fonts.googleapis.com/css?family=Noto Sans Math');

.hidden {
  display: none;
}

#header {
  display: flex;
  position: relative;
  align-items: center;
  height: 8em;
  justify-content: space-between;
  width: 100%;
  color: white;
  user-select: none;

  @media (max-width: $bpw-tabletH) {
    justify-content: center;
    height: 5em;
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
    overflow: visible;
    white-space: pre-wrap;



    &:hover {
      font-weight: bold;
    }

    @media (max-width: $bpw-tablet) {
      font-size: 35px;
      margin: 0;
    }
  }

  // #burger {
  //   @media (min-width: $bpw-tablet) {
  //     display: none;
  //   }
  //   * {
  //     font-family: 'Noto Sans Math', sans-serif;
  //   }
  //   font-size: 36px;
  //   text-decoration: none;

  //   #close {
  //     display: none;
  //   }

  //   #open {
  //     display: block;
  //   }

  //   &:hover {
  //     color: white;
  //     font-weight: normal;
  //   }
  // }

  #menu {
    display: flex;
    min-width: fit-content;
    font-size: 16px;
    white-space: nowrap;
    
    @media (max-width: $bpw-tablet) {
      display: none;
    }

    > :not(:last-child) {
      margin-right: 20px;
    }

    .active {
      color: $hover-color;
    }

    a {
      text-decoration: none;
      text-transform: lowercase;
    }
  }
}

#menuMobile {
  @media (min-width: $bpw-tablet) {
    display: none !important;
  }
  display: flex;
  position: relative;
  min-width: fit-content;
  font-size: 16px;
  white-space: nowrap;
  flex-direction: column;
  margin-bottom: 30px;
  
  .active {
    color: $hover-color;
  }

  > :last-child {
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
    text-transform: lowercase;
    text-align: center;
    height: 2em;
    color: white;
  }

  hr {
    margin-bottom: 8px;
  }
}
</style>