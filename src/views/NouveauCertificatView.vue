<template>
  <div class="pb-16">
    <!-- Header -->
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" color="primary" class="px-0 text-none font-weight-bold text-caption" to="/certificats">
        RETOUR À LA LISTE
      </v-btn>
      <div class="d-flex justify-space-between align-center mt-2">
        <h1 class="text-h5 font-weight-bold" style="color: #1a3b5c;">Nouveau certificat d'occupation</h1>
        <div class="d-flex align-center bg-white border px-4 py-2 rounded-lg">
          <v-icon color="success" size="small" class="mr-2">mdi-check-circle</v-icon>
          <div>
            <div class="text-caption text-grey-darken-1 font-weight-bold" style="line-height: 1;">ÉTAT DU FORMULAIRE</div>
            <div class="text-body-2 font-weight-bold" style="line-height: 1.2;">Nouveau</div>
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
                v-model="certificat.superficie"
                placeholder="..."
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
                v-model="certificat.localisation"
                prepend-inner-icon="mdi-map-marker-outline"
                placeholder="..."
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

        <!-- Titulaire -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6 bg-blue-grey-lighten-5">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-account-check-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Titulaire du certificat</h2>
          </div>
          
          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">CIN (Carte d'Identité)</div>
          <v-text-field 
            v-model="proprietaireCin" 
            variant="outlined" 
            density="comfortable" 
            hide-details 
            rounded="lg" 
            class="bg-white mb-2"
            placeholder="Rechercher par CIN"
            append-inner-icon="mdi-magnify"
            @click:append-inner="lookupProprietaire"
            @keyup.enter="lookupProprietaire"
            :loading="searchingProprietaire"
          ></v-text-field>

          <v-expand-transition>
            <div v-if="resolvedProprietaire" class="bg-white pa-4 rounded-lg border mt-2">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="48" class="mr-4">
                  <span class="text-white text-h6 font-weight-bold">{{ getInitials(resolvedProprietaire.prenom + ' ' + resolvedProprietaire.nom) }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-body-1" style="color: #1a3b5c;">{{ resolvedProprietaire.prenom }} {{ resolvedProprietaire.nom }}</div>
                  <div class="text-caption text-grey-darken-1">{{ resolvedProprietaire.adresse || 'Sans adresse' }} — {{ resolvedProprietaire.telephone || 'Sans téléphone' }}</div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="4">
        <!-- Paramètres administratifs -->
        <v-card elevation="0" border rounded="xl" class="pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-calendar-check-outline</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Paramètres</h2>
          </div>
          
          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">Date de délivrance</div>
          <v-text-field
            v-model="certificat.date_delivrance"
            type="date"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            class="mb-4"
          ></v-text-field>
          
          <v-alert type="info" variant="tonal" density="compact" class="text-caption">
            Le certificat sera automatiquement valide pour 5 ans à partir de la date de délivrance.
          </v-alert>
        </v-card>

        <!-- Résumé -->
        <v-card elevation="0" rounded="xl" class="pa-6" color="#1a3b5c" theme="dark">
          <h2 class="text-subtitle-1 font-weight-bold text-white mb-6" style="letter-spacing: 1px;">APERÇU DU CERTIFICAT</h2>
          
          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">PARCELLE CONCERNÉE</div>
          <div class="text-h6 font-weight-bold text-white mb-4">{{ resolvedParcelle?.numero_parcelle || '- À renseigner -' }}</div>
          
          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">TITULAIRE</div>
          <div class="text-body-1 text-white mb-4">{{ resolvedProprietaire ? `${resolvedProprietaire.prenom} ${resolvedProprietaire.nom}` : '- À renseigner -' }}</div>
          
          <div class="text-caption text-blue-lighten-2 font-weight-bold mb-1">DATE DE DÉLIVRANCE</div>
          <div class="text-body-2 text-white">{{ formatDate(certificat.date_delivrance) }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sticky Footer -->
    <v-card elevation="4" class="position-fixed bottom-0 left-0 w-100 py-3 px-6 d-flex justify-space-between align-center" style="z-index: 100; border-top: 1px solid rgba(0,0,0,0.05);">
      <div style="width: 260px;" class="hidden-sm-and-down"></div>
      
      <div class="d-flex align-center text-caption text-grey-darken-1 w-100 max-w-md">
        <v-icon size="small" class="mr-2">mdi-shield-check</v-icon>
        La création d'un certificat d'occupation générera automatiquement un QR code infalsifiable.
      </div>
      
      <div class="d-flex gap-4">
        <v-btn variant="text" color="primary" class="text-none font-weight-bold" rounded="lg" to="/certificats">Annuler</v-btn>
        <v-btn color="primary" elevation="0" class="text-none font-weight-bold" rounded="lg" @click="createCertificat()" :loading="loading">Générer le certificat</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const router = useRouter()

const parcelleSearch = ref('')
const proprietaireCin = ref('')

const searchingParcelle = ref(false)
const searchingProprietaire = ref(false)

const resolvedParcelle = ref(null)
const resolvedProprietaire = ref(null)

const certificat = ref({
  parcelle_id: '',
  proprietaire_id: '',
  date_delivrance: new Date().toISOString().substr(0, 10),
  // Visual fields
  superficie: '',
  localisation: ''
})

const loading = ref(false)

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const lookupParcelle = async () => {
  if (!parcelleSearch.value) return
  searchingParcelle.value = true
  try {
    const data = await api.parcelles.getAll(0, 5, parcelleSearch.value)
    if (data && data.length > 0) {
      const found = data[0]
      resolvedParcelle.value = found
      certificat.value.parcelle_id = found.id
      certificat.value.superficie = found.superficie_m2 + ' m²'
      certificat.value.localisation = found.localisation
    } else {
      notify.error("Parcelle non trouvée")
    }
  } catch (error) {
    notify.error("Erreur lors de la recherche")
  } finally {
    searchingParcelle.value = false
  }
}

const lookupProprietaire = async () => {
  if (!proprietaireCin.value) return
  searchingProprietaire.value = true
  try {
    const data = await api.proprietaires.getAll(0, 5, '', proprietaireCin.value)
    if (data && data.length > 0) {
      resolvedProprietaire.value = data[0]
      certificat.value.proprietaire_id = data[0].id
    } else {
      notify.error("Propriétaire non trouvé")
    }
  } catch (error) {
    notify.error("Erreur lors de la recherche")
  } finally {
    searchingProprietaire.value = false
  }
}

const createCertificat = async () => {
  if (parcelleSearch.value && !certificat.value.parcelle_id) await lookupParcelle()
  if (proprietaireCin.value && !certificat.value.proprietaire_id) await lookupProprietaire()

  if (!certificat.value.parcelle_id || !certificat.value.proprietaire_id) {
    notify.error("Veuillez renseigner et valider la parcelle et le titulaire")
    return
  }

  loading.value = true
  try {
    const payload = {
      parcelle_id: certificat.value.parcelle_id,
      proprietaire_id: certificat.value.proprietaire_id,
      date_delivrance: certificat.value.date_delivrance
    }
    
    const response = await api.certificats.create(payload)
    if (response && response.id) {
      notify.success("Certificat d'occupation créé avec succès")
      router.push(`/certificats/${response.id}`)
    } else {
      notify.success("Certificat d'occupation créé avec succès")
      router.push('/certificats')
    }
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
