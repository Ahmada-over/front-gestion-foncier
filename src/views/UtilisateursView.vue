<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #0f2942;">Gestion des Utilisateurs</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Gérez les comptes, les rôles (Admin, Agent, Lecteur) et les accès au système.</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-account-plus-outline" rounded="lg" class="text-none font-weight-bold" @click="openCreateModal">
        Nouvel utilisateur
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-2 mt-4" v-if="!loading">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg">
              <v-icon color="primary">mdi-account-group-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">TOTAL UTILISATEURS</div>
          <div class="text-h4 font-weight-black" style="color: #0f2942;">{{ stats.total }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="purple-lighten-5" size="48" rounded="lg">
              <v-icon color="purple-darken-2">mdi-shield-account-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">ADMINISTRATEURS</div>
          <div class="text-h4 font-weight-black" style="color: #6a1b9a;">{{ stats.admins }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="cyan-lighten-5" size="48" rounded="lg">
              <v-icon color="cyan-darken-2">mdi-account-tie-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">AGENTS FONCIERS</div>
          <div class="text-h4 font-weight-black" style="color: #00838f;">{{ stats.agents }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="green-lighten-5" size="48" rounded="lg">
              <v-icon color="green-darken-2">mdi-check-decagram-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">COMPTES ACTIFS</div>
          <div class="text-h4 font-weight-black" style="color: #2e7d32;">{{ stats.actifs }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table Container -->
    <v-card elevation="0" border rounded="xl" class="pa-0 mt-6 bg-white">
      <div class="d-flex justify-space-between align-center px-6 py-4 border-b bg-white" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
        <div class="d-flex gap-4 align-center">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Rechercher un nom, email..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 320px;"
            clearable
          ></v-text-field>

          <v-select
            v-model="filterRole"
            :items="['Tous', 'admin', 'agent', 'lecteur']"
            label="Rôle"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 160px;"
          ></v-select>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        hover
        class="custom-table"
      >
        <!-- Utilisateur -->
        <template v-slot:item.user="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary" size="36" class="mr-3 text-white font-weight-bold">
              {{ (item.prenom[0] + item.nom[0]).toUpperCase() }}
            </v-avatar>
            <div>
              <div class="font-weight-bold" style="color: #0f2942;">{{ item.prenom }} {{ item.nom }}</div>
              <div class="text-caption text-grey">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Rôle -->
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
            variant="flat"
            class="font-weight-bold text-uppercase"
          >
            {{ item.role }}
          </v-chip>
        </template>

        <!-- Statut -->
        <template v-slot:item.actif="{ item }">
          <v-chip
            :color="item.actif ? 'success' : 'grey'"
            size="small"
            variant="tonal"
            class="font-weight-bold"
          >
            {{ item.actif ? 'Actif' : 'Inactif' }}
          </v-chip>
        </template>

        <!-- Date de création -->
        <template v-slot:item.created_at="{ item }">
          <div class="text-body-2">{{ formatDate(item.created_at) }}</div>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"></v-btn>
            </template>
            <v-list density="compact" rounded="lg">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Éditer" @click="openEditModal(item)"></v-list-item>
              <v-list-item 
                :prepend-icon="item.actif ? 'mdi-account-off-outline' : 'mdi-account-check-outline'" 
                :title="item.actif ? 'Désactiver' : 'Activer'" 
                :color="item.actif ? 'error' : 'success'"
                @click="toggleUserActive(item)"
              ></v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal Créer / Éditer Utilisateur -->
    <v-dialog v-model="userModal" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="text-subtitle-1 font-weight-bold pt-6 px-6" style="color: #0f2942;">
          {{ isEditing ? 'Éditer l\'utilisateur' : 'Créer un utilisateur' }}
        </v-card-title>
        <v-card-text class="px-6 pb-6 pt-2">
          <v-text-field v-model="userForm.prenom" label="Prénom *" variant="outlined" density="compact" class="mb-3" rounded="lg"></v-text-field>
          <v-text-field v-model="userForm.nom" label="Nom *" variant="outlined" density="compact" class="mb-3" rounded="lg"></v-text-field>
          <v-text-field v-model="userForm.email" label="Adresse Email *" type="email" variant="outlined" density="compact" class="mb-3" rounded="lg"></v-text-field>
          
          <v-select
            v-model="userForm.role"
            :items="['admin', 'agent', 'lecteur']"
            label="Rôle *"
            variant="outlined"
            density="compact"
            class="mb-3"
            rounded="lg"
          ></v-select>

          <v-text-field
            v-model="userForm.password"
            :label="isEditing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'"
            type="password"
            variant="outlined"
            density="compact"
            rounded="lg"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="text-none" @click="userModal = false">Annuler</v-btn>
          <v-btn color="primary" class="text-none font-weight-bold" rounded="lg" @click="saveUser" :loading="saving">
            {{ isEditing ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../services/api'
import { notification } from '../services/notifier'

const loading = ref(true)
const search = ref('')
const filterRole = ref('Tous')
const users = ref([])

const userModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const selectedUserId = ref(null)

const userForm = ref({
  nom: '',
  prenom: '',
  email: '',
  role: 'agent',
  password: '',
  actif: true
})

const headers = [
  { title: 'Utilisateur', key: 'user', sortable: true },
  { title: 'Rôle', key: 'role', sortable: true },
  { title: 'Statut', key: 'actif', sortable: true },
  { title: 'Créé le', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const stats = computed(() => {
  const total = users.value.length
  const admins = users.value.filter(u => u.role === 'admin').length
  const agents = users.value.filter(u => u.role === 'agent').length
  const actifs = users.value.filter(u => u.actif).length
  return { total, admins, agents, actifs }
})

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesRole = filterRole.value === 'Tous' || u.role.toLowerCase() === filterRole.value.toLowerCase()
    const q = search.value.toLowerCase()
    const matchesSearch = !q ||
      (u.nom || '').toLowerCase().includes(q) ||
      (u.prenom || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    return matchesRole && matchesSearch
  })
})

const fetchUsers = async () => {
  loading.value = true
  try {
    users.value = await api.utilisateurs.getAll()
  } catch (e) {
    notification.error('Erreur lors du chargement des utilisateurs: ' + e.message)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  selectedUserId.value = null
  userForm.value = { nom: '', prenom: '', email: '', role: 'agent', password: '', actif: true }
  userModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  selectedUserId.value = item.id
  userForm.value = {
    nom: item.nom,
    prenom: item.prenom,
    email: item.email,
    role: item.role,
    password: '',
    actif: item.actif
  }
  userModal.value = true
}

const saveUser = async () => {
  if (!userForm.value.nom || !userForm.value.prenom || !userForm.value.email) {
    notification.error('Veuillez remplir les champs obligatoires')
    return
  }
  if (!isEditing.value && !userForm.value.password) {
    notification.error('Le mot de passe est obligatoire pour la création')
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      const payload = { ...userForm.value }
      if (!payload.password) delete payload.password
      await api.utilisateurs.update(selectedUserId.value, payload)
      notification.success('Utilisateur mis à jour avec succès !')
    } else {
      await api.utilisateurs.create(userForm.value)
      notification.success('Utilisateur créé avec succès !')
    }
    userModal.value = false
    await fetchUsers()
  } catch (e) {
    notification.error('Erreur: ' + e.message)
  } finally {
    saving.value = false
  }
}

const toggleUserActive = async (user) => {
  try {
    await api.utilisateurs.update(user.id, { actif: !user.actif })
    notification.success(`Compte ${!user.actif ? 'activé' : 'désactivé'} avec succès`)
    await fetchUsers()
  } catch (e) {
    notification.error('Erreur: ' + e.message)
  }
}

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'purple-darken-2'
    case 'agent': return 'blue-darken-2'
    case 'lecteur': return 'success'
    default: return 'grey'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
</style>
