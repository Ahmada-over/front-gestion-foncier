<template>
  <div>
    <!-- Back link + Title -->
    <div class="mb-2">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" to="/actes">
        Retour à la liste
      </v-btn>
    </div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <h1 class="text-h6 font-weight-bold mr-3" style="color: #1a3b5c;">Acte de vente — {{ acte.numero }}</h1>
        <v-chip v-bind="getStatusProps(acte.statut)" size="small" class="font-weight-bold text-caption px-3">{{ acte.statut }}</v-chip>
      </div>
      <div class="d-flex gap-3">
        <v-btn variant="outlined" color="grey-darken-1" prepend-icon="mdi-printer-outline" rounded="lg" class="text-none font-weight-medium" size="small">
          Imprimer
        </v-btn>
        <v-btn color="#0a2540" prepend-icon="mdi-download-outline" rounded="lg" elevation="0" class="text-none font-weight-medium" size="small" @click="downloadPdf" :disabled="(acte.statut || '').toLowerCase() === 'brouillon'">
          Télécharger PDF
        </v-btn>
        <v-btn v-if="(acte.statut || '').toLowerCase() === 'brouillon'" variant="outlined" color="primary" prepend-icon="mdi-pencil" rounded="lg" class="text-none font-weight-medium" size="small" :to="`/actes/${route.params.id}/editer`">
          Éditer l'acte
        </v-btn>
        <v-btn v-if="(acte.statut || '').toLowerCase() === 'brouillon'" color="success" prepend-icon="mdi-check-decagram" rounded="lg" elevation="0" class="text-none font-weight-medium" size="small" :loading="validating" @click="validerActe">
          Valider l'acte
        </v-btn>
      </div>
    </div>

    <v-row>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="8">
        <!-- Information sur la Parcelle -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex justify-space-between align-center mb-5">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3" size="20">mdi-map-marker-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Information sur la Parcelle</h2>
            </div>
            <span class="text-caption text-grey-darken-1 font-weight-medium">ID: {{ acte.parcelleId }}</span>
          </div>

          <v-row>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">LOCALISATION</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ acte.localisation }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">SUPERFICIE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ acte.superficie }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">TYPE D'USAGE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ acte.typeUsage }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="font-size: 10px !important;">NUMÉRO DE TITRE</div>
              <div class="text-body-2 font-weight-medium text-grey-darken-3">{{ acte.numeroTitre }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Vendeur & Acheteur -->
        <v-row class="mb-6">
          <!-- Vendeur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100">
              <div class="d-flex align-center mb-5">
                <v-icon color="red-darken-1" class="mr-3" size="20">mdi-account-arrow-right-outline</v-icon>
                <h2 class="text-subtitle-2 font-weight-bold text-red-darken-1">Vendeur</h2>
              </div>
              <div class="d-flex align-center mb-4">
                <v-avatar color="grey-lighten-2" size="44" class="mr-4">
                  <v-img v-if="acte.vendeur.avatar" :src="acte.vendeur.avatar"></v-img>
                  <span v-else class="text-grey-darken-2 font-weight-bold text-caption">{{ getInitials(acte.vendeur.nom) }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-body-2" style="color: #1a3b5c;">{{ acte.vendeur.nom }}</div>
                  <div class="text-caption text-grey-darken-1">CIN : {{ acte.vendeur.cin }}</div>
                </div>
              </div>
              <div class="d-flex align-center text-caption text-grey-darken-1 mb-2" v-if="acte.vendeur.telephone && acte.vendeur.telephone !== 'Non renseigné'">
                <v-icon size="14" class="mr-2" color="grey-darken-1">mdi-phone-outline</v-icon>
                {{ acte.vendeur.telephone }}
              </div>
              <div class="d-flex align-center text-caption text-grey-darken-1" v-if="acte.vendeur.email && acte.vendeur.email !== 'Non renseigné'">
                <v-icon size="14" class="mr-2" color="grey-darken-1">mdi-email-outline</v-icon>
                {{ acte.vendeur.email }}
              </div>
            </v-card>
          </v-col>

          <!-- Acheteur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100">
              <div class="d-flex align-center mb-5">
                <v-icon color="green-darken-2" class="mr-3" size="20">mdi-account-arrow-left-outline</v-icon>
                <h2 class="text-subtitle-2 font-weight-bold text-green-darken-2">Acheteur</h2>
              </div>
              <div class="d-flex align-center mb-4">
                <v-avatar color="grey-lighten-2" size="44" class="mr-4">
                  <v-img v-if="acte.acheteur.avatar" :src="acte.acheteur.avatar"></v-img>
                  <span v-else class="text-grey-darken-2 font-weight-bold text-caption">{{ getInitials(acte.acheteur.nom) }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-body-2" style="color: #1a3b5c;">{{ acte.acheteur.nom }}</div>
                  <div class="text-caption text-grey-darken-1">CIN : {{ acte.acheteur.cin }}</div>
                </div>
              </div>
              <div class="d-flex align-center text-caption text-grey-darken-1 mb-2" v-if="acte.acheteur.telephone && acte.acheteur.telephone !== 'Non renseigné'">
                <v-icon size="14" class="mr-2" color="grey-darken-1">mdi-phone-outline</v-icon>
                {{ acte.acheteur.telephone }}
              </div>
              <div class="d-flex align-center text-caption text-grey-darken-1" v-if="acte.acheteur.email && acte.acheteur.email !== 'Non renseigné'">
                <v-icon size="14" class="mr-2" color="grey-darken-1">mdi-email-outline</v-icon>
                {{ acte.acheteur.email }}
              </div>

            </v-card>
          </v-col>
        </v-row>

        <!-- Détails de la Transaction -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-5">
            <v-icon color="primary" class="mr-3" size="20">mdi-credit-card-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Détails de la Transaction</h2>
          </div>

          <v-row>
            <v-col cols="12" sm="4">
              <v-card elevation="0" color="blue-lighten-5" rounded="lg" class="pa-4">
                <div class="text-caption text-primary font-weight-medium mb-1">Montant Total</div>
                <div class="text-h6 font-weight-black text-primary">{{ acte.montant }} FCFA</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card elevation="0" color="grey-lighten-4" rounded="lg" class="pa-4">
                <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Date de Signature</div>
                <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ acte.dateSignature }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card elevation="0" color="grey-lighten-4" rounded="lg" class="pa-4">
                <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Mode de Paiement</div>
                <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ acte.modePaiement }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Témoins de l'acte -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center mb-5">
            <v-icon color="primary" class="mr-3" size="20">mdi-account-group-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Témoins de l'acte</h2>
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
              <tr v-for="temoin in acte.temoins" :key="temoin.cin || temoin.nom">
                <td class="font-weight-bold text-body-2 py-3" style="color: #1a3b5c;">{{ temoin.nom }}</td>
                <td class="text-body-2 text-grey-darken-1 py-3">{{ temoin.role }}</td>
                <td class="text-body-2 text-grey-darken-1 py-3">{{ temoin.cin }}</td>
                <td class="text-body-2 text-grey-darken-1 py-3">{{ temoin.telephone }}</td>
                <td class="py-3">
                  <div class="d-flex align-center text-teal-darken-2 font-weight-medium text-caption">
                    <v-icon size="14" class="mr-1" color="teal-darken-2">mdi-check-circle</v-icon>
                    Signé
                  </div>
                </td>
              </tr>
              <tr v-if="!acte.temoins || acte.temoins.length === 0">
                <td colspan="5" class="text-center py-4 text-caption text-grey">Aucun témoin enregistré pour cet acte.</td>
              </tr>
            </tbody>
          </v-table>

        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="4">
        <!-- Authenticité Digitale -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 text-center">
          <h3 class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-5">Authenticité Digitale</h3>
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
          <div class="text-caption text-grey-darken-1 mb-4">Scanner pour vérifier l'authenticité de cet acte sur le portail public.</div>
          <v-btn v-if="!qrCodeUrl" block variant="flat" color="success" size="small" class="text-none font-weight-bold mb-2" prepend-icon="mdi-qrcode-scan" @click="validerEtGenererQR" :loading="validating">
            Générer le QR Code
          </v-btn>
          <v-chip v-else color="success" variant="flat" class="font-weight-bold text-caption mt-2">
            <v-icon size="14" class="mr-1">mdi-shield-check</v-icon>
            CERTIFIÉ PAR BLOCKCHAIN
          </v-chip>
        </v-card>

        <!-- Historique des modifications -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-5">
            <v-icon color="primary" class="mr-3" size="20">mdi-history</v-icon>
            <h3 class="text-subtitle-2 font-weight-bold" style="color: #1a3b5c;">Historique des modifications</h3>
          </div>

          <v-timeline density="compact" side="end" line-thickness="2" line-color="grey-lighten-3">
            <v-timeline-item
              v-for="event in acte.historique"
              :key="event.titre"
              :dot-color="event.color"
              size="small"
            >
              <div class="text-body-2 font-weight-bold" style="color: #1a3b5c;">{{ event.titre }}</div>
              <div class="text-caption text-grey-darken-1">Par {{ event.auteur }}</div>
              <div class="text-caption text-grey">{{ event.date }}</div>
            </v-timeline-item>
          </v-timeline>
        </v-card>

        <!-- Carte GPS -->
        <v-card elevation="0" rounded="xl" class="overflow-hidden">
          <div class="map-placeholder" style="height: 200px; background: linear-gradient(135deg, #1a3b5c 0%, #2e7d32 100%); position: relative;">
            <div class="d-flex align-center justify-center h-100">
              <v-icon size="48" color="white" style="opacity: 0.3;">mdi-map</v-icon>
            </div>
            <div class="position-absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
              <v-icon size="32" color="blue-darken-2">mdi-map-marker</v-icon>
            </div>
          </div>
          <div class="d-flex justify-space-between align-center pa-4 bg-grey-darken-4">
            <span class="text-caption text-grey-lighten-2 font-weight-medium">Coordonnées GPS</span>
            <span class="text-caption text-white font-weight-bold">14.7561° N, 17.4677° W</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer -->
    <div class="text-center mt-12 mb-6">
      <div class="d-flex justify-center gap-4 mb-2">
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Mentions Légales</a>
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Vérification de Titre</a>
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Contact</a>
      </div>
      <div class="text-caption font-weight-medium text-grey-darken-2">Village de Taofikh Bousso — République du Sénégal © 2024</div>
      <div class="text-caption text-grey mt-1">Système de gestion foncière sécurisé par infrastructure certifiée.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const route = useRoute()
const qrCodeUrl = ref(null)
const validating = ref(false)

const acte = ref({
  numero: '',
  statut: '',
  parcelleId: '',
  localisation: '',
  superficie: '',
  typeUsage: '',
  numeroTitre: '',
  vendeur: {
    nom: '',
    cin: '',
    telephone: '',
    email: '',
    avatar: ''
  },
  acheteur: {
    nom: '',
    cin: '',
    telephone: '',
    email: '',
    avatar: ''
  },
  montant: '0',
  dateSignature: '',
  modePaiement: 'Comptant',
  temoins: [],
  historique: []
})

const fetchActe = async () => {
  const acteId = route.params.id
  if (!acteId) return

  try {
    const data = await api.actes.getById(acteId)
    if (data) {
      acte.value = {
        numero: data.numero_acte || '',
        statut: data.statut || 'brouillon',
        parcelleId: data.numero_parcelle || data.numero_parcelle_info || 'Non renseigné',
        localisation: data.localisation || data.parcelle?.localisation || 'Non renseignée',
        superficie: data.superficie_m2 ? `${data.superficie_m2} m²` : (data.parcelle?.superficie_m2 ? `${data.parcelle.superficie_m2} m²` : 'Non renseignée'),
        typeUsage: data.type_usage || data.parcelle?.description || 'Habitation',
        numeroTitre: data.numero_parcelle ? `TF-${data.numero_parcelle.replace(/[^0-9]/g, '') || '00'}-TB` : 'N/A',
        montant: data.montant_cfa !== undefined && data.montant_cfa !== null ? new Intl.NumberFormat('fr-FR').format(data.montant_cfa) : '0',
        dateSignature: data.date_vente ? new Date(data.date_vente + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
        modePaiement: 'Comptant',
        vendeur: {
          nom: `${data.vendeur_prenom || ''} ${data.vendeur_nom || ''}`.trim() || 'Non renseigné',
          cin: data.vendeur_cin || 'Non renseigné',
          telephone: data.vendeur_telephone || 'Non renseigné',
          email: data.vendeur_email || 'Non renseigné',
          avatar: ''
        },
        acheteur: {
          nom: `${data.acheteur_prenom || ''} ${data.acheteur_nom || ''}`.trim() || 'Non renseigné',
          cin: data.acheteur_cin || 'Non renseigné',
          telephone: data.acheteur_telephone || 'Non renseigné',
          email: data.acheteur_email || 'Non renseigné',
          avatar: ''
        },
        temoins: data.temoins && data.temoins.length > 0
          ? data.temoins.map(t => ({
              nom: `${t.prenom || ''} ${t.nom || ''}`.trim(),
              cin: t.cin || '-',
              role: 'Témoin',
              telephone: t.telephone || '-'
            }))
          : [],
        historique: []
      }

      // Fetch real audit trail history for this Acte
      try {
        const logs = await api.historique.getAll(0, 100, 'actes_vente')
        const acteLogs = logs.filter(l => l.enregistrement_id === acteId)
        if (acteLogs.length > 0) {
          acte.value.historique = acteLogs.map(l => {
            let label = 'Acte Modifié'
            let color = 'warning'
            if (l.action === 'creation') { label = 'Acte Créé (Brouillon)'; color = 'blue-darken-2' }
            else if (l.action === 'validation') { label = 'Acte Validé & Certifié'; color = 'success' }
            else if (l.action === 'annulation') { label = 'Acte Annulé'; color = 'error' }
            
            return {
              titre: label,
              auteur: l.utilisateur_nom || 'Utilisateur',
              date: new Date(l.created_at).toLocaleDateString('fr-FR') + ' — ' + new Date(l.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              color: color
            }
          })
        } else {
          acte.value.historique = [
            {
              titre: data.statut === 'valide' ? 'Acte Validé & Certifié' : 'Acte Créé (Brouillon)',
              auteur: 'Agent Foncier',
              date: new Date(data.created_at || data.date_vente).toLocaleDateString('fr-FR'),
              color: data.statut === 'valide' ? 'success' : 'blue-darken-2'
            }
          ]
        }
      } catch (e) {
        console.warn("Historique non disponible:", e)
      }
    }


    // Fetch QR code unconditionally
    try {
      qrCodeUrl.value = await api.actes.getQrcodeImage(acteId)
    } catch (e) {
      console.warn("QR code non disponible:", e)
      qrCodeUrl.value = null
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'acte:", error)
  }
}


onMounted(() => {
  fetchActe()
})



const validerEtGenererQR = async () => {
  const acteId = route.params.id
  validating.value = true
  try {
    await api.actes.valider(acteId)
    notify.success("Acte validé et QR Code généré avec succès")
    await fetchActe()
  } catch (error) {
    notify.error("Erreur lors de la génération du QR Code: " + error.message)
  } finally {
    validating.value = false
  }
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
  if (s === 'validé' || s === 'valide') return { color: 'success', variant: 'tonal' }
  if (s === 'brouillon') return { color: 'grey', variant: 'tonal' }
  if (s === 'annulé' || s === 'annule') return { color: 'error', variant: 'tonal' }
  return { color: 'grey', variant: 'tonal' }
}

const downloadPdf = () => {
  const acteId = route.params.id
  if (acteId) {
    api.actes.downloadPdf(acteId, `acte_${acte.value.numero}.pdf`)
  }
}

const validerActe = async () => {
  const acteId = route.params.id
  if (!acteId) return
  
  validating.value = true
  try {
    await api.actes.valider(acteId)
    await fetchActe() // Refresh data (statut, QR code, etc.)
  } catch (error) {
    console.error("Erreur lors de la validation:", error)
    alert("Erreur lors de la validation: " + error.message)
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
.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
.transition-colors {
  transition: color 0.2s ease;
}
.h-100 {
  height: 100%;
}
</style>
