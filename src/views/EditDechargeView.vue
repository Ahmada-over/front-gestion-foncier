<template>
  <div class="pb-16">
    <!-- Header -->
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" :to="`/decharges/${route.params.id}`">
        RETOUR À LA DÉCHARGE
      </v-btn>
      <div class="d-flex justify-space-between align-center mt-2">
        <h1 class="text-h5 font-weight-bold" style="color: #1a3b5c;">Éditer la décharge {{ form.numero_decharge }}</h1>
        <v-chip color="warning" size="small" class="font-weight-bold">Brouillon</v-chip>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-6"></v-progress-linear>

    <v-row v-if="!loading">
      <!-- Left Column: Form -->
      <v-col cols="12" md="8">
        
        <!-- Récepteur & Remettant -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-blue-grey-lighten-5">
              <h2 class="text-subtitle-1 font-weight-bold mb-3" style="color: #1a3b5c;">Le Récepteur</h2>
              <v-text-field v-model="form.receveur_prenom" label="Prénom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
              <v-text-field v-model="form.receveur_nom" label="Nom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
              <v-text-field v-model="form.receveur_cin" label="N° CIN *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
              <v-text-field v-model="form.receveur_telephone" label="Téléphone" variant="outlined" density="compact" class="bg-white" rounded="lg" hide-details></v-text-field>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-blue-grey-lighten-5">
              <h2 class="text-subtitle-1 font-weight-bold mb-3" style="color: #1a3b5c;">Le Remettant</h2>
              <v-text-field v-model="form.remettant_prenom" label="Prénom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
              <v-text-field v-model="form.remettant_nom" label="Nom *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
              <v-text-field v-model="form.remettant_cin" label="N° CIN *" variant="outlined" density="compact" class="bg-white mb-2" rounded="lg" hide-details></v-text-field>
              <v-text-field v-model="form.remettant_telephone" label="Téléphone" variant="outlined" density="compact" class="bg-white" rounded="lg" hide-details></v-text-field>
            </v-card>
          </v-col>
        </v-row>

        <!-- Montants & Terrain -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <h2 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1a3b5c;">Montants & Transaction</h2>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Montant reçu (FCFA) *</div>
              <v-text-field v-model.number="form.montant_recu" type="number" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Montant convenu global (FCFA)</div>
              <v-text-field v-model.number="form.montant_convenu_global" type="number" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Avance versée (FCFA)</div>
              <v-text-field v-model.number="form.avance" type="number" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Date limite reliquat</div>
              <v-text-field v-model="form.date_limite_reliquat" type="date" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Motif</div>
              <v-text-field v-model="form.motif" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Site du terrain</div>
              <v-text-field v-model="form.site_terrain" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Terrain N°</div>
              <v-text-field v-model="form.numero_terrain" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Témoins -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Témoins</h2>
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

      <v-col cols="12" md="4">
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <h2 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1a3b5c;">Lieu et Date</h2>
          <v-text-field v-model="form.lieu_fait" label="Lieu" variant="outlined" density="comfortable" hide-details rounded="lg" class="mb-4"></v-text-field>
          <v-text-field v-model="form.date_fait" label="Date" type="date" variant="outlined" density="comfortable" hide-details rounded="lg"></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sticky Footer Actions -->
    <v-card elevation="4" class="position-fixed bottom-0 left-0 w-100 py-3 px-6 d-flex justify-space-between align-center" style="z-index: 100;">
      <div style="width: 260px;" class="hidden-sm-and-down"></div>
      <div></div>
      <div class="d-flex gap-4">
        <v-btn variant="text" color="primary" class="text-none font-weight-bold" rounded="lg" :to="`/decharges/${route.params.id}`">Annuler</v-btn>
        <v-btn color="primary" elevation="0" class="text-none font-weight-bold" rounded="lg" @click="save" :loading="saving">Enregistrer les modifications</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'
import { notification } from '../services/notifier'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)

const form = ref({
  numero_decharge: '',
  date_fait: '',
  lieu_fait: 'Touba',
  receveur_nom: '',
  receveur_prenom: '',
  receveur_cin: '',
  receveur_telephone: '',
  remettant_nom: '',
  remettant_prenom: '',
  remettant_cin: '',
  remettant_telephone: '',
  montant_recu: 0,
  montant_convenu_global: null,
  avance: null,
  date_limite_reliquat: '',
  motif: 'VENTE DE TERRAIN',
  site_terrain: '',
  numero_terrain: '',
  temoins: []
})

const fetchDecharge = async () => {
  loading.value = true
  try {
    const data = await api.decharges.getById(route.params.id)
    form.value = {
      ...data,
      temoins: data.temoins || []
    }
  } catch (e) {
    notification.error('Erreur de chargement: ' + e.message)
  } finally {
    loading.value = false
  }
}

const addTemoin = () => {
  form.value.temoins.push({ prenom: '', nom: '', cin: '' })
}

const removeTemoin = (index) => {
  form.value.temoins.splice(index, 1)
}

const save = async () => {
  saving.value = true
  try {
    const cleanTemoins = form.value.temoins.filter(t => t.nom && t.prenom && t.cin)
    const payload = {
      ...form.value,
      temoins: cleanTemoins
    }
    await api.decharges.update(route.params.id, payload)
    notification.success('Décharge mise à jour !')
    router.push(`/decharges/${route.params.id}`)
  } catch (e) {
    notification.error('Erreur lors de la mise à jour: ' + e.message)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchDecharge()
})
</script>
