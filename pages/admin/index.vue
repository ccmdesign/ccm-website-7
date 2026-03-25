<template>
  <div class="admin-page">
    <h1>Content Distribution</h1>

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
              <span :class="check.ok ? 'status-ok' : 'status-fail'">
                {{ check.ok ? 'OK' : 'FAIL' }}
              </span>
              {{ name }}
              <span v-if="check.error" class="health-error"> &mdash; {{ check.error }}</span>
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

      <ul class="post-list" v-if="filteredPosts.length">
        <li v-for="post in filteredPosts" :key="post.stem" class="post-item">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-actions">
            <!-- Newsletter status/actions -->
            <span class="channel-group">
              <span class="channel-label">Newsletter:</span>
              <template v-if="post.newsletterSentAt === null || post.newsletterSentAt === undefined">
                <a
                  href="#"
                  class="action-link"
                  :class="{ disabled: loading[post.stem + ':test-newsletter'] }"
                  @click.prevent="doAction(post, 'test-newsletter')"
                >{{ loading[post.stem + ':test-newsletter'] ? 'Sending...' : 'Send Test' }}</a>
                <a
                  href="#"
                  class="action-link"
                  :class="{ disabled: loading[post.stem + ':send-newsletter'] }"
                  @click.prevent="doAction(post, 'send-newsletter')"
                >{{ loading[post.stem + ':send-newsletter'] ? 'Sending...' : 'Send' }}</a>
              </template>
              <template v-else-if="post.newsletterSentAt === 'legacy'">
                <span class="status-text muted">Sent (legacy)</span>
              </template>
              <template v-else>
                <span class="status-text">Sent {{ formatDate(post.newsletterSentAt) }}</span>
                <a
                  v-if="post.newsletterPreviewUrl"
                  :href="post.newsletterPreviewUrl"
                  target="_blank"
                  rel="noopener"
                  class="action-link"
                >Preview</a>
              </template>
            </span>

            <span class="channel-sep">&middot;</span>

            <!-- LinkedIn status/actions -->
            <span class="channel-group">
              <span class="channel-label">LinkedIn:</span>
              <template v-if="post.linkedinDraftedAt === null || post.linkedinDraftedAt === undefined">
                <a
                  href="#"
                  class="action-link"
                  :class="{ disabled: loading[post.stem + ':draft-linkedin'] }"
                  @click.prevent="doAction(post, 'draft-linkedin')"
                >{{ loading[post.stem + ':draft-linkedin'] ? 'Drafting...' : 'Draft' }}</a>
              </template>
              <template v-else-if="!isNullish(post.linkedinPostedAt)">
                <span class="status-text">Posted {{ post.linkedinPostedAt === 'legacy' ? '(legacy)' : formatDate(post.linkedinPostedAt) }}</span>
                <a
                  v-if="post.linkedinPostUrl"
                  :href="post.linkedinPostUrl"
                  target="_blank"
                  rel="noopener"
                  class="action-link"
                >View</a>
              </template>
              <template v-else>
                <span class="status-text">Drafted {{ post.linkedinDraftedAt === 'legacy' ? '(legacy)' : formatDate(post.linkedinDraftedAt) }}</span>
                <a
                  v-if="post.linkedinPostUrl"
                  :href="post.linkedinPostUrl"
                  target="_blank"
                  rel="noopener"
                  class="action-link"
                >View</a>
                <a
                  href="#"
                  class="action-link"
                  :class="{ disabled: loading[post.stem + ':publish-linkedin'] }"
                  @click.prevent="doAction(post, 'publish-linkedin')"
                >{{ loading[post.stem + ':publish-linkedin'] ? 'Publishing...' : 'Post' }}</a>
              </template>
            </span>
          </div>
        </li>
      </ul>

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

// Use admin layout — minimal shell with header bar, no site chrome
definePageMeta({
  layout: 'admin',
  validate: () => import.meta.dev || false,
})

const isDev = import.meta.dev
const router = useRouter()
const config = useRuntimeConfig()

// Redirect in production — Vite will tree-shake this entire branch away
if (!isDev) {
  if (import.meta.client) {
    router.replace('/')
  }
}

// Admin API secret for authenticated $fetch calls
const adminSecret = config.public.adminApiSecret || ''

function adminFetch(url, opts = {}) {
  const headers = { ...(opts.headers || {}) }
  if (adminSecret) {
    headers['x-admin-secret'] = adminSecret
  }
  return $fetch(url, { ...opts, headers })
}

const posts = ref([])
const showOnlyUnsent = ref(false)
const loading = ref({})
const toasts = ref([])
const healthChecked = ref(false)
const healthOk = ref(false)
const healthChecks = ref({})

const filteredPosts = computed(() => {
  if (!showOnlyUnsent.value) return posts.value
  return posts.value.filter(
    (p) => p.newsletterSentAt == null || p.linkedinPostedAt == null
  )
})

function formatDate(isoString) {
  if (!isoString || isoString === 'legacy') return isoString
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return isoString
  }
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
    const data = await adminFetch('/api/admin/health')
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

const actionRoutes = {
  'test-newsletter': '/api/admin/test-newsletter',
  'send-newsletter': '/api/admin/send-newsletter',
  'draft-linkedin': '/api/admin/draft-linkedin',
  'publish-linkedin': '/api/admin/publish-linkedin',
}

const actionLabels = {
  'test-newsletter': 'Test newsletter',
  'send-newsletter': 'Newsletter',
  'draft-linkedin': 'LinkedIn draft',
  'publish-linkedin': 'LinkedIn post',
}

// Actions that are irreversible and require explicit confirmation before executing
const destructiveActions = new Set(['send-newsletter', 'publish-linkedin'])

async function doAction(post, action) {
  // Gate destructive actions behind a confirmation dialog
  if (destructiveActions.has(action)) {
    const label = actionLabels[action] || action
    const confirmed = window.confirm(
      `Are you sure you want to send "${post.title}" via ${label}? This action cannot be undone.`
    )
    if (!confirmed) return
  }

  const key = `${post.stem}:${action}`
  if (loading.value[key]) return
  loading.value[key] = true

  const endpoint = actionRoutes[action]

  try {
    const res = await adminFetch(endpoint, {
      method: 'POST',
      body: { slug: post.stem },
    })

    if (res.status === 'sent_but_flag_failed') {
      showToast(res.warning, 'warning', 8000)
      // Service call succeeded but frontmatter update failed —
      // update local state so the UI reflects reality and prevents re-sends.
      updateLocalState(post, action, res)
    } else {
      updateLocalState(post, action, res)
    }
  } catch (err) {
    const message = err?.data?.statusMessage || err?.message || 'Action failed'
    showToast(`Failed: ${message}`, 'error')
  } finally {
    loading.value[key] = false
  }
}

/** Apply API response data to local reactive post object and show a toast. */
function updateLocalState(post, action, res) {
  const label = actionLabels[action] || action
  switch (action) {
    case 'test-newsletter':
      showToast(`Test email sent for "${post.title}"`, 'success')
      break
    case 'send-newsletter':
      post.newsletterSentAt = res.newsletterSentAt ?? post.newsletterSentAt
      post.newsletterPreviewUrl = res.newsletterPreviewUrl ?? post.newsletterPreviewUrl
      showToast(`${label} sent for "${post.title}"`, 'success')
      break
    case 'draft-linkedin':
      post.linkedinDraftedAt = res.linkedinDraftedAt ?? post.linkedinDraftedAt
      post.linkedinPostUrl = res.linkedinPostUrl ?? post.linkedinPostUrl
      showToast(`${label} created for "${post.title}"`, 'success')
      break
    case 'publish-linkedin':
      post.linkedinPostedAt = res.linkedinPostedAt ?? post.linkedinPostedAt
      post.linkedinPostUrl = res.linkedinPostUrl ?? post.linkedinPostUrl
      showToast(`${label} published for "${post.title}"`, 'success')
      break
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
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.admin-controls {
  margin-bottom: 1rem;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.post-item:first-child {
  border-top: 1px solid #e5e7eb;
}

.post-title {
  font-weight: 500;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
}

.post-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #555;
}

.channel-group {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.channel-label {
  color: #888;
}

.channel-sep {
  margin: 0 0.25rem;
  color: #ccc;
}

.action-link {
  color: #2563eb;
  text-decoration: none;
  cursor: pointer;
}

.action-link:hover {
  text-decoration: underline;
}

.action-link.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.status-text {
  color: #555;
}

.status-text.muted {
  color: #999;
}

.status-ok { color: #16a34a; font-weight: 500; }
.status-fail { color: #dc2626; font-weight: 500; }

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
