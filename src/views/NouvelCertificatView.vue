<template>
  <v-container class="pa-6">
    <v-card elevation="2" class="pa-4 mx-auto" max-width="800">
      <v-card-title class="text-h5 font-weight-bold" style="color:#1a3b5c;">
        Nouveau certificat d'occupation
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.numero" label="Numéro du certificat" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.proprietaire" label="Propriétaire" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.parcelle" label="Parcelle" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.dateDelivrance" label="Date de délivrance" type="date" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.dateExpiration" label="Date d'expiration" type="date" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.statut" :items="['Actif', 'Expiré', 'Brouillon']" label="Statut" required></v-select>
            </v-col>
          </v-row>
          <v-btn type="submit" color="#0a2540" class="mt-4" :loading="loading" rounded="lg" elevation="0" class="text-none font-weight-medium">
            Enregistrer
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = ref({
  numero: '',
  proprietaire: '',
  parcelle: '',
  dateDelivrance: '',
  dateExpiration: '',
  statut: 'Brouillon'
})

const submit = async () => {
  loading.value = true
  try {
    const payload = {
      numero_certificat: form.value.numero,
      proprietaire: form.value.proprietaire,
      numero_parcelle: form.value.parcelle,
      date_delivrance: form.value.dateDelivrance,
      date_expiration: form.value.dateExpiration,
      statut: form.value.statut.toLowerCase()
    }
    await api.certificats.create(payload)
    router.push({ name: 'certificats' })
  } catch (e) {
    console.error('Erreur création certificat :', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optionally add custom styles */
</style>
