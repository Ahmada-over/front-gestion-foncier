<template>
  <v-app class="bg-grey-lighten-4">
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-if="!isLogin" v-model="drawer" app elevation="1" border="0" width="260">
      <div class="px-4 py-5 d-flex align-center">
        <v-avatar color="primary" size="36" class="mr-3">
          <span class="text-white text-caption font-weight-bold">TB</span>
        </v-avatar>
        <div>
          <div class="font-weight-bold text-subtitle-2 text-primary" style="line-height: 1.2;">Taofikh Bousso</div>
          <div class="text-caption text-grey-darken-1" style="line-height: 1.2;">Système de Gestion Foncière</div>
        </div>
      </div>

      <v-divider class="mb-2"></v-divider>

      <v-list density="compact" nav class="px-3">
        <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Tableau de bord" value="home" to="/" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-file-document-outline" title="Actes de vente" value="actes" to="/actes" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-certificate-outline" title="Certificats d'occupation" value="certificats" to="/certificats" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-map-marker-outline" title="Parcelles" value="parcelles" to="/parcelles" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-home-group" title="Patrimoine Familial" value="patrimoine" to="/patrimoine" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="Propriétaires" value="proprietaires" to="/proprietaires" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-account-outline" title="Utilisateurs" value="utilisateurs" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-history" title="Historique" value="historique" rounded="lg"></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider class="mb-2"></v-divider>
        <div class="px-4 py-4 d-flex align-center">
          <v-avatar size="40" class="mr-3">
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User"></v-img>
          </v-avatar>
          <div>
            <div class="text-subtitle-2 font-weight-bold" style="color: #1a3b5c; line-height: 1.2;">{{ userName }}</div>
            <div class="text-caption text-grey-darken-1">{{ userRole }}</div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar v-if="!isLogin" app color="white" elevation="1" height="70">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>

      <div class="px-4 w-100" style="max-width: 520px;">
        <v-menu
          v-model="showSearchResults"
          :close-on-content-click="false"
          location="bottom"
          offset="4"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="globalSearch"
              prepend-inner-icon="mdi-magnify"
              placeholder="Rechercher une parcelle, un propriétaire..."
              variant="solo"
              density="compact"
              hide-details
              flat
              bg-color="grey-lighten-4"
              rounded="lg"
              @input="onGlobalSearch"
              @keydown.escape="showSearchResults = false"
              @keydown.enter="goToFirstResult"
              clearable
              @click:clear="clearSearch"
            ></v-text-field>
          </template>

          <!-- Search Results Dropdown -->
          <v-card
            v-if="globalSearch && globalSearch.length >= 2"
            class="search-dropdown"
            elevation="8"
            rounded="lg"
            width="488"
            max-height="420"
            style="overflow-y: auto;"
          >
            <v-progress-linear v-if="searching" indeterminate color="primary" height="3"></v-progress-linear>
            
            <!-- Parcelles -->
            <div v-if="searchResults.parcelles.length > 0">
              <div class="text-overline text-grey-darken-1 font-weight-bold px-4 pt-3 pb-1" style="font-size: 10px !important;">PARCELLES</div>
              <v-list-item
                v-for="p in searchResults.parcelles"
                :key="'p-'+p.id"
                class="search-item"
                @click="goTo(`/parcelles/${p.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar color="blue-lighten-5" size="32" rounded>
                    <v-icon color="primary" size="18">mdi-map-marker</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">{{ p.numero_parcelle }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ p.localisation || 'Non spécifié' }} — {{ p.superficie_m2 }} m²</v-list-item-subtitle>
              </v-list-item>
            </div>

            <!-- Actes -->
            <div v-if="searchResults.actes.length > 0">
              <v-divider v-if="searchResults.parcelles.length > 0"></v-divider>
              <div class="text-overline text-grey-darken-1 font-weight-bold px-4 pt-3 pb-1" style="font-size: 10px !important;">ACTES DE VENTE</div>
              <v-list-item
                v-for="a in searchResults.actes"
                :key="'a-'+a.id"
                class="search-item"
                @click="goTo(`/actes/${a.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar color="green-lighten-5" size="32" rounded>
                    <v-icon color="success" size="18">mdi-file-document</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">{{ a.numero_acte || a.id.substring(0,8) }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ a.vendeur_nom }} → {{ a.acheteur_nom }} — {{ a.statut }}</v-list-item-subtitle>
              </v-list-item>
            </div>

            <!-- Certificats -->
            <div v-if="searchResults.certificats.length > 0">
              <v-divider v-if="searchResults.parcelles.length > 0 || searchResults.actes.length > 0"></v-divider>
              <div class="text-overline text-grey-darken-1 font-weight-bold px-4 pt-3 pb-1" style="font-size: 10px !important;">CERTIFICATS</div>
              <v-list-item
                v-for="c in searchResults.certificats"
                :key="'c-'+c.id"
                class="search-item"
                @click="goTo(`/certificats/${c.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar color="orange-lighten-5" size="32" rounded>
                    <v-icon color="orange-darken-2" size="18">mdi-certificate</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">{{ c.numero_certificat || c.id.substring(0,8) }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ c.statut }}</v-list-item-subtitle>
              </v-list-item>
            </div>

            <!-- Propriétaires -->
            <div v-if="searchResults.proprietaires.length > 0">
              <v-divider v-if="searchResults.parcelles.length > 0 || searchResults.actes.length > 0 || searchResults.certificats.length > 0"></v-divider>
              <div class="text-overline text-grey-darken-1 font-weight-bold px-4 pt-3 pb-1" style="font-size: 10px !important;">PROPRIÉTAIRES</div>
              <v-list-item
                v-for="pr in searchResults.proprietaires"
                :key="'pr-'+pr.id"
                class="search-item"
                @click="goTo(`/parcelles`)"
              >
                <template v-slot:prepend>
                  <v-avatar color="purple-lighten-5" size="32">
                    <span class="text-caption font-weight-bold text-purple-darken-2">{{ (pr.prenom[0] + pr.nom[0]).toUpperCase() }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">{{ pr.prenom }} {{ pr.nom }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">CIN: {{ pr.cin }}</v-list-item-subtitle>
              </v-list-item>
            </div>

            <!-- No Results -->
            <div v-if="!searching && searchResults.parcelles.length === 0 && searchResults.actes.length === 0 && searchResults.certificats.length === 0 && searchResults.proprietaires.length === 0" class="text-center pa-6 text-grey-darken-1">
              <v-icon size="32" color="grey-lighten-2" class="mb-1">mdi-magnify</v-icon>
              <div class="text-caption">Aucun résultat pour "{{ globalSearch }}"</div>
            </div>
          </v-card>
        </v-menu>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center pr-4">
        <v-btn icon variant="text" color="grey-darken-1" size="small" class="mr-2">
          <v-badge color="error" dot>
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-btn icon="mdi-cog-outline" variant="text" color="grey-darken-1" size="small" class="mr-2"></v-btn>
        <v-btn icon="mdi-logout" variant="text" color="grey-darken-1" size="small" @click="handleLogout"></v-btn>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid :class="isLogin ? 'pa-0 h-100' : 'pa-6'" :style="isLogin ? 'max-width: none;' : 'max-width: 1400px;'">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Global Floating Action Button -->
    <v-btn
      v-if="!isLogin"
      icon="mdi-plus"
      color="#0a2540"
      size="large"
      elevation="4"
      class="position-fixed"
      style="bottom: 30px; right: 30px; z-index: 99;"
    ></v-btn>

    <!-- Global Snackbar -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      timeout="3000"
      location="top right"
      variant="flat"
      class="mt-4 mr-4"
    >
      <div class="d-flex align-center font-weight-medium">
        <v-icon
          :icon="notification.color === 'success' ? 'mdi-check-circle' : (notification.color === 'error' ? 'mdi-alert-circle' : 'mdi-information')"
          class="mr-3"
          size="24"
        ></v-icon>
        {{ notification.message }}
      </div>
      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="notification.show = false"></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from './services/api'
import { notification } from './services/notifier'

const route = useRoute()
const router = useRouter()
const isLogin = computed(() => route.name === 'login')

const drawer = ref(true)
const userName = ref('Taofikh Bousso')
const userRole = ref('Admin Principal')

// --- Global Search ---
const globalSearch = ref('')
const showSearchResults = ref(false)
const searching = ref(false)
let searchTimeout = null

const searchResults = ref({
  parcelles: [],
  actes: [],
  certificats: [],
  proprietaires: []
})

const onGlobalSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!globalSearch.value || globalSearch.value.length < 2) {
    searchResults.value = { parcelles: [], actes: [], certificats: [], proprietaires: [] }
    return
  }
  searchTimeout = setTimeout(async () => {
    searching.value = true
    showSearchResults.value = true
    const q = globalSearch.value.toLowerCase()
    try {
      const [parcelles, actes, certificats, proprietaires] = await Promise.allSettled([
        api.parcelles.getAll(0, 200),
        api.actes.getAll(0, 200),
        api.certificats.getAll(0, 200),
        api.proprietaires.getAll(0, 200)
      ])

      // Filter parcelles
      searchResults.value.parcelles = (parcelles.status === 'fulfilled' ? parcelles.value : [])
        .filter(p => (p.numero_parcelle || '').toLowerCase().includes(q) || (p.localisation || '').toLowerCase().includes(q))
        .slice(0, 5)

      // Filter actes
      searchResults.value.actes = (actes.status === 'fulfilled' ? actes.value : [])
        .filter(a => (a.numero_acte || '').toLowerCase().includes(q) || (a.vendeur_nom || '').toLowerCase().includes(q) || (a.acheteur_nom || '').toLowerCase().includes(q))
        .slice(0, 5)

      // Filter certificats
      searchResults.value.certificats = (certificats.status === 'fulfilled' ? certificats.value : [])
        .filter(c => (c.numero_certificat || '').toLowerCase().includes(q) || (c.nom_titulaire || '').toLowerCase().includes(q))
        .slice(0, 5)

      // Filter proprietaires
      searchResults.value.proprietaires = (proprietaires.status === 'fulfilled' ? proprietaires.value : [])
        .filter(pr => (pr.nom || '').toLowerCase().includes(q) || (pr.prenom || '').toLowerCase().includes(q) || (pr.cin || '').toLowerCase().includes(q))
        .slice(0, 5)
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      searching.value = false
    }
  }, 300)
}

const clearSearch = () => {
  globalSearch.value = ''
  searchResults.value = { parcelles: [], actes: [], certificats: [], proprietaires: [] }
  showSearchResults.value = false
}

const goTo = (path) => {
  showSearchResults.value = false
  globalSearch.value = ''
  router.push(path)
}

const goToFirstResult = () => {
  const r = searchResults.value
  if (r.parcelles.length > 0) return goTo(`/parcelles/${r.parcelles[0].id}`)
  if (r.actes.length > 0) return goTo(`/actes/${r.actes[0].id}`)
  if (r.certificats.length > 0) return goTo(`/certificats/${r.certificats[0].id}`)
  if (r.proprietaires.length > 0) return goTo('/parcelles')
}

// Close dropdown on outside click
const onClickOutside = (e) => {
  if (!e.target.closest('.search-dropdown') && !e.target.closest('.v-text-field')) {
    showSearchResults.value = false
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

// --- User info ---
const fetchUser = async () => {
  if (!api.auth.isAuthenticated()) return
  try {
    const user = await api.auth.getMe()
    if (user) {
      userName.value = user.nom || user.prenom ? `${user.prenom || ''} ${user.nom || ''}`.trim() : user.email
      userRole.value = user.role || 'Utilisateur'
    }
  } catch {
    // Keep defaults
  }
}

const handleLogout = () => {
  api.auth.logout()
  router.push('/login')
}

onMounted(() => {
  if (!isLogin.value) {
    fetchUser()
  }
})
</script>

<style>
.v-list-item--active {
  border-left: 4px solid #4CAF50 !important;
  background-color: rgba(76, 175, 80, 0.08) !important;
}

.v-list-item--active .v-list-item__prepend > .v-icon {
  color: #4CAF50 !important;
}

.v-list-item--active .v-list-item-title {
  color: #2E7D32 !important;
  font-weight: 600;
}

.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover:not(.v-list-item--active) {
  background-color: rgba(76, 175, 80, 0.04);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
