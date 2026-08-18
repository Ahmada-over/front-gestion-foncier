<template>
  <div class="pb-16"> <!-- Padding bottom for sticky footer -->
    <!-- Header -->
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" @click="router.back()">
        RETOUR
      </v-btn>
      <div class="d-flex justify-space-between align-center mt-2">
        <h1 class="text-h5 font-weight-bold" style="color: #1a3b5c;">Édition de l'acte de vente</h1>
        <div class="d-flex align-center bg-white border px-4 py-2 rounded-lg">
          <v-icon color="warning" size="small" class="mr-2">mdi-pencil-circle</v-icon>
          <div>
            <div class="text-caption text-grey-darken-1 font-weight-bold" style="line-height: 1;">STATUT ACTUEL</div>
            <div class="text-body-2 font-weight-bold text-warning" style="line-height: 1.2;">Édition Brouillon</div>
          </div>
        </div>
      </div>
    </div>

    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="8">
        <!-- Informations de la parcelle -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-map-marker-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Informations de la parcelle</h2>
          </div>
          
          <v-row>
            <v-col cols="12" sm="8">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">N° de parcelle</div>
              <v-text-field
                v-model="parcelleSearch"
                placeholder="Ex: TB-2024-045"
                variant="outlined"
                density="comfortable"
                hide-details
                append-inner-icon="mdi-magnify"
                rounded="lg"
                @click:append-inner="lookupParcelle"
                @keyup.enter="lookupParcelle"
                :loading="searchingParcelle"
              ></v-text-field>
              <div v-if="resolvedParcelle" class="text-caption text-success font-weight-bold mt-1">
                <v-icon size="14">mdi-check-circle</v-icon> {{ resolvedParcelle.numero_parcelle }} - {{ resolvedParcelle.superficie_m2 }}m²
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Superficie</div>
              <v-text-field
                v-model="acte.superficie"
                placeholder="200 m²"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                bg-color="grey-lighten-4"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Localisation</div>
              <v-text-field
                v-model="acte.localisation"
                prepend-inner-icon="mdi-map-marker-outline"
                placeholder="Quartier Darou"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                bg-color="grey-lighten-4"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Vendeur & Acheteur Row -->
        <v-row class="mb-6">
          <!-- Vendeur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-blue-grey-lighten-5">
              <div class="d-flex align-center mb-6">
                <v-icon color="primary" class="mr-3">mdi-account-outline</v-icon>
                <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Vendeur</h2>
              </div>
              
              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">CIN (Carte d'Identité)</div>
              <v-text-field 
                v-model="vendeurCin" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                rounded="lg" 
                class="bg-white mb-2"
                placeholder="Rechercher par CIN"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupVendeur"
                @keyup.enter="lookupVendeur"
                :loading="searchingVendeur"
              ></v-text-field>

              <v-expand-transition>
                <div v-if="resolvedVendeur" class="bg-white pa-3 rounded-lg border mt-2">
                  <div class="font-weight-bold text-body-2" style="color: #1a3b5c;">{{ resolvedVendeur.prenom }} {{ resolvedVendeur.nom }}</div>
                  <div class="text-caption text-grey-darken-1">{{ resolvedVendeur.adresse || 'Sans adresse' }}</div>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>

          <!-- Acheteur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-teal-lighten-5">
              <div class="d-flex align-center mb-6">
                <v-icon color="teal-darken-2" class="mr-3">mdi-account-plus-outline</v-icon>
                <h2 class="text-subtitle-1 font-weight-bold" style="color: #004d40;">Acheteur</h2>
              </div>

              <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">CIN (Carte d'Identité)</div>
              <v-text-field 
                v-model="acheteurCin" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                rounded="lg" 
                class="bg-white mb-2"
                placeholder="Rechercher par CIN"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupAcheteur"
                @keyup.enter="lookupAcheteur"
                :loading="searchingAcheteur"
              ></v-text-field>

              <v-expand-transition>
                <div v-if="resolvedAcheteur" class="bg-white pa-3 rounded-lg border mt-2">
                  <div class="font-weight-bold text-body-2" style="color: #004d40;">{{ resolvedAcheteur.prenom }} {{ resolvedAcheteur.nom }}</div>
                  <div class="text-caption text-grey-darken-1">{{ resolvedAcheteur.adresse || 'Sans adresse' }}</div>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <!-- Témoins -->
        <v-card elevation="0" border rounded="xl" class="pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3">mdi-account-group-outline</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Témoins</h2>
            </div>
            <v-chip size="small" color="grey-lighten-2" text-color="grey-darken-3" class="font-weight-bold">3 REQUIS</v-chip>
          </div>
          
          <v-table density="comfortable" class="bg-transparent">
            <thead>
              <tr>
                <th class="text-overline font-weight-bold text-grey-darken-1">PRÉNOM</th>
                <th class="text-overline font-weight-bold text-grey-darken-1">NOM</th>
                <th class="text-overline font-weight-bold text-grey-darken-1">CIN</th>
                <th class="text-overline font-weight-bold text-grey-darken-1">N° TÉLÉPHONE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(temoin, index) in acte.temoins" :key="index">
                <td class="py-2"><v-text-field v-model="temoin.prenom" :placeholder="`Prénom ${index + 1}`" variant="outlined" density="compact" hide-details bg-color="grey-lighten-4" rounded="lg"></v-text-field></td>
                <td class="py-2"><v-text-field v-model="temoin.nom" :placeholder="`Nom ${index + 1}`" variant="outlined" density="compact" hide-details bg-color="grey-lighten-4" rounded="lg"></v-text-field></td>
                <td class="py-2"><v-text-field v-model="temoin.cin" placeholder="0000 0000 00000" variant="outlined" density="compact" hide-details bg-color="grey-lighten-4" rounded="lg"></v-text-field></td>
                <td class="py-2"><v-text-field v-model="temoin.telephone" placeholder="Tél (ex: 77...)" variant="outlined" density="compact" hide-details bg-color="grey-lighten-4" rounded="lg"></v-text-field></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="4">
        <!-- Détails financiers -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-credit-card-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Détails financiers</h2>
          </div>
          
          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Date de la transaction</div>
          <v-text-field
            v-model="acte.date_vente"
            type="date"
            placeholder="mm/dd/yyyy"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            class="mb-4"
          ></v-text-field>

          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Montant FCFA</div>
          <v-text-field
            v-model="acte.montant_cfa"
            type="number"
            placeholder="0"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            bg-color="blue-lighten-5"
          >
            <template v-slot:append-inner>
              <span class="text-primary font-weight-bold mt-1">FCFA</span>
            </template>
          </v-text-field>
          <div class="text-caption text-grey mt-2 d-flex justify-space-between">
            <span>Frais administratifs (2%)</span>
            <span>Calcul automatique...</span>
          </div>
        </v-card>

        <!-- Résumé du titre -->
        <v-card elevation="0" rounded="xl" class="pa-6" color="#1a3b5c" theme="dark">
          <h2 class="text-subtitle-1 font-weight-bold text-white mb-6" style="letter-spacing: 1px;">RÉSUMÉ DU TITRE</h2>
          
          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">PARCELLE</div>
          <div class="text-h6 font-weight-bold text-white mb-4">{{ acte.parcelle_id || '- À renseigner -' }}</div>
          
          <v-row>
            <v-col cols="6">
              <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">VENDEUR</div>
              <div class="text-body-1 text-white">{{ resolvedVendeur ? `${resolvedVendeur.prenom} ${resolvedVendeur.nom}` : '-' }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">ACHETEUR</div>
              <div class="text-body-1 text-white">{{ resolvedAcheteur ? `${resolvedAcheteur.prenom} ${resolvedAcheteur.nom}` : '-' }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sticky Footer -->
    <v-card elevation="4" class="position-fixed bottom-0 left-0 w-100 py-3 px-6 d-flex justify-space-between align-center" style="z-index: 100; border-top: 1px solid rgba(0,0,0,0.05);">
      <div style="width: 260px;" class="hidden-sm-and-down"></div> <!-- Spacer for sidebar -->
      
      <div class="d-flex align-center text-caption text-grey-darken-1 w-100 max-w-md">
        <v-icon size="small" class="mr-2">mdi-information-outline</v-icon>
        Tous les champs sont requis pour la validation finale par le conservateur foncier.
      </div>
      
      <div class="d-flex gap-4">
        <v-btn variant="text" color="primary" class="text-none font-weight-bold" rounded="lg" @click="router.back()">Annuler</v-btn>
        <v-btn color="primary" elevation="0" class="text-none font-weight-bold" rounded="lg" @click="updateActe()" :loading="loading">Enregistrer les modifications</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const router = useRouter()
const route = useRoute()

const parcelleSearch = ref('')
const vendeurCin = ref('')
const acheteurCin = ref('')

const searchingParcelle = ref(false)
const searchingVendeur = ref(false)
const searchingAcheteur = ref(false)

const resolvedParcelle = ref(null)
const resolvedVendeur = ref(null)
const resolvedAcheteur = ref(null)

const acte = ref({
  parcelle_id: '',
  vendeur_id: '',
  acheteur_id: '',
  montant_cfa: 0,
  date_vente: new Date().toISOString().substr(0, 10),
  temoins: [
    { nom: '', prenom: '', cin: '' },
    { nom: '', prenom: '', cin: '' },
    { nom: '', prenom: '', cin: '' }
  ],
  // Visual fields only
  superficie: '',
  localisation: ''
})
const loading = ref(false)

const fetchActe = async () => {
  const acteId = route.params.id
  if (!acteId) return
  loading.value = true
  try {
    const data = await api.actes.getById(acteId)
    if (data) {
      acte.value.parcelle_id = data.parcelle_id
      acte.value.vendeur_id = data.vendeur_id
      acte.value.acheteur_id = data.acheteur_id
      acte.value.montant_cfa = data.montant_cfa
      acte.value.date_vente = data.date_vente ? new Date(data.date_vente).toISOString().substr(0, 10) : ''
      
      if (data.temoins && data.temoins.length > 0) {
        acte.value.temoins = data.temoins.map(t => ({ nom: t.nom, prenom: t.prenom, cin: t.cin }))
      }
      while (acte.value.temoins.length < 3) {
        acte.value.temoins.push({ nom: '', prenom: '', cin: '' })
      }
      
      parcelleSearch.value = data.numero_parcelle_info || 'Parcelle ID: ' + data.parcelle_id
      vendeurCin.value = data.vendeur_cin
      acheteurCin.value = data.acheteur_cin
      
      resolvedParcelle.value = {
        numero_parcelle: data.numero_parcelle_info || 'Parcelle',
        superficie_m2: '...'
      }
      resolvedVendeur.value = { prenom: data.vendeur_prenom, nom: data.vendeur_nom }
      resolvedAcheteur.value = { prenom: data.acheteur_prenom, nom: data.acheteur_nom }
    }
  } catch (error) {
    console.error("Erreur chargement de l'acte:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActe()
})

const lookupParcelle = async () => {
  if (!parcelleSearch.value) return
  searchingParcelle.value = true
  try {
    const data = await api.parcelles.getAll(0, 5, parcelleSearch.value)
    if (data && data.length > 0) {
      const found = data[0]
      resolvedParcelle.value = found
      acte.value.parcelle_id = found.id
      acte.value.superficie = found.superficie_m2 + ' m²'
      acte.value.localisation = found.localisation
    } else {
      notify.error("Parcelle non trouvée")
    }
  } catch (error) {
    notify.error("Erreur lors de la recherche")
  } finally {
    searchingParcelle.value = false
  }
}

const lookupVendeur = async () => {
  if (!vendeurCin.value) return
  searchingVendeur.value = true
  try {
    const data = await api.proprietaires.getAll(0, 5, '', vendeurCin.value)
    if (data && data.length > 0) {
      resolvedVendeur.value = data[0]
      acte.value.vendeur_id = data[0].id
    } else {
      notify.error("Propriétaire non trouvé")
    }
  } catch (e) {
    console.error(e)
  } finally {
    searchingVendeur.value = false
  }
}

const lookupAcheteur = async () => {
  if (!acheteurCin.value) return
  searchingAcheteur.value = true
  try {
    const data = await api.proprietaires.getAll(0, 5, '', acheteurCin.value)
    if (data && data.length > 0) {
      resolvedAcheteur.value = data[0]
      acte.value.acheteur_id = data[0].id
    } else {
      notify.error("Propriétaire non trouvé")
    }
  } catch (e) {
    console.error(e)
  } finally {
    searchingAcheteur.value = false
  }
}

const updateActe = async () => {
  if (parcelleSearch.value && !acte.value.parcelle_id) await lookupParcelle()
  if (vendeurCin.value && !acte.value.vendeur_id) await lookupVendeur()
  if (acheteurCin.value && !acte.value.acheteur_id) await lookupAcheteur()

  if (!acte.value.parcelle_id || !acte.value.vendeur_id || !acte.value.acheteur_id) {
    notify.error("Veuillez renseigner et valider la parcelle, le vendeur et l'acheteur")
    return
  }

  loading.value = true
  try {
    const payload = {
      parcelle_id: acte.value.parcelle_id,
      vendeur_id: acte.value.vendeur_id,
      acheteur_id: acte.value.acheteur_id,
      montant_cfa: parseFloat(acte.value.montant_cfa),
      date_vente: acte.value.date_vente,
      temoins: acte.value.temoins.filter(t => t.nom && t.prenom && t.cin)
    }
    
    await api.actes.update(route.params.id, payload)
    notify.success("Acte de vente modifié avec succès")
    router.push(`/actes/${route.params.id}`)
  } catch (error) {
    notify.error('Erreur: ' + (error.response?.data?.detail || error.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
.bottom-0 {
  bottom: 0;
}
.left-0 {
  left: 0;
}
.w-100 {
  width: 100%;
}
.max-w-md {
  max-width: 600px;
}
</style>
