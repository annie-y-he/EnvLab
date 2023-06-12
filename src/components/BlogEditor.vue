<script setup>

  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

</script>

<template>

  <div class="editor">
    <QuillEditor theme="snow" toolbar="full" />
  </div>

</template>

<style>

  .editor {
    width: 80vw;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .editor .ql-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .editor .ql-editor {
    display: block;
    width: 100%;
  }

</style>

