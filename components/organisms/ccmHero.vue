<template>
  <header 
    class="ccm-hero" 
    :background-color="backgroundColor" 
    :size="size" 
    :hide-bottom="hideBottom" 
    :variant="variant"
    :style="{
      '--_ccm-hero-background-color': `var(--${backgroundColor})`
    }"
    >
    
      <div class="ccm-hero__main">
      <slot>
        <hgroup>
          <!-- <span v-if="brow">{{ brow }}</span> -->
          <h2 class="h1">{{ title }}</h2>
          <h3 class="h2" v-if="tagline">{{ tagline }}</h3>
        </hgroup>  
      </slot>
      </div>

      <div class="ccm-hero__bottom">
        <slot name="footer" />
      </div>
  </header>
</template>

<script setup>
const props = defineProps({
  brow: {
    type: String,
    default: 'Brow'
  },
  title: {
    type: String,
    default: 'Hero'
  },
  tagline: {
    type: String,
    default: 'Tagline'
  },
  backgroundColor: {
    type: String,
    default: 'transparent'
  },
  size: {
    type: String,
    default: 'l'
  },
  hideBottom: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.ccm-hero {
  --_ccm-hero-padding-block: var(--space-l);
  --_ccm-hero-background-color: var(--color-primary-tint-20);
}

.ccm-hero {
  background-color: var(--_ccm-hero-background-color);
  display: block;
  max-width: 100vw; 
  max-height: 600px;
  
}

.ccm-hero__main {
  display: flex;
  padding-block: var(--_ccm-hero-padding-block);
  align-items: center;
  flex: 1;
  aspect-ratio: 16/7;
}

.ccm-hero__main {
  text-wrap: balance;
}

.ccm-hero__bottom {
  padding-bottom: var(--_ccm-hero-padding-block);
}

.ccm-hero[hide-bottom="true"] .ccm-hero__bottom { display: none; }

.ccm-hero[variant="minimal"] .ccm-hero__main { aspect-ratio: unset; }

</style>