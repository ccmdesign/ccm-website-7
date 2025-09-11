<template>
  

  <ccm-section>
    <div class="stack">
      <h2>Foundation</h2>
      <div class="grid">
        <ccm-card-minimal v-for="foundationDoc in foundationDocs" :key="foundationDoc._path" :to="foundationDoc.path" class="component-link">
          {{ foundationDoc.title }}
        </ccm-card-minimal>
      </div>
    </div>

  </ccm-section>

  <ccm-section>
    <div class="stack">
      <h2>Layout Components</h2>
      <div class="grid">
        <ccm-card-minimal v-for="layoutDoc in layoutDocs" :key="layoutDoc._path" :to="layoutDoc.path" class="component-link">{{ layoutDoc.title }}</ccm-card-minimal>
      </div>
    </div>
  </ccm-section>

  <ccm-section>
    <div class="stack">
      <h2>Content Components</h2>
      <div class="grid">
        <ccm-card-minimal v-for="contentDoc in contentDocs" :key="contentDoc._path" :to="contentDoc.path" class="component-link">
            {{ contentDoc.title }}
          </ccm-card-minimal>
        </div>
    </div>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  hero: {
    brow: 'Documentation',
    title: 'Component Library',
    tagline: 'A systematic collection of reusable components built with programmatic styling and consistent design tokens.',
    variant: 'minimal'
  }
})

// Fetch all component documentation
const { data: componentDocs } = await useAsyncData('component-docs', () => {
  return queryCollection('components').all()
})

// Organize components by category
const foundationDocs = computed(() => 
  componentDocs.value?.filter(doc => doc.category === 'Foundation') || []
)

const layoutDocs = computed(() => 
  componentDocs.value?.filter(doc => doc.category === 'Layout') || []
)

const contentDocs = computed(() => 
  componentDocs.value?.filter(doc => doc.category === 'Content') || []
)

</script>

<style scoped>

.grid {
  --_grid-gap: var(--space-m);
}

</style>