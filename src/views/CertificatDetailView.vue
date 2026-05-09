<template>
  <div>
    <!-- Back link + Title -->
    <div class="mb-2">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" to="/certificats">
        Retour à la liste
      </v-btn>
    </div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-avatar color="blue-lighten-5" size="40" class="mr-4" rounded="lg">
          <v-icon color="primary">mdi-certificate-outline</v-icon>
        </v-avatar>
        <div>
          <h1 class="text-h6 font-weight-bold" style="color: #1a3b5c; line-height: 1.2;">Certificat d'occupation — {{ cert.numero }}</h1>
          <div class="d-flex align-center mt-1">
            <v-chip v-bind="getStatusProps(cert.statut)" size="x-small" class="font-weight-bold text-caption px-2 mr-2">{{ cert.statut }}</v-chip>
            <span class="text-caption text-grey-darken-1">Délivré le {{ cert.dateDelivrance }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex gap-3">
        <v-btn variant="outlined" color="grey-darken-1" prepend-icon="mdi-printer-outline" rounded="lg" class="text-none font-weight-medium" size="small">
          Imprimer
        </v-btn>
        <v-btn color="#0a2540" prepend-icon="mdi-download-outline" rounded="lg" elevation="0" class="text-none font-weight-medium" size="small" @click="downloadPdf">
          Télécharger PDF
        </v-btn>
      </div>
    </div>

    <v-row>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="8">
        <!-- Information sur le Titulaire -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3" size="20">mdi-account-check-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Titulaire du certificat</h2>
          </div>
          
          <div class="d-flex align-center mb-6">
            <v-avatar color="grey-lighten-3" size="64" class="mr-6">
              <span class="text-h5 font-weight-bold text-grey-darken-2">{{ getInitials(cert.titulaire.nom) }}</span>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-black" style="color: #1a3b5c;">{{ cert.titulaire.nom }}</div>
              <div class="text-body-2 text-grey-darken-1">CIN : {{ cert.titulaire.cin }}</div>
            </div>
          </div>

          <v-divider class="mb-6"></v-divider>

          <v-row>
            <v-col cols="12" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">TÉLÉPHONE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.titulaire.telephone || 'Non renseigné' }}</div>
            </v-col>
            <v-col cols="12" sm="8">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">ADRESSE DE RÉSIDENCE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.titulaire.adresse || 'Village de Taofikh Bousso' }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Information sur la Parcelle -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3" size="20">mdi-map-marker-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Localisation de la parcelle</h2>
            </div>
            <v-chip color="blue-lighten-5" text-color="primary" class="font-weight-bold text-caption" size="small">{{ cert.parcelle.numero }}</v-chip>
          </div>

          <v-row>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">SUPERFICIE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.parcelle.superficie }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">USAGE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.parcelle.usage }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">LATITUDE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">14.7561° N</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">LONGITUDE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">17.4677° W</div>
            </v-col>
          </v-row>
          
          <div class="mt-6 rounded-xl overflow-hidden border" style="height: 200px; background: #f5f5f5;">
            <!-- Placeholder for Map -->
            <div class="d-flex align-center justify-center h-100" style="background: linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%);">
               <v-icon size="48" color="grey-lighten-1">mdi-map-search-outline</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="4">
        <!-- Authenticité Digitale -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 text-center">
          <h3 class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-5">Vérification QR Code</h3>
          <div class="d-flex justify-center mb-4">
            <div class="qr-container pa-3 rounded-lg bg-white" style="border: 2px solid rgba(0,0,0,0.06); display: inline-block; min-width: 150px; min-height: 150px;">
              <v-img v-if="route.params.id && qrCodeUrl" :src="qrCodeUrl" width="150" height="150">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                    <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
                  </div>
                </template>
                <template v-slot:error>
                  <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-4 rounded">
                    <v-icon size="60" color="grey-darken-1">mdi-qrcode-remove</v-icon>
                    <span class="text-caption text-grey-darken-1 mt-1">Image absente</span>
                  </div>
                </template>
              </v-img>
              <div v-else class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-4 rounded" style="width: 150px; height: 150px;">
                <v-icon size="60" color="grey-lighten-1">mdi-qrcode</v-icon>
                <span class="text-caption text-grey-lighten-1 mt-1">En attente</span>
              </div>
            </div>
          </div>
          <div class="text-caption text-grey-darken-1 mb-4">Ce certificat est infalsifiable grâce à son empreinte numérique unique.</div>
          <v-btn block variant="tonal" color="primary" size="small" class="text-none font-weight-bold" prepend-icon="mdi-shield-check-outline">
            Vérifier sur la Blockchain
          </v-btn>
        </v-card>

        <!-- Dates Clés -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="orange-darken-2" class="mr-3" size="20">mdi-calendar-clock</v-icon>
            <h3 class="text-subtitle-2 font-weight-bold" style="color: #1a3b5c;">Validité du titre</h3>
          </div>
          
          <div class="mb-4">
            <div class="text-caption text-grey-darken-1 mb-1">Délivré par</div>
            <div class="text-body-2 font-weight-bold">Conservateur Foncier — Zone Nord</div>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <div class="text-caption text-grey-darken-1">Délivrance</div>
            <div class="text-caption font-weight-bold">{{ cert.dateDelivrance }}</div>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <div class="text-caption text-grey-darken-1">Expiration</div>
            <div class="text-caption font-weight-bold text-error">{{ cert.dateExpiration }}</div>
          </div>

          <v-alert v-if="isNearExpiration" color="warning" variant="tonal" density="compact" class="text-caption">
            Ce titre arrive à expiration dans moins de 30 jours.
          </v-alert>
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
const qrCodeUrl = ref(null)
const loading = ref(false)

const cert = ref({
  numero: '...',
  statut: '...',
  dateDelivrance: '...',
  dateExpiration: '...',
  titulaire: { nom: '...', cin: '...', telephone: '', adresse: '' },
  parcelle: { numero: '...', superficie: '...', usage: '...' }
})

const fetchCertificat = async () => {
  const certId = route.params.id
  if (!certId) return

  loading.value = true
  try {
    const data = await api.certificats.getById(certId)
    if (data) {
      cert.value = {
        numero: data.numero_certificat || `CO-${data.id.substring(0, 8)}`,
        statut: data.statut || 'Actif',
        dateDelivrance: data.date_delivrance ? new Date(data.date_delivrance).toLocaleDateString('fr-FR') : '-',
        dateExpiration: data.date_expiration ? new Date(data.date_expiration).toLocaleDateString('fr-FR') : '-',
        titulaire: {
          nom: `${data.prenom_titulaire || ''} ${data.nom_titulaire || ''}`.trim(),
          cin: data.cin_titulaire || '-',
          telephone: data.telephone_titulaire || '',
          adresse: data.adresse_titulaire || ''
        },
        parcelle: {
          numero: data.numero_parcelle || '-',
          superficie: data.superficie_m2 ? `${data.superficie_m2} m²` : '-',
          usage: data.type_usage || 'Résidentiel'
        }
      }
      
      // Get QR code URL if valid
      if (cert.value.statut.toLowerCase() === 'actif' || cert.value.statut.toLowerCase() === 'valide') {
        qrCodeUrl.value = api.certificats.getQrcodeUrl(certId)
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du certificat:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCertificat()
})

const isNearExpiration = computed(() => {
  // Demo logic
  return false
})

const getInitials = (name) => {
  if (!name || name === '...') return '?'
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

const downloadPdf = () => {
  const certId = route.params.id
  if (certId) {
    api.certificats.downloadPdf(certId, `certificat_${cert.value.numero}.pdf`)
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
</style>
