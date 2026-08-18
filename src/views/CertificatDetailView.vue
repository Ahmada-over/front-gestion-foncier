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
        <v-btn v-if="(cert.statut || '').toLowerCase() === 'brouillon'" color="success" prepend-icon="mdi-check-decagram" rounded="lg" elevation="0" class="text-none font-weight-medium" size="small" @click="validerCertificat" :loading="validating">
          Valider le certificat
        </v-btn>
        <v-btn v-else color="#0a2540" prepend-icon="mdi-download-outline" rounded="lg" elevation="0" class="text-none font-weight-medium" size="small" @click="downloadPdf">
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
            <v-col cols="12" sm="4" v-if="cert.titulaire.telephone">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">TÉLÉPHONE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.titulaire.telephone }}</div>
            </v-col>
            <v-col cols="12" sm="8" v-if="cert.titulaire.adresse">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">ADRESSE DE RÉSIDENCE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.titulaire.adresse }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Information sur la Parcelle -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3" size="20">mdi-map-marker-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Localisation et données de la parcelle</h2>
            </div>
            <v-chip color="blue-lighten-5" text-color="primary" class="font-weight-bold text-caption" size="small">{{ cert.parcelle.numero }}</v-chip>
          </div>

          <v-row>
            <v-col cols="6" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">LOCALISATION</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.parcelle.localisation }}</div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">SUPERFICIE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.parcelle.superficie }}</div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">TYPE D'USAGE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ cert.parcelle.usage }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Témoins du certificat -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center mb-5">
            <v-icon color="primary" class="mr-3" size="20">mdi-account-group-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Témoins du certificat</h2>
          </div>

          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-overline font-weight-bold text-grey-darken-1" style="font-size: 10px !important;">NOM & PRÉNOMS</th>
                <th class="text-overline font-weight-bold text-grey-darken-1" style="font-size: 10px !important;">RÔLE</th>
                <th class="text-overline font-weight-bold text-grey-darken-1" style="font-size: 10px !important;">N° CIN</th>
                <th class="text-overline font-weight-bold text-grey-darken-1" style="font-size: 10px !important;">TÉLÉPHONE</th>
                <th class="text-overline font-weight-bold text-grey-darken-1" style="font-size: 10px !important;">SIGNATURE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="temoin in cert.temoins" :key="temoin.cin || temoin.nom">
                <td class="font-weight-bold text-body-2 py-3" style="color: #1a3b5c;">{{ temoin.nom }}</td>
                <td class="text-body-2 text-grey-darken-1 py-3">Témoin</td>
                <td class="text-body-2 text-grey-darken-1 py-3">{{ temoin.cin }}</td>
                <td class="text-body-2 text-grey-darken-1 py-3">{{ temoin.telephone }}</td>
                <td class="py-3">
                  <div class="d-flex align-center text-teal-darken-2 font-weight-medium text-caption">
                    <v-icon size="14" class="mr-1" color="teal-darken-2">mdi-check-circle</v-icon>
                    Signé
                  </div>
                </td>
              </tr>
              <tr v-if="!cert.temoins || cert.temoins.length === 0">
                <td colspan="5" class="text-center py-4 text-caption text-grey">Aucun témoin enregistré pour ce certificat.</td>
              </tr>
            </tbody>
          </v-table>
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
          <v-btn v-if="!qrCodeUrl" block variant="flat" color="primary" size="small" class="text-none font-weight-bold mb-2" prepend-icon="mdi-qrcode-scan" @click="validerEtGenererQR" :loading="validating">
            Générer le QR Code
          </v-btn>
          <v-btn v-else block variant="tonal" color="primary" size="small" class="text-none font-weight-bold" prepend-icon="mdi-shield-check-outline">
            Certificat Vérifié
          </v-btn>
        </v-card>

        <!-- Dates Clés -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="orange-darken-2" class="mr-3" size="20">mdi-calendar-clock</v-icon>
            <h3 class="text-subtitle-2 font-weight-bold" style="color: #1a3b5c;">Validité du titre</h3>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <div class="text-caption text-grey-darken-1">Délivrance</div>
            <div class="text-caption font-weight-bold">{{ cert.dateDelivrance }}</div>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <div class="text-caption text-grey-darken-1">Expiration</div>
            <div class="text-caption font-weight-bold text-error">{{ cert.dateExpiration }}</div>
          </div>
        </v-card>

        <!-- Historique de délivrance -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-3" size="20">mdi-history</v-icon>
            <h3 class="text-subtitle-2 font-weight-bold" style="color: #1a3b5c;">Historique d'audit</h3>
          </div>

          <v-timeline density="compact" align="start" class="px-0">
            <v-timeline-item
              v-for="(item, i) in cert.historique"
              :key="i"
              :dot-color="item.color || 'primary'"
              size="x-small"
            >
              <div class="text-caption font-weight-bold" style="color: #1a3b5c;">{{ item.titre }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.auteur }}</div>
              <div class="text-caption text-grey" style="font-size: 10px !important;">{{ item.date }}</div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const route = useRoute()
const qrCodeUrl = ref(null)
const loading = ref(false)
const validating = ref(false)

const cert = ref({
  numero: '',
  statut: '',
  dateDelivrance: '',
  dateExpiration: '',
  titulaire: { nom: '', cin: '', telephone: '', adresse: '' },
  parcelle: { numero: '', superficie: '', usage: '', localisation: '' },
  temoins: [],
  historique: []
})

const fetchCertificat = async () => {
  const certId = route.params.id
  if (!certId) return

  loading.value = true
  try {
    const data = await api.certificats.getById(certId)
    if (data) {
      cert.value = {
        numero: data.numero_certificat || '',
        statut: data.statut || 'brouillon',
        dateDelivrance: data.date_delivrance ? new Date(data.date_delivrance + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
        dateExpiration: data.date_expiration ? new Date(data.date_expiration + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
        titulaire: {
          nom: `${data.prenom_titulaire || ''} ${data.nom_titulaire || ''}`.trim() || 'Non renseigné',
          cin: data.cin_titulaire || 'Non renseigné',
          telephone: data.telephone_titulaire || '',
          adresse: data.adresse_titulaire || ''
        },
        parcelle: {
          numero: data.numero_parcelle || 'Non renseigné',
          superficie: data.superficie_m2 ? `${data.superficie_m2} m²` : 'Non renseignée',
          usage: data.type_usage || 'Habitation',
          localisation: data.localisation || 'Non renseignée'
        },
        temoins: data.temoins && data.temoins.length > 0
          ? data.temoins.map(t => ({
              nom: `${t.prenom || ''} ${t.nom || ''}`.trim(),
              cin: t.cin || '-',
              telephone: t.telephone || '-'
            }))
          : [],
        historique: []
      }
      
      // Fetch real audit trail history
      try {
        const logs = await api.historique.getAll(0, 100, 'certificats_occupation')
        const certLogs = logs.filter(l => l.enregistrement_id === certId)
        if (certLogs.length > 0) {
          cert.value.historique = certLogs.map(l => {
            let label = 'Certificat Modifié'
            let color = 'warning'
            if (l.action === 'creation') { label = 'Certificat Enregistré (Brouillon)'; color = 'blue-darken-2' }
            else if (l.action === 'validation') { label = 'Certificat Validé & Actif'; color = 'success' }
            else if (l.action === 'annulation') { label = 'Certificat Révoqué'; color = 'error' }
            
            return {
              titre: label,
              auteur: l.utilisateur_nom || 'Utilisateur',
              date: new Date(l.created_at).toLocaleDateString('fr-FR') + ' — ' + new Date(l.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              color: color
            }
          })
        } else {
          cert.value.historique = [
            {
              titre: data.statut === 'actif' ? 'Certificat Validé & Actif' : 'Certificat Enregistré (Brouillon)',
              auteur: 'Agent Foncier',
              date: new Date(data.created_at || data.date_delivrance).toLocaleDateString('fr-FR'),
              color: data.statut === 'actif' ? 'success' : 'blue-darken-2'
            }
          ]
        }
      } catch (e) {
        console.warn("Historique non disponible:", e)
      }

      // Fetch QR code unconditionally
      try {
        qrCodeUrl.value = await api.certificats.getQrcodeImage(certId)
      } catch (e) {
        console.warn("QR Code non disponible", e)
        qrCodeUrl.value = null
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

const validerEtGenererQR = async () => {
  const certId = route.params.id
  validating.value = true
  try {
    await api.certificats.valider(certId)
    notify.success("Certificat validé et QR Code généré avec succès")
    await fetchCertificat()
  } catch (error) {
    notify.error("Erreur lors de la génération du QR Code: " + error.message)
  } finally {
    validating.value = false
  }
}

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

const validerCertificat = async () => {
  const certId = route.params.id
  if (!certId) return
  
  validating.value = true
  try {
    await api.certificats.valider(certId)
    notify.success("Certificat validé et QR code généré avec succès")
    await fetchCertificat()
  } catch (e) {
    notify.error("Erreur lors de la validation: " + (e.response?.data?.detail || e.message))
  } finally {
    validating.value = false
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
