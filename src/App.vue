<template>
  <h1 class="header">Matter.js Demo</h1>

  <div class="scene-list">
    <label v-for="(scene, index) in scenes" :key="index">
      <input type="radio" :value="scene" :checked="selectedScene === scene" @change="selectScene(scene)">
      {{ scene }}
    </label>
  </div>

  <div class="blog-editor">
    <component :is="selectedSceneComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BlogEditor from './components/BlogEditor.vue';
import Physics from './components/Physics.vue';

const scenes = ['BlogEditor', 'Physics']; // Add other scene names here

const selectedScene = ref('');

const selectedSceneComponent = computed(() => {
  if (selectedScene.value === 'BlogEditor') {
    return BlogEditor;
  } else if (selectedScene.value === 'Physics') {
    return Physics;
  }
  // Add other scene components here
});

function selectScene(scene: string) {
  selectedScene.value = scene;
}

</script>

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

.scene-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.blog-editor {
  width: 100vw;
  height: calc((100vh - 60px - 15vh));
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
