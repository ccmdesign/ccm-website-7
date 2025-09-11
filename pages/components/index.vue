<template>
  <ccm-section>
    <div class="prose">
      <h2>Component Library</h2>
      <p>A systematic collection of reusable components built with programmatic styling and consistent design tokens.</p>
    </div>
  </ccm-section>

  <ccm-section size="l">
    <div class="prose">
      <h2>Foundation</h2>
      <nuxt-link v-for="foundationDoc in foundationDocs" :key="foundationDoc._path" :to="foundationDoc.path" class="component-link">
        {{ foundationDoc.title }}
      </nuxt-link>
    </div>
  </ccm-section>

  <ccm-section>
    <div class="prose">
      <h2>Layout Components</h2>
      <nuxt-link v-for="layoutDoc in layoutDocs" :key="layoutDoc._path" :to="layoutDoc.path" class="component-link">{{ layoutDoc.title }}</nuxt-link>
    </div>
  </ccm-section>

  <ccm-section>
    <div class="prose">
      <h2>Content Components</h2>
        <nuxt-link v-for="contentDoc in contentDocs" :key="contentDoc._path" :to="contentDoc.path" class="component-link">
          {{ contentDoc.title }}
        </nuxt-link>
    </div>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  hero: {
    brow: 'Documentation',
    title: 'Component Library',
    tagline: 'Systematic, scalable components with programmatic styling',
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
.component-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.component-list li {
  margin-bottom: var(--space-m);
}

.component-link {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: var(--space-m);
  border: 1px solid var(--color-neutral-tint-80);
  border-radius: var(--border-radius-m);
  transition: all 0.2s ease;
}

.component-link:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-tint-95);
}

.component-link strong {
  display: block;
  color: var(--color-primary);
  margin-bottom: var(--space-xs);
}

.component-description {
  color: var(--color-neutral);
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>