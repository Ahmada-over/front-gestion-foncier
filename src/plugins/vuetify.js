import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#0f2942',
          secondary: '#1b4965',
          accent: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0284c7',
          background: '#f8fafc',
          surface: '#ffffff'
        }
      }
    }
  },
  defaults: {
    VCard: {
      elevation: 0
    },
    VBtn: {
      elevation: 0
    }
  }
})
