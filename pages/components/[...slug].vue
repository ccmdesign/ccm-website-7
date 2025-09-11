<template>
  <div v-if="doc">
    <ccm-section>
      <div class="component-header">
        <div class="component-meta">
          <span class="category">{{ doc.category }}</span>
        </div>
        <h1>{{ doc.title }}</h1>
        <p class="tagline">{{ doc.tagline }}</p>
      </div>
    </ccm-section>

    <ccm-section v-if="doc.props && doc.props.length" background-color="color-neutral-tint-95">
      <div class="prose">
        <h2>Props</h2>
        <div class="props-table">
          <div class="props-header">
            <span>Name</span>
            <span>Type</span>
            <span>Default</span>
            <span>Description</span>
          </div>
          <div v-for="prop in doc.props" :key="prop.name" class="prop-row">
            <code class="prop-name">{{ prop.name }}</code>
            <span class="prop-type">{{ prop.type }}</span>
            <code class="prop-default">{{ prop.default || (prop.required ? 'required' : '-') }}</code>
            <span class="prop-description">{{ prop.description }}</span>
          </div>
        </div>
      </div>
    </ccm-section>

    <ccm-section v-if="doc.slots && doc.slots.length">
      <div class="prose">
        <h2>Slots</h2>
        <div class="slots-list">
          <div v-for="slot in doc.slots" :key="slot.name" class="slot-item">
            <code class="slot-name">{{ slot.name }}</code>
            <p class="slot-description">{{ slot.description }}</p>
          </div>
        </div>
      </div>
    </ccm-section>

    <ccm-section v-if="doc.examples && doc.examples.length" background-color="color-primary-tint-95">
      <div class="prose">
        <h2>Examples</h2>
        <div v-for="example in doc.examples" :key="example.title" class="example">
          <h3>{{ example.title }}</h3>
          <div class="code-block">
            <pre><code>{{ example.code }}</code></pre>
          </div>
        </div>
      </div>
    </ccm-section>

    <ccm-section>
      <div class="prose">
        <ContentDoc :path="doc._path" />
      </div>
    </ccm-section>

    <ccm-section background-color="color-neutral-tint-95">
      <div class="navigation">
        <nuxt-link to="/components" class="back-link">← Back to Component Library</nuxt-link>
      </div>
    </ccm-section>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug.join('/')


const { data: doc } = await useAsyncData(`component-${slug}`, () => {
  return queryCollection('components').path(`/components/${slug}`).first()
})

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Component documentation not found' })
}

definePageMeta({
  hero: {
    variant: 'minimal',
    hideBottom: false
  }
})
</script>

<style scoped>
.component-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.component-meta {
  margin-bottom: var(--space-s);
}

.category {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  padding: var(--space-2xs) var(--space-s);
  border-radius: var(--border-radius-s);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tagline {
  font-size: 1.25rem;
  color: var(--color-neutral);
  margin-top: var(--space-s);
}

.props-table {
  background: white;
  border-radius: var(--border-radius-m);
  overflow: hidden;
  border: 1px solid var(--color-neutral-tint-80);
}

.props-header {
  display: grid;
  grid-template-columns: 1fr 100px 120px 2fr;
  gap: var(--space-m);
  padding: var(--space-m);
  background: var(--color-neutral-tint-90);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prop-row {
  display: grid;
  grid-template-columns: 1fr 100px 120px 2fr;
  gap: var(--space-m);
  padding: var(--space-m);
  border-top: 1px solid var(--color-neutral-tint-90);
}

.prop-name {
  font-weight: 600;
  color: var(--color-primary);
}

.prop-type {
  font-size: 0.875rem;
  color: var(--color-neutral);
}

.prop-default {
  font-size: 0.875rem;
  background: var(--color-neutral-tint-95);
  padding: 2px var(--space-2xs);
  border-radius: var(--border-radius-xs);
}

.prop-description {
  font-size: 0.875rem;
  line-height: 1.5;
}

.slots-list {
  background: white;
  border-radius: var(--border-radius-m);
  border: 1px solid var(--color-neutral-tint-80);
  overflow: hidden;
}

.slot-item {
  padding: var(--space-m);
  border-top: 1px solid var(--color-neutral-tint-90);
}

.slot-item:first-child {
  border-top: none;
}

.slot-name {
  font-weight: 600;
  color: var(--color-primary);
  display: block;
  margin-bottom: var(--space-xs);
}

.slot-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-neutral);
}

.example {
  margin-bottom: var(--space-xl);
}

.code-block {
  background: var(--color-neutral-shade-95);
  border: 1px solid var(--color-neutral-tint-80);
  border-radius: var(--border-radius-m);
  overflow: hidden;
  margin-top: var(--space-m);
}

.code-block pre {
  margin: 0;
  padding: var(--space-l);
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
}

.code-block code {
  background: none;
  padding: 0;
  font-family: 'Monaco', 'Consolas', monospace;
}

.navigation {
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-s) var(--space-l);
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius-m);
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.back-link:hover {
  background: var(--color-primary-shade-10);
}

@media (max-width: 768px) {
  .props-header,
  .prop-row {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
  }
  
  .props-header {
    display: none;
  }
  
  .prop-row {
    padding: var(--space-m);
    display: block;
  }
  
  .prop-row > * {
    display: block;
    margin-bottom: var(--space-xs);
  }
}
</style>