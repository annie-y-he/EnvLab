<template>
  <div>
    <h1 class="header">{{ selectedScene ? selectedScene + ' Demo' : 'Choose the demo' }}</h1>

    <div class="body">
      <div class="scene-list">
        <label v-for="(scene, index) in scenes" :key="index">
          <input type="radio" :value="scene" :checked="selectedScene === scene" @change="selectScene(scene)">
          {{ scene }}
        </label>
      </div>

      <div class="demo">
        <component :is="getSelectedSceneComponent" v-if="selectedScene" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import BlogEditor from './components/BlogEditor.vue';
  import Physics from './components/Physics.vue';

  const scenes = ['Blog', 'Physics']; // Add other scene names here

  const selectedScene = ref('');

  const getSelectedSceneComponent = computed<any>(() => {
    if (selectedScene.value === 'Blog') {
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

