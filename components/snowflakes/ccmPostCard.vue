<template>
  <li class="ccm-post-card">
    <NuxtLink 
      :to="to" 
      :aria-label="`Read post: ${title}`"
      class="ccm-post-card__link"
    >
      <div class="ccm-post-card__content | stack">
        <h4 class="ccm-post-card__brow" v-if="brow">{{ brow }}</h4>
        <h3 class="ccm-post-card__title">{{ title }}</h3>
        <p v-html="renderedTldr"></p>
        <div class="ccm-post-card__categories | cluster | margin-top:l" v-if="categoryList.length > 0">
          <ccm-chip v-for="category in categoryList" :key="category">{{ category }}</ccm-chip>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<style lang="css" scoped>
.ccm-post-card {
  border-bottom: 1px solid var(--color-base-tint-10);
  display: grid;
  grid-template-columns: subgrid;
  position: relative;

  &:first-child {
    border-top: 1px solid var(--color-base-tint-10);
  }
}

.ccm-post-card__link {
  display: block;
  padding-block: var(--space-2xl);
  text-decoration: none;
  color: inherit;
  outline: none;
  position: relative;

  &:hover,
  &:focus-visible {
    background-color: var(--color-base-tint-5);
  }

  &:focus-visible {
    outline: 2px solid var(--color-base-tint-90);
    outline-offset: -2px;
  }
}

.ccm-post-card__brow {
  font-size: var(--size--2);
  font-weight: 800;
  color: var(--color-base-tint-90);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ccm-post-card__title {
  font-size: var(--size-2);
  font-weight: 100;
  --_stack-space: var(--space-2xs);
}

p {
  font-size: var(--size-0);
  color: var(--color-base-tint-70);
  font-weight: 200;
  --_stack-space: var(--space-l);

  :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: var(--color-primary-tint-20);
    }
  }

  :deep(strong) {
    font-weight: 600;
  }

  :deep(em) {
    font-style: italic;
  }
}

.ccm-post-card__categories {
  position: absolute;
  bottom: calc(var(--size--1) * -1 + 4px);
  left: 0;
}


</style>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

// Create markdown parser instance once (shared across all component instances)
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

const props = withDefaults(defineProps<{
  to: string
  categories?: string | null
  brow?: string | null
  title: string
  tldr: string | null
}>(), {
  tldr: null
})

const renderedTldr = computed(() => {
  if (!props.tldr) return ''
  return md.render(props.tldr)
})

const categoryList = computed(() => {
  if (!props.categories) return []
  return props.categories.split(',').map(cat => cat.trim()).filter(Boolean)
})

</script>

