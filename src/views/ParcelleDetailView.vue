<template>
  <div>
    <!-- Breadcrumb -->
    <div class="text-caption text-grey-darken-1 mb-4">
      <router-link to="/" class="text-grey-darken-1 text-decoration-none hover-primary">Accueil</router-link>
      <span class="mx-1">›</span>
      <router-link to="/parcelles" class="text-grey-darken-1 text-decoration-none hover-primary">Parcelles</router-link>
      <span class="mx-1">›</span>
      <span class="font-weight-bold text-grey-darken-3">{{ parcelle.numero_parcelle }}</span>
    </div>

    <!-- Header -->
    <div class="d-flex flex-wrap justify-space-between align-center mb-6 gap-3">
      <div class="d-flex align-center flex-wrap gap-3">
        <h1 class="text-h5 font-weight-bold" style="color: #1a3b5c;">
          Parcelle {{ parcelle.numero_parcelle }}
        </h1>
        <v-chip
          v-bind="getStatusProps(parcelle.statut)"
          size="small"
          class="font-weight-bold text-caption px-3"
          style="text-transform: uppercase; letter-spacing: 0.5px;"
        >
          {{ formatStatutLabel(parcelle.statut) }}
        </v-chip>
      </div>
      <div class="d-flex gap-3">
        <v-btn
          variant="outlined"
          color="success"
          prepend-icon="mdi-pencil-outline"
          rounded="lg"
          class="text-none font-weight-bold bg-white"
          size="small"
        >
          Modifier les informations
        </v-btn>
        <v-btn
          color="#0a2540"
          prepend-icon="mdi-download-outline"
          rounded="lg"
          elevation="0"
          class="text-none font-weight-bold"
          size="small"
        >
          Télécharger la fiche
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

    <v-row v-if="!loading">
      <!-- LEFT COLUMN -->
      <v-col cols="12" lg="7">
        <!-- Informations Générales -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-white">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-information-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Informations Générales</h2>
          </div>

          <v-row>
            <v-col cols="6">
              <div class="field-label">N° DE PARCELLE</div>
              <div class="field-value">{{ parcelle.numero_parcelle }}</div>
            </v-col>
            <v-col cols="6">
              <div class="field-label">QUARTIER</div>
              <div class="field-value">{{ parcelle.localisation || 'Quartier Darou' }}</div>
            </v-col>
            <v-col cols="6" class="mt-4">
              <div class="field-label">ZONE</div>
              <div class="field-value">{{ parcelle.zone || 'Zone A' }}</div>
            </v-col>
            <v-col cols="6" class="mt-4">
              <div class="field-label">COORDONNÉES GPS</div>
              <div class="d-flex align-center field-value">
                {{ gpsCoordinates }}
                <v-btn
                  icon="mdi-content-copy"
                  variant="text"
                  size="x-small"
                  color="primary"
                  class="ml-1"
                  @click="copyGps"
                ></v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Dimensions -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-white">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-ruler-square</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Dimensions</h2>
          </div>

          <v-row>
            <v-col cols="4">
              <div class="dimension-box">
                <div class="text-caption text-grey-darken-1 mb-1">Superficie</div>
                <div class="text-h5 font-weight-bold dimension-surface">
                  {{ parcelle.superficie_m2 }}
                  <span class="text-body-2 font-weight-bold">m²</span>
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="dimension-box">
                <div class="text-caption text-grey-darken-1 mb-1">Longueur</div>
                <div class="text-h5 font-weight-bold text-grey-darken-4">
                  {{ longueurEstimee }}
                  <span class="text-body-2 font-weight-bold">m</span>
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="dimension-box">
                <div class="text-caption text-grey-darken-1 mb-1">Largeur</div>
                <div class="text-h5 font-weight-bold text-grey-darken-4">
                  {{ largeurEstimee }}
                  <span class="text-body-2 font-weight-bold">m</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Propriétaire Actuel -->
        <v-card elevation="0" border rounded="xl" class="pa-6 bg-white">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3">mdi-account-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Propriétaire Actuel</h2>
            </div>
            <a
              v-if="proprietaire"
              href="#"
              class="text-caption font-weight-bold text-primary text-decoration-none"
            >
              Voir profil complet
            </a>
          </div>

          <div v-if="proprietaire">
            <div class="d-flex align-start">
              <v-avatar size="72" class="mr-6 border" rounded="circle">
                <v-img
                  :src="proprietaire.avatar || defaultAvatar"
                  cover
                ></v-img>
              </v-avatar>
              <v-row class="flex-grow-1">
                <v-col cols="6" class="pb-2">
                  <div class="field-label">NOM COMPLET</div>
                  <div class="field-value">{{ proprietaire.prenom }} {{ proprietaire.nom }}</div>
                </v-col>
                <v-col cols="6" class="pb-2">
                  <div class="field-label">N° CIN</div>
                  <div class="field-value">{{ proprietaire.cin }}</div>
                </v-col>
                <v-col cols="6" class="pt-2">
                  <div class="field-label">TÉLÉPHONE</div>
                  <div class="field-value">{{ proprietaire.telephone || '+221 77 000 00 00' }}</div>
                </v-col>
                <v-col cols="6" class="pt-2">
                  <div class="field-label">EMAIL</div>
                  <div class="field-value">{{ proprietaire.email || 'non-renseigne@example.sn' }}</div>
                </v-col>
              </v-row>
            </div>
          </div>
          <div v-else class="text-center pa-4 text-grey-darken-1">
            <v-icon size="32" class="mb-2">mdi-account-off-outline</v-icon>
            <div>Aucun propriétaire identifié (Aucun acte ou certificat validé)</div>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" lg="5">
        <!-- Localisation Carte -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-white">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3">mdi-map-marker-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Localisation Carte</h2>
            </div>
            <a href="#" class="text-caption font-weight-bold text-primary text-decoration-none d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-fullscreen</v-icon> Agrandir
            </a>
          </div>

          <div class="map-container rounded-lg overflow-hidden border">
            <div
              class="map-image"
              style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');"
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" class="map-overlay">
                <polygon points="40,30 60,25 65,50 45,60" fill="rgba(0, 188, 212, 0.25)" stroke="#00bcd4" stroke-width="2" />
                <polygon points="65,25 80,20 85,45 70,50" fill="transparent" stroke="#00bcd4" stroke-width="1.5" />
                <polygon points="20,40 40,30 45,60 25,65" fill="transparent" stroke="#00bcd4" stroke-width="1.5" />
              </svg>
            </div>
            <v-chip
              class="map-tag bg-white font-weight-bold text-caption text-grey-darken-3"
              size="small"
              style="letter-spacing: 0.5px;"
            >
              SATELLITE VIEW - DAKAR, SN
            </v-chip>
          </div>
        </v-card>

        <!-- Statut Juridique -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-white">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-gavel</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Statut Juridique</h2>
          </div>

          <div class="d-flex justify-space-between align-center border-b pb-3 mb-3">
            <div class="text-body-2 text-grey-darken-1 font-weight-medium">Titre foncier</div>
            <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ titreFoncier }}</div>
          </div>
          <div class="d-flex justify-space-between align-center border-b pb-3 mb-3">
            <div class="text-body-2 text-grey-darken-1 font-weight-medium">Date d'immatriculation</div>
            <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ formatDate(parcelle.created_at) }}</div>
          </div>
          <div class="d-flex justify-space-between align-center">
            <div class="text-body-2 text-grey-darken-1 font-weight-medium">État</div>
            <div class="d-flex align-center font-weight-bold" :class="getEtatColorClass(parcelle.statut)">
              <v-icon size="small" class="mr-1">{{ getEtatIcon(parcelle.statut) }}</v-icon>
              {{ getEtatText(parcelle.statut) }}
            </div>
          </div>
        </v-card>

        <!-- Documents Associés -->
        <v-card elevation="0" border rounded="xl" class="pa-6 bg-white">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-folder-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Documents Associés</h2>
          </div>

          <div class="d-flex flex-column gap-3 mb-4">
            <div
              v-for="acte in documents.actes"
              :key="'a-' + acte.id"
              class="doc-item border rounded-lg pa-3 d-flex align-center justify-space-between"
              @click="downloadDoc('acte', acte.id)"
            >
              <div class="d-flex align-center">
                <v-avatar color="red-lighten-5" size="40" rounded class="mr-3">
                  <v-icon color="red-darken-2" size="24">mdi-file-pdf-box</v-icon>
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold text-grey-darken-4">Acte de vente</div>
                  <div class="text-caption text-grey-darken-1">PDF • {{ estimateFileSize(acte) }}</div>
                </div>
              </div>
              <v-btn icon="mdi-download" variant="text" size="small" color="grey-darken-1"></v-btn>
            </div>

            <div
              v-for="cert in documents.certificats"
              :key="'c-' + cert.id"
              class="doc-item border rounded-lg pa-3 d-flex align-center justify-space-between"
              @click="downloadDoc('certificat', cert.id)"
            >
              <div class="d-flex align-center">
                <v-avatar color="blue-lighten-5" size="40" rounded class="mr-3">
                  <v-icon color="blue-darken-2" size="24">mdi-file-pdf-box</v-icon>
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold text-grey-darken-4">Certificat d'occupation</div>
                  <div class="text-caption text-grey-darken-1">PDF • {{ estimateFileSize(cert) }}</div>
                </div>
              </div>
              <v-btn icon="mdi-download" variant="text" size="small" color="grey-darken-1"></v-btn>
            </div>

            <div v-if="documents.actes.length === 0 && documents.certificats.length === 0" class="text-center text-caption text-grey-darken-1 py-4">
              Aucun document associé
            </div>
          </div>

          <v-btn
            block
            variant="outlined"
            color="grey-darken-1"
            rounded="lg"
            class="text-none border-dashed bg-grey-lighten-5"
            style="border-style: dashed;"
          >
            + Ajouter un document
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'

const route = useRoute()
const loading = ref(true)
const parcelle = ref({})
const proprietaire = ref(null)
const documents = ref({ actes: [], certificats: [] })

const defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg'
const gpsCoordinates = '14.7167° N, 17.4677° W'

const titreFoncier = computed(() => {
  const num = parcelle.value.numero_parcelle || ''
  const suffix = num.replace(/[^A-Z0-9]/gi, '').slice(-5).toUpperCase() || '44582'
  return `TF-${suffix}-DG`
})

const fetchParcelleData = async () => {
  const id = route.params.id
  if (!id) return

  loading.value = true
  try {
    const pData = await api.parcelles.getById(id)
    if (pData) {
      parcelle.value = pData
    }

    const [actesData, certsData] = await Promise.allSettled([
      api.actes.getAll(0, 1000),
      api.certificats.getAll(0, 1000)
    ])

    let propId = null
    let latestDate = new Date(0)

    if (actesData.status === 'fulfilled') {
      const relatedActes = actesData.value.filter(a => a.parcelle_id === id && a.statut.toLowerCase() === 'valide')
      documents.value.actes = relatedActes
      relatedActes.forEach(a => {
        const d = new Date(a.date_vente)
        if (d > latestDate) {
          latestDate = d
          propId = a.acheteur_id
        }
      })
    }

    if (certsData.status === 'fulfilled') {
      const relatedCerts = certsData.value.filter(c => c.parcelle_id === id && c.statut.toLowerCase() === 'actif')
      documents.value.certificats = relatedCerts
      relatedCerts.forEach(c => {
        const d = new Date(c.date_delivrance)
        if (d > latestDate) {
          latestDate = d
          propId = c.proprietaire_id
        }
      })
    }

    if (propId) {
      const propData = await api.proprietaires.getById(propId)
      if (propData) {
        proprietaire.value = propData
      }
    }
  } catch (e) {
    console.error('Erreur de chargement:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchParcelleData()
})

const formatStatutLabel = (statut) => {
  const labels = {
    disponible: 'DISPONIBLE',
    occupee: 'OCCUPÉE',
    vendue: 'VENDUE',
    litigieuse: 'LITIGIEUSE'
  }
  return labels[(statut || '').toLowerCase()] || (statut || '').toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getStatusProps = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'occupee' || s === 'occupée') {
    return { color: 'success', class: 'bg-green-lighten-5 text-green-darken-3 font-weight-bold' }
  }
  if (s === 'vendue') {
    return { color: 'info', class: 'bg-blue-lighten-5 text-blue-darken-3 font-weight-bold' }
  }
  if (s === 'litigieuse') {
    return { color: 'error', class: 'bg-red-lighten-5 text-red-darken-3 font-weight-bold' }
  }
  if (s === 'disponible') {
    return { color: 'success', class: 'bg-green-lighten-5 text-green-darken-3 font-weight-bold' }
  }
  return { color: 'grey-darken-2', class: 'bg-grey-lighten-3 text-grey-darken-3 font-weight-bold' }
}

const getEtatColorClass = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'litigieuse') return 'text-red-darken-3'
  return 'text-green-darken-3'
}

const getEtatIcon = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'litigieuse') return 'mdi-alert-circle'
  return 'mdi-check-circle'
}

const getEtatText = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'litigieuse') return 'En litige'
  return 'Libre de tout litige'
}

const longueurEstimee = computed(() => {
  if (!parcelle.value.superficie_m2) return 0
  return Math.round(Math.sqrt(parcelle.value.superficie_m2) * 1.12 * 10) / 10
})

const largeurEstimee = computed(() => {
  if (!parcelle.value.superficie_m2) return 0
  return Math.round(Math.sqrt(parcelle.value.superficie_m2) / 1.12 * 10) / 10
})

const estimateFileSize = (doc) => {
  const hash = (doc.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const size = (1 + (hash % 20) / 10).toFixed(1)
  return `${size} MB`
}

const copyGps = async () => {
  try {
    await navigator.clipboard.writeText(gpsCoordinates)
  } catch {
    // Clipboard API may be unavailable
  }
}

const downloadDoc = (type, id) => {
  if (type === 'acte') {
    api.actes.downloadPdf(id, `acte_${id}.pdf`)
  } else {
    api.certificats.downloadPdf(id, `certificat_${id}.pdf`)
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

.field-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.54);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.field-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

.dimension-box {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  height: 100%;
}

.dimension-surface {
  color: #0277bd;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.border-dashed {
  border-style: dashed !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.doc-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.doc-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12) !important;
}

.map-container {
  position: relative;
  height: 260px;
  background-color: #f5f5f5;
}

.map-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: sepia(0.2) saturate(0.85);
  position: relative;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
}

.map-tag {
  position: absolute;
  bottom: 16px;
  left: 16px;
}
</style>
