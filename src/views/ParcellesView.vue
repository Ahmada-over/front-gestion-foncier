<template>
  <div>
    <!-- Header: Title and Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #1a3b5c;">Gestion des parcelles</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Consultez et gérez l'ensemble des parcelles du village.</div>
      </div>
      <v-btn color="#0a2540" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-medium" @click="openAddDialog">
        Ajouter une parcelle
      </v-btn>
    </div>

    <!-- Main Content Container -->
    <v-card elevation="0" border rounded="xl" class="pa-0 mt-6 bg-white">
      
      <!-- Filters Row -->
      <div class="d-flex justify-space-between align-center px-6 py-4 border-b bg-white" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
        <div class="d-flex gap-4 align-center">
          <v-text-field
            v-model="search"
            placeholder="Rechercher par numéro..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            style="width: 300px;"
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
      </div>

      <!-- Table -->
      <v-table>
        <thead>
          <tr>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">N° PARCELLE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">SUPERFICIE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">LOCALISATION</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">STATUT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-right">DATE CRÉATION</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
          <tr v-for="item in parcelles" :key="item.id" class="border-b-thin align-middle">
            <td class="font-weight-bold text-primary py-4">{{ item.numero_parcelle }}</td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ item.superficie_m2 }} m²</td>
            <td class="text-grey-darken-1 py-4">{{ item.localisation || 'Non spécifiée' }}</td>
            <td class="text-center py-4">
              <v-chip v-bind="getStatusProps(item.statut)" size="small" class="font-weight-bold px-4 text-caption" style="text-transform: uppercase;">
                {{ item.statut }}
              </v-chip>
            </td>
            <td class="text-right text-grey-darken-1 py-4 text-body-2">{{ formatDate(item.created_at) }}</td>
            <td class="text-center py-4 text-grey-darken-1">
              <v-btn size="x-small" variant="text" icon="mdi-pencil-outline" class="mx-1" color="grey-darken-1" @click="openEditDialog(item)"></v-btn>
              <v-btn size="x-small" variant="text" icon="mdi-delete-outline" class="mx-1" color="error" @click="confirmDelete(item)"></v-btn>
            </td>
          </tr>
          <tr v-if="!loading && parcelles.length === 0">
            <td colspan="6" class="text-center py-8 text-grey">Aucune parcelle trouvée</td>
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
import { ref, onMounted } from 'vue'
import { api } from '../services/api'

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
    const data = await api.parcelles.getAll(0, 100, search.value)
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
    fetchParcelles()
  } catch (error) {
    alert(error.message)
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
    // Note: I added the delete endpoint in the backend but not yet in api.js
    // I should add it to api.js first or use a generic request
    // Let's assume I'll add it to api.js
    const token = localStorage.getItem('access_token')
    const response = await fetch(`http://localhost:8081/api/v1/parcelles/${itemToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Erreur suppression')
    deleteDialog.value = false
    fetchParcelles()
  } catch (error) {
    alert(error.message)
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
</style>
