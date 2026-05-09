import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/actes',
      name: 'actes',
      component: () => import('../views/ActesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/actes/nouveau',
      name: 'nouvel-acte',
      component: () => import('../views/NouvelActeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/actes/:id',
      name: 'acte-detail',
      component: () => import('../views/ActeDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/certificats',
      name: 'certificats',
      component: () => import('../views/CertificatsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/certificats/:id',
      name: 'certificat-detail',
      component: () => import('../views/CertificatDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/parcelles',
      name: 'parcelles',
      component: () => import('../views/ParcellesView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
