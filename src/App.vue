<template>
  <v-app class="bg-grey-lighten-4">
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-if="!isLogin" v-model="drawer" app elevation="1" border="0" width="260">
      <div class="px-4 py-4 d-flex align-center">
        <v-avatar color="primary" size="32" class="mr-3">
          <span class="text-white text-caption font-weight-bold">TB</span>
        </v-avatar>
        <div>
          <div class="font-weight-bold text-subtitle-2" style="line-height: 1.2;">Taofikh Bousso</div>
          <div class="text-caption text-grey" style="line-height: 1;">GESTION FONCIÈRE</div>
        </div>
      </div>

      <v-divider class="mb-2"></v-divider>

      <v-list density="compact" nav class="px-3">
        <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Tableau de bord" value="home" to="/" active-color="primary" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-file-document-outline" title="Actes de vente" value="actes" to="/actes" active-color="primary" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-certificate-outline" title="Certificats d'occupation" value="certificats" to="/certificats" active-color="primary" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-map-marker-outline" title="Parcelles" value="parcelles" to="/parcelles" active-color="primary" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="Propriétaires" value="proprietaires" active-color="primary" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-account-outline" title="Utilisateurs" value="utilisateurs" active-color="primary" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-history" title="Historique" value="historique" active-color="primary" rounded="lg"></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list density="compact" nav class="px-3 pb-4">
          <v-list-item prepend-icon="mdi-help-circle-outline" title="Aide" value="aide" active-color="primary" rounded="lg"></v-list-item>
          <v-list-item prepend-icon="mdi-headset" title="Support" value="support" active-color="primary" rounded="lg"></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar v-if="!isLogin" app color="white" elevation="1" height="70">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      
      <div class="px-4 w-100 max-w-md" style="max-width: 500px;">
        <v-text-field
          prepend-inner-icon="mdi-magnify"
          placeholder="Rechercher une parcelle, un acte..."
          variant="solo"
          density="compact"
          hide-details
          flat
          bg-color="grey-lighten-4"
          rounded="lg"
        ></v-text-field>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center pr-4">
        <v-btn icon="mdi-bell-outline" variant="text" color="grey-darken-1" size="small" class="mr-2"></v-btn>
        <v-btn icon="mdi-cog-outline" variant="text" color="grey-darken-1" size="small" class="mr-4"></v-btn>
        
        <div class="d-flex align-center text-right mr-3">
          <div>
            <div class="text-subtitle-2 font-weight-medium text-primary" style="line-height: 1.2;">{{ userName }}</div>
            <div class="text-caption text-grey">{{ userRole }}</div>
          </div>
        </div>
        <v-avatar size="36" color="grey-lighten-2" class="mr-2">
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User"></v-img>
        </v-avatar>
        <v-btn icon="mdi-logout" variant="text" color="grey-darken-1" size="small" @click="handleLogout"></v-btn>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid :class="isLogin ? 'pa-0 h-100' : 'pa-6'" :style="isLogin ? 'max-width: none;' : 'max-width: 1400px;'">
        <router-view></router-view>
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
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from './services/api'

const route = useRoute()
const router = useRouter()
const isLogin = computed(() => route.name === 'login')

const drawer = ref(true)
const userName = ref('Administrateur')
const userRole = ref('Admin')

const fetchUser = async () => {
  if (!api.auth.isAuthenticated()) return
  try {
    const user = await api.auth.getMe()
    if (user) {
      userName.value = user.nom || user.prenom ? `${user.prenom || ''} ${user.nom || ''}`.trim() : user.email
      userRole.value = user.role || 'Utilisateur'
    }
  } catch (e) {
    // Silently fail, keep defaults
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
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}
.v-list-item--active .v-list-item__prepend > .v-icon {
  color: rgb(var(--v-theme-primary));
}
.v-list-item--active .v-list-item-title {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
