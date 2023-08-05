<template>

  <Background />

  <Fish />

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
}

#homeFooter {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 30px 50px;
  background-image: linear-gradient(to bottom, #00000000, #000000);
  pointer-events: auto;
}
</style>