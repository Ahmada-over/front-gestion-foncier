<template>
  <div class="login-wrapper bg-grey-lighten-4 d-flex flex-column align-center justify-center">
    <v-card class="login-card pa-8" elevation="2" border rounded="xl" width="100%" max-width="420">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <v-avatar color="#0a2540" size="48" class="mb-4">
          <!-- Approximating the logo with an icon since we don't have the asset -->
          <v-icon color="white" size="24">mdi-bank-outline</v-icon>
        </v-avatar>
        <h1 class="text-h6 font-weight-bold" style="color: #0a2540;">Taofikh Bousso</h1>
        <div class="text-caption text-grey-darken-1">Système de Gestion Foncière</div>
      </div>

      <!-- Form -->
      <v-form @submit.prevent="handleLogin">
        <div class="text-caption font-weight-medium text-grey-darken-2 mb-1">Email professionnel</div>
        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-email-outline"
          placeholder="admin@taofikhbousso.sn"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-4"
          hide-details="auto"
        ></v-text-field>

        <div class="d-flex justify-space-between align-center mb-1">
          <div class="text-caption font-weight-medium text-grey-darken-2">Mot de passe</div>
          <a href="#" class="text-caption text-primary text-decoration-none font-weight-medium">Oublié ?</a>
        </div>
        <v-text-field
          v-model="password"
          prepend-inner-icon="mdi-lock-outline"
          type="password"
          placeholder="••••••••"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-2"
          hide-details="auto"
        ></v-text-field>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4 text-caption"
        >
          {{ error }}
        </v-alert>

        <div class="d-flex align-center mb-6">
          <v-checkbox
            v-model="rememberMe"
            density="compact"
            hide-details
            color="primary"
            class="mt-0"
          ></v-checkbox>
          <span class="text-caption text-grey-darken-2 ml-n2">Se souvenir de moi</span>
        </div>

        <v-btn
          type="submit"
          block
          color="#0a2540"
          size="large"
          class="text-none font-weight-bold mb-6"
          rounded="lg"
          elevation="0"
          :loading="loading"
        >
          Se connecter
        </v-btn>
      </v-form>

      <!-- Footer Support -->
      <div class="text-center text-caption text-grey-darken-1">
        Besoin d'assistance ? <a href="#" class="text-teal-darken-2 font-weight-bold text-decoration-none">Contacter le support</a>
      </div>
    </v-card>

    <!-- Page Footer Links -->
    <div class="position-absolute bottom-0 text-center mb-6 w-100">
      <div class="d-flex justify-center gap-4 mb-2">
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Mentions Légales</a>
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Vérification de Titre</a>
        <a href="#" class="text-caption text-grey text-decoration-none hover-primary transition-colors">Contact</a>
      </div>
      <div class="text-caption text-grey-darken-1">
        Village de Taofikh Bousso - République du Sénégal © 2024
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Veuillez remplir tous les champs"
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await api.auth.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.message || "Email ou mot de passe incorrect"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
}
.login-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05) !important;
}
.gap-4 {
  gap: 16px;
}
.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
.transition-colors {
  transition: color 0.2s ease;
}
</style>
