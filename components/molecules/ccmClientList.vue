<template>
  <div class="cluster">
    <NuxtLink 
      v-for="client in clients" 
      :key="client.path" 
      :to="`/clients/${client.slug || client.meta?.slug}`"
      class="client-link"
    >
      {{ client['display-name'] || client.displayName || client.name || client.title || 'Client Name Missing' }}
    </NuxtLink>
  </div>
</template>

<script setup>
const { data: clients } = await useAsyncData('clients-list', () => {
  return queryCollection('clients').where('published', '=', true).all()
})

// Debug client data structure if needed
if (import.meta.client && clients.value) {
  console.log('Client list data:', clients.value)
  if (clients.value[0]) {
    console.log('First client structure:', clients.value[0])
  }
}
</script>

<style scoped>

</style>