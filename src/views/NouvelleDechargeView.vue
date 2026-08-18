<template>
  <div class="pb-16">
    <!-- Header -->
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" to="/decharges">
        RETOUR À LA LISTE
      </v-btn>
      <div class="d-flex justify-space-between align-center mt-2">
        <h1 class="text-h5 font-weight-bold" style="color: #1a3b5c;">Nouvelle décharge de paiement</h1>
        <div class="d-flex align-center bg-white border px-4 py-2 rounded-lg">
          <v-icon color="warning" size="small" class="mr-2">mdi-pencil-outline</v-icon>
          <div>
            <div class="text-caption text-grey-darken-1 font-weight-bold" style="line-height: 1;">STATUT ACTUEL</div>
            <div class="text-body-2 font-weight-bold text-warning" style="line-height: 1.2;">Nouveau brouillon</div>
          </div>
        </div>
      </div>
    </div>

    <v-row>
      <!-- Left Column: Form -->
      <v-col cols="12" md="8">
        
        <!-- Récepteur & Remettant Row -->
        <v-row class="mb-4">
          <!-- Récepteur (Reçoit l'argent) -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-blue-grey-lighten-5">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-account-arrow-left-outline</v-icon>
                  <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Le Récepteur (Qui reçoit)</h2>
                </div>
              </div>

              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Rechercher par CIN</div>
              <v-text-field
                v-model="receveurCin"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                class="bg-white mb-2"
                placeholder="Ex: 123456789"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupReceveur"
                @keyup.enter="lookupReceveur"
                :loading="searchingReceveur"
              ></v-text-field>

              <div v-if="resolvedReceveur" class="bg-white pa-3 rounded-lg border mb-2">
                <div class="text-subtitle-2 font-weight-bold text-primary">{{ resolvedReceveur.prenom }} {{ resolvedReceveur.nom }}</div>
                <div class="text-caption text-grey-darken-1">CIN: {{ resolvedReceveur.cin }}</div>
                <div v-if="resolvedReceveur.telephone" class="text-caption text-grey-darken-1">Tél: {{ resolvedReceveur.telephone }}</div>
              </div>

              <div v-else class="mt-2">
                <v-text-field v-model="form.receveur_prenom" label="Prénom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
                <v-text-field v-model="form.receveur_nom" label="Nom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
                <v-text-field v-model="form.receveur_cin" label="N° CIN *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
                <v-text-field v-model="form.receveur_telephone" label="Téléphone" variant="outlined" density="compact" class="bg-white" rounded="lg" hide-details></v-text-field>
              </div>
            </v-card>
          </v-col>

          <!-- Remettant (Donne l'argent) -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-blue-grey-lighten-5">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-account-arrow-right-outline</v-icon>
                  <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Le Remettant (Qui paie)</h2>
                </div>
              </div>

              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Rechercher par CIN</div>
              <v-text-field
                v-model="remettantCin"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                class="bg-white mb-2"
                placeholder="Ex: 987654321"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupRemettant"
                @keyup.enter="lookupRemettant"
                :loading="searchingRemettant"
              ></v-text-field>

              <div v-if="resolvedRemettant" class="bg-white pa-3 rounded-lg border mb-2">
                <div class="text-subtitle-2 font-weight-bold text-primary">{{ resolvedRemettant.prenom }} {{ resolvedRemettant.nom }}</div>
                <div class="text-caption text-grey-darken-1">CIN: {{ resolvedRemettant.cin }}</div>
                <div v-if="resolvedRemettant.telephone" class="text-caption text-grey-darken-1">Tél: {{ resolvedRemettant.telephone }}</div>
              </div>

              <div v-else class="mt-2">
                <v-text-field v-model="form.remettant_prenom" label="Prénom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
                <v-text-field v-model="form.remettant_nom" label="Nom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
                <v-text-field v-model="form.remettant_cin" label="N° CIN *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
                <v-text-field v-model="form.remettant_telephone" label="Téléphone" variant="outlined" density="compact" class="bg-white" rounded="lg" hide-details></v-text-field>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Informations financières & Terrain -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-cash-multiple</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Montants & Détails de la transaction</h2>
          </div>

          <v-row>
            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Montant reçu (FCFA) *</div>
              <v-text-field
                v-model.number="form.montant_recu"
                type="number"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                @input="recalculateFinancials"
              >
                <template v-slot:append-inner><span class="text-caption font-weight-bold">FCFA</span></template>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Montant convenu global (FCFA)</div>
              <v-text-field
                v-model.number="form.montant_convenu_global"
                type="number"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                @input="recalculateFinancials"
              >
                <template v-slot:append-inner><span class="text-caption font-weight-bold">FCFA</span></template>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Avance versée (FCFA)</div>
              <v-text-field
                v-model.number="form.avance"
                type="number"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                @input="recalculateFinancials"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Reliquat à payer</div>
              <v-text-field
                v-model="calculatedReliquat"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                readonly
                bg-color="grey-lighten-4"
                class="font-weight-bold text-error"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Date limite reliquat</div>
              <v-text-field
                v-model="form.date_limite_reliquat"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Motif de la décharge</div>
              <v-text-field
                v-model="form.motif"
                placeholder="Ex: VENTE DE TERRAIN"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Nombre de terrains</div>
              <v-text-field
                v-model.number="form.nombre_terrains"
                type="number"
                min="1"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Site du terrain</div>
              <v-text-field
                v-model="form.site_terrain"
                placeholder="Ex: Taofikh Bousso"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Terrain N°</div>
              <v-text-field
                v-model="form.numero_terrain"
                placeholder="Ex: TB-2024-045"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupParcelle"
                @keyup.enter="lookupParcelle"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Témoins -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3">mdi-account-group-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Témoins (Optionnel)</h2>
            </div>
            <v-btn size="small" variant="text" prepend-icon="mdi-plus" color="primary" @click="addTemoin">Ajouter un témoin</v-btn>
          </div>

          <v-row v-for="(t, index) in form.temoins" :key="index" class="align-center mb-2">
            <v-col cols="12" sm="4">
              <v-text-field v-model="t.prenom" label="Prénom" variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field v-model="t.nom" label="Nom" variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field v-model="t.cin" label="N° CIN" variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="12" sm="1" class="text-right">
              <v-btn icon="mdi-delete-outline" color="error" variant="text" size="small" @click="removeTemoin(index)"></v-btn>
            </v-col>
          </v-row>
        </v-card>

      </v-col>

      <!-- Right Column: Context & Preview Summary -->
      <v-col cols="12" md="4">
        <!-- Date & Lieu -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <h2 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1a3b5c;">Lieu et Date</h2>
          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Fait à</div>
          <v-text-field v-model="form.lieu_fait" variant="outlined" density="comfortable" hide-details rounded="lg" class="mb-4"></v-text-field>

          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Date de rédaction</div>
          <v-text-field v-model="form.date_fait" type="date" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
        </v-card>

        <!-- Aperçu de la décharge -->
        <v-card elevation="0" rounded="xl" class="pa-6" color="#1a3b5c" theme="dark">
          <h2 class="text-subtitle-1 font-weight-bold text-white mb-4" style="letter-spacing: 1px;">APERCU DE LA DECHARGE</h2>

          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">RÉCEPTEUR</div>
          <div class="text-body-1 text-white font-weight-bold mb-3">
            {{ form.receveur_prenom || '-' }} {{ form.receveur_nom || '' }}
          </div>

          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">REMETTANT</div>
          <div class="text-body-1 text-white font-weight-bold mb-3">
            {{ form.remettant_prenom || '-' }} {{ form.remettant_nom || '' }}
          </div>

          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">MONTANT REÇU</div>
          <div class="text-h5 font-weight-black text-amber-accent-2 mb-3">
            {{ formatMoney(form.montant_recu) }} FCFA
          </div>

          <div v-if="calculatedReliquatVal > 0">
            <div class="text-caption text-red-lighten-3 font-weight-bold mb-1">RELIQUAT</div>
            <div class="text-body-1 text-white font-weight-bold">
              {{ formatMoney(calculatedReliquatVal) }} FCFA
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sticky Footer Actions -->
    <v-card elevation="4" class="position-fixed bottom-0 left-0 w-100 py-3 px-6 d-flex justify-space-between align-center" style="z-index: 100; border-top: 1px solid rgba(0,0,0,0.05);">
      <div style="width: 260px;" class="hidden-sm-and-down"></div>
      <div class="d-flex align-center text-caption text-grey-darken-1 w-100 max-w-md">
        <v-icon size="small" class="mr-2">mdi-information-outline</v-icon>
        Tous les champs requis doivent être renseignés avant impression ou validation.
      </div>
      <div class="d-flex gap-4">
        <v-btn variant="text" color="primary" class="text-none font-weight-bold" rounded="lg" to="/decharges">Annuler</v-btn>
        <v-btn color="primary" elevation="0" class="text-none font-weight-bold" rounded="lg" @click="submitDecharge()" :loading="saving">Enregistrer</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { notification } from '../services/notifier'

const router = useRouter()

const receveurCin = ref('')
const remettantCin = ref('')
const searchingReceveur = ref(false)
const searchingRemettant = ref(false)
const resolvedReceveur = ref(null)
const resolvedRemettant = ref(null)
const saving = ref(false)

const form = ref({
  date_fait: new Date().toISOString().substring(0, 10),
  lieu_fait: 'Touba',
  receveur_id: null,
  receveur_nom: '',
  receveur_prenom: '',
  receveur_cin: '',
  receveur_telephone: '',
  remettant_id: null,
  remettant_nom: '',
  remettant_prenom: '',
  remettant_cin: '',
  remettant_telephone: '',
  montant_recu: 0,
  montant_convenu_global: null,
  avance: null,
  reliquat: null,
  date_limite_reliquat: '',
  motif: 'VENTE DE TERRAIN',
  nombre_terrains: 1,
  site_terrain: 'Taofikh Bousso',
  numero_terrain: '',
  parcelle_id: null,
  acte_id: null,
  temoins: [
    { prenom: '', nom: '', cin: '' }
  ]
})

const calculatedReliquatVal = computed(() => {
  if (!form.value.montant_convenu_global) return 0
  const paid = form.value.avance || form.value.montant_recu || 0
  return Math.max(0, form.value.montant_convenu_global - paid)
})

const calculatedReliquat = computed(() => {
  return formatMoney(calculatedReliquatVal.value) + ' FCFA'
})

const recalculateFinancials = () => {
  if (form.value.montant_convenu_global) {
    if (!form.value.avance) {
      form.value.avance = form.value.montant_recu
    }
    form.value.reliquat = calculatedReliquatVal.value
  }
}

const lookupReceveur = async () => {
  if (!receveurCin.value) return
  searchingReceveur.value = true
  try {
    const list = await api.proprietaires.getAll(0, 5, '', receveurCin.value)
    if (list && list.length > 0) {
      const p = list[0]
      resolvedReceveur.value = p
      form.value.receveur_id = p.id
      form.value.receveur_nom = p.nom
      form.value.receveur_prenom = p.prenom
      form.value.receveur_cin = p.cin
      form.value.receveur_telephone = p.telephone
      notification.success(`Récepteur trouvé: ${p.prenom} ${p.nom}`)
    } else {
      notification.error('Aucun propriétaire trouvé avec cette CIN')
    }
  } catch (e) {
    notification.error('Erreur lors de la recherche du récepteur')
  } finally {
    searchingReceveur.value = false
  }
}

const lookupRemettant = async () => {
  if (!remettantCin.value) return
  searchingRemettant.value = true
  try {
    const list = await api.proprietaires.getAll(0, 5, '', remettantCin.value)
    if (list && list.length > 0) {
      const p = list[0]
      resolvedRemettant.value = p
      form.value.remettant_id = p.id
      form.value.remettant_nom = p.nom
      form.value.remettant_prenom = p.prenom
      form.value.remettant_cin = p.cin
      form.value.remettant_telephone = p.telephone
      notification.success(`Remettant trouvé: ${p.prenom} ${p.nom}`)
    } else {
      notification.error('Aucun propriétaire trouvé avec cette CIN')
    }
  } catch (e) {
    notification.error('Erreur lors de la recherche du remettant')
  } finally {
    searchingRemettant.value = false
  }
}

const lookupParcelle = async () => {
  if (!form.value.numero_terrain) return
  try {
    const list = await api.parcelles.getAll(0, 5, form.value.numero_terrain)
    if (list && list.length > 0) {
      const p = list[0]
      form.value.parcelle_id = p.id
      form.value.site_terrain = p.localisation || form.value.site_terrain
      form.value.numero_terrain = p.numero_parcelle
      notification.success(`Parcelle associée: ${p.numero_parcelle}`)
    }
  } catch {
    // Ignore error
  }
}

const addTemoin = () => {
  form.value.temoins.push({ prenom: '', nom: '', cin: '' })
}

const removeTemoin = (index) => {
  form.value.temoins.splice(index, 1)
}

const submitDecharge = async () => {
  if (!form.value.receveur_nom || !form.value.receveur_cin || !form.value.remettant_nom || !form.value.remettant_cin) {
    notification.error('Veuillez remplir les informations du récepteur et du remettant (Nom & CIN)')
    return
  }
  if (!form.value.montant_recu) {
    notification.error('Veuillez saisir le montant reçu')
    return
  }

  saving.value = true
  try {
    const cleanTemoins = form.value.temoins.filter(t => t.nom && t.prenom && t.cin)
    const payload = {
      ...form.value,
      temoins: cleanTemoins,
      date_limite_reliquat: form.value.date_limite_reliquat || null
    }

    const created = await api.decharges.create(payload)
    notification.success('Décharge créée en brouillon !')
    router.push(`/decharges/${created.id}`)
  } catch (e) {
    notification.error('Erreur lors de la création de la décharge: ' + e.message)
  } finally {
    saving.value = false
  }
}

const formatMoney = (val) => {
  if (val === null || val === undefined) return '0'
  return new Intl.NumberFormat('fr-FR').format(val)
}
</script>

<style scoped>
.custom-card {
  border-radius: 16px;
}
</style>
