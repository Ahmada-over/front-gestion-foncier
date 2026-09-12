<template>
  <div>
    <!-- Header: Title and Buttons -->
    <div class="d-flex flex-wrap justify-space-between align-center mb-6 ga-4">
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <h1 class="text-h5 font-weight-bold" style="color: #0f2942;">Tableau de bord</h1>
          <v-chip size="x-small" color="success" variant="tonal" class="font-weight-bold px-2">
            <v-icon start size="12" icon="mdi-circle-medium"></v-icon>
            Actif
          </v-chip>
        </div>
        <div class="text-subtitle-2 text-grey-darken-1">Aperçu général de l'activité foncière à Taofikh Bousso.</div>
      </div>
      <div class="d-flex align-center ga-2">
        <v-tooltip text="Rafraîchir les données" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-refresh"
              variant="outlined"
              color="grey-darken-2"
              size="small"
              rounded="lg"
              :loading="loading || loadingActivities"
              @click="refreshAll"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          elevation="2"
          class="text-none font-weight-bold"
          style="background: linear-gradient(135deg, #0f2942 0%, #1e40af 100%) !important; box-shadow: 0 4px 12px rgba(15, 41, 66, 0.25) !important;"
          to="/actes/nouveau"
        >
          Nouvel Acte de Vente
        </v-btn>
      </div>
    </div>

    <!-- Cards Row -->
    <v-row>
      <!-- Card 1: TOTAL ACTES DE VENTE -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card" to="/actes">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="primary" size="24">mdi-file-document-outline</v-icon>
            </v-avatar>
            <v-chip color="primary" size="small" variant="tonal" class="font-weight-bold text-caption">Actes</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">TOTAL ACTES DE VENTE</div>
          <div class="text-h4 font-weight-black" style="color: #0f2942;">
            <v-skeleton-loader v-if="loading" type="text" width="80"></v-skeleton-loader>
            <span v-else>{{ formatNumber(stats.totalActes) }}</span>
          </div>
        </v-card>
      </v-col>

      <!-- Card 2: ACTES EN ATTENTE -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card" to="/actes">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="amber-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="warning" size="24">mdi-clock-alert-outline</v-icon>
            </v-avatar>
            <v-chip v-if="stats.actesEnAttente > 0" color="warning" size="small" variant="tonal" class="font-weight-bold text-caption">À traiter</v-chip>
            <v-chip v-else color="success" size="small" variant="tonal" class="font-weight-bold text-caption">À jour</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">ACTES EN ATTENTE</div>
          <div class="text-h4 font-weight-black" style="color: #d97706;">
            <v-skeleton-loader v-if="loading" type="text" width="50"></v-skeleton-loader>
            <span v-else>{{ stats.actesEnAttente }}</span>
          </div>
        </v-card>
      </v-col>

      <!-- Card 3: CERTIFICATS ACTIFS -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card" to="/certificats">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="green-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="success" size="24">mdi-certificate-outline</v-icon>
            </v-avatar>
            <v-chip color="success" size="small" variant="tonal" class="font-weight-bold text-caption">Certifiés</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">CERTIFICATS ACTIFS</div>
          <div class="text-h4 font-weight-black" style="color: #059669;">
            <v-skeleton-loader v-if="loading" type="text" width="60"></v-skeleton-loader>
            <span v-else>{{ formatNumber(stats.certificatsActifs) }}</span>
          </div>
        </v-card>
      </v-col>

      <!-- Card 4: PARCELLES ENREGISTRÉES -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card" to="/parcelles">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="indigo-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="indigo-darken-2" size="24">mdi-map-marker-radius-outline</v-icon>
            </v-avatar>
            <v-chip color="indigo" size="small" variant="tonal" class="font-weight-bold text-caption">Cadastre</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">PARCELLES ENREGISTRÉES</div>
          <div class="text-h4 font-weight-black" style="color: #4338ca;">
            <v-skeleton-loader v-if="loading" type="text" width="70"></v-skeleton-loader>
            <span v-else>{{ formatNumber(stats.parcelles) }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activités récentes table -->
    <v-card elevation="0" border rounded="xl" class="mt-8 overflow-hidden bg-white">
      <div class="d-flex justify-space-between align-center px-6 py-5 border-b flex-wrap ga-3">
        <div class="d-flex align-center ga-3">
          <v-avatar color="blue-lighten-5" size="36" rounded="lg">
            <v-icon color="primary" size="20">mdi-history</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #0f2942;">Activités récentes</h2>
            <div class="text-caption text-grey-darken-1">Derniers actes et transactions enregistrés</div>
          </div>
        </div>
        <div class="d-flex align-center ga-2">
          <v-btn variant="tonal" color="primary" size="small" class="text-none font-weight-bold" rounded="lg" to="/actes">
            Voir tous les actes
            <v-icon end size="16">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>

      <v-progress-linear v-if="loadingActivities" indeterminate color="primary" height="3"></v-progress-linear>

      <v-table hover class="w-100">
        <thead>
          <tr>
            <th class="text-overline font-weight-bold py-3">N° ACTE</th>
            <th class="text-overline font-weight-bold py-3">VENDEUR</th>
            <th class="text-overline font-weight-bold py-3">ACHETEUR</th>
            <th class="text-overline font-weight-bold py-3">PARCELLE</th>
            <th class="text-overline font-weight-bold py-3">MONTANT</th>
            <th class="text-overline font-weight-bold py-3 text-center">STATUT</th>
            <th class="text-overline font-weight-bold py-3 text-right">DATE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activities" :key="item.id" class="hover-row">
            <td class="font-weight-bold py-4">
              <router-link :to="`/actes/${item.rawId || item.id}`" class="text-primary text-decoration-none font-weight-bold table-link d-inline-flex align-center ga-1">
                <v-icon size="16" color="primary">mdi-file-document-outline</v-icon>
                {{ item.id }}
              </router-link>
            </td>
            <td class="text-grey-darken-4 font-weight-medium py-4">{{ item.vendeur }}</td>
            <td class="text-grey-darken-4 font-weight-medium py-4">{{ item.acheteur }}</td>
            <td class="text-grey-darken-2 py-4">
              <div class="d-flex align-center ga-1">
                <v-icon size="small" color="grey-darken-1">mdi-map-marker-outline</v-icon>
                <span>{{ item.parcelle }}</span>
              </div>
            </td>
            <td class="font-weight-bold text-grey-darken-4 py-4">{{ item.montant }} FCFA</td>
            <td class="text-center py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-bold px-3">
                <v-icon start size="14" :icon="getStatusIcon(item.statut)"></v-icon>
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-right text-grey-darken-1 py-4 text-body-2 font-weight-medium">{{ item.date }}</td>
          </tr>
          <!-- Empty state -->
          <tr v-if="!loadingActivities && activities.length === 0">
            <td colspan="7" class="text-center pa-10">
              <div class="d-flex flex-column align-center justify-center">
                <v-avatar color="grey-lighten-4" size="64" class="mb-3">
                  <v-icon size="32" color="grey-darken-1">mdi-file-document-outline</v-icon>
                </v-avatar>
                <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-1">Aucune activité récente</div>
                <div class="text-caption text-grey-darken-1 mb-4">Créez votre premier acte de vente pour voir apparaître l'activité ici.</div>
                <v-btn color="primary" size="small" prepend-icon="mdi-plus" rounded="lg" to="/actes/nouveau">
                  Créer un acte de vente
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Footer -->
    <div class="text-center mt-12 mb-6">
      <div class="text-caption font-weight-medium text-grey-darken-2 mb-2">Village de Taofikh Bousso - République du Sénégal © 2024</div>
      <div class="d-flex justify-center ga-4">
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Mentions Légales</a>
        <span class="text-grey-lighten-2">•</span>
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Vérification de Titre</a>
        <span class="text-grey-lighten-2">•</span>
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Contact</a>
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

const refreshAll = () => {
  fetchStats()
  fetchActivities()
}

onMounted(() => {
  refreshAll()
})

const getStatusProps = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'validé' || s === 'valide') return { color: 'success', variant: 'tonal' }
  if (s === 'en attente' || s === 'en_attente' || s === 'brouillon') return { color: 'warning', variant: 'tonal' }
  if (s === 'révoqué' || s === 'revoque' || s === 'annulé' || s === 'annule') return { color: 'error', variant: 'tonal' }
  return { color: 'grey', variant: 'tonal' }
}

const getStatusIcon = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'validé' || s === 'valide') return 'mdi-check-circle-outline'
  if (s === 'en attente' || s === 'en_attente' || s === 'brouillon') return 'mdi-clock-outline'
  if (s === 'révoqué' || s === 'revoque' || s === 'annulé' || s === 'annule') return 'mdi-close-circle-outline'
  return 'mdi-information-outline'
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
