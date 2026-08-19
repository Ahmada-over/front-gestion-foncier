<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold" style="color: #1a3b5c;">Répertoire des Propriétaires</h1>
        <p class="text-subtitle-1 text-grey-darken-1 mt-1">Gérez et consultez la liste des propriétaires fonciers enregistrés.</p>
      </div>
      <v-btn color="#0f2942" prepend-icon="mdi-account-plus" class="text-none font-weight-bold rounded-lg px-6" size="large" elevation="0" @click="newProprietaireDialog = true">
        Nouveau Propriétaire
      </v-btn>
    </div>

    <!-- Dialog Nouveau Propriétaire -->
    <v-dialog v-model="newProprietaireDialog" max-width="500" persistent>
      <v-card rounded="xl" class="pa-2">
        <v-progress-linear v-if="savingProprietaire" indeterminate color="primary" height="4" class="rounded-top"></v-progress-linear>
        <v-card-title class="text-subtitle-1 font-weight-bold pt-4 px-6" style="color: #0f2942;">
          Créer un nouveau propriétaire
        </v-card-title>
        <v-card-text class="px-6 pb-6 pt-2">
          <v-text-field v-model="newProprietaire.prenom" label="Prénom *" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.nom" label="Nom *" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.cin" label="N° CIN / Passeport *" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.telephone" label="Téléphone" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.adresse" label="Adresse" variant="outlined" density="compact" rounded="lg" :disabled="savingProprietaire"></v-text-field>
        </v-card-text>
        <v-card-actions class="px-6 pb-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="text-none" :disabled="savingProprietaire" @click="newProprietaireDialog = false">Annuler</v-btn>
          <v-btn variant="flat" color="primary" class="text-none font-weight-bold" rounded="lg" @click="saveNewProprietaire" :loading="savingProprietaire">Créer le propriétaire</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- KPIs -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 d-flex flex-column">
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="text-subtitle-1 font-weight-medium text-grey-darken-3">Total Propriétaires</div>
            <v-avatar color="blue-lighten-5" size="40">
              <v-icon color="blue-darken-2">mdi-account-group</v-icon>
            </v-avatar>
          </div>
          <div class="text-h4 font-weight-bold mb-2" style="color: #1a3b5c;">{{ stats.total }}</div>
          <div class="d-flex align-center mt-auto">
            <v-icon size="small" color="success" class="mr-1">mdi-arrow-up</v-icon>
            <span class="text-caption text-success font-weight-medium">+2.4% ce mois</span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 d-flex flex-column">
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="text-subtitle-1 font-weight-medium text-grey-darken-3">Nouveaux (Ce mois)</div>
            <v-avatar color="teal-lighten-5" size="40">
              <v-icon color="teal-darken-2">mdi-account-multiple-plus</v-icon>
            </v-avatar>
          </div>
          <div class="text-h4 font-weight-bold mb-2" style="color: #1a3b5c;">{{ stats.nouveaux }}</div>
          <div class="d-flex align-center mt-auto">
            <span class="text-caption text-grey-darken-1">En attente de validation: 12</span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 d-flex flex-column">
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="text-subtitle-1 font-weight-medium text-grey-darken-3">Titres Actifs</div>
            <v-avatar color="green-lighten-5" size="40">
              <v-icon color="success">mdi-check-decagram</v-icon>
            </v-avatar>
          </div>
          <div class="text-h4 font-weight-bold mb-2" style="color: #1a3b5c;">{{ stats.actifs }}</div>
          <div class="d-flex align-center mt-auto">
            <span class="text-caption text-grey-darken-1">Propriétaires en règle</span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 d-flex flex-column">
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="text-subtitle-1 font-weight-medium text-grey-darken-3">Paiements en Attente</div>
            <v-avatar color="red-lighten-5" size="40">
              <v-icon color="error">mdi-cash-remove</v-icon>
            </v-avatar>
          </div>
          <div class="text-h4 font-weight-bold mb-2" style="color: #1a3b5c;">{{ stats.paiementsEnAttente || 156 }}</div>
          <div class="d-flex align-center mt-auto">
            <v-icon size="small" color="error" class="mr-1">mdi-alert-outline</v-icon>
            <span class="text-caption text-error font-weight-medium">Nécessite attention</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters & List -->
    <v-card elevation="0" border rounded="xl" class="mb-8 overflow-hidden">
      <!-- Toolbar -->
      <div class="d-flex flex-wrap align-center justify-space-between pa-4 bg-grey-lighten-5 border-b">
        <v-text-field
          v-model="search"
          placeholder="Rechercher par nom, CNI ou numéro de parcelle..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          class="flex-grow-1 mr-4"
          style="max-width: 500px;"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex align-center gap-3 mt-4 mt-sm-0">
          <v-select
            v-model="statusFilter"
            :items="['Tous', 'Validé', 'En vérification', 'Dossier Incomplet']"
            label="Statut"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            class="min-width-150"
            rounded="lg"
          ></v-select>
          <v-btn variant="outlined" color="grey-darken-2" prepend-icon="mdi-filter-variant" rounded="lg" class="text-none bg-white">
            Filtres
          </v-btn>
        </div>
      </div>

      <!-- Table -->
      <v-table>
        <thead class="bg-grey-lighten-5">
          <tr>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">ID / PROFIL</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">NOM COMPLET</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">CNI</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">CONTACT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">PARCELLES</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">STATUT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </td>
          </tr>
          <tr v-else-if="filteredProprietaires.length === 0">
            <td colspan="7" class="text-center py-8 text-grey">Aucun propriétaire trouvé.</td>
          </tr>
          <tr v-for="item in filteredProprietaires" :key="item.id" class="border-b-thin align-middle hover-row">
            <td class="py-4">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.nom)" size="40" class="mr-3 text-white font-weight-bold">
                  {{ getInitials(item.prenom, item.nom) }}
                </v-avatar>
                <div>
                  <router-link :to="`/proprietaires/${item.id}`" class="text-primary text-decoration-none font-weight-bold">
                    {{ item.reference }}
                  </router-link>
                </div>
              </div>
            </td>
            <td class="font-weight-medium text-grey-darken-4 py-4">{{ item.prenom }} {{ item.nom }}</td>
            <td class="text-grey-darken-2 py-4">{{ formatCNI(item.cin) }}</td>
            <td class="py-4">
              <div class="text-body-2 text-grey-darken-4">{{ formatPhone(item.telephone) }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.email || 'Non renseigné' }}</div>
            </td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.parcellesCount || 0 }}</td>
            <td class="py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-medium px-3 text-caption">
                <v-icon start size="x-small" class="mr-1">mdi-circle</v-icon>
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-center py-4 text-grey-darken-1">
              <v-btn size="small" variant="text" icon="mdi-eye-outline" color="primary" class="mx-1" :to="`/proprietaires/${item.id}`"></v-btn>
              <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="grey-darken-2" class="mx-1"></v-btn>
              <v-btn size="small" variant="text" icon="mdi-email-outline" color="grey-darken-2" class="mx-1"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination -->
      <div class="d-flex justify-space-between align-center px-6 py-4 border-t bg-white">
        <div class="text-caption text-grey-darken-1">
          Affichage de <span class="font-weight-bold">1-{{ filteredProprietaires.length }}</span> sur <span class="font-weight-bold">{{ proprietaires.length }}</span>
        </div>
        <div class="d-flex align-center gap-1">
          <v-btn icon="mdi-chevron-left" variant="text" size="small" color="grey-darken-1" disabled></v-btn>
          <v-btn size="small" variant="flat" color="#0a2540" class="text-white mx-1 rounded-sm" min-width="32" width="32">1</v-btn>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">2</v-btn>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">3</v-btn>
          <span class="text-grey-darken-1 mx-1">...</span>
          <v-btn icon="mdi-chevron-right" variant="text" size="small" color="grey-darken-1"></v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../services/api'
import { notification } from '../services/notifier'

const search = ref('')
const statusFilter = ref('Tous')
const proprietaires = ref([])
const loading = ref(true)

const newProprietaireDialog = ref(false)
const savingProprietaire = ref(false)
const newProprietaire = ref({
  nom: '',
  prenom: '',
  cin: '',
  telephone: '',
  adresse: ''
})

const saveNewProprietaire = async () => {
  if (!newProprietaire.value.nom || !newProprietaire.value.prenom || !newProprietaire.value.cin) {
    notification.error('Veuillez remplir le prénom, le nom et la CIN')
    return
  }

  savingProprietaire.value = true
  try {
    await api.proprietaires.create(newProprietaire.value)
    notification.success('Propriétaire créé avec succès !')
    newProprietaireDialog.value = false
    newProprietaire.value = { nom: '', prenom: '', cin: '', telephone: '', adresse: '' }
    await fetchProprietaires()
  } catch (e) {
    notification.error('Erreur lors de la création: ' + e.message)
  } finally {
    savingProprietaire.value = false
  }
}

// Mocked stats since backend doesn't have aggregate endpoints yet
const stats = ref({
  total: 0,
  nouveaux: 0,
  actifs: 0
})

const fetchProprietaires = async () => {
  loading.value = true
  try {
    const data = await api.proprietaires.getAll()
    proprietaires.value = data.map((p, i) => {
      return {
        ...p,
        reference: `#PR-${new Date(p.created_at).getFullYear()}-${p.id.substring(0, 4).toUpperCase()}`,
        parcellesCount: p.parcellesCount || 0,
        statut: p.statut || 'Validé'
      }
    })
    
    const statsData = await api.proprietaires.getStats()
    stats.value = {
      total: statsData.total || 0,
      nouveaux: statsData.nouveaux || 0,
      actifs: statsData.actifs || 0
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des propriétaires:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProprietaires()
})

const filteredProprietaires = computed(() => {
  return proprietaires.value.filter(p => {
    const matchesSearch = !search.value || 
      `${p.prenom} ${p.nom}`.toLowerCase().includes(search.value.toLowerCase()) ||
      p.cin.includes(search.value) ||
      p.reference.toLowerCase().includes(search.value.toLowerCase())
      
    const matchesStatus = statusFilter.value === 'Tous' || p.statut === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const getInitials = (prenom, nom) => {
  return `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`.toUpperCase()
}

const getAvatarColor = (nom) => {
  const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'teal', 'green', 'blue-grey']
  const index = (nom || '').charCodeAt(0) % colors.length
  return colors[index]
}

const formatCNI = (cin) => {
  if (!cin) return ''
  // Format as X XXX XXXX XXXXX
  const s = cin.replace(/\D/g, '')
  if (s.length >= 13) {
    return `${s.substring(0, 1)} ${s.substring(1, 4)} ${s.substring(4, 8)} ${s.substring(8)}`
  }
  return cin
}

const formatPhone = (phone) => {
  if (!phone) return 'Non renseigné'
  return phone
}

const getStatusProps = (statut) => {
  if (statut === 'Validé') return { color: 'success', class: 'bg-green-lighten-5 text-green-darken-2' }
  if (statut === 'En vérification') return { color: 'grey-darken-2', class: 'bg-grey-lighten-3 text-grey-darken-3' }
  if (statut === 'Dossier Incomplet') return { color: 'error', class: 'bg-red-lighten-5 text-red-darken-2' }
  return { color: 'grey', class: 'bg-grey-lighten-4 text-grey-darken-2' }
}
</script>

<style scoped>
.border-b { border-bottom: 1px solid rgba(0,0,0,0.06); }
.border-t { border-top: 1px solid rgba(0,0,0,0.06); }
.border-b-thin { border-bottom: 1px solid rgba(0,0,0,0.04); }
.gap-3 { gap: 12px; }
.gap-1 { gap: 4px; }
.min-width-150 { min-width: 150px; }
.hover-row:hover { background-color: #f8fafc; }
</style>
