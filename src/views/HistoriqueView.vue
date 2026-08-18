<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #0f2942;">Historique des Actions (Journal d'Audit)</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Tracé complet de l'ensemble des créations, modifications et validations effectuées.</div>
      </div>
    </div>

    <!-- Filters & Table Card -->
    <v-card elevation="0" border rounded="xl" class="pa-0 bg-white">
      <div class="d-flex justify-space-between align-center px-6 py-4 border-b bg-white" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
        <div class="d-flex gap-4 align-center flex-wrap">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Rechercher utilisateur, module..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 300px;"
            clearable
          ></v-text-field>

          <v-select
            v-model="filterAction"
            :items="['Toutes les actions', 'creation', 'modification', 'validation', 'annulation']"
            label="Type d'action"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 180px;"
          ></v-select>

          <v-select
            v-model="filterTable"
            :items="['Tous les modules', 'actes_vente', 'decharges', 'certificats_occupation', 'parcelles']"
            label="Module"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 200px;"
          ></v-select>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredLogs"
        :loading="loading"
        hover
        class="custom-table"
      >
        <!-- Date & Heure -->
        <template v-slot:item.created_at="{ item }">
          <div class="d-flex align-center">
            <v-icon color="grey-darken-1" size="18" class="mr-2">mdi-clock-outline</v-icon>
            <div>
              <div class="font-weight-bold text-body-2" style="color: #0f2942;">{{ formatDateTime(item.created_at) }}</div>
            </div>
          </div>
        </template>

        <!-- Utilisateur -->
        <template v-slot:item.utilisateur="{ item }">
          <div class="d-flex align-center">
            <v-avatar color="blue-lighten-5" size="32" class="mr-2 font-weight-bold text-caption text-primary">
              {{ item.utilisateur_nom ? (item.utilisateur_nom[0]).toUpperCase() : 'U' }}
            </v-avatar>
            <div>
              <div class="font-weight-medium text-body-2">{{ item.utilisateur_nom || 'Système' }}</div>
              <div class="text-caption text-grey">{{ item.utilisateur_email || '' }}</div>
            </div>
          </div>
        </template>

        <!-- Action -->
        <template v-slot:item.action="{ item }">
          <v-chip
            :color="getActionColor(item.action)"
            size="small"
            variant="flat"
            class="font-weight-bold text-capitalize"
          >
            {{ item.action }}
          </v-chip>
        </template>

        <!-- Module Cible -->
        <template v-slot:item.table_cible="{ item }">
          <v-chip size="small" variant="tonal" color="slate-700" class="font-weight-bold">
            {{ formatModuleName(item.table_cible) }}
          </v-chip>
        </template>

        <!-- Détails -->
        <template v-slot:item.nouvelles_valeurs="{ item }">
          <div class="text-caption font-mono text-grey-darken-2" style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ JSON.stringify(item.nouvelles_valeurs || item.anciennes_valeurs || {}) }}
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../services/api'
import { notification } from '../services/notifier'

const loading = ref(true)
const search = ref('')
const filterAction = ref('Toutes les actions')
const filterTable = ref('Tous les modules')
const logs = ref([])

const headers = [
  { title: 'Date & Heure', key: 'created_at', sortable: true },
  { title: 'Utilisateur', key: 'utilisateur', sortable: false },
  { title: 'Action', key: 'action', sortable: true },
  { title: 'Module Cible', key: 'table_cible', sortable: true },
  { title: 'Détails Modifiés', key: 'nouvelles_valeurs', sortable: false }
]

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesAction = filterAction.value === 'Toutes les actions' || log.action === filterAction.value
    const matchesTable = filterTable.value === 'Tous les modules' || log.table_cible === filterTable.value

    const q = search.value.toLowerCase()
    const matchesSearch = !q ||
      (log.utilisateur_nom || '').toLowerCase().includes(q) ||
      (log.utilisateur_email || '').toLowerCase().includes(q) ||
      (log.table_cible || '').toLowerCase().includes(q) ||
      (log.action || '').toLowerCase().includes(q)

    return matchesAction && matchesTable && matchesSearch
  })
})

const fetchLogs = async () => {
  loading.value = true
  try {
    logs.value = await api.historique.getAll()
  } catch (e) {
    notification.error('Erreur lors du chargement de l\'historique: ' + e.message)
  } finally {
    loading.value = false
  }
}

const getActionColor = (action) => {
  switch (action) {
    case 'creation': return 'blue-darken-2'
    case 'modification': return 'warning'
    case 'validation': return 'success'
    case 'annulation': return 'error'
    case 'impression': return 'info'
    default: return 'grey'
  }
}

const formatModuleName = (table) => {
  switch (table) {
    case 'actes_vente': return 'Actes de vente'
    case 'decharges': return 'Décharges'
    case 'certificats_occupation': return 'Certificats'
    case 'parcelles': return 'Parcelles'
    default: return table
  }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>
