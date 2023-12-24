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
  data() {
    return {
      fishEnv: [
        { path: ball, glow: ballGlow, name: "ball", x: 0.09, y: 0.45, z: 0.1, s: 1.2, r: 0, vr: 0.03, av: 5, sel: true }, 
        { path: argo, glow: argoGlow, name: "argo", x: -0.5, y: 0.3, z: 0.2, s: 1.3, r: 0, vr: 0, av: 3, sel: true }, 
        { path: bag, glow: bagGlow, name: "bag", x: -0.7, y: -0.25, z: 0.3, s: 0.9, r: -15, vr: 0.0225, av: 2, sel: true }, 
        { path: arch, glow: archGlow, name: "arch", x: 0.65, y: -0.3, z: 0.4, s: 1, r: 0, vr: 0.0125, av: 1, sel: true }, 
        { path: iceberg, glow: icebergGlow, name: "iceberg", x: 0.25, y: -0.6, z: 0.5, s: 0.7, r: 20, vr: 0.005, av: -1, sel: true }, 
        { path: manatees, glow: manateesGlow, name: "manatees", x: 0.55, y: 0.35, z: 0.6, s: 1.5, r: 25, vr: 0, av: -2, sel: true }, 
        { path: pyramids, glow: pyramidsGlow, name: "pyramids", x: 0, y: -0.1, z: 0.7, s: 1.8, r: -20, vr: 0.045, av: -1, sel: true }, 
        { path: tv, glow: tvGlow, name: "tv", x: -0.2, y: -0.6, z: 0.8, s: 0.8, r: -15, vr: 0.02, av: 1, sel: true }, 
      ],
    }
  },
}

</script>

<template>

  <Background />

  <Fish :fishEnv="fishEnv"/>

  <div class="overlay">
    <div id="homeHeader">
      <CustomHeader />
    </div>
    <div id="homeFooter">
      <CustomFooter />
    </div>
  </div>

</template>

<style scoped lang="scss">

@import '@/styles/media.scss';

#grid {
  width: 100vw;
  height: 100vh;
}

.physics {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

.overlay {
  pointer-events: none;
}

#homeHeader {
  padding: 0 50px;
  background-image: linear-gradient(to bottom, #000000, #00000000);
  pointer-events: auto;
  @media (max-width: $bpw-tablet) {
    padding: 0 20px;
  }
}

#homeFooter {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 30px 50px;
  color: white;
  background-image: linear-gradient(to bottom, #00000000, #000000);
  pointer-events: auto;
  @media (max-width: $bpw-tablet) {
    padding: 30px 30px;
  }
}
</style>