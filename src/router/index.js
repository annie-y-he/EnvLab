import { createRouter, createWebHistory } from 'vue-router'
import BlogEditor from '../components/BlogEditor.vue'
import Physics from '../components/Physics.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/blog',
      name: 'blog',
      component: BlogEditor
    },
    {
      path: '/physics',
      name: 'physics',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Physics
    }
  ]
})

export default router
