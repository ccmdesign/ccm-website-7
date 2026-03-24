import { ref } from 'vue'

export function useNewsletterSubscribe() {
  const email = ref('')
  const subscribed = ref(false)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function subscribe() {
    if (!email.value || subscribed.value || loading.value) return

    error.value = null
    loading.value = true

    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value }),
      })

      if (res.ok) {
        subscribed.value = true
      } else {
        const data = await res.json().catch(() => ({}))
        error.value = data.error || 'Subscription failed. Please try again.'
      }
    } catch {
      error.value = 'Network error. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return { email, subscribed, error, loading, subscribe }
}
