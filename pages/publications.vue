<script>
import ball from "~/assets/ball.png";
import argo from "~/assets/argo.png";
import bag from "~/assets/bag.png";
import arch from "~/assets/arch.png";
import iceberg from "~/assets/iceberg.png";
import manatees from "~/assets/manatees.png";
import pyramids from "~/assets/pyramids.png";
import tv from "~/assets/tv.png";
import ballGlow from "~/assets/ballGlow.png";
import argoGlow from "~/assets/argoGlow.png";
import bagGlow from "~/assets/bagGlow.png";
import archGlow from "~/assets/archGlow.png";
import icebergGlow from "~/assets/icebergGlow.png";
import manateesGlow from "~/assets/manateesGlow.png";
import pyramidsGlow from "~/assets/pyramidsGlow.png";
import tvGlow from "~/assets/tvGlow.png";

export default {
  setup() {
    const posts = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/posts').data;

    return {
      posts,
    }
  },
  data() {
    return {
      fishEnv: [
        //{ path: ball, glow: ballGlow, name: "ball", x: 0.09, y: 0.45, z: 0.1, s: 1.2, r: 0, vr: 0.03, av: 5, sel: false }, 
        // { path: argo, glow: argoGlow, name: "argo", x: -0.5, y: 0.3, z: 0.2, s: 1.3, r: 79, vr: 0.05, av: 3, sel: false }, 
        //{ path: bag, glow: bagGlow, name: "bag", x: -0.7, y: -0.25, z: 0.3, s: 0.9, r: -15, vr: 0.0225, av: 2, sel: false }, 
        //{ path: arch, glow: archGlow, name: "arch", x: 0.65, y: -0.3, z: 0.4, s: 0.5, r: 0, vr: 0.0125, av: 1, sel: false }, 
        { path: iceberg, glow: icebergGlow, name: "iceberg", x: 0.4, y: -0.6, z: 0.5, s: 1.2, r: 20, vr: 0.06, av: -1, sel: false }, 
        // { path: manatees, glow: manateesGlow, name: "manatees", x: 0.55, y: 0.35, z: 0.6, s: 1.5, r: 25, vr: 0.03, av: -2, sel: false }, 
        //{ path: pyramids, glow: pyramidsGlow, name: "pyramids", x: 0, y: -0.1, z: 0.7, s: 1.8, r: -20, vr: 0.045, av: -1, sel: false }, 
        { path: tv, glow: tvGlow, name: "tv", x: -0.2, y: -0.6, z: 0.8, s: 1.3, r: -15, vr: 0.06, av: 1, sel: false }, 
      ],
    }
  },
}
</script>

<template>

  <Background />

  <div class="overlay">

    <div class="text">
      <CustomHeader />

      <div id="publicationsPage" class="content">
        <div v-for="post in posts" :key="post.id">
          <div class="title">{{ post.title.rendered }}</div>
          <span v-html="post.content.rendered" class="article"></span>
        </div>
      </div>
        
      <CustomFooter class="footer" />
    </div>

  </div>

  <div class="fish">
    <Fish :fishEnv="fishEnv"/>
  </div>

</template>

<style scoped lang="scss">

#publicationsPage {
  
  .title {
    display: block;
    font-size: 28px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: bold;
  }

}

</style>