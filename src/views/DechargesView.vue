<template>
  <div>
    <!-- Header: Title and Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #1a3b5c;">Décharges de paiement</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Gérez et suivez les attestations et reçus de remise de sommes d'argent.</div>
      </div>
      <v-btn color="#0a2540" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-medium" to="/decharges/nouvelle">
        Nouvelle décharge
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-2 mt-4" v-if="!loading">
      <!-- Total Décharges -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="blue-lighten-5" size="48" rounded="lg">
              <v-icon color="blue-darken-2">mdi-file-certificate-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">TOTAL DÉCHARGES</div>
          <div class="text-h4 font-weight-black" style="color: #1a3b5c;">{{ stats.total }}</div>
        </v-card>
      </v-col>

      <!-- Validées -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="green-lighten-5" size="48" rounded="lg">
              <v-icon color="green-darken-2">mdi-check-circle-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">VALIDÉES</div>
          <div class="text-h4 font-weight-black" style="color: #2e7d32;">{{ stats.validees }}</div>
        </v-card>
      </v-col>

      <!-- Brouillons -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="amber-lighten-5" size="48" rounded="lg">
              <v-icon color="amber-darken-3">mdi-file-edit-outline</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">BROUILLONS</div>
          <div class="text-h4 font-weight-black" style="color: #d84315;">{{ stats.brouillons }}</div>
        </v-card>
      </v-col>

      <!-- Total Encaissé -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="purple-lighten-5" size="48" rounded="lg">
              <v-icon color="purple-darken-2">mdi-cash-multiple</v-icon>
            </v-avatar>
          </div>
          <div class="text-overline text-grey-darken-1 font-weight-medium mb-1" style="letter-spacing: 1px;">TOTAL ENCAISSÉ</div>
          <div class="text-h5 font-weight-black text-truncate" style="color: #6a1b9a;">{{ formatMoney(stats.totalMontant) }} FCFA</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table Container -->
    <v-card elevation="0" border rounded="xl" class="pa-0 mt-6 bg-white">
      <div class="d-flex justify-space-between align-center px-6 py-4 border-b bg-white" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
        <div class="d-flex gap-4 align-center">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Rechercher par N°, récepteur, remettant..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 320px;"
            clearable
          ></v-text-field>

          <v-select
            v-model="filterStatut"
            :items="['Tous', 'Validé', 'Brouillon', 'Annulé']"
            label="Statut"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 160px;"
          ></v-select>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredDecharges"
        :loading="loading"
        hover
        class="custom-table"
      >
        <!-- N° Décharge -->
        <template v-slot:item.numero_decharge="{ item }">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2" size="small">mdi-file-document-outline</v-icon>
            <router-link :to="`/decharges/${item.id}`" class="text-decoration-none font-weight-bold text-primary">
              {{ item.numero_decharge }}
            </router-link>
          </div>
        </template>

        <!-- Récepteur -->
        <template v-slot:item.receveur="{ item }">
          <div class="font-weight-medium">{{ item.receveur_prenom }} {{ item.receveur_nom }}</div>
          <div class="text-caption text-grey">CIN: {{ item.receveur_cin }}</div>
        </template>

        <!-- Remettant -->
        <template v-slot:item.remettant="{ item }">
          <div class="font-weight-medium">{{ item.remettant_prenom }} {{ item.remettant_nom }}</div>
          <div class="text-caption text-grey">CIN: {{ item.remettant_cin }}</div>
        </template>

        <!-- Montant reçu -->
        <template v-slot:item.montant_recu="{ item }">
          <div class="font-weight-bold text-success">{{ formatMoney(item.montant_recu) }} FCFA</div>
          <div v-if="item.reliquat > 0" class="text-caption text-error">
            Reliquat: {{ formatMoney(item.reliquat) }} FCFA
          </div>
        </template>

        <!-- Date -->
        <template v-slot:item.date_fait="{ item }">
          <div>{{ formatDate(item.date_fait) }}</div>
          <div class="text-caption text-grey">{{ item.lieu_fait || 'Touba' }}</div>
        </template>

        <!-- Statut -->
        <template v-slot:item.statut="{ item }">
          <v-chip
            :color="getStatutColor(item.statut)"
            size="small"
            variant="flat"
            class="font-weight-bold text-capitalize"
          >
            {{ item.statut }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"></v-btn>
            </template>
            <v-list density="compact" rounded="lg">
              <v-list-item prepend-icon="mdi-eye-outline" title="Consulter" :to="`/decharges/${item.id}`"></v-list-item>
              
              <v-list-item 
                v-if="item.statut === 'brouillon'"
                prepend-icon="mdi-pencil-outline" 
                title="Éditer" 
                :to="`/decharges/${item.id}/editer`"
              ></v-list-item>

              <v-list-item 
                v-if="item.statut === 'brouillon'"
                prepend-icon="mdi-check-circle-outline" 
                title="Valider" 
                color="success"
                @click="validerDecharge(item.id)"
              ></v-list-item>

              <v-list-item 
                v-if="item.statut === 'valide'"
                prepend-icon="mdi-download-outline" 
                title="Télécharger PDF" 
                @click="api.decharges.downloadPdf(item.id, `decharge_${item.numero_decharge}.pdf`)"
              ></v-list-item>
            </v-list>
          </v-menu>
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
const filterStatut = ref('Tous')
const decharges = ref([])

const headers = [
  { title: 'N° Décharge', key: 'numero_decharge', sortable: true },
  { title: 'Récepteur (Reçoit)', key: 'receveur', sortable: false },
  { title: 'Remettant (Paie)', key: 'remettant', sortable: false },
  { title: 'Montant Reçu', key: 'montant_recu', sortable: true },
  { title: 'Date & Lieu', key: 'date_fait', sortable: true },
  { title: 'Statut', key: 'statut', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const stats = computed(() => {
  const total = decharges.value.length
  const validees = decharges.value.filter(d => d.statut === 'valide').length
  const brouillons = decharges.value.filter(d => d.statut === 'brouillon').length
  const totalMontant = decharges.value.reduce((sum, d) => sum + (d.montant_recu || 0), 0)
  return { total, validees, brouillons, totalMontant }
})

const filteredDecharges = computed(() => {
  return decharges.value.filter(d => {
    const matchesStatut = filterStatut.value === 'Tous' || d.statut.toLowerCase() === filterStatut.value.toLowerCase()
    
    const q = search.value.toLowerCase()
    const matchesSearch = !q || 
      (d.numero_decharge || '').toLowerCase().includes(q) ||
      (d.receveur_nom || '').toLowerCase().includes(q) ||
      (d.receveur_prenom || '').toLowerCase().includes(q) ||
      (d.receveur_cin || '').toLowerCase().includes(q) ||
      (d.remettant_nom || '').toLowerCase().includes(q) ||
      (d.remettant_prenom || '').toLowerCase().includes(q) ||
      (d.remettant_cin || '').toLowerCase().includes(q)

    return matchesStatut && matchesSearch
  })
})

const fetchDecharges = async () => {
  loading.value = true
  try {
    decharges.value = await api.decharges.getAll()
  } catch (e) {
    notification.error('Erreur lors du chargement des décharges: ' + e.message)
  } finally {
    loading.value = false
  }
}

const validerDecharge = async (id) => {
  try {
    await api.decharges.valider(id)
    notification.success('Décharge validée avec succès !')
    await fetchDecharges()
  } catch (e) {
    notification.error('Erreur lors de la validation: ' + e.message)
  }
}

const formatMoney = (val) => {
  if (val === null || val === undefined) return '0'
  return new Intl.NumberFormat('fr-FR').format(val)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const getStatutColor = (statut) => {
  switch (statut) {
    case 'valide': return 'success'
    case 'brouillon': return 'warning'
    case 'annule': return 'error'
    default: return 'grey'
  }
}

onMounted(() => {
  fetchDecharges()
})
</script>

<style scoped>
.stat-card {
  transition: all 0.2s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}
.custom-table :deep(th) {
  font-weight: 700 !important;
  color: #1a3b5c !important;
}
</style>
