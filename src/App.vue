<script setup>

  import { RouterLink, RouterView } from 'vue-router'

</script>

<template>

  <h1 class="header">Choose the Demo</h1>

  <div class="body">

    <div class="scene-list">
      <RouterLink to="/blog">Blog</RouterLink>
      <RouterLink to="/physics">Physics</RouterLink>
    </div>

    <div class="demo">
      <RouterView />
    </div>
    
  </div>

</template>

<style scoped>

  .header {
    position: sticky;
    margin-bottom: 5vh;
    height: 60px;
    width: 100%;
    background-color: #f4f4f4;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .body {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .scene-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 5vw;
    padding: 10px;
    background-color: #f4f4f4;
  }

  .demo {
    width: 80vw;
    height: calc((100vh - 60px - 15vh));
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
</style>
