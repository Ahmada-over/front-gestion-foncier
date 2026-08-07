<template>
  <div v-if="loading" class="d-flex justify-center align-center h-100 py-16">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>
  <div v-else-if="proprietaire">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-space-between align-center mb-8 gap-4">
      <div class="d-flex align-center">
        <v-avatar :color="getAvatarColor(proprietaire.nom)" size="80" class="mr-6 text-white font-weight-bold text-h4 shadow-sm">
          {{ getInitials(proprietaire.prenom, proprietaire.nom) }}
        </v-avatar>
        <div>
          <div class="d-flex align-center mb-1">
            <h1 class="text-h4 font-weight-bold mr-2" style="color: #1a3b5c;">{{ proprietaire.prenom }} {{ proprietaire.nom }}</h1>
            <v-icon color="success" size="24">mdi-check-decagram</v-icon>
          </div>
          <div class="d-flex align-center text-body-2 text-grey-darken-1">
            <v-icon size="small" class="mr-1">mdi-card-account-details-outline</v-icon>
            ID: {{ proprietaire.reference }}
            <span class="mx-2">•</span>
            <v-chip color="success" size="x-small" class="font-weight-medium px-2" variant="tonal">Actif</v-chip>
          </div>
        </div>
      </div>
      <div class="d-flex gap-3">
        <v-btn variant="outlined" color="primary" prepend-icon="mdi-pencil" rounded="lg" class="text-none bg-white font-weight-medium">
          Modifier
        </v-btn>
        <v-btn variant="outlined" color="grey-darken-2" prepend-icon="mdi-export-variant" rounded="lg" class="text-none bg-white font-weight-medium">
          Exporter
        </v-btn>
        <v-btn color="#0a2540" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-medium px-5">
          Ajouter Parcelle
        </v-btn>
      </div>
    </div>

    <v-row>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="4">
        <!-- Informations Personnelles -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-avatar color="blue-lighten-5" size="36" class="mr-3">
              <v-icon color="blue-darken-2" size="20">mdi-card-account-details-outline</v-icon>
            </v-avatar>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Informations Personnelles</h2>
          </div>
          <v-divider class="mb-6"></v-divider>

          <div class="mb-5">
            <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Numéro CNI</div>
            <div class="text-body-1 font-weight-medium text-grey-darken-4">{{ formatCNI(proprietaire.cin) }}</div>
          </div>
          <div class="mb-5">
            <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Date de Naissance</div>
            <div class="text-body-1 font-weight-medium text-grey-darken-4">{{ mockBirthDate() }} <span class="text-grey-darken-1">({{ mockAge() }} ans)</span></div>
          </div>
          <div class="mb-5">
            <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Téléphone</div>
            <div class="text-body-1 font-weight-medium text-grey-darken-4">{{ formatPhone(proprietaire.telephone) }}</div>
          </div>
          <div class="mb-5">
            <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Email</div>
            <div class="text-body-1 font-weight-medium text-grey-darken-4">{{ proprietaire.email }}</div>
          </div>
          <div>
            <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Adresse Principale</div>
            <div class="text-body-1 font-weight-medium text-grey-darken-4">{{ proprietaire.adresse || 'Quartier Darou Khoudoss\nTouba, Sénégal' }}</div>
          </div>
        </v-card>

        <!-- Documents Archivés -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center mb-6">
            <v-avatar color="indigo-lighten-5" size="36" class="mr-3">
              <v-icon color="indigo-darken-2" size="20">mdi-folder-outline</v-icon>
            </v-avatar>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Documents Archivés</h2>
          </div>

          <v-card variant="flat" color="grey-lighten-4" class="mb-3 d-flex align-center pa-3 rounded-lg border-thin">
            <v-avatar color="blue-lighten-4" size="40" class="mr-4 rounded">
              <v-icon color="blue-darken-2">mdi-card-account-details-outline</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-body-2 font-weight-bold text-grey-darken-4">Copie CNI</div>
              <div class="text-caption text-grey-darken-1">PDF • 1.2 MB</div>
            </div>
            <v-btn icon="mdi-download-outline" variant="text" size="small" color="grey-darken-1"></v-btn>
          </v-card>

          <v-card variant="flat" color="grey-lighten-4" class="d-flex align-center pa-3 rounded-lg border-thin">
            <v-avatar color="green-lighten-4" size="40" class="mr-4 rounded">
              <v-icon color="green-darken-2">mdi-file-document-outline</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-body-2 font-weight-bold text-grey-darken-4">Actes de Vente (ZIP)</div>
              <div class="text-caption text-grey-darken-1">Archive • 4.5 MB</div>
            </div>
            <v-btn icon="mdi-download-outline" variant="text" size="small" color="grey-darken-1"></v-btn>
          </v-card>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="8">
        <!-- Patrimoine Foncier -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-avatar color="indigo-lighten-5" size="36" class="mr-3">
                <v-icon color="indigo-darken-2" size="20">mdi-terrain</v-icon>
              </v-avatar>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Patrimoine Foncier</h2>
            </div>
            <v-chip color="grey-darken-2" variant="tonal" size="small" class="font-weight-medium">{{ parcelles.length }} Parcelles</v-chip>
          </div>

          <v-card variant="flat" color="grey-lighten-4" class="pa-4 rounded-xl border-thin">
            <v-row>
              <v-col v-for="parcelle in parcelles" :key="parcelle.id" cols="12" sm="6">
                <v-card elevation="0" border rounded="lg" class="pa-4 h-100 bg-white shadow-sm hover-lift">
                  <div class="d-flex justify-space-between align-start mb-3">
                    <div class="text-caption text-primary font-weight-bold">RÉF: {{ parcelle.numero_parcelle }}</div>
                    <v-chip v-bind="getParcelleStatusProps(parcelle.statut)" size="x-small" class="px-2 font-weight-bold text-uppercase">{{ parcelle.statut }}</v-chip>
                  </div>
                  <div class="text-body-1 font-weight-bold mb-4 text-grey-darken-4">{{ parcelle.localisation || 'Lotissement Darou' }}</div>
                  
                  <div class="d-flex justify-space-between text-body-2 mb-2">
                    <span class="text-grey-darken-1 d-flex align-center"><v-icon size="x-small" class="mr-1">mdi-ruler-square</v-icon>Superficie</span>
                    <span class="font-weight-bold text-grey-darken-4">{{ parcelle.superficie_m2 }} m²</span>
                  </div>
                  <v-divider class="my-2 border-opacity-50"></v-divider>
                  <div class="d-flex justify-space-between text-body-2 mb-2">
                    <span class="text-grey-darken-1 d-flex align-center"><v-icon size="x-small" class="mr-1">mdi-calendar</v-icon>Acquisition</span>
                    <span class="font-weight-bold text-grey-darken-4">{{ formatDate(parcelle.created_at) }}</span>
                  </div>
                  <v-divider class="my-2 border-opacity-50"></v-divider>
                  <div class="d-flex justify-space-between text-body-2">
                    <span class="text-grey-darken-1 d-flex align-center"><v-icon size="x-small" class="mr-1">mdi-map-marker-outline</v-icon>Secteur</span>
                    <span class="font-weight-medium text-grey-darken-4">{{ mockSecteur(parcelle.localisation) }}</span>
                  </div>
                </v-card>
              </v-col>
              <v-col v-if="parcelles.length === 0" cols="12">
                <div class="text-center py-6 text-grey-darken-1">Aucune parcelle trouvée pour ce propriétaire.</div>
              </v-col>
            </v-row>
          </v-card>
        </v-card>

        <!-- Historique des Transactions -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-avatar color="blue-lighten-5" size="36" class="mr-3">
                <v-icon color="blue-darken-2" size="20">mdi-receipt-text-outline</v-icon>
              </v-avatar>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Historique des Transactions</h2>
            </div>
            <a href="#" class="text-body-2 text-primary text-decoration-none font-weight-medium">Voir tout</a>
          </div>

          <v-table>
            <thead class="bg-transparent">
              <tr>
                <th class="text-caption text-grey-darken-1 font-weight-bold py-3">Date</th>
                <th class="text-caption text-grey-darken-1 font-weight-bold py-3">Type / Acte</th>
                <th class="text-caption text-grey-darken-1 font-weight-bold py-3">Parcelle</th>
                <th class="text-caption text-grey-darken-1 font-weight-bold py-3 text-right">Montant<br>(FCFA)</th>
                <th class="text-caption text-grey-darken-1 font-weight-bold py-3 text-right">Solde Dû<br>(FCFA)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="transactions.length === 0">
                <td colspan="5" class="text-center py-6 text-grey">Aucune transaction trouvée.</td>
              </tr>
              <tr v-for="(tx, index) in transactions" :key="index" class="border-b-thin align-middle hover-row">
                <td class="text-body-2 text-grey-darken-3 py-4">{{ formatDate(tx.created_at) }}</td>
                <td class="py-4">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="grey-darken-1" class="mr-2">mdi-file-document-outline</v-icon>
                    <span class="text-body-2 font-weight-medium text-grey-darken-4">Acte de Vente Initiale</span>
                  </div>
                </td>
                <td class="py-4">
                  <router-link v-if="tx.parcelle" :to="`/parcelles/${tx.parcelle.id}`" class="text-primary text-decoration-none font-weight-medium text-body-2">
                    {{ tx.parcelle.numero_parcelle }}
                  </router-link>
                  <span v-else class="text-grey-darken-1">-</span>
                </td>
                <td class="text-right py-4 font-weight-bold text-grey-darken-4">
                  {{ formatMontant(tx.montant_cfa) }}
                </td>
                <td class="text-right py-4 font-weight-bold" :class="getSoldeColorClass(tx, index)">
                  {{ formatSolde(tx, index) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else class="d-flex flex-column align-center justify-center h-100 py-16">
    <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-off-outline</v-icon>
    <h2 class="text-h5 text-grey-darken-2">Propriétaire introuvable</h2>
    <v-btn color="primary" class="mt-4" to="/proprietaires">Retour à la liste</v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'

const route = useRoute()
const proprietaire = ref(null)
const parcelles = ref([])
const transactions = ref([])
const loading = ref(true)

const fetchProprietaireData = async () => {
  const id = route.params.id
  if (!id) return
  
  loading.value = true
  try {
    const propData = await api.proprietaires.getById(id)
    proprietaire.value = {
      ...propData,
      reference: `#PR-${new Date(propData.created_at).getFullYear()}-${id.substring(0, 4).toUpperCase()}`,
      email: `${propData.prenom.toLowerCase()[0]}.${propData.nom.toLowerCase()}@email.sn`
    }

    // Load parcelles
    try {
      const parcellesData = await api.proprietaires.getParcelles(id)
      parcelles.value = parcellesData
    } catch (e) {
      console.warn("Could not load parcelles", e)
    }

    // Load transactions
    try {
      const actesData = await api.proprietaires.getActes(id)
      transactions.value = actesData
    } catch (e) {
      console.warn("Could not load transactions", e)
    }
  } catch (error) {
    console.error("Erreur lors du chargement du propriétaire:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProprietaireData()
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

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('fr-FR', options)
}

const formatMontant = (montant) => {
  if (montant == null) return '0'
  return new Intl.NumberFormat('fr-FR').format(montant)
}

const formatSolde = (tx, index) => {
  // Mock logic: some transactions have soldes
  if (index % 2 === 0) {
    return formatMontant(500000)
  }
  return '0'
}

const getSoldeColorClass = (tx, index) => {
  if (index % 2 === 0) return 'text-error'
  return 'text-grey-darken-4'
}

const getParcelleStatusProps = (statut) => {
  if (statut === 'disponible') return { color: 'info', class: 'bg-blue-lighten-5 text-blue-darken-2' }
  if (statut === 'occupee') return { color: 'success', class: 'bg-green-lighten-5 text-green-darken-2' }
  if (statut === 'vendue') return { color: 'grey', class: 'bg-grey-lighten-3 text-grey-darken-3' }
  if (statut === 'litigieuse') return { color: 'error', class: 'bg-red-lighten-5 text-red-darken-2' }
  return { color: 'grey', variant: 'tonal' }
}

const mockBirthDate = () => '12 Mai 1975'
const mockAge = () => '49'
const mockSecteur = (loc) => {
  if (!loc) return 'Darou Khoudoss'
  if (loc.toLowerCase().includes('extension')) return 'Touba Extension'
  return 'Secteur Centre'
}
</script>

<style scoped>
.shadow-sm { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
.border-b-thin { border-bottom: 1px solid rgba(0,0,0,0.04); }
.gap-4 { gap: 16px; }
.gap-3 { gap: 12px; }
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
.hover-row:hover { background-color: #f8fafc; }
</style>
