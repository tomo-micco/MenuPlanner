import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/family',
  },
  {
    path: '/family',
    name: 'FamilySettings',
    component: () => import('@/views/FamilySettingsView.vue'),
    meta: { title: '家族設定 | MenuPlanner' },
  },
  {
    path: '/family/join',
    name: 'JoinFamily',
    component: () => import('@/views/JoinFamilyView.vue'),
    meta: { title: '家族グループに参加 | MenuPlanner' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ページタイトルを動的に設定する
router.afterEach((to) => {
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }
})

export default router
