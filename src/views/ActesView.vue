<template>
  <div>
    <!-- Header: Title and Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #1a3b5c;">Actes de vente</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Gérez et suivez l'ensemble des transactions foncières enregistrées.</div>
      </div>
      <v-btn color="#0a2540" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-medium" to="/actes/nouveau">
        Nouvel acte
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-2 mt-4" v-if="!loading">
      <!-- Total actifs -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg">
              <v-icon color="blue-darken-2">mdi-check-decagram-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">TOTAL ACTIFS</div>
          <div class="text-h4 font-weight-black" style="color: #1a3b5c;">{{ stats.actifs }}</div>
        </v-card>
      </v-col>
      <!-- En expiration -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="orange-lighten-5" size="48" rounded="lg">
              <v-icon color="orange-darken-2">mdi-clock-alert-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">EN EXPIRATION</div>
          <div class="text-h4 font-weight-black" style="color: #e65100;">{{ stats.expirations }}</div>
        </v-card>
      </v-col>
      <!-- Brouillons -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="grey-lighten-4" size="48" rounded="lg">
              <v-icon color="grey-darken-2">mdi-file-edit-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">BROUILLONS</div>
          <div class="text-h4 font-weight-black" style="color: #424242;">{{ stats.brouillons }}</div>
        </v-card>
      </v-col>
      <!-- Révocations -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="red-lighten-5" size="48" rounded="lg">
              <v-icon color="red-darken-2">mdi-close-octagon-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">RÉVOCATIONS</div>
          <div class="text-h4 font-weight-black" style="color: #c62828;">{{ stats.revocations }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Container -->
    <v-card elevation="0" border rounded="xl" class="pa-0 mt-6 bg-white">
      
      <!-- Filters Row -->
      <div class="d-flex justify-space-between align-center px-6 py-4 border-b bg-white" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
        <div class="d-flex gap-4">
          <div style="width: 200px;">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">STATUT DE L'ACTE</div>
            <v-select
              v-model="filters.statut"
              :items="['Tous les statuts', 'Validé', 'Brouillon', 'Annulé']"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              bg-color="white"
            ></v-select>
          </div>
          <div style="width: 150px;">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">ANNÉE</div>
            <v-select
              v-model="filters.annee"
              :items="['2024', '2023', '2022']"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              bg-color="white"
            ></v-select>
          </div>
        </div>
        
        <div class="d-flex mt-5">
          <v-btn icon="mdi-filter-variant" variant="outlined" color="grey-darken-1" size="small" class="mr-2" rounded="lg"></v-btn>
          <v-btn icon="mdi-download-outline" variant="outlined" color="grey-darken-1" size="small" rounded="lg"></v-btn>
        </div>
      </div>

      <!-- Table -->
      <v-table>
        <thead>
          <tr>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">N° ACTE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">VENDEUR</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">ACHETEUR</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">N° PARCELLE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">MONTANT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">STATUT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-right">DATE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in actes" :key="item.id" class="border-b-thin align-middle">
            <td class="font-weight-bold text-primary py-4"><router-link :to="`/actes/${item.rawId || item.id}`" class="text-primary text-decoration-none font-weight-bold">{{ item.id }}</router-link></td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.vendeur }}</td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.acheteur }}</td>
            <td class="text-grey-darken-1 py-4">
              <div class="d-flex align-center">
                <v-icon size="small" color="grey-lighten-1" class="mr-2">mdi-office-building-outline</v-icon>
                {{ item.parcelle }}
              </div>
            </td>
            <td class="font-weight-bold text-grey-darken-4 py-4">{{ item.montant }} FCFA</td>
            <td class="text-center py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-bold px-4 text-caption" style="text-transform: uppercase;">
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-right text-grey-darken-1 py-4 text-body-2">{{ item.date }}</td>
            <td class="text-center py-4 text-grey-darken-1">
              <v-btn size="x-small" variant="text" icon="mdi-eye-outline" class="mx-1" color="grey-darken-1" :to="`/actes/${item.rawId || item.id}`"></v-btn>
              <v-btn size="x-small" variant="text" icon="mdi-pencil-outline" class="mx-1" color="grey-darken-1"></v-btn>
              <v-btn size="x-small" variant="text" icon="mdi-download-outline" class="mx-1" color="grey-darken-1" @click="downloadPdf(item.rawId)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination / Footer -->
      <div class="d-flex justify-space-between align-center px-6 py-4 border-t bg-white" style="border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;">
        <div class="text-caption text-grey-darken-1">
          Affichage de <span class="font-weight-bold">1</span> à <span class="font-weight-bold">{{ actes.length }}</span> sur <span class="font-weight-bold">{{ actes.length }}</span> actes
        </div>
        <div class="d-flex align-center gap-1">
          <v-btn icon="mdi-chevron-left" variant="text" size="small" color="grey-darken-1" disabled></v-btn>
          <v-btn size="small" variant="flat" color="#0a2540" class="text-white mx-1 rounded-sm" min-width="32" width="32">1</v-btn>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">2</v-btn>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">3</v-btn>
          <span class="text-grey-darken-1 mx-1">...</span>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">5</v-btn>
          <v-btn icon="mdi-chevron-right" variant="text" size="small" color="grey-darken-1"></v-btn>
        </div>
      </div>
    </v-card>

    <!-- Page Footer -->
    <div class="text-center mt-12 mb-6">
      <div class="text-caption font-weight-medium text-grey-darken-2 mb-2">Village de Taofikh Bousso - République du Sénégal © 2024</div>
      <div class="d-flex justify-center gap-4">
        <a href="#" class="text-caption text-grey text-decoration-none mx-3 hover-primary transition-colors">Mentions Légales</a>
        <a href="#" class="text-caption text-grey text-decoration-none mx-3 hover-primary transition-colors">Vérification de Titre</a>
        <a href="#" class="text-caption text-grey text-decoration-none mx-3 hover-primary transition-colors">Contact</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../services/api'

const filters = ref({
  statut: 'Tous les statuts',
  annee: '2024'
})

const actes = ref([])
const allActes = ref([])
const loading = ref(true)

const stats = computed(() => {
  return {
    actifs: allActes.value.filter(a => a.statut.toLowerCase() === 'validé' || a.statut.toLowerCase() === 'valide').length,
    expirations: 0, // Pour les actes de vente, pas d'expiration en général
    brouillons: allActes.value.filter(a => a.statut.toLowerCase() === 'brouillon').length,
    revocations: allActes.value.filter(a => a.statut.toLowerCase() === 'annulé' || a.statut.toLowerCase() === 'annule').length
  }
})

const fetchActes = async () => {
  loading.value = true
  try {
    const data = await api.actes.getAll()
    allActes.value = data
    actes.value = data.map(acte => ({
      rawId: acte.id,
      id: acte.numero_acte || `AV-${acte.id.substring(0, 8)}`,
      vendeur: `${acte.vendeur_prenom || ''} ${acte.vendeur_nom || ''}`.trim() || 'Inconnu',
      acheteur: `${acte.acheteur_prenom || ''} ${acte.acheteur_nom || ''}`.trim() || 'Inconnu',
      parcelle: acte.numero_parcelle_info || acte.parcelle_id.substring(0, 8),
      montant: new Intl.NumberFormat('fr-FR').format(acte.montant_cfa),
      statut: acte.statut,
      date: new Date(acte.date_vente).toLocaleDateString('fr-FR')
    }))
  } catch (error) {
    console.error("Erreur lors de la récupération des actes:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActes()
})

const getStatusProps = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'validé' || s === 'valide') return { color: 'success', variant: 'tonal', class: 'bg-green-lighten-5 text-green-darken-2 font-weight-bold text-caption px-3' }
  if (s === 'brouillon') return { color: 'grey', variant: 'tonal', class: 'bg-grey-lighten-4 text-grey-darken-2 font-weight-bold text-caption px-3' }
  if (s === 'annulé' || s === 'annule') return { color: 'error', variant: 'tonal', class: 'bg-red-lighten-5 text-red-darken-2 font-weight-bold text-caption px-3' }
  return { color: 'grey', variant: 'tonal' }
}

const downloadPdf = (id) => {
  api.actes.downloadPdf(id, `acte_${id}.pdf`)
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.border-t {
  border-top: 1px solid rgba(0,0,0,0.06);
}
.border-b-thin {
  border-bottom: 1px solid rgba(0,0,0,0.03);
}
.gap-4 {
  gap: 16px;
}
.gap-1 {
  gap: 4px;
}
.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
.transition-colors {
  transition: color 0.2s ease;
}
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td {
  border-bottom: 1px solid rgba(0,0,0,0.03) !important;
}
.stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px -8px rgba(0,0,0,0.1) !important;
}
</style>
