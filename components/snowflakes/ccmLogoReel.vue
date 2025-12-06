<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'

const { data: clients } = await useAsyncData('logo-reel-clients', () => {
  return queryCollection('clients')
    .order('order', 'ASC')
    .all()
})

const reelClients = computed(() => {
  if (!clients.value) { return [] }

  return clients.value
    .filter((client) => {
      const featured = client.featured || client.meta?.featured
      const published = client.published || client.meta?.published
      return featured === true && published === true
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
  <section>
    <h3 class="h6 | text-align:center margin-block: var(--space-l)">Trusted by</h3>
    <ul ref="reelRef" class="reel" :class="{ 'reel--scrolling': hasScroll }">
      <li v-for="client in reelClients" :key="client.key" data-slide-in="from-top">
        <nuxt-link class="reel__link" :to="client.slug ? `/clients/${client.slug}` : '#'" >
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
  </section>
</template>

<style lang="css" scoped>

section {
  margin-block-start: var(--space-xl);
}

.h6 {
  color: var(--color-base-tint-30);
}

.reel {
  max-width: calc(100svw - var(--system-padding-edge) * 2);
  width: 100svw;
  justify-content: space-between;
  padding-inline: 0;
  --_reel-gap: var(--space-2xl);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.reel::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.reel--scrolling {
  justify-content: start;
  --_reel-gap: var(--space-2xl);
}

.reel li {
  min-block-size: 80px;
  /* min-inline-size: 120px; */
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
  width: 120px;
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
