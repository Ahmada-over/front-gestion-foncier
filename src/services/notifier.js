import { ref } from 'vue'

export const notification = ref({
  show: false,
  message: '',
  color: 'success'
})

export const notify = {
  success(msg) {
    notification.value = { show: true, message: msg, color: 'success' }
  },
  error(msg) {
    notification.value = { show: true, message: msg, color: 'error' }
  },
  info(msg) {
    notification.value = { show: true, message: msg, color: 'info' }
  }
}

// Attach helper methods to notification object for backward compatibility
notification.success = notify.success
notification.error = notify.error
notification.info = notify.info
