<script setup lang="ts">
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import '@vueup/vue-quill/dist/vue-quill.bubble.css';
</script>



<template>
  <div class="editor">
    <QuillEditor theme="snow" toolbar="full" />
  </div>
</template>

<style  lang="scss">
  .editor {
    width: 80vw;
    display: flex;
    flex-direction: column;
    height: 100%;
    .ql-toolbar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .ql-editor {
      display: block;
      width: 100%;
    }
  }
</style>

