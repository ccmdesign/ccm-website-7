<template>
  <header 
    class="ccm-post-hero" 
    :background-color="backgroundColor" 
    :size="size" 
    :hide-top="hideTop" 
    :hide-bottom="hideBottom" 
    :variant="variant"
    :style="{
      '--_ccm-post-hero-background-color': `var(--${backgroundColor})`,
      '--_ccm-post-hero-padding-block': `var(--space-${size})`,
      '--_ccm-post-hero-foreground-color': `var(--${foregroundColor})`
    }"
    >
    <div class="center">
      <ccm-topbar v-if="!hideTopbar" class="ccm-post-hero__top"/>
    </div>

    <div class="center">
      <div class="ccm-post-hero__main">
        <hgroup>
          <p><ccm-button to="/blog">Back to Blog</ccm-button></p>
          <p><span v-if="brow">{{ brow }}</span></p>
          <h1>{{ title }}</h1>
          <p v-if="tagline">{{ tagline }}</p>
        </hgroup>
        <div class="ccm-post-hero__meta">
          <p>Published {{ formatDate(date, 'MMM d, yyyy') }} by {{ author }}</p>
          <p>
            Tags:
            <span v-for="(tag, i) in tags" :key="tag">
              <NuxtLink :to="`/blog/tag/${encodeURIComponent(tag)}`">{{ tag }}</NuxtLink><span v-if="i < tags.length - 1">, </span>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="center">
      <div class="ccm-post-hero__bottom">
        <slot name="footer" />
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  brow: {
    type: String,
    default: 'Insight'
  },
  date: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  backgroundColor: {
    type: String,
    default: 'color-primary-tint-20'
  },
  size: {
    type: String,
    default: 'l'
  },
  foregroundColor: {
    type: String,
    default: 'color-base'
  },
  hideTop: {
    type: Boolean,
    default: false
  },
  hideBottom: {
    type: Boolean,
    default: true
  },
  hideTopbar: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.ccm-post-hero {
  --_ccm-post-hero-padding-block: var(--space-l);
  --_ccm-post-hero-background-color: var(--color-primary-tint-20);
  --_ccm-post-hero-foreground-color: var(--color-base);
  
}

.ccm-post-hero {
  background-color: var(--_ccm-post-hero-background-color);
  color: var(--_ccm-post-hero-foreground-color);
  display: block;
  max-width: 100vw; 
  max-height: 600px;
}

.ccm-post-hero__main {
  display: flex;
  flex-direction: column;
  padding-block: var(--_ccm-post-hero-padding-block);
  align-items: flex-start;
  flex: 1;
  aspect-ratio: 16/7;
  text-wrap: balance;
}

.ccm-post-hero__meta {
  margin-top: var(--space-m);
}

.ccm-post-hero__bottom {
  padding-bottom: var(--_ccm-post-hero-padding-block);
}

.ccm-post-hero[hide-top="true"] .ccm-post-hero__top { display: none; }
.ccm-post-hero[hide-bottom="true"] .ccm-post-hero__bottom { display: none; }

.ccm-post-hero[variant="minimal"] .ccm-post-hero__main { aspect-ratio: unset; }

h4, h3 {
  font-family: var(--body-font);
  font-weight: 200;
}

h1, h3, h4 {
  margin-block: 0;
}
</style>