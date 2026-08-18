<template>
  <div>
    <!-- Back Link -->
    <div class="mb-2">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" to="/decharges">
        Retour à la liste
      </v-btn>
    </div>

    <!-- Title & Action Bar -->
    <div class="d-flex justify-space-between align-center mb-6" v-if="decharge">
      <div class="d-flex align-center">
        <h1 class="text-h6 font-weight-bold mr-3" style="color: #1a3b5c;">Décharge — {{ decharge.numero_decharge }}</h1>
        <v-chip :color="getStatutColor(decharge.statut)" size="small" class="font-weight-bold text-caption px-3 text-capitalize">
          {{ decharge.statut }}
        </v-chip>
      </div>

      <div class="d-flex gap-3">
        <v-btn
          v-if="decharge.statut === 'valide'"
          variant="outlined"
          color="grey-darken-1"
          prepend-icon="mdi-printer-outline"
          rounded="lg"
          class="text-none font-weight-medium"
          size="small"
          @click="printPdf"
        >
          Imprimer
        </v-btn>

        <v-btn
          v-if="decharge.statut === 'valide'"
          color="#0a2540"
          prepend-icon="mdi-download-outline"
          rounded="lg"
          elevation="0"
          class="text-none font-weight-medium"
          size="small"
          @click="downloadPdf"
        >
          Télécharger PDF
        </v-btn>

        <v-btn
          v-if="decharge.statut === 'brouillon'"
          variant="outlined"
          color="primary"
          prepend-icon="mdi-pencil-outline"
          rounded="lg"
          class="text-none font-weight-medium"
          size="small"
          :to="`/decharges/${decharge.id}/editer`"
        >
          Éditer
        </v-btn>

        <v-btn
          v-if="decharge.statut === 'brouillon'"
          color="success"
          prepend-icon="mdi-check-circle-outline"
          rounded="lg"
          elevation="0"
          class="text-none font-weight-medium"
          size="small"
          :loading="validating"
          @click="valider"
        >
          Valider la décharge
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-6"></v-progress-linear>

    <v-row v-if="decharge">
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="8">
        <!-- Informations Financières & Terrain Card -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3" size="24">mdi-cash-multiple</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Informations de la Transaction</h2>
            </div>
            <span class="text-caption text-grey font-weight-medium">DÉCHA-{{ decharge.id.substring(0, 8) }}</span>
          </div>

          <v-row class="mt-2">
            <v-col cols="12" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">MONTANT REÇU</div>
              <div class="text-h6 font-weight-black text-success">{{ formatMoney(decharge.montant_recu) }} FCFA</div>
            </v-col>

            <v-col cols="12" sm="4" v-if="decharge.montant_convenu_global">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">MONTANT GLOBAL</div>
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">{{ formatMoney(decharge.montant_convenu_global) }} FCFA</div>
            </v-col>

            <v-col cols="12" sm="4" v-if="decharge.reliquat">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">RELIQUAT</div>
              <div class="text-subtitle-1 font-weight-bold text-error">{{ formatMoney(decharge.reliquat) }} FCFA</div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">MOTIF</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ decharge.motif || 'VENTE DE TERRAIN' }}</div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">SITE & TERRAIN</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ decharge.site_terrain || 'Taofikh Bousso' }} — N° {{ decharge.numero_terrain || 'N/A' }}</div>
            </v-col>

            <v-col cols="12" sm="4" v-if="decharge.date_limite_reliquat">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">DATE LIMITE RELIQUAT</div>
              <div class="text-body-2 font-weight-medium text-primary">{{ formatDate(decharge.date_limite_reliquat) }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Récepteur & Remettant Cards -->
        <v-row class="mb-6">
          <!-- Récepteur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100">
              <div class="d-flex align-center mb-4">
                <v-icon color="blue-darken-2" class="mr-3">mdi-account-arrow-left-outline</v-icon>
                <h2 class="text-subtitle-2 font-weight-bold text-blue-darken-2">Le Récepteur (Qui reçoit)</h2>
              </div>
              <div class="font-weight-bold text-body-1 text-primary mb-1">{{ decharge.receveur_prenom }} {{ decharge.receveur_nom }}</div>
              <div class="text-caption text-grey-darken-1 mb-2">CIN : {{ decharge.receveur_cin }}</div>
              <div v-if="decharge.receveur_telephone" class="text-caption text-grey-darken-1">Tél : {{ decharge.receveur_telephone }}</div>
            </v-card>
          </v-col>

          <!-- Remettant -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100">
              <div class="d-flex align-center mb-4">
                <v-icon color="indigo-darken-2" class="mr-3">mdi-account-arrow-right-outline</v-icon>
                <h2 class="text-subtitle-2 font-weight-bold text-indigo-darken-2">Le Remettant (Qui paie)</h2>
              </div>
              <div class="font-weight-bold text-body-1 text-primary mb-1">{{ decharge.remettant_prenom }} {{ decharge.remettant_nom }}</div>
              <div class="text-caption text-grey-darken-1 mb-2">CIN : {{ decharge.remettant_cin }}</div>
              <div v-if="decharge.remettant_telephone" class="text-caption text-grey-darken-1">Tél : {{ decharge.remettant_telephone }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Témoins Card -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-3">mdi-account-group-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Témoins enregistrés</h2>
          </div>

          <v-table density="compact" v-if="decharge.temoins && decharge.temoins.length > 0">
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Prénom & Nom</th>
                <th class="text-left">N° CIN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, index) in decharge.temoins" :key="t.id || index">
                <td>{{ index + 1 }}</td>
                <td class="font-weight-medium">{{ t.prenom }} {{ t.nom }}</td>
                <td>{{ t.cin }}</td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-caption text-grey">Aucun témoin spécifique enregistré.</div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN: QR Code & Visual PDF Badge -->
      <v-col cols="12" md="4">
        <!-- QR Code Verification Card -->
        <v-card elevation="0" border rounded="xl" class="pa-6 text-center mb-6">
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-3" style="letter-spacing: 1px;">SÉCURITÉ & AUTHENTICITÉ</div>
          
          <div v-if="decharge.statut === 'valide' && qrCodeUrl" class="d-flex justify-center my-3">
            <v-img :src="qrCodeUrl" width="160" height="160" class="border rounded-lg pa-2"></v-img>
          </div>
          <div v-else-if="decharge.statut === 'brouillon'" class="pa-6 bg-grey-lighten-4 rounded-lg my-3">
            <v-icon size="48" color="grey">mdi-qrcode-remove</v-icon>
            <div class="text-caption text-grey-darken-1 mt-2">Le QR Code sera généré lors de la validation finale.</div>
          </div>

          <div class="text-caption text-grey-darken-1">
            Date de rédaction : {{ formatDate(decharge.date_fait) }} à {{ decharge.lieu_fait || 'Touba' }}
          </div>
        </v-card>

        <!-- Dynamic Action Card -->
        <v-card elevation="0" rounded="xl" class="pa-6" color="#1a3b5c" theme="dark">
          <h2 class="text-subtitle-1 font-weight-bold text-white mb-4" style="letter-spacing: 1px;">DOCUMENT OFFICIEL</h2>

          <p class="text-caption text-blue-lighten-3 mb-6">
            Cette décharge délivrée à Touba constitue la preuve authentique de remise de sommes d'argent pour la parcelle concernée.
          </p>

          <v-btn
            v-if="decharge.statut === 'valide'"
            block
            color="success"
            prepend-icon="mdi-file-pdf-box"
            size="large"
            rounded="lg"
            class="text-none font-weight-bold"
            @click="downloadPdf"
          >
            Télécharger le PDF officiel
          </v-btn>

          <v-btn
            v-else
            block
            color="warning"
            prepend-icon="mdi-check-circle-outline"
            size="large"
            rounded="lg"
            class="text-none font-weight-bold"
            :loading="validating"
            @click="valider"
          >
            Valider maintenant
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import { notification } from '../services/notifier'

const route = useRoute()
const loading = ref(true)
const validating = ref(false)
const decharge = ref(null)
const qrCodeUrl = ref('')

const fetchDecharge = async () => {
  loading.value = true
  try {
    const id = route.params.id
    decharge.value = await api.decharges.getById(id)
    if (decharge.value.statut === 'valide') {
      qrCodeUrl.value = await api.decharges.getQrcodeImage(id).catch(() => '')
    }
  } catch (e) {
    notification.error('Erreur lors de la récupération de la décharge: ' + e.message)
  } finally {
    loading.value = false
  }
}

const valider = async () => {
  validating.value = true
  try {
    decharge.value = await api.decharges.valider(decharge.value.id)
    notification.success('Décharge validée et PDF généré avec succès !')
    qrCodeUrl.value = await api.decharges.getQrcodeImage(decharge.value.id).catch(() => '')
  } catch (e) {
    notification.error('Erreur lors de la validation: ' + e.message)
  } finally {
    validating.value = false
  }
}

const downloadPdf = () => {
  if (decharge.value) {
    api.decharges.downloadPdf(decharge.value.id, `decharge_${decharge.value.numero_decharge}.pdf`)
  }
}

const printPdf = () => {
  downloadPdf()
}

const formatMoney = (val) => {
  if (val === null || val === undefined) return '0'
  return new Intl.NumberFormat('fr-FR').format(val)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const getStatutColor = (statut) => {
  switch (statut) {
    case 'valide': return 'success'
    case 'brouillon': return 'warning'
    case 'annule': return 'error'
    default: return 'grey'
  }
}

onMounted(() => {
  fetchDecharge()
})
</script>

<style scoped>
</style>
