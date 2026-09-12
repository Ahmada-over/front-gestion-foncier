<template>
  <div>
    <!-- Header: Title and Button -->
    <div class="d-flex flex-wrap justify-space-between align-center mb-6 ga-4">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #0f2942;">Gestion des parcelles</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Consultez et gérez l'ensemble des parcelles du village.</div>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        elevation="2"
        class="text-none font-weight-bold"
        style="background: linear-gradient(135deg, #0f2942 0%, #1e40af 100%) !important; box-shadow: 0 4px 12px rgba(15, 41, 66, 0.25) !important;"
        @click="openAddDialog"
      >
        Ajouter une parcelle
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-2 mt-4" v-if="!loading">
      <!-- Total des parcelles -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="indigo-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="indigo-darken-2" size="24">mdi-map-marker-multiple-outline</v-icon>
            </v-avatar>
            <v-chip color="indigo" size="small" variant="tonal" class="font-weight-bold text-caption">Total</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">TOTAL PARCELLES</div>
          <div class="text-h4 font-weight-black" style="color: #0f2942;">{{ totalParcelles }}</div>
        </v-card>
      </v-col>
      <!-- Total occupés -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="blue-darken-2" size="24">mdi-home-city-outline</v-icon>
            </v-avatar>
            <v-chip color="info" size="small" variant="tonal" class="font-weight-bold text-caption">Attribuées</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">TOTAL OCCUPÉES</div>
          <div class="text-h4 font-weight-black" style="color: #0288d1;">{{ totalOccupees }}</div>
        </v-card>
      </v-col>
      <!-- Total disponibles -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="green-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="green-darken-2" size="24">mdi-map-marker-check-outline</v-icon>
            </v-avatar>
            <v-chip color="success" size="small" variant="tonal" class="font-weight-bold text-caption">Disponibles</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">TOTAL DISPONIBLES</div>
          <div class="text-h4 font-weight-black" style="color: #2e7d32;">{{ totalDisponibles }}</div>
        </v-card>
      </v-col>
      <!-- Total en litiges -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="red-lighten-5" size="48" rounded="lg" class="icon-avatar">
              <v-icon color="red-darken-2" size="24">mdi-alert-octagon-outline</v-icon>
            </v-avatar>
            <v-chip color="error" size="small" variant="tonal" class="font-weight-bold text-caption">Litiges</v-chip>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1" style="letter-spacing: 0.8px;">TOTAL EN LITIGES</div>
          <div class="text-h4 font-weight-black" style="color: #c62828;">{{ totalLitiges }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Container -->
    <v-card elevation="0" border rounded="xl" class="pa-0 mt-6 bg-white overflow-hidden">
      
      <!-- Filters Row -->
      <div class="d-flex flex-wrap justify-space-between align-center px-6 py-4 border-b bg-white ga-3">
        <div class="d-flex flex-wrap gap-4 align-center ga-3">
          <v-text-field
            v-model="search"
            placeholder="Rechercher par numéro ou lieu..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            style="width: 280px;"
            @keyup.enter="fetchParcelles"
            @click:clear="fetchParcelles"
            clearable
          ></v-text-field>
          
          <div style="width: 200px;">
            <v-select
              v-model="statutFilter"
              :items="['Tous les statuts', 'Disponible', 'Occupée', 'Vendue', 'Litigieuse']"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              bg-color="white"
              @update:model-value="fetchParcelles"
            ></v-select>
          </div>
        </div>

        <v-tooltip text="Actualiser" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-refresh"
              variant="outlined"
              color="grey-darken-1"
              size="small"
              rounded="lg"
              @click="fetchParcelles"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>

      <!-- Table -->
      <v-table hover class="w-100">
        <thead>
          <tr>
            <th class="text-overline font-weight-bold py-4">N° PARCELLE</th>
            <th class="text-overline font-weight-bold py-4">SUPERFICIE</th>
            <th class="text-overline font-weight-bold py-4">LOCALISATION</th>
            <th class="text-overline font-weight-bold py-4 text-center">STATUT</th>
            <th class="text-overline font-weight-bold py-4 text-right">DATE CRÉATION</th>
            <th class="text-overline font-weight-bold py-4 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <v-progress-linear v-if="loading" indeterminate color="primary" height="3"></v-progress-linear>
          <tr v-for="item in parcelles" :key="item.id" class="hover-row align-middle parcelle-row" @click="goToDetail(item.id)">
            <td class="font-weight-bold text-primary py-4">
              <span class="d-inline-flex align-center ga-1">
                <v-icon size="16" color="primary">mdi-map-marker-outline</v-icon>
                {{ item.numero_parcelle }}
              </span>
            </td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.superficie_m2 }} m²</td>
            <td class="text-grey-darken-1 py-4">{{ item.localisation || 'Non spécifiée' }}</td>
            <td class="text-center py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-bold px-3">
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-right text-grey-darken-1 py-4 text-body-2 font-weight-medium">{{ formatDate(item.created_at) }}</td>
            <td class="text-center py-4 text-grey-darken-1">
              <v-tooltip text="Consulter les détails" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="x-small" variant="text" icon="mdi-eye-outline" class="mx-1" color="primary" @click.stop="goToDetail(item.id)"></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Modifier" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="x-small" variant="text" icon="mdi-pencil-outline" class="mx-1" color="grey-darken-2" @click.stop="openEditDialog(item)"></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Supprimer" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="x-small" variant="text" icon="mdi-delete-outline" class="mx-1" color="error" @click.stop="confirmDelete(item)"></v-btn>
                </template>
              </v-tooltip>
            </td>
          </tr>
          <tr v-if="!loading && parcelles.length === 0">
            <td colspan="6" class="text-center pa-10">
              <div class="d-flex flex-column align-center justify-center">
                <v-avatar color="grey-lighten-4" size="64" class="mb-3">
                  <v-icon size="32" color="grey-darken-1">mdi-map-marker-outline</v-icon>
                </v-avatar>
                <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-1">Aucune parcelle trouvée</div>
                <div class="text-caption text-grey-darken-1 mb-4">Aucune parcelle ne correspond à vos critères de recherche.</div>
                <v-btn color="primary" size="small" prepend-icon="mdi-plus" rounded="lg" @click="openAddDialog">
                  Ajouter une parcelle
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold" style="color: #1a3b5c;">
          {{ isEdit ? 'Modifier la parcelle' : 'Ajouter une parcelle' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">NUMÉRO DE PARCELLE</div>
                <v-text-field
                  v-model="editedItem.numero_parcelle"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  placeholder="Ex: TB-2024-001"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">SUPERFICIE (M²)</div>
                <v-text-field
                  v-model.number="editedItem.superficie_m2"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  placeholder="Ex: 200"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">LOCALISATION</div>
                <v-text-field
                  v-model="editedItem.localisation"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  placeholder="Ex: Quartier Darou"
                  prepend-inner-icon="mdi-map-marker-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">STATUT</div>
                <v-select
                  v-model="editedItem.statut"
                  :items="['disponible', 'occupee', 'vendue', 'litigieuse']"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">DESCRIPTION</div>
                <v-textarea
                  v-model="editedItem.description"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  rows="3"
                  placeholder="Détails supplémentaires..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="dialog = false">Annuler</v-btn>
          <v-btn color="#0a2540" class="text-none px-6 text-white" rounded="lg" @click="save" :loading="saving">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer la parcelle <strong>{{ itemToDelete?.numero_parcelle }}</strong> ? Cette action est irréversible.
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" rounded="lg" @click="doDelete" :loading="deleting">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const router = useRouter()

const allLoadedParcelles = ref([])
const parcelles = ref([])
const loading = ref(true)
const search = ref('')
const statutFilter = ref('Tous les statuts')

const dialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editedItem = ref({
  numero_parcelle: '',
  superficie_m2: 0,
  localisation: '',
  statut: 'disponible',
  description: ''
})

const deleteDialog = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const fetchParcelles = async () => {
  loading.value = true
  try {
    const data = await api.parcelles.getAll(0, 500, search.value)
    allLoadedParcelles.value = data
    if (statutFilter.value !== 'Tous les statuts') {
      parcelles.value = data.filter(p => p.statut.toLowerCase() === statutFilter.value.toLowerCase().replace('é', 'e'))
    } else {
      parcelles.value = data
    }
  } catch (error) {
    console.error("Erreur parcelles:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchParcelles)

const goToDetail = (id) => {
  router.push(`/parcelles/${id}`)
}

const totalParcelles = computed(() => allLoadedParcelles.value.length)
const totalOccupees = computed(() => allLoadedParcelles.value.filter(p => p.statut.toLowerCase() === 'occupee' || p.statut.toLowerCase() === 'occupée').length)
const totalDisponibles = computed(() => allLoadedParcelles.value.filter(p => p.statut.toLowerCase() === 'disponible').length)
const totalLitiges = computed(() => allLoadedParcelles.value.filter(p => p.statut.toLowerCase() === 'litigieuse').length)

const getStatusProps = (statut) => {
  const s = (statut || '').toLowerCase()
  if (s === 'disponible') return { color: 'success', variant: 'tonal', class: 'bg-green-lighten-5 text-green-darken-2' }
  if (s === 'occupee' || s === 'occupée') return { color: 'info', variant: 'tonal', class: 'bg-blue-lighten-5 text-blue-darken-2' }
  if (s === 'vendue') return { color: 'orange', variant: 'tonal', class: 'bg-orange-lighten-5 text-orange-darken-2' }
  if (s === 'litigieuse') return { color: 'error', variant: 'tonal', class: 'bg-red-lighten-5 text-red-darken-2' }
  return { color: 'grey', variant: 'tonal' }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const openAddDialog = () => {
  isEdit.value = false
  editedItem.value = {
    numero_parcelle: '',
    superficie_m2: 0,
    localisation: '',
    statut: 'disponible',
    description: ''
  }
  dialog.value = true
}

const openEditDialog = (item) => {
  isEdit.value = true
  editedItem.value = { ...item }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await api.parcelles.update(editedItem.value.id, editedItem.value)
    } else {
      await api.parcelles.create(editedItem.value)
    }
    dialog.value = false
    notify.success(isEdit.value ? 'Parcelle modifiée avec succès' : 'Parcelle ajoutée avec succès')
    fetchParcelles()
  } catch (error) {
    notify.error(error.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  deleting.value = true
  try {
    await api.parcelles.delete(itemToDelete.value.id)
    deleteDialog.value = false
    notify.success('Parcelle supprimée avec succès')
    fetchParcelles()
  } catch (error) {
    notify.error(error.message)
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.border-b { border-bottom: 1px solid rgba(0,0,0,0.06); }
.border-t { border-top: 1px solid rgba(0,0,0,0.06); }
.border-b-thin { border-bottom: 1px solid rgba(0,0,0,0.03); }
.gap-4 { gap: 16px; }
.parcelle-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px -8px rgba(0,0,0,0.1) !important;
}
.parcelle-row:hover {
  background-color: rgba(25, 118, 210, 0.04);
}
</style>
