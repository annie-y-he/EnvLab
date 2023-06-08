<script setup lang="ts">
  import BlogEditor from './components/BlogEditor.vue'
</script>

<template>
  <h1 class="header">VueQuill Demo</h1>

  <div class="blog-editor">
    <BlogEditor />
  </div>
</template>

<style scoped lang="scss">
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

  .blog-editor {
    width: 100vw;
    height: calc((100vh - 60px - 15vh));
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
