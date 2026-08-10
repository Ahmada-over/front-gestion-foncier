<template>
  <div class="pb-16">
    <!-- Header -->
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption mb-1" to="/actes">
        RETOUR À LA LISTE DES ACTES
      </v-btn>
      <div class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: #0f2942;">Nouvel acte de vente</h1>
          <div class="text-caption text-grey-darken-1">Renseignez la parcelle, le vendeur, l'acheteur et les témoins.</div>
        </div>
        <div class="d-flex align-center bg-white border px-4 py-2 rounded-xl shadow-xs">
          <v-avatar color="amber-lighten-5" size="28" class="mr-2">
            <v-icon color="warning" size="16">mdi-pencil</v-icon>
          </v-avatar>
          <div>
            <div class="text-caption text-grey-darken-1 font-weight-bold" style="line-height: 1; font-size: 10px;">STATUT</div>
            <div class="text-caption font-weight-bold text-warning" style="line-height: 1.2;">Brouillon</div>
          </div>
        </div>
      </div>
    </div>

    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="8">
        <!-- Informations de la parcelle -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-white">
          <div class="d-flex align-center mb-6">
            <v-avatar color="blue-lighten-5" size="36" class="mr-3">
              <v-icon color="primary" size="20">mdi-map-marker-radius-outline</v-icon>
            </v-avatar>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #0f2942;">Informations de la parcelle</h2>
          </div>
          
          <v-row>
            <v-col cols="12" sm="8">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">RECHERCHER N° PARCELLE *</div>
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
              <div v-if="resolvedParcelle" class="text-caption text-success font-weight-bold mt-2 d-flex align-center">
                <v-icon size="16" class="mr-1">mdi-check-circle</v-icon> Parcelle identifiée: {{ resolvedParcelle.numero_parcelle }} ({{ resolvedParcelle.superficie_m2 }} m²)
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">SUPERFICIE</div>
              <v-text-field
                v-model="acte.superficie"
                placeholder="200 m²"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                bg-color="slate-50"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">LOCALISATION</div>
              <v-text-field
                v-model="acte.localisation"
                prepend-inner-icon="mdi-map-marker-outline"
                placeholder="Quartier / Village"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                bg-color="slate-50"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Vendeur & Acheteur Row -->
        <v-row class="mb-6">
          <!-- Vendeur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-slate-50">
              <div class="d-flex align-center mb-6">
                <v-avatar color="indigo-lighten-5" size="36" class="mr-3">
                  <v-icon color="indigo-darken-2" size="20">mdi-account-arrow-right-outline</v-icon>
                </v-avatar>
                <h2 class="text-subtitle-1 font-weight-bold" style="color: #0f2942;">Vendeur</h2>
              </div>
              
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">N° CIN VENDEUR *</div>
              <v-text-field 
                v-model="vendeurCin" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                rounded="lg" 
                class="bg-white mb-2"
                placeholder="Ex: 1990123456789"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupVendeur"
                @keyup.enter="lookupVendeur"
                :loading="searchingVendeur"
              ></v-text-field>

              <v-expand-transition>
                <div v-if="resolvedVendeur" class="bg-white pa-4 rounded-xl border mt-3 shadow-xs">
                  <div class="font-weight-bold text-body-2" style="color: #0f2942;">{{ resolvedVendeur.prenom }} {{ resolvedVendeur.nom }}</div>
                  <div class="text-caption text-grey-darken-1">CIN : {{ resolvedVendeur.cin }}</div>
                  <div v-if="resolvedVendeur.telephone" class="text-caption text-grey-darken-1">Tél : {{ resolvedVendeur.telephone }}</div>
                </div>
                <div v-else-if="vendeurNotFound" class="mt-3">
                  <v-alert color="amber-lighten-5" variant="flat" density="compact" class="text-caption mb-2 text-warning rounded-lg border">
                    Aucun propriétaire enregistré avec cette CIN.
                  </v-alert>
                  <v-btn size="small" variant="outlined" color="primary" block rounded="lg" class="text-none font-weight-bold" @click="openNewProprietaireDialog('vendeur')">
                    <v-icon class="mr-1">mdi-account-plus</v-icon> Enregistrer ce vendeur
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>

          <!-- Acheteur -->
          <v-col cols="12" sm="6">
            <v-card elevation="0" border rounded="xl" class="pa-6 h-100 bg-emerald-50" style="background-color: #f0fdf4 !important;">
              <div class="d-flex align-center mb-6">
                <v-avatar color="green-lighten-4" size="36" class="mr-3">
                  <v-icon color="green-darken-3" size="20">mdi-account-arrow-left-outline</v-icon>
                </v-avatar>
                <h2 class="text-subtitle-1 font-weight-bold" style="color: #064e3b;">Acheteur</h2>
              </div>

              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">N° CIN ACHETEUR *</div>
              <v-text-field 
                v-model="acheteurCin" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                rounded="lg" 
                class="bg-white mb-2"
                placeholder="Ex: 1992987654321"
                append-inner-icon="mdi-magnify"
                @click:append-inner="lookupAcheteur"
                @keyup.enter="lookupAcheteur"
                :loading="searchingAcheteur"
              ></v-text-field>

              <v-expand-transition>
                <div v-if="resolvedAcheteur" class="bg-white pa-4 rounded-xl border mt-3 shadow-xs">
                  <div class="font-weight-bold text-body-2 text-emerald-900" style="color: #064e3b;">{{ resolvedAcheteur.prenom }} {{ resolvedAcheteur.nom }}</div>
                  <div class="text-caption text-grey-darken-1">CIN : {{ resolvedAcheteur.cin }}</div>
                  <div v-if="resolvedAcheteur.telephone" class="text-caption text-grey-darken-1">Tél : {{ resolvedAcheteur.telephone }}</div>
                </div>
                <div v-else-if="acheteurNotFound" class="mt-3">
                  <v-alert color="amber-lighten-5" variant="flat" density="compact" class="text-caption mb-2 text-warning rounded-lg border">
                    Aucun propriétaire enregistré avec cette CIN.
                  </v-alert>
                  <v-btn size="small" variant="outlined" color="success" block rounded="lg" class="text-none font-weight-bold" @click="openNewProprietaireDialog('acheteur')">
                    <v-icon class="mr-1">mdi-account-plus</v-icon> Enregistrer cet acheteur
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <!-- Témoins -->
        <v-card elevation="0" border rounded="xl" class="pa-6 bg-white">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <v-avatar color="purple-lighten-5" size="36" class="mr-3">
                <v-icon color="purple-darken-2" size="20">mdi-account-group-outline</v-icon>
              </v-avatar>
              <h2 class="text-subtitle-1 font-weight-bold" style="color: #0f2942;">Témoins de la transaction</h2>
            </div>
            <v-chip size="small" color="purple-lighten-5" class="font-weight-bold text-purple-darken-2" variant="flat">3 REQUIS</v-chip>
          </div>
          
          <v-table density="comfortable" class="bg-transparent">
            <thead>
              <tr>
                <th class="text-overline font-weight-bold text-grey-darken-1">PRÉNOM</th>
                <th class="text-overline font-weight-bold text-grey-darken-1">NOM</th>
                <th class="text-overline font-weight-bold text-grey-darken-1">N° CIN</th>
                <th class="text-overline font-weight-bold text-grey-darken-1">N° TÉLÉPHONE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(temoin, index) in acte.temoins" :key="index">
                <td class="py-2"><v-text-field v-model="temoin.prenom" :placeholder="`Prénom Témoin ${index + 1}`" variant="outlined" density="compact" hide-details bg-color="slate-50" rounded="lg"></v-text-field></td>
                <td class="py-2"><v-text-field v-model="temoin.nom" :placeholder="`Nom Témoin ${index + 1}`" variant="outlined" density="compact" hide-details bg-color="slate-50" rounded="lg"></v-text-field></td>
                <td class="py-2"><v-text-field v-model="temoin.cin" placeholder="CIN" variant="outlined" density="compact" hide-details bg-color="slate-50" rounded="lg"></v-text-field></td>
                <td class="py-2"><v-text-field v-model="temoin.telephone" placeholder="Tél (ex: 77 000...)" variant="outlined" density="compact" hide-details bg-color="slate-50" rounded="lg"></v-text-field></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="4">
        <!-- Détails financiers -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-white">
          <div class="d-flex align-center mb-6">
            <v-avatar color="amber-lighten-5" size="36" class="mr-3">
              <v-icon color="amber-darken-3" size="20">mdi-cash-multiple</v-icon>
            </v-avatar>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #0f2942;">Détails financiers</h2>
          </div>
          
          <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">DATE DE LA TRANSACTION</div>
          <v-text-field
            v-model="acte.date_vente"
            type="date"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            class="mb-4"
          ></v-text-field>

          <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">MONTANT EN FCFA *</div>
          <v-text-field
            v-model.number="acte.montant_cfa"
            type="number"
            placeholder="Ex: 5 000 000"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
          >
            <template v-slot:append-inner>
              <span class="text-caption font-weight-bold text-primary">FCFA</span>
            </template>
          </v-text-field>
        </v-card>

        <!-- Résumé du titre -->
        <v-card elevation="0" rounded="xl" class="pa-6" color="#0f2942" theme="dark">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="text-subtitle-2 font-weight-bold text-white" style="letter-spacing: 1px;">RÉSUMÉ DE L'ACTE</h2>
            <v-icon color="blue-lighten-3" size="20">mdi-file-certificate</v-icon>
          </div>
          
          <div class="text-caption text-blue-lighten-3 font-weight-bold mb-1">N° PARCELLE</div>
          <div class="text-subtitle-1 font-weight-bold text-white mb-4">{{ resolvedParcelle ? resolvedParcelle.numero_parcelle : '- Non sélectionnée -' }}</div>
          
          <div class="border-t border-blue-darken-3 pt-3 mt-2">
            <div class="text-caption text-blue-lighten-3 font-weight-bold mb-1">VENDEUR</div>
            <div class="text-body-2 text-white font-weight-bold mb-3">{{ resolvedVendeur ? `${resolvedVendeur.prenom} ${resolvedVendeur.nom}` : '-' }}</div>

            <div class="text-caption text-blue-lighten-3 font-weight-bold mb-1">ACHETEUR</div>
            <div class="text-body-2 text-white font-weight-bold mb-3">{{ resolvedAcheteur ? `${resolvedAcheteur.prenom} ${resolvedAcheteur.nom}` : '-' }}</div>

            <div class="text-caption text-blue-lighten-3 font-weight-bold mb-1">MONTANT TRANSACTION</div>
            <div class="text-h6 font-weight-black text-amber-accent-2">{{ formatMoney(acte.montant_cfa) }} FCFA</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sticky Footer -->
    <v-card elevation="4" class="position-fixed bottom-0 left-0 w-100 py-3 px-6 d-flex justify-space-between align-center bg-white" style="z-index: 100; border-top: 1px solid rgba(226, 232, 240, 0.8);">
      <div style="width: 260px;" class="hidden-sm-and-down"></div>
      
      <div class="d-flex align-center text-caption text-grey-darken-1 w-100 max-w-md">
        <v-icon size="small" class="mr-2" color="info">mdi-information-outline</v-icon>
        Tous les champs marqués d'un astérisque sont requis pour enregistrer l'acte.
      </div>
      
      <div class="d-flex gap-3">
        <v-btn variant="text" color="grey-darken-1" class="text-none font-weight-bold" rounded="lg" to="/actes">Annuler</v-btn>
        <v-btn color="primary" elevation="0" class="text-none font-weight-bold px-6" rounded="lg" @click="createActe()" :loading="loading">Enregistrer l'acte</v-btn>
      </div>
    </v-card>

    <!-- Dialog Nouveau Propriétaire -->
    <v-dialog v-model="newProprietaireDialog" max-width="500" persistent>
      <v-card rounded="xl" class="pa-2">
        <v-progress-linear v-if="savingProprietaire" indeterminate color="primary" height="4" class="rounded-top"></v-progress-linear>
        <v-card-title class="text-subtitle-1 font-weight-bold pt-4 px-6" style="color: #0f2942;">
          Créer un nouveau propriétaire
        </v-card-title>
        <v-card-text class="px-6 pb-6 pt-2">
          <v-text-field v-model="newProprietaire.prenom" label="Prénom *" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.nom" label="Nom *" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.cin" label="N° CIN / Passeport *" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.telephone" label="Téléphone" variant="outlined" density="compact" class="mb-3" rounded="lg" :disabled="savingProprietaire"></v-text-field>
          <v-text-field v-model="newProprietaire.adresse" label="Adresse" variant="outlined" density="compact" rounded="lg" :disabled="savingProprietaire"></v-text-field>
        </v-card-text>
        <v-card-actions class="px-6 pb-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="text-none" :disabled="savingProprietaire" @click="newProprietaireDialog = false">Annuler</v-btn>
          <v-btn variant="flat" color="primary" class="text-none font-weight-bold" rounded="lg" @click="saveNewProprietaire" :loading="savingProprietaire">Créer & Sélectionner</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const router = useRouter()

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
  montant_cfa: null,
  date_vente: new Date().toISOString().substr(0, 10),
  temoins: [
    { nom: '', prenom: '', cin: '', telephone: '' },
    { nom: '', prenom: '', cin: '', telephone: '' },
    { nom: '', prenom: '', cin: '', telephone: '' }
  ],
  superficie: '',
  localisation: ''
})
const loading = ref(false)

const acheteurNotFound = ref(false)
const vendeurNotFound = ref(false)

const newProprietaireDialog = ref(false)
const savingProprietaire = ref(false)
const proprietaireTarget = ref('')
const newProprietaire = ref({
  nom: '',
  prenom: '',
  cin: '',
  telephone: '',
  adresse: ''
})

const formatMoney = (val) => {
  if (!val) return '0'
  return new Intl.NumberFormat('fr-FR').format(val)
}

const openNewProprietaireDialog = (target) => {
  proprietaireTarget.value = target
  newProprietaire.value = {
    nom: '',
    prenom: '',
    cin: target === 'acheteur' ? acheteurCin.value : vendeurCin.value,
    telephone: '',
    adresse: ''
  }
  newProprietaireDialog.value = true
}

const saveNewProprietaire = async () => {
  if (!newProprietaire.value.nom || !newProprietaire.value.prenom || !newProprietaire.value.cin) {
    notify.error("Veuillez remplir le prénom, nom et CIN du propriétaire")
    return
  }
  savingProprietaire.value = true
  try {
    const res = await api.proprietaires.create(newProprietaire.value)
    notify.success("Propriétaire créé avec succès")
    newProprietaireDialog.value = false
    
    if (proprietaireTarget.value === 'acheteur') {
      resolvedAcheteur.value = res
      acte.value.acheteur_id = res.id
      acheteurNotFound.value = false
      acheteurCin.value = res.cin
    } else {
      resolvedVendeur.value = res
      acte.value.vendeur_id = res.id
      vendeurNotFound.value = false
      vendeurCin.value = res.cin
    }
  } catch (e) {
    notify.error("Erreur lors de la création du propriétaire: " + e.message)
  } finally {
    savingProprietaire.value = false
  }
}


const lookupParcelle = async () => {
  if (!parcelleSearch.value) return
  searchingParcelle.value = true
  try {
    const data = await api.parcelles.getAll(0, 1, parcelleSearch.value)
    if (data && data.length > 0) {
      const found = data[0]
      resolvedParcelle.value = found
      acte.value.parcelle_id = found.id
      acte.value.superficie = found.superficie_m2 + ' m²'
      acte.value.localisation = found.localisation
    } else {
      notify.error("Parcelle non trouvée")
    }
  } catch (e) {
    notify.error("Erreur lors de la recherche")
  } finally {
    searchingParcelle.value = false
  }
}

const lookupVendeur = async () => {
  if (!vendeurCin.value) return
  searchingVendeur.value = true
  vendeurNotFound.value = false
  try {
    const data = await api.proprietaires.getAll(0, 1, '', vendeurCin.value)
    if (data && data.length > 0) {
      resolvedVendeur.value = data[0]
      acte.value.vendeur_id = data[0].id
    } else {
      vendeurNotFound.value = true
      resolvedVendeur.value = null
      notify.error("Vendeur non trouvé")
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
  acheteurNotFound.value = false
  try {
    const data = await api.proprietaires.getAll(0, 1, '', acheteurCin.value)
    if (data && data.length > 0) {
      resolvedAcheteur.value = data[0]
      acte.value.acheteur_id = data[0].id
    } else {
      acheteurNotFound.value = true
      resolvedAcheteur.value = null
      notify.error("Acheteur non trouvé")
    }
  } catch (e) {
    console.error(e)
  } finally {
    searchingAcheteur.value = false
  }
}

const createActe = async () => {
  if (parcelleSearch.value && !acte.value.parcelle_id) await lookupParcelle()
  if (vendeurCin.value && !acte.value.vendeur_id) await lookupVendeur()
  if (acheteurCin.value && !acte.value.acheteur_id) await lookupAcheteur()

  if (!acte.value.parcelle_id || !acte.value.vendeur_id || !acte.value.acheteur_id) {
    notify.error("Veuillez renseigner et valider la parcelle, le vendeur et l'acheteur")
    return
  }

  if (!acte.value.montant_cfa || isNaN(parseFloat(acte.value.montant_cfa)) || parseFloat(acte.value.montant_cfa) <= 0) {
    notify.error("Veuillez saisir le montant de la transaction (supérieur à 0 FCFA)")
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
    
    const response = await api.actes.create(payload)
    notify.success("Acte de vente créé avec succès")
    if (response && response.id) {
      await router.push(`/actes/${response.id}`)
    } else {
      await router.push('/actes')
    }
  } catch (error) {
    notify.error('Erreur: ' + (error.response?.data?.detail || error.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
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
