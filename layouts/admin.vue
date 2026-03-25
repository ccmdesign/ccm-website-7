<template>
  <div class="admin-shell">
    <header class="admin-header">
      <a href="/blog" class="admin-brand">{{ siteName }}</a>
      <span class="admin-label">Admin</span>
    </header>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const siteName = config.public.siteName || 'CCM Design'
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f8f9fa;
  color: #1a1a1a;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: #fff;
}

.admin-brand {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
}

.admin-brand:hover {
  text-decoration: underline;
}

.admin-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}

.admin-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
