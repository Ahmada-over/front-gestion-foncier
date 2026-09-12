import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const isTauri = typeof window !== 'undefined' && (
  window.__TAURI_INTERNALS__ !== undefined || 
  window.__TAURI__ !== undefined || 
  window.location.protocol === 'tauri:' || 
  window.location.protocol === 'file:'
)

const router = createRouter({
  history: isTauri ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
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
      path: '/actes/:id/editer',
      name: 'edit-acte',
      component: () => import('../views/EditActeView.vue'),
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
      path: '/certificats/nouveau',
      name: 'nouveau-certificat',
      component: () => import('../views/NouveauCertificatView.vue'),
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
    },
    {
      path: '/parcelles/:id',
      name: 'parcelle-detail',
      component: () => import('../views/ParcelleDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/proprietaires',
      name: 'proprietaires',
      component: () => import('../views/ProprietairesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/proprietaires/:id',
      name: 'proprietaire-detail',
      component: () => import('../views/ProprietaireDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/patrimoine',
      name: 'patrimoine',
      component: () => import('../views/PatrimoineFamilialView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decharges',
      name: 'decharges',
      component: () => import('../views/DechargesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decharges/nouvelle',
      name: 'nouvelle-decharge',
      component: () => import('../views/NouvelleDechargeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decharges/:id/editer',
      name: 'edit-decharge',
      component: () => import('../views/EditDechargeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decharges/:id',
      name: 'decharge-detail',
      component: () => import('../views/DechargeDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/utilisateurs',
      name: 'utilisateurs',
      component: () => import('../views/UtilisateursView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/historique',
      name: 'historique',
      component: () => import('../views/HistoriqueView.vue'),
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
