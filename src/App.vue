<template>
  <v-app style="background-color: #f8fafc;">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-if="!isLogin"
      v-model="drawer"
      app
      elevation="0"
      width="280"
      style="border-right: 1px solid #f1f5f9; background: #ffffff;"
    >
      <!-- Drawer Header -->
      <div class="px-5 py-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="42" class="mr-3" style="background: linear-gradient(135deg, #0f2942 0%, #1e40af 100%) !important; box-shadow: 0 4px 10px rgba(15, 41, 66, 0.2);">
            <v-icon color="white" size="22">mdi-office-building-marker</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-black text-subtitle-2" style="color: #0f2942; line-height: 1.2; letter-spacing: -0.2px;">TAOFIKH BOUSSO</div>
            <div class="text-caption text-grey-darken-1 font-weight-medium" style="line-height: 1.2; font-size: 11px;">Gestion Foncière Officielle</div>
          </div>
        </div>
        <v-btn v-if="mobile" icon="mdi-close" variant="text" size="small" color="grey-darken-1" @click="drawer = false"></v-btn>
      </div>

      <v-divider class="mb-3" style="border-color: #f1f5f9;"></v-divider>

      <v-list density="comfortable" nav class="px-3">
        <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Tableau de bord" value="home" to="/" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-file-document-outline" title="Actes de vente" value="actes" to="/actes" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-certificate-outline" title="Certificats d'occupation" value="certificats" to="/certificats" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-file-undo-outline" title="Décharges" value="decharges" to="/decharges" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-map-marker-outline" title="Parcelles" value="parcelles" to="/parcelles" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-home-group" title="Patrimoine Familial" value="patrimoine" to="/patrimoine" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="Propriétaires" value="proprietaires" to="/proprietaires" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-account-outline" title="Utilisateurs" value="utilisateurs" to="/utilisateurs" rounded="xl" class="mb-1"></v-list-item>
        <v-list-item prepend-icon="mdi-history" title="Historique" value="historique" to="/historique" rounded="xl"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 m-3 rounded-xl border border-slate-200" style="background: #f8fafc;">
          <div class="d-flex align-center">
            <v-avatar size="40" color="primary" class="mr-3" style="background: linear-gradient(135deg, #0f2942 0%, #1e40af 100%) !important; color: white !important;">
              <span class="text-caption font-weight-bold">{{ userInitials }}</span>
            </v-avatar>
            <div class="overflow-hidden flex-grow-1">
              <div class="text-subtitle-2 font-weight-bold text-truncate" style="color: #0f2942; line-height: 1.2;" :title="userName">{{ userName }}</div>
              <div class="text-caption text-grey-darken-1 text-truncate" :title="userRole">{{ userRole }}</div>
            </div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar v-if="!isLogin" app color="white" elevation="0" height="70" class="modern-app-bar px-2 px-sm-4 border-b">
      <!-- Responsive Mobile/Tablet Hamburger Toggle Button -->
      <v-btn
        icon="mdi-menu"
        variant="text"
        color="primary"
        class="d-md-none mr-2"
        @click.stop="drawer = !drawer"
        aria-label="Ouvrir le menu"
      ></v-btn>

      <div class="px-1 px-sm-2 flex-grow-1" style="max-width: 480px;">
        <v-menu
          v-model="showSearchResults"
          :close-on-content-click="false"
          location="bottom"
          offset="6"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="globalSearch"
              prepend-inner-icon="mdi-magnify"
              placeholder="Rechercher parcelle, acte, décharge, CIN..."
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              bg-color="white"
              style="border-color: #e2e8f0;"
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
            class="search-dropdown border"
            elevation="8"
            rounded="xl"
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
                  <v-avatar color="blue-lighten-5" size="32" rounded="lg">
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
                  <v-avatar color="green-lighten-5" size="32" rounded="lg">
                    <v-icon color="success" size="18">mdi-file-document</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">{{ a.numero_acte || a.id.substring(0,8) }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ a.vendeur_nom }} → {{ a.acheteur_nom }} — {{ a.statut }}</v-list-item-subtitle>
              </v-list-item>
            </div>

            <!-- Décharges -->
            <div v-if="searchResults.decharges && searchResults.decharges.length > 0">
              <v-divider v-if="searchResults.parcelles.length > 0 || searchResults.actes.length > 0"></v-divider>
              <div class="text-overline text-grey-darken-1 font-weight-bold px-4 pt-3 pb-1" style="font-size: 10px !important;">DÉCHARGES</div>
              <v-list-item
                v-for="d in searchResults.decharges"
                :key="'d-'+d.id"
                class="search-item"
                @click="goTo(`/decharges/${d.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar color="purple-lighten-5" size="32" rounded="lg">
                    <v-icon color="purple-darken-2" size="18">mdi-file-undo</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">{{ d.numero_decharge || d.id.substring(0,8) }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ d.receveur_nom }} — {{ d.montant_recu }} FCFA</v-list-item-subtitle>
              </v-list-item>
            </div>

            <!-- Certificats -->
            <div v-if="searchResults.certificats.length > 0">
              <v-divider v-if="searchResults.parcelles.length > 0 || searchResults.actes.length > 0 || (searchResults.decharges && searchResults.decharges.length > 0)"></v-divider>
              <div class="text-overline text-grey-darken-1 font-weight-bold px-4 pt-3 pb-1" style="font-size: 10px !important;">CERTIFICATS</div>
              <v-list-item
                v-for="c in searchResults.certificats"
                :key="'c-'+c.id"
                class="search-item"
                @click="goTo(`/certificats/${c.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar color="orange-lighten-5" size="32" rounded="lg">
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
                  <v-avatar color="teal-lighten-5" size="32" rounded="circle">
                    <span class="text-caption font-weight-bold text-teal-darken-2">{{ (pr.prenom[0] + pr.nom[0]).toUpperCase() }}</span>
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

      <!-- Right Header Actions with Dynamic Connected User -->
      <div class="d-flex align-center ga-1 ga-sm-2">
        <v-menu location="bottom end" offset="8">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" rounded="pill" class="text-none px-2 d-flex align-center">
              <v-avatar size="34" color="primary" class="mr-1 mr-sm-2" style="background: linear-gradient(135deg, #0f2942 0%, #1e40af 100%) !important; color: white !important;">
                <span class="text-caption font-weight-bold" style="font-size: 12px;">{{ userInitials }}</span>
              </v-avatar>
              <div class="d-none d-sm-flex flex-column text-left mr-1">
                <span class="text-caption font-weight-bold text-grey-darken-3 text-truncate" style="max-width: 140px; line-height: 1.1;">{{ userName }}</span>
                <span class="text-grey-darken-1" style="font-size: 10px; line-height: 1.1;">{{ userRole }}</span>
              </div>
              <v-icon size="16" color="grey-darken-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-card min-width="240" rounded="xl" elevation="6" class="pa-2 border">
            <div class="px-3 py-2">
              <div class="text-subtitle-2 font-weight-bold text-truncate" style="color: #0f2942;">{{ userName }}</div>
              <div class="text-caption text-grey text-truncate">{{ userEmail }}</div>
              <v-chip size="x-small" color="primary" variant="tonal" class="mt-1 font-weight-bold">{{ userRole }}</v-chip>
            </div>
            <v-divider class="my-1"></v-divider>
            <v-list-item prepend-icon="mdi-account-outline" title="Gestion Utilisateurs" to="/utilisateurs" rounded="lg" density="compact"></v-list-item>
            <v-list-item prepend-icon="mdi-logout" title="Déconnexion" rounded="lg" density="compact" color="error" @click="handleLogout"></v-list-item>
          </v-card>
        </v-menu>

        <v-tooltip text="Se déconnecter" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-logout" variant="text" color="grey-darken-1" size="small" class="d-none d-md-flex" @click="handleLogout"></v-btn>
          </template>
        </v-tooltip>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid :class="isLogin ? 'pa-0 h-100' : 'pa-3 pa-sm-6'" :style="isLogin ? 'max-width: none;' : 'max-width: 1400px;'">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Speed Dial Quick Creation FAB -->
    <v-menu v-if="!isLogin" location="top left">
      <template v-slot:activator="{ props }">
        <v-tooltip text="Création rapide" location="left">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="{ ...props, ...tooltipProps }"
              icon="mdi-plus"
              color="primary"
              size="large"
              elevation="4"
              class="position-fixed"
              style="bottom: 30px; right: 30px; z-index: 99; background: linear-gradient(135deg, #0f2942 0%, #1e40af 100%) !important; box-shadow: 0 10px 25px -5px rgba(15, 41, 66, 0.4) !important;"
            ></v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-list rounded="xl" elevation="6" class="pa-2 mb-2">
        <v-list-item prepend-icon="mdi-file-document-plus-outline" title="Nouvel acte de vente" to="/actes/nouveau" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-file-undo-outline" title="Nouvelle décharge" to="/decharges/nouvelle" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-certificate-outline" title="Nouveau certificat" to="/certificats/nouveau" rounded="lg"></v-list-item>
      </v-list>
    </v-menu>

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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { api } from './services/api'
import { notification } from './services/notifier'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()
const isLogin = computed(() => route.name === 'login')

const drawer = ref(!mobile.value)
const currentUser = ref(api.auth.getUser() || null)

const userName = computed(() => {
  if (!currentUser.value) return 'Administrateur'
  const full = `${currentUser.value.prenom || ''} ${currentUser.value.nom || ''}`.trim()
  return full || currentUser.value.email || 'Utilisateur'
})

const userEmail = computed(() => currentUser.value?.email || '')

const userRole = computed(() => {
  const r = currentUser.value?.role
  if (r === 'admin') return 'Administrateur'
  if (r === 'agent') return 'Agent Foncier'
  if (r === 'lecteur') return 'Lecteur'
  return r || 'Connecté'
})

const userInitials = computed(() => {
  if (!currentUser.value) return 'TB'
  const p = (currentUser.value.prenom || '')[0] || ''
  const n = (currentUser.value.nom || '')[0] || ''
  if (p || n) return (p + n).toUpperCase()
  return (currentUser.value.email || 'TB').substring(0, 2).toUpperCase()
})

// --- Global Search ---
const globalSearch = ref('')
const showSearchResults = ref(false)
const searching = ref(false)
let searchTimeout = null

const searchResults = ref({
  parcelles: [],
  actes: [],
  certificats: [],
  decharges: [],
  proprietaires: []
})

const onGlobalSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!globalSearch.value || globalSearch.value.length < 2) {
    searchResults.value = { parcelles: [], actes: [], certificats: [], decharges: [], proprietaires: [] }
    return
  }
  searchTimeout = setTimeout(async () => {
    searching.value = true
    showSearchResults.value = true
    const q = globalSearch.value.toLowerCase()
    try {
      const [parcelles, actes, certificats, decharges, proprietaires] = await Promise.allSettled([
        api.parcelles.getAll(0, 200),
        api.actes.getAll(0, 200),
        api.certificats.getAll(0, 200),
        api.decharges ? api.decharges.getAll(0, 200) : Promise.resolve([]),
        api.proprietaires.getAll(0, 200)
      ])

      searchResults.value.parcelles = (parcelles.status === 'fulfilled' ? parcelles.value : [])
        .filter(p => (p.numero_parcelle || '').toLowerCase().includes(q) || (p.localisation || '').toLowerCase().includes(q))
        .slice(0, 5)

      searchResults.value.actes = (actes.status === 'fulfilled' ? actes.value : [])
        .filter(a => (a.numero_acte || '').toLowerCase().includes(q) || (a.vendeur_nom || '').toLowerCase().includes(q) || (a.acheteur_nom || '').toLowerCase().includes(q))
        .slice(0, 5)

      searchResults.value.decharges = (decharges.status === 'fulfilled' ? decharges.value : [])
        .filter(d => (d.numero_decharge || '').toLowerCase().includes(q) || (d.receveur_nom || '').toLowerCase().includes(q) || (d.remettant_nom || '').toLowerCase().includes(q))
        .slice(0, 5)

      searchResults.value.certificats = (certificats.status === 'fulfilled' ? certificats.value : [])
        .filter(c => (c.numero_certificat || '').toLowerCase().includes(q) || (c.nom_titulaire || '').toLowerCase().includes(q))
        .slice(0, 5)

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
  searchResults.value = { parcelles: [], actes: [], certificats: [], decharges: [], proprietaires: [] }
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
  if (r.decharges.length > 0) return goTo(`/decharges/${r.decharges[0].id}`)
  if (r.certificats.length > 0) return goTo(`/certificats/${r.certificats[0].id}`)
  if (r.proprietaires.length > 0) return goTo('/parcelles')
}

const onClickOutside = (e) => {
  if (!e.target.closest('.search-dropdown') && !e.target.closest('.v-text-field')) {
    showSearchResults.value = false
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

const fetchUser = async () => {
  if (!api.auth.isAuthenticated()) {
    currentUser.value = null
    return
  }
  try {
    const user = await api.auth.getMe()
    if (user) {
      currentUser.value = user
    }
  } catch (err) {
    console.warn('Erreur chargement session utilisateur:', err)
  }
}

const handleLogout = () => {
  api.auth.logout()
  currentUser.value = null
  router.push('/login')
}

watch(() => route.path, () => {
  if (!isLogin.value) {
    fetchUser()
  }
}, { immediate: true })
</script>

<style>
.bg-slate-50 {
  background-color: #f8fafc !important;
}
.border-slate-200 {
  border-color: #e2e8f0 !important;
}
</style>
