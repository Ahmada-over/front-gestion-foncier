<template>
  <div>
    <!-- Header: Title and Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #1a3b5c;">Tableau de bord</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Aperçu général de l'activité foncière à Taofikh Bousso.</div>
      </div>
      <v-btn color="#0a2540" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-medium" to="/actes/nouveau">
        Nouvel Acte de Vente
      </v-btn>
    </div>

    <!-- Cards Row -->
    <v-row>
      <!-- Card 1: TOTAL ACTES DE VENTE -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card transition-swing">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="blue-darken-2">mdi-file-document-outline</v-icon>
            </v-avatar>
            <v-chip color="success" size="small" variant="flat" class="font-weight-bold text-caption bg-green-lighten-5 text-green-darken-2">+4%</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">TOTAL ACTES DE VENTE</div>
          <div class="text-h4 font-weight-black stat-number" style="color: #1a3b5c;">
            <v-skeleton-loader v-if="loading" type="text" width="80"></v-skeleton-loader>
            <span v-else>{{ formatNumber(stats.totalActes) }}</span>
          </div>
        </v-card>
      </v-col>

      <!-- Card 2: ACTES EN ATTENTE -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card transition-swing">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="orange-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="orange-darken-2">mdi-file-clock-outline</v-icon>
            </v-avatar>
            <v-chip v-if="stats.actesEnAttente > 0" color="error" size="small" variant="flat" class="font-weight-bold text-caption bg-red-lighten-5 text-red-darken-2">Attention</v-chip>
            <v-chip v-else color="success" size="small" variant="flat" class="font-weight-bold text-caption bg-green-lighten-5 text-green-darken-2">OK</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">ACTES EN ATTENTE</div>
          <div class="text-h4 font-weight-black stat-number" style="color: #e65100;">
            <v-skeleton-loader v-if="loading" type="text" width="50"></v-skeleton-loader>
            <span v-else>{{ stats.actesEnAttente }}</span>
          </div>
        </v-card>
      </v-col>

      <!-- Card 3: CERTIFICATS ACTIFS -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card transition-swing">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="green-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="green-darken-2">mdi-check-decagram-outline</v-icon>
            </v-avatar>
            <v-chip color="success" size="small" variant="flat" class="font-weight-bold text-caption bg-green-lighten-5 text-green-darken-2">+12%</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">CERTIFICATS ACTIFS</div>
          <div class="text-h4 font-weight-black stat-number" style="color: #2e7d32;">
            <v-skeleton-loader v-if="loading" type="text" width="60"></v-skeleton-loader>
            <span v-else>{{ formatNumber(stats.certificatsActifs) }}</span>
          </div>
        </v-card>
      </v-col>

      <!-- Card 4: PARCELLES ENREGISTRÉES -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card transition-swing">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="grey-lighten-4" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="grey-darken-2">mdi-office-building-outline</v-icon>
            </v-avatar>
            <v-chip color="grey" size="small" variant="flat" class="font-weight-bold text-caption bg-grey-lighten-4 text-grey-darken-2">Stable</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">PARCELLES ENREGISTRÉES</div>
          <div class="text-h4 font-weight-black stat-number" style="color: #424242;">
            <v-skeleton-loader v-if="loading" type="text" width="70"></v-skeleton-loader>
            <span v-else>{{ formatNumber(stats.parcelles) }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activités récentes table -->
    <v-card elevation="0" border rounded="xl" class="mt-8">
      <div class="d-flex justify-space-between align-center px-6 py-5 border-b">
        <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Activités récentes</h2>
        <div>
          <v-btn variant="outlined" color="grey-darken-1" size="small" class="mr-3 text-none font-weight-medium" rounded="lg">
            Filtrer
          </v-btn>
          <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold" to="/actes">
            Voir tout
          </v-btn>
        </div>
      </div>

      <v-progress-linear v-if="loadingActivities" indeterminate color="primary"></v-progress-linear>

      <v-table>
        <thead>
          <tr>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3">N° ACTE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3">VENDEUR</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3">ACHETEUR</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3">PARCELLE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3">MONTANT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3 text-center">STATUT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-3 text-right">DATE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activities" :key="item.id" class="border-b-thin hover-row transition-swing">
            <td class="font-weight-bold text-primary py-4">
              <router-link :to="`/actes/${item.rawId || item.id}`" class="text-primary text-decoration-none font-weight-bold table-link">{{ item.id }}</router-link>
            </td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.vendeur }}</td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.acheteur }}</td>
            <td class="text-grey-darken-1 py-4">
              <div class="d-flex align-center">
                <v-icon size="small" color="grey-lighten-1" class="mr-2 icon-hover">mdi-map-marker-outline</v-icon>
                {{ item.parcelle }}
              </div>
            </td>
            <td class="font-weight-bold text-grey-darken-4 py-4">{{ item.montant }} FCFA</td>
            <td class="text-center py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-bold px-4 text-caption chip-hover">
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-right text-grey-darken-1 py-4 text-body-2">{{ item.date }}</td>
          </tr>
          <!-- Empty state -->
          <tr v-if="!loadingActivities && activities.length === 0">
            <td colspan="7" class="text-center pa-8 text-grey-darken-1">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-file-document-outline</v-icon>
              <div>Aucune activité récente</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Footer -->
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
import { ref, onMounted } from 'vue'
import { api } from '../services/api'

const loading = ref(true)
const loadingActivities = ref(true)

const stats = ref({
  totalActes: 0,
  actesEnAttente: 0,
  certificatsActifs: 0,
  parcelles: 0
})

const activities = ref([])

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const fetchStats = async () => {
  loading.value = true
  try {
    // Fetch all data in parallel
    const [actes, certificats, parcelles] = await Promise.allSettled([
      api.actes.getAll(0, 1000),
      api.certificats.getAll(0, 1000),
      api.parcelles.getAll(0, 1000)
    ])

    // Total Actes
    const actesData = actes.status === 'fulfilled' ? actes.value : []
    stats.value.totalActes = actesData.length

    // Actes en attente (brouillon)
    stats.value.actesEnAttente = actesData.filter(a => {
      const s = (a.statut || '').toLowerCase()
      return s === 'brouillon' || s === 'en_attente' || s === 'en attente'
    }).length

    // Certificats actifs
    const certsData = certificats.status === 'fulfilled' ? certificats.value : []
    stats.value.certificatsActifs = certsData.filter(c => {
      const s = (c.statut || '').toLowerCase()
      return s === 'actif'
    }).length || certsData.length

    // Parcelles
    const parcellesData = parcelles.status === 'fulfilled' ? parcelles.value : []
    stats.value.parcelles = parcellesData.length
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
}

const fetchActivities = async () => {
  loadingActivities.value = true
  try {
    const data = await api.actes.getAll(0, 10)
    activities.value = data.map(acte => ({
      rawId: acte.id,
      id: acte.numero_acte || `AV-${acte.id.substring(0, 8)}`,
      vendeur: `${acte.vendeur_prenom || ''} ${acte.vendeur_nom || ''}`.trim() || '-',
      acheteur: `${acte.acheteur_prenom || ''} ${acte.acheteur_nom || ''}`.trim() || '-',
      parcelle: acte.numero_parcelle || '-',
      montant: acte.montant ? new Intl.NumberFormat('fr-FR').format(acte.montant) : '0',
      statut: acte.statut || 'Brouillon',
      date: acte.date_vente ? new Date(acte.date_vente).toLocaleDateString('fr-FR') : '-'
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des activités:', error)
  } finally {
    loadingActivities.value = false
  }
}

onMounted(() => {
  fetchStats()
  fetchActivities()
})

const getStatusProps = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'validé' || s === 'valide') return { color: 'success', variant: 'tonal' }
  if (s === 'en attente' || s === 'en_attente' || s === 'brouillon') return { color: 'warning', variant: 'tonal' }
  if (s === 'révoqué' || s === 'revoque' || s === 'annulé' || s === 'annule') return { color: 'error', variant: 'tonal' }
  return { color: 'grey', variant: 'tonal' }
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.border-b-thin {
  border-bottom: 1px solid rgba(0,0,0,0.03);
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

/* Micro-animations and hover effects */
.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.stat-card {
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -10px rgba(0,0,0,0.1) !important;
  border-color: rgba(var(--v-theme-primary), 0.2) !important;
}
.stat-card:hover .icon-avatar {
  transform: scale(1.1);
}
.stat-card .icon-avatar {
  transition: transform 0.3s ease;
}

.hover-row:hover td {
  background-color: rgba(var(--v-theme-primary), 0.02);
}
.hover-row:hover .table-link {
  text-decoration: underline !important;
}
.hover-row:hover .icon-hover {
  color: rgb(var(--v-theme-primary)) !important;
  transform: scale(1.1);
  transition: all 0.2s;
}

.v-btn {
  transition: transform 0.2s, box-shadow 0.2s;
}
.v-btn:hover {
  transform: translateY(-1px);
}
.v-btn:active {
  transform: translateY(1px);
}
</style>
