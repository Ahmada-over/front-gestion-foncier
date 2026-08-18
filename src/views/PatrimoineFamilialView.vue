<template>
  <div>
    <!-- Breadcrumb -->
    <div class="text-caption text-grey-darken-1 mb-1">
      <router-link to="/parcelles" class="text-grey-darken-1 text-decoration-none hover-primary">Parcelles</router-link> › 
      <span class="font-weight-bold text-primary">Héritage Famille Bousso</span>
    </div>

    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6 mt-2">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1" style="color: #1a3b5c;">Patrimoine Familial — Famille Bousso</h1>
        <div class="text-subtitle-2 text-grey-darken-1">Gestion exclusive du foncier réservé à la lignée Bousso.</div>
      </div>
      <div class="d-flex gap-3">
        <v-btn variant="outlined" color="primary" prepend-icon="mdi-file-export-outline" rounded="lg" class="text-none font-weight-bold bg-white" size="small">
          Exporter Registre
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-plus" rounded="lg" elevation="0" class="text-none font-weight-bold" size="small" @click="openAffectationDialog">
          + Affecter Parcelle
        </v-btn>
      </div>
    </div>

    <!-- Alert Banner -->
    <v-alert color="orange-lighten-5" variant="flat" rounded="xl" class="mb-6 border" border="start" border-color="orange-darken-2">
      <template v-slot:prepend>
        <v-icon color="orange-darken-2">mdi-alert-circle-outline</v-icon>
      </template>
      <div class="text-body-2 text-grey-darken-3">
        Parcelles réservées au patrimoine familial. Ces parcelles sont exclues du circuit commercial et ne font l'objet d'aucun acte de vente.
        <a href="#" class="font-weight-bold text-primary text-decoration-none ml-1">Consulter le décret n°2024-B-Heritage</a>
      </div>
    </v-alert>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

    <!-- Stats Cards -->
    <v-row class="mb-8" v-if="!loading">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="text-caption text-grey-darken-1 font-weight-bold mb-2" style="letter-spacing: 0.5px;">Total Superficie</div>
          <div class="text-h4 font-weight-black" style="color: #0277bd;">{{ formatNumber(stats.total_superficie) }} <span class="text-body-2 font-weight-bold">m²</span></div>
          <div class="d-flex align-center mt-2">
            <v-icon color="success" size="small" class="mr-1">mdi-trending-up</v-icon>
            <span class="text-caption font-weight-bold text-success">+2.4% VS ANNÉE DERNIÈRE</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="text-caption text-grey-darken-1 font-weight-bold mb-2" style="letter-spacing: 0.5px;">Parcelles Réservées</div>
          <div class="text-h4 font-weight-black" style="color: #1a3b5c;">{{ stats.parcelles_reservees }} <span class="text-body-2 font-weight-bold">Unités</span></div>
          <div class="d-flex align-center mt-2">
            <v-icon color="primary" size="small" class="mr-1">mdi-shield-check-outline</v-icon>
            <span class="text-caption font-weight-bold text-primary">STATUT INALIÉNABLE</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card">
          <div class="text-caption text-grey-darken-1 font-weight-bold mb-2" style="letter-spacing: 0.5px;">Membres Actifs</div>
          <div class="text-h4 font-weight-black" style="color: #1a3b5c;">{{ stats.membres_actifs }} <span class="text-body-2 font-weight-bold">Gestionnaires</span></div>
          <div class="d-flex align-center mt-2">
            <div class="d-flex">
              <v-avatar v-for="n in Math.min(stats.membres_actifs, 4)" :key="n" :color="avatarColors[n % avatarColors.length]" size="24" class="member-avatar-mini">
                <span class="text-white text-caption font-weight-bold" style="font-size: 9px;">{{ n }}</span>
              </v-avatar>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 stat-card" style="border-left: 4px solid #2e7d32 !important;">
          <div class="text-caption text-grey-darken-1 font-weight-bold mb-2" style="letter-spacing: 0.5px;">Taux d'Exploitation</div>
          <div class="text-h4 font-weight-black" style="color: #2e7d32;">{{ stats.taux_exploitation }} <span class="text-body-2 font-weight-bold">%</span></div>
          <v-progress-linear :model-value="stats.taux_exploitation" color="success" bg-color="green-lighten-5" height="8" rounded class="mt-3"></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>

    <!-- Répartition par Membre -->
    <div class="d-flex justify-space-between align-center mb-4" v-if="!loading">
      <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Répartition par Membre</h2>
      <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold" @click="openMembreDialog">
        Voir tous les membres
      </v-btn>
    </div>

    <v-row class="mb-8" v-if="!loading">
      <v-col v-for="membre in membres" :key="membre.id" cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="xl" class="pa-5 h-100 text-center member-card">
          <div class="d-flex justify-center mb-3">
            <v-avatar :color="getMemberAvatarColor(membre)" size="48" class="mb-1">
              <v-icon color="white" size="28">mdi-account</v-icon>
            </v-avatar>
          </div>
          <v-chip :color="getRoleColor(membre.role_familial)" size="x-small" variant="flat" class="font-weight-bold text-caption mb-2" style="text-transform: uppercase;">
            {{ getRoleLabel(membre.role_familial) }}
          </v-chip>
          <div class="text-body-1 font-weight-bold text-grey-darken-4 mb-0">{{ membre.prenom }} {{ membre.nom }}</div>
          <div class="text-caption text-grey-darken-1 mb-3">{{ getRoleTitre(membre.role_familial) }}</div>
          <v-divider class="my-3"></v-divider>
          <div class="d-flex justify-space-between text-caption px-2">
            <div>
              <div class="text-grey-darken-1">Parcelles :</div>
              <div class="font-weight-black text-grey-darken-4 text-h6">{{ getMembreParcelles(membre.id) }}</div>
            </div>
            <div class="text-right">
              <div class="text-grey-darken-1">Surface :</div>
              <div class="font-weight-black text-grey-darken-4 text-h6">{{ formatNumber(getMembreSuperficie(membre.id)) }} <span class="text-caption">m²</span></div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col v-if="membres.length === 0" cols="12">
        <v-card elevation="0" border rounded="xl" class="pa-8 text-center text-grey-darken-1">
          <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-account-group-outline</v-icon>
          <div>Aucun membre. Ajoutez un membre de la famille d'abord.</div>
          <v-btn color="primary" class="text-none mt-3" rounded="lg" size="small" @click="openMembreDialog">+ Ajouter un membre</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Registre Détaillé des Parcelles -->
    <v-card elevation="0" border rounded="xl" class="mb-8" v-if="!loading">
      <div class="d-flex justify-space-between align-center px-6 py-5 border-b">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-3" size="22">mdi-clipboard-list-outline</v-icon>
          <h2 class="text-subtitle-1 font-weight-bold" style="color: #1a3b5c;">Registre Détaillé des Parcelles</h2>
        </div>
        <div class="d-flex align-center gap-3">
          <v-select
            v-model="filterMembre"
            :items="membreFilterItems"
            item-title="text"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="width: 220px;"
            placeholder="Filtrer par Responsable"
          ></v-select>
          <v-btn icon="mdi-tune-variant" variant="outlined" color="grey-darken-1" size="small" rounded="lg"></v-btn>
        </div>
      </div>

      <v-table>
        <thead>
          <tr>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">N° PARCELLE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">LOCALISATION</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">SUPERFICIE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4">MEMBRE RESPONSABLE</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">STATUT</th>
            <th class="text-overline text-grey-darken-1 font-weight-bold py-4 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aff in filteredAffectations" :key="aff.id" class="border-b-thin">
            <td class="font-weight-bold text-primary py-4">{{ aff.parcelle_numero }}</td>
            <td class="text-grey-darken-1 py-4">{{ aff.parcelle_localisation || 'Non spécifié' }}</td>
            <td class="text-grey-darken-3 font-weight-medium py-4">{{ formatNumber(aff.parcelle_superficie) }} m²</td>
            <td class="py-4">
              <div class="d-flex align-center">
                <v-avatar :color="getMemberAvatarColorByRole(aff.membre_role)" size="28" class="mr-3">
                  <span class="text-white text-caption font-weight-bold" style="font-size: 10px;">{{ getInitials(aff.membre_prenom + ' ' + aff.membre_nom) }}</span>
                </v-avatar>
                <span class="text-grey-darken-3 font-weight-medium">{{ aff.membre_prenom }} {{ aff.membre_nom }}</span>
              </div>
            </td>
            <td class="text-center py-4">
              <v-chip color="teal" variant="flat" size="small" class="font-weight-bold text-caption bg-teal-lighten-5 text-teal-darken-3 px-3">
                <v-icon size="small" class="mr-1">mdi-shield-check</v-icon>
                Réservé Famille
              </v-chip>
            </td>
            <td class="text-center py-4">
              <router-link :to="`/parcelles/${aff.parcelle_id}`" class="text-primary text-decoration-none font-weight-bold text-caption d-flex align-center justify-center">
                Détails <v-icon size="small" class="ml-1">mdi-eye-outline</v-icon>
              </router-link>
            </td>
          </tr>
          <tr v-if="filteredAffectations.length === 0">
            <td colspan="6" class="text-center pa-8 text-grey-darken-1">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-clipboard-outline</v-icon>
              <div>Aucune parcelle affectée au patrimoine familial.</div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-space-between align-center px-6 py-4 border-t">
        <div class="text-caption text-grey-darken-1">
          Affichage de <span class="font-weight-bold">{{ filteredAffectations.length }}</span> sur <span class="font-weight-bold">{{ affectations.length }}</span> parcelles
        </div>
        <div class="d-flex align-center gap-2">
          <v-btn variant="outlined" color="grey-darken-1" size="small" class="text-none text-caption" rounded="lg" disabled>Précédent</v-btn>
          <v-btn variant="outlined" color="grey-darken-1" size="small" class="text-none text-caption" rounded="lg">Suivant</v-btn>
        </div>
      </div>
    </v-card>

    <!-- Map Visualization -->
    <v-card elevation="0" border rounded="xl" class="overflow-hidden mb-8" v-if="!loading">
      <div class="position-relative" style="height: 260px; background: linear-gradient(135deg, #0d4b6e 0%, #1a8a6a 50%, #0d4b6e 100%);">
        <!-- Overlay SVG map placeholder -->
        <svg width="100%" height="100%" viewBox="0 0 800 260" preserveAspectRatio="xMidYMid slice" style="opacity: 0.3;">
          <path d="M0,130 Q100,80 200,120 T400,100 T600,140 T800,120 L800,260 L0,260 Z" fill="rgba(0,188,212,0.3)"/>
          <path d="M0,160 Q150,120 300,150 T600,130 T800,150 L800,260 L0,260 Z" fill="rgba(0,188,212,0.2)"/>
        </svg>
        <div class="position-absolute" style="top: 16px; left: 16px;">
          <v-chip color="white" variant="flat" size="small" class="font-weight-bold text-caption">
            <v-icon size="small" color="primary" class="mr-1">mdi-circle</v-icon>
            Visualisation en temps réel
          </v-chip>
        </div>
      </div>
    </v-card>

    <!-- Footer -->
    <div class="text-center mt-8 mb-6">
      <div class="text-caption font-weight-medium text-grey-darken-2">© 2024 Système de Gestion Foncière — Division du Patrimoine Privé — Famille Bousso</div>
    </div>

    <!-- Dialog: Ajouter Membre -->
    <v-dialog v-model="membreDialog" max-width="500px">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold" style="color: #1a3b5c;">Ajouter un Membre</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">PRÉNOM</div>
              <v-text-field v-model="newMembre.prenom" variant="outlined" density="comfortable" rounded="lg" placeholder="Ex: Serigne"></v-text-field>
            </v-col>
            <v-col cols="6">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">NOM</div>
              <v-text-field v-model="newMembre.nom" variant="outlined" density="comfortable" rounded="lg" placeholder="Ex: Bousso"></v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">RÔLE FAMILIAL</div>
              <v-select v-model="newMembre.role_familial" :items="[{title:'Aîné', value:'aine'},{title:'Gestionnaire', value:'gestionnaire'},{title:'Héritier', value:'heritier'}]" variant="outlined" density="comfortable" rounded="lg"></v-select>
            </v-col>
            <v-col cols="6">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">TÉLÉPHONE</div>
              <v-text-field v-model="newMembre.telephone" variant="outlined" density="comfortable" rounded="lg" placeholder="+221 77..."></v-text-field>
            </v-col>
            <v-col cols="6">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">EMAIL</div>
              <v-text-field v-model="newMembre.email" variant="outlined" density="comfortable" rounded="lg" placeholder="email@example.sn"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="membreDialog = false">Annuler</v-btn>
          <v-btn color="#0a2540" class="text-none px-6 text-white" rounded="lg" @click="saveMembre" :loading="savingMembre">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Affecter Parcelle -->
    <v-dialog v-model="affectationDialog" max-width="500px">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold" style="color: #1a3b5c;">Affecter une Parcelle</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">PARCELLE</div>
              <v-select v-model="newAffectation.parcelle_id" :items="availableParcelles" item-title="text" item-value="value" variant="outlined" density="comfortable" rounded="lg" placeholder="Sélectionner une parcelle"></v-select>
            </v-col>
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">MEMBRE RESPONSABLE</div>
              <v-select v-model="newAffectation.membre_id" :items="membreSelectItems" item-title="text" item-value="value" variant="outlined" density="comfortable" rounded="lg" placeholder="Sélectionner un membre"></v-select>
            </v-col>
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">NOTES</div>
              <v-textarea v-model="newAffectation.notes" variant="outlined" density="comfortable" rounded="lg" rows="2" placeholder="Observations..."></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="affectationDialog = false">Annuler</v-btn>
          <v-btn color="success" class="text-none px-6 text-white" rounded="lg" @click="saveAffectation" :loading="savingAffectation">Affecter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../services/api'
import { notify } from '../services/notifier'

const loading = ref(true)
const stats = ref({ total_superficie: 0, parcelles_reservees: 0, membres_actifs: 0, taux_exploitation: 0 })
const membres = ref([])
const affectations = ref([])
const allParcelles = ref([])

const filterMembre = ref('all')

const avatarColors = ['blue-darken-2', 'teal-darken-2', 'deep-purple-darken-1', 'orange-darken-2']

// Dialogs
const membreDialog = ref(false)
const savingMembre = ref(false)
const newMembre = ref({ prenom: '', nom: '', role_familial: 'heritier', telephone: '', email: '' })

const affectationDialog = ref(false)
const savingAffectation = ref(false)
const newAffectation = ref({ parcelle_id: null, membre_id: null, notes: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const [statsData, membresData, affData, parcellesData] = await Promise.allSettled([
      api.patrimoine.getStats(),
      api.patrimoine.getMembres(),
      api.patrimoine.getAffectations(),
      api.parcelles.getAll(0, 1000)
    ])
    if (statsData.status === 'fulfilled') stats.value = statsData.value
    if (membresData.status === 'fulfilled') membres.value = membresData.value
    if (affData.status === 'fulfilled') affectations.value = affData.value
    if (parcellesData.status === 'fulfilled') allParcelles.value = parcellesData.value
  } catch (e) {
    notify.error(e.message)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('fr-FR').format(num)
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}

const getMemberAvatarColor = (membre) => {
  const r = (membre.role_familial || '').toLowerCase()
  if (r === 'aine') return 'blue-darken-2'
  if (r === 'gestionnaire') return 'teal-darken-2'
  return 'deep-purple-darken-1'
}

const getMemberAvatarColorByRole = (role) => {
  const r = (role || '').toLowerCase()
  if (r === 'aine') return 'blue-darken-2'
  if (r === 'gestionnaire') return 'teal-darken-2'
  return 'deep-purple-darken-1'
}

const getRoleColor = (role) => {
  const r = (role || '').toLowerCase()
  if (r === 'aine') return 'primary'
  if (r === 'gestionnaire') return 'teal'
  return 'deep-purple'
}

const getRoleLabel = (role) => {
  const r = (role || '').toLowerCase()
  if (r === 'aine') return 'Aîné'
  if (r === 'gestionnaire') return 'Gestionnaire'
  return 'Héritier'
}

const getRoleTitre = (role) => {
  const r = (role || '').toLowerCase()
  if (r === 'aine') return 'Chef de lignée'
  if (r === 'gestionnaire') return 'Trésorière Patrimoine'
  return 'Héritier'
}

const getMembreParcelles = (membreId) => {
  return affectations.value.filter(a => a.membre_id === membreId).length
}

const getMembreSuperficie = (membreId) => {
  return affectations.value.filter(a => a.membre_id === membreId).reduce((sum, a) => sum + (a.parcelle_superficie || 0), 0)
}

const membreFilterItems = computed(() => {
  const items = [{ text: 'Tous les responsables', value: 'all' }]
  membres.value.forEach(m => {
    items.push({ text: `${m.prenom} ${m.nom}`, value: m.id })
  })
  return items
})

const filteredAffectations = computed(() => {
  if (filterMembre.value === 'all') return affectations.value
  return affectations.value.filter(a => a.membre_id === filterMembre.value)
})

const membreSelectItems = computed(() => {
  return membres.value.map(m => ({ text: `${m.prenom} ${m.nom} (${getRoleLabel(m.role_familial)})`, value: m.id }))
})

const availableParcelles = computed(() => {
  const affectedIds = new Set(affectations.value.map(a => a.parcelle_id))
  return allParcelles.value
    .filter(p => !affectedIds.has(p.id))
    .map(p => ({ text: `${p.numero_parcelle} — ${p.superficie_m2} m²`, value: p.id }))
})

const openMembreDialog = () => {
  newMembre.value = { prenom: '', nom: '', role_familial: 'heritier', telephone: '', email: '' }
  membreDialog.value = true
}

const saveMembre = async () => {
  savingMembre.value = true
  try {
    await api.patrimoine.createMembre(newMembre.value)
    membreDialog.value = false
    await fetchData()
  } catch (e) {
    notify.error(e.message)
  } finally {
    savingMembre.value = false
  }
}

const openAffectationDialog = () => {
  newAffectation.value = { parcelle_id: null, membre_id: null, notes: '' }
  affectationDialog.value = true
}

const saveAffectation = async () => {
  savingAffectation.value = true
  try {
    await api.patrimoine.affecterParcelle(newAffectation.value)
    notify.success("Parcelle affectée avec succès au patrimoine familial")
    affectationDialog.value = false
    await fetchData()
  } catch (e) {
    if (e.response?.data?.detail) {
      notify.error(e.response.data.detail)
    } else {
      notify.error(e.message)
    }
  } finally {
    savingAffectation.value = false
  }
}
</script>

<style scoped>
.gap-3 { gap: 12px; }
.gap-2 { gap: 8px; }
.border-b { border-bottom: 1px solid rgba(0,0,0,0.06); }
.border-t { border-top: 1px solid rgba(0,0,0,0.06); }
.border-b-thin { border-bottom: 1px solid rgba(0,0,0,0.03); }
.hover-primary:hover { color: rgb(var(--v-theme-primary)) !important; }
.stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px -8px rgba(0,0,0,0.1) !important;
}
.member-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  cursor: pointer;
}
.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -10px rgba(0,0,0,0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}
.member-avatar-mini {
  margin-left: -6px;
  border: 2px solid white;
}
.member-avatar-mini:first-child {
  margin-left: 0;
}
</style>
