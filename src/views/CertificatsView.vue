<template>
  <div>
    <!-- Breadcrumb -->
    <div class="text-caption text-grey-darken-1 mb-1">
      <span class="text-grey-darken-1">Accueil</span> › <span class="font-weight-medium text-grey-darken-3">Certificats d'occupation</span>
    </div>

    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #1a3b5c;">Certificats d'occupation</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Gérez et suivez les titres d'occupation du village de Taofikh Bousso.</div>
      </div>
      <v-btn color="#0a2540" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-medium">
        Nouveau certificat
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <!-- TOTAL ACTIFS -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg">
              <v-icon color="blue-darken-2">mdi-check-decagram-outline</v-icon>
            </v-avatar>
            <v-chip color="success" size="small" variant="flat" class="font-weight-bold text-caption bg-green-lighten-5 text-green-darken-2">+16%</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">TOTAL ACTIFS</div>
          <div class="text-h4 font-weight-black" style="color: #1a3b5c;">1,284</div>
        </v-card>
      </v-col>

      <!-- EN EXPIRATION -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="orange-lighten-5" size="48" rounded="lg">
              <v-icon color="orange-darken-2">mdi-clock-alert-outline</v-icon>
            </v-avatar>
            <v-chip color="error" size="small" variant="flat" class="font-weight-bold text-caption bg-red-lighten-5 text-red-darken-2">Action</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">EN EXPIRATION</div>
          <div class="text-h4 font-weight-black" style="color: #e65100;">42</div>
        </v-card>
      </v-col>

      <!-- BROUILLONS -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="grey-lighten-4" size="48" rounded="lg">
              <v-icon color="grey-darken-2">mdi-file-edit-outline</v-icon>
            </v-avatar>
            <v-chip color="grey" size="small" variant="flat" class="font-weight-bold text-caption bg-grey-lighten-4 text-grey-darken-2">Stable</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">BROUILLONS</div>
          <div class="text-h4 font-weight-black" style="color: #424242;">15</div>
        </v-card>
      </v-col>

      <!-- RÉVOCATIONS -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="red-lighten-5" size="48" rounded="lg">
              <v-icon color="red-darken-2">mdi-close-circle-outline</v-icon>
            </v-avatar>
            <v-chip color="error" size="small" variant="flat" class="font-weight-bold text-caption bg-red-lighten-5 text-red-darken-2">-3%</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">RÉVOCATIONS</div>
          <div class="text-h4 font-weight-black" style="color: #c62828;">08</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Registre des Certificats -->
    <v-card elevation="0" border rounded="xl">
      <div class="d-flex justify-space-between align-center px-6 py-5 border-b">
        <div class="d-flex align-center">
          <h2 class="text-subtitle-1 font-weight-bold mr-3" style="color: #1a3b5c;">Registre des Certificats</h2>
          <v-chip size="small" color="primary" variant="flat" class="font-weight-bold text-caption">MISE À JOUR EN DIRECT</v-chip>
        </div>
        <div class="d-flex">
          <v-btn icon="mdi-filter-variant" variant="outlined" color="grey-darken-1" size="small" class="mr-2" rounded="lg"></v-btn>
          <v-btn icon="mdi-download-outline" variant="outlined" color="grey-darken-1" size="small" rounded="lg"></v-btn>
        </div>
      </div>

      <!-- Loading state -->
      <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

      <v-table>
        <thead>
          <tr>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">N° CERTIFICAT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">PROPRIÉTAIRE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">N° PARCELLE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">DATE DÉLIVRANCE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">DATE EXPIRATION</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">STATUT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in certificats" :key="item.id" class="border-b-thin">
            <td class="font-weight-bold text-primary py-4">{{ item.numero }}</td>
            <td class="py-4">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.proprietaire)" size="28" class="mr-3">
                  <span class="text-white text-caption font-weight-bold">{{ getInitials(item.proprietaire) }}</span>
                </v-avatar>
                <span class="text-grey-darken-3 font-weight-medium">{{ item.proprietaire }}</span>
              </div>
            </td>
            <td class="text-grey-darken-1 py-4">{{ item.parcelle }}</td>
            <td class="text-grey-darken-1 py-4 text-body-2">{{ item.dateDelivrance }}</td>
            <td class="text-grey-darken-1 py-4 text-body-2">{{ item.dateExpiration }}</td>
            <td class="text-center py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-bold px-4 text-caption">
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-center py-4">
              <v-btn size="x-small" variant="text" icon="mdi-eye-outline" class="mx-0" color="grey-darken-1" :to="`/certificats/${item.id}`"></v-btn>
              <v-btn size="x-small" variant="text" icon="mdi-pencil-outline" class="mx-0" color="grey-darken-1"></v-btn>
              <v-btn size="x-small" variant="text" icon="mdi-download-outline" class="mx-0" color="grey-darken-1" @click="downloadPdf(item.id)"></v-btn>
              <v-btn size="x-small" variant="text" icon="mdi-dots-vertical" class="mx-0" color="grey-darken-1"></v-btn>
            </td>
          </tr>
          <!-- Empty state -->
          <tr v-if="!loading && certificats.length === 0">
            <td colspan="7" class="text-center pa-8 text-grey-darken-1">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-certificate-outline</v-icon>
              <div>Aucun certificat trouvé</div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination -->
      <div class="d-flex justify-space-between align-center px-6 py-4 border-t">
        <div class="text-caption text-grey-darken-1">
          Affichage de <span class="font-weight-bold">1</span> à <span class="font-weight-bold">4</span> sur <span class="font-weight-bold">1,284</span> certificats
        </div>
        <div class="d-flex align-center gap-1">
          <v-btn variant="text" size="small" color="grey-darken-1" class="text-none text-caption" disabled>Précédent</v-btn>
          <v-btn size="small" variant="flat" color="#0a2540" class="text-white mx-1 rounded-sm" min-width="32" width="32">1</v-btn>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">2</v-btn>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">3</v-btn>
          <span class="text-grey-darken-1 mx-1">...</span>
          <v-btn size="small" variant="text" color="grey-darken-3" class="mx-1 rounded-sm font-weight-medium" min-width="32" width="32">321</v-btn>
          <v-btn variant="text" size="small" color="grey-darken-1" class="text-none text-caption">Suivant</v-btn>
        </div>
      </div>
    </v-card>

    <!-- Page Footer -->
    <div class="text-center mt-12 mb-6">
      <div class="text-caption font-weight-medium text-grey-darken-2 mb-2">Village de Taofikh Bousso — République du Sénégal © 2024</div>
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

const certificats = ref([
  { id: 1, numero: 'CO-2024-0012', proprietaire: 'Ousmane Kane', parcelle: 'P-98', dateDelivrance: '01/01/2024', dateExpiration: '01/01/2029', statut: 'Actif' },
  { id: 2, numero: 'CO-2024-0013', proprietaire: 'Mariam Diop', parcelle: 'P-194', dateDelivrance: '12/02/2024', dateExpiration: '02/02/2025', statut: 'Actif' },
  { id: 3, numero: 'CO-2023-0902', proprietaire: 'Babacar Sall', parcelle: 'P-43', dateDelivrance: '15/11/2023', dateExpiration: '15/11/2028', statut: 'Expiré' },
  { id: 4, numero: 'CO-2024-0005', proprietaire: 'Aminata Seck', parcelle: 'P-17', dateDelivrance: '05/01/2024', dateExpiration: '05/01/2029', statut: 'Brouillon' },
])
const loading = ref(false)

const fetchCertificats = async () => {
  loading.value = true
  try {
    const data = await api.certificats.getAll()
    if (data && data.length > 0) {
      certificats.value = data.map(cert => ({
        id: cert.id,
        numero: cert.numero_certificat || `CO-${cert.id.substring(0, 8)}`,
        proprietaire: `${cert.prenom_titulaire || ''} ${cert.nom_titulaire || ''}`.trim() || 'Inconnu',
        parcelle: cert.numero_parcelle || cert.parcelle_id.substring(0, 8),
        dateDelivrance: cert.date_delivrance ? new Date(cert.date_delivrance).toLocaleDateString('fr-FR') : '-',
        dateExpiration: cert.date_expiration ? new Date(cert.date_expiration).toLocaleDateString('fr-FR') : '-',
        statut: cert.statut || 'Brouillon'
      }))
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des certificats:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCertificats()
})

const avatarColors = ['blue-darken-2', 'green-darken-2', 'red-darken-2', 'orange-darken-2', 'purple-darken-2', 'teal-darken-2']

const getAvatarColor = (name) => {
  if (!name) return 'grey'
  const index = name.charCodeAt(0) % avatarColors.length
  return avatarColors[index]
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}

const getStatusProps = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'actif') return { color: 'success', variant: 'tonal' }
  if (s === 'expiré' || s === 'expire') return { color: 'error', variant: 'tonal' }
  if (s === 'brouillon') return { color: 'grey', variant: 'tonal' }
  if (s === 'revoque' || s === 'révoqué') return { color: 'error', variant: 'tonal' }
  return { color: 'grey', variant: 'tonal' }
}

const downloadPdf = (id) => {
  api.certificats.downloadPdf(id, `certificat_${id}.pdf`)
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
</style>
