<template>
    <details name="post-card" class="ccm-post-card | stack" ref="detailsEl" @toggle="handleToggle">
      <summary>
        <h4 class="ccm-post-card__brow" v-if="brow" :title="brow">{{ brow }}</h4>
        <h3 class="ccm-post-card__title" :title="title">{{ title }}</h3>
      <time v-if="date" class="ccm-post-card__date">{{ formattedDate }}</time>
      </summary>
      <div class="stack">
        <div v-if="renderedTldr" v-html="renderedTldr"></div>
        <div>
          <NuxtLink :to="to" :aria-label="`Read post: ${title}`" class="button" data-size="s">Read more</NuxtLink>
        </div>
      </div>
    </details>
</template>

<style lang="css" scoped>
.ccm-post-card {
  border-bottom: 1px solid var(--color-base-tint-10);
  position: relative;
  transition: transform 0.2s ease-in-out;
  padding-block: var(--space-xl);
  interpolate-size: allow-keywords;
  scroll-margin-top: var(--space-xl);

  &::details-content {
    opacity: 0;
    block-size: 0;
    overflow: hidden;
    transition: 
      opacity 0.3s ease,
      block-size 0.3s ease,
      content-visibility 0.3s allow-discrete;
  }

    &[open]::details-content {
      opacity: 1;
      block-size: auto;
    }

  summary:first-of-type { list-style: none; }
  
  &:first-child {
    border-top: 1px solid var(--color-base-tint-10);
  }

  &:hover {
    transform: scale(1.03);
    cursor: pointer;
    .ccm-post-card__read-more { color: var(--color-primary); }
  }

  .stack {
    --_stack-space: var(--space-l);
  }
}



.ccm-post-card:not([open]):has(~ .ccm-post-card[open]),
.ccm-post-card[open] ~ .ccm-post-card:not([open]) {
  opacity: 0.2;
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
  color: var(--color-base-tint-40);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ccm-post-card__title {
  font-size: var(--size-1);
  font-weight: 100;
  --_stack-space: var(--space-2xs);
}

.ccm-post-card__date {
  font-size: var(--size--1);
  color: var(--color-base-tint-40);
  font-weight: 400;
  text-transform: uppercase;
}

p {
  font-size: var(--size-0);
  color: var(--color-base-tint-80);
  font-weight: 200;
  --_stack-space: var(--space-xs);

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
.ccm-post-card__brow {
  font-size: var(--size--1);
  font-weight: 800;
  color: var(--color-base-tint-40);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.ccm-post-card__categories {
  position: absolute;
  bottom: calc(var(--size--1) * -1 + 4px);
  left: 0;
}


</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
  tldr?: string | null
  date?: string | null
}>(), {
  tldr: null,
  date: null
})

const renderedTldr = computed(() => {
  if (!props.tldr) return ''
  return md.render(props.tldr)
})

const categoryList = computed(() => {
  if (!props.categories) return []
  return props.categories.split(',').map(cat => cat.trim()).filter(Boolean)
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  return formatDate(props.date)
})

const detailsEl = ref<HTMLDetailsElement | null>(null)

const handleToggle = (event: Event) => {
  const target = event.target as HTMLDetailsElement
  if (target.open && detailsEl.value) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (detailsEl.value) {
          detailsEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    })
  }
}

</script>

