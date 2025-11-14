<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'

const { data: clients } = await useAsyncData('logo-reel-clients', () => {
  return queryCollection('clients').all()
})

const reelClients = computed(() => {
  if (!clients.value) { return [] }

  return clients.value
    .filter((client) => {
      const featured = client.featured || client.meta?.featured
      return featured === true
    })
    .map((client) => {
      const name =
        client['display-name'] || client.displayName || client.name || client.title || 'Client'
      const clientLogo = client.client_logo || client.meta?.['client_logo'] || ''
      const logo = clientLogo 
        ? `/assets/clients/${clientLogo}` 
        : (client.logo || client.meta?.logo || '').trim()
      const slug = client.slug || client.meta?.slug || client.path?.split('/').pop() || ''
      const logoScale = client.logo_scale || client.meta?.['logo_scale'] || 1
      const key = client.path || slug || name
      return { name, logo, slug, key, logoScale }
    })
})

const reelRef = ref<HTMLElement | null>(null)
const hasScroll = ref(false)

const checkScroll = () => {
  if (!reelRef.value) return
  hasScroll.value = reelRef.value.scrollWidth > reelRef.value.clientWidth
}

onMounted(() => {
  nextTick(() => {
    checkScroll()
    if (reelRef.value) {
      const resizeObserver = new ResizeObserver(() => {
        checkScroll()
      })
      resizeObserver.observe(reelRef.value)
    }
  })
})

watch(reelClients, () => {
  nextTick(() => {
    checkScroll()
  })
})
</script>

<template>
  <ul ref="reelRef" class="reel" :class="{ 'reel--scrolling': hasScroll }">
    <li v-for="client in reelClients" :key="client.key">
      <nuxt-link class="reel__link" :to="client.slug ? `/clients/${client.slug}` : '#'">
        <img 
          v-if="client.logo" 
          :src="client.logo" 
          :alt="client.name"
          :style="{ transform: `scale(${client.logoScale})` }"
        />
        <span v-else class="reel__placeholder">{{ client.name }}</span>
      </nuxt-link>
    </li>
  </ul>
</template>

<style lang="css" scoped>
.reel {
  max-width: 100svw;
  width: 100%;
  margin-inline: auto;
  justify-content: space-between;
  padding-inline: var(--space-3xl);
  --_reel-gap: var(--space-2xl);
}

.reel--scrolling {
  justify-content: start;
  --_reel-gap: var(--space-2xl);
}

.reel li {
  min-block-size: 80px;
  min-inline-size: 120px;
  max-inline-size: 160px;
}

.reel__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
} 

.reel img {
  max-inline-size: 100%;
  max-block-size: 80px;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.4;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.reel__link:hover img {
  filter: grayscale(0%);
  opacity: 1;
}
</style>