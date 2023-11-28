import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchView from '@/views/SearchView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import TagView from '@/views/TagView.vue'
import PostsView from '@/views/PostsView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import TestView from '@/views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView
    },
    {
      path: '/tag',
      name: 'tag',
      component: TagView
    },
    {
      path: '/posts/:number',
      name: 'posts',
      component: PostsView
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: PostDetailView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    },
  ]
})

export default router
