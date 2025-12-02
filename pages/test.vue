<template>
  <div class="test-page">
    <h1>Collections Debug</h1>

    <details v-for="collection in collections" :key="collection.name" open>
      <summary>
        <strong>{{ collection.name }}</strong> ({{ collection.items?.length || 0 }} items)
      </summary>
      <pre>{{ JSON.stringify(collection.items, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup>
// Define the known collections based on content.config.ts
const collectionNames = [
  'blog',
  'casestudies', // Note: config uses 'casestudies', not 'case-studies'
  'clients',
  'components',
  'services',
  'work'
];

// Fetch all collections
const { data: allCollections } = await useAsyncData('all-collections', async () => {
  const collectionsWithItems = await Promise.all(
    collectionNames.map(async (name) => {
      try {
        const items = await queryCollection(name).all();
        return {
          name,
          items
        };
      } catch (error) {
        console.error(`Error fetching collection ${name}:`, error);
        return {
          name,
          items: [],
          error: error.message
        };
      }
    })
  );

  return collectionsWithItems;
});

const collections = computed(() => allCollections.value || []);
</script>

<style scoped>
.test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

details {
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

summary {
  cursor: pointer;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>