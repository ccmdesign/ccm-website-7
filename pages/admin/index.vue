<template>
  <div class="admin-page">
    <h1>Admin: Content Distribution</h1>

    <div v-if="!isDev" class="redirect-notice">
      <p>Admin is only available in development mode.</p>
    </div>

    <template v-else>
      <!-- Service connectivity status -->
      <div class="health-status" v-if="healthChecked">
        <details :open="!healthOk">
          <summary :class="healthOk ? 'health-ok' : 'health-warn'">
            {{ healthOk ? 'All services connected' : 'Service connectivity issues' }}
          </summary>
          <ul class="health-details">
            <li v-for="(check, name) in healthChecks" :key="name">
              <span :class="check.ok ? 'status-sent' : 'status-unsent'">
                {{ check.ok ? 'OK' : 'FAIL' }}
              </span>
              {{ name }}
              <span v-if="check.error" class="health-error"> — {{ check.error }}</span>
            </li>
          </ul>
        </details>
      </div>

      <div class="admin-controls">
        <label class="filter-toggle">
          <input v-model="showOnlyUnsent" type="checkbox" />
          Show only unsent posts
        </label>
      </div>

      <table class="admin-table" v-if="filteredPosts.length">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Newsletter</th>
            <th>LinkedIn</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in filteredPosts" :key="post.stem">
            <td class="title-cell">{{ post.title }}</td>
            <td class="date-cell">{{ post.date }}</td>
            <td class="status-cell">
              <span :class="statusClass(post.newsletterSent)">
                {{ post.newsletterSent ? 'Sent' : 'Unsent' }}
              </span>
            </td>
            <td class="status-cell">
              <span :class="statusClass(post.linkedinSent)">
                {{ post.linkedinSent ? 'Sent' : 'Unsent' }}
              </span>
            </td>
            <td class="actions-cell">
              <button
                :disabled="post.newsletterSent || sending[post.stem + ':newsletter']"
                @click="send(post, 'newsletter')"
                class="action-btn"
              >
                <template v-if="sending[post.stem + ':newsletter']">Sending...</template>
                <template v-else>Send Newsletter</template>
              </button>
              <button
                :disabled="post.linkedinSent || sending[post.stem + ':linkedin']"
                @click="send(post, 'linkedin')"
                class="action-btn"
              >
                <template v-if="sending[post.stem + ':linkedin']">Sending...</template>
                <template v-else>Send LinkedIn</template>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty-state">No posts to display.</p>

      <!-- Toast notifications -->
      <div class="toast-container">
        <div
          v-for="(toast, i) in toasts"
          :key="i"
          :class="['toast', toast.type]"
        >
          {{ toast.message }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Block route entirely in production — returns 404 before component renders
definePageMeta({
  validate: () => import.meta.dev || false,
})

// import.meta.dev is statically replaced by Vite at build time.
// When false, the entire if-block (and its referenced code) is tree-shaken out.
const isDev = import.meta.dev
const router = useRouter()

// Redirect in production — Vite will tree-shake this entire branch away
if (!isDev) {
  if (import.meta.client) {
    router.replace('/')
  }
}

const posts = ref([])
const showOnlyUnsent = ref(false)
const sending = ref({})
const toasts = ref([])
const healthChecked = ref(false)
const healthOk = ref(false)
const healthChecks = ref({})

const filteredPosts = computed(() => {
  if (!showOnlyUnsent.value) return posts.value
  return posts.value.filter(
    (p) => !p.newsletterSent || !p.linkedinSent
  )
})

function statusClass(sent) {
  return sent ? 'status-sent' : 'status-unsent'
}

function showToast(message, type = 'success', duration = 4000) {
  const toast = { message, type }
  toasts.value.push(toast)
  setTimeout(() => {
    const idx = toasts.value.indexOf(toast)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }, duration)
}

async function checkHealth() {
  try {
    const data = await $fetch('/api/admin/health')
    healthOk.value = data.ok
    healthChecks.value = data.checks
  } catch (err) {
    healthOk.value = false
    healthChecks.value = { healthEndpoint: { ok: false, error: 'Health check endpoint unreachable' } }
  } finally {
    healthChecked.value = true
  }
}

async function loadPosts() {
  try {
    // Use queryCollection directly instead of useAsyncData.
    // useAsyncData must be called synchronously during setup, not inside onMounted.
    // Since this is a dev-only, client-only page, a direct query is appropriate.
    const data = await queryCollection('blog').order('date', 'DESC').all()
    if (data) {
      posts.value = data
    }
  } catch (err) {
    console.error('Failed to load posts:', err)
    const message = (err && err.message) || 'Unknown error'
    if (message.includes('SQLITE') || message.includes('database')) {
      showToast('Content database error. Try restarting the dev server to rebuild the SQLite DB.', 'error', 8000)
    } else {
      showToast(`Failed to load posts: ${message}`, 'error', 6000)
    }
  }
}

async function send(post, service) {
  const key = `${post.stem}:${service}`
  sending.value[key] = true

  const endpoint = service === 'newsletter'
    ? '/api/admin/send-newsletter'
    : '/api/admin/send-linkedin'

  try {
    const res = await $fetch(endpoint, {
      method: 'POST',
      body: { slug: post.stem },
    })

    if (res.status === 'sent_but_flag_failed') {
      showToast(res.warning, 'warning', 8000)
    } else {
      // Update local state
      if (service === 'newsletter') post.newsletterSent = true
      else post.linkedinSent = true
      showToast(`${service === 'newsletter' ? 'Newsletter' : 'LinkedIn post'} sent for "${post.title}"`, 'success')
    }
  } catch (err) {
    const message = err?.data?.statusMessage || err?.message || 'Send failed'
    showToast(`Failed: ${message}`, 'error')
  } finally {
    sending.value[key] = false
  }
}

onMounted(() => {
  if (isDev) {
    loadPosts()
    checkHealth()
  }
})
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}

.admin-controls {
  margin-bottom: 1rem;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.admin-table th,
.admin-table td {
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #ddd;
}

.admin-table th {
  font-weight: 600;
  background: #f5f5f5;
}

.title-cell { max-width: 300px; }
.date-cell { white-space: nowrap; }
.status-cell { text-align: center; }
.actions-cell { white-space: nowrap; }

.status-sent { color: #16a34a; font-weight: 500; }
.status-unsent { color: #dc2626; font-weight: 500; }

.action-btn {
  padding: 0.25rem 0.75rem;
  margin-right: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.8125rem;
}

.action-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  color: #666;
  text-align: center;
  padding: 2rem;
}

.redirect-notice {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.health-status {
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.health-status summary {
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-weight: 500;
}

.health-ok { background: #f0fdf4; color: #16a34a; }
.health-warn { background: #fefce8; color: #ca8a04; }

.health-details {
  list-style: none;
  padding: 0.5rem 0.75rem;
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
}

.health-details li {
  padding: 0.25rem 0;
}

.health-error {
  color: #666;
  font-style: italic;
}

.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.toast {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  color: #fff;
  font-size: 0.875rem;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.toast.success { background: #16a34a; }
.toast.error { background: #dc2626; }
.toast.warning { background: #ca8a04; }
</style>
