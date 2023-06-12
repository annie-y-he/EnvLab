import './assets/main.scss'

import { createApp } from 'vue'
import BlogEditor from './components/BlogEditor.vue';
import Physics from './components/Physics.vue';
import App from './App.vue'

const app = createApp(App);

app.component('blog-editor', BlogEditor);
app.component('physics', Physics);

app.mount('#app');
