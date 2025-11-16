<template>
  <nuxt-link 
    class="ccm-card" 
    :to="to" 
    :aria-label="title" 
    :aria-describedby="ctaId" 
    :image="image"
    :style="{
      '--_card-padding': `var(--space-${size})`,
      '--_card-background-color': `var(--${backgroundColor})`
    }"
    >
    
  <slot name="image">
    <img class="ccm-card__image" v-if="image && image !== 'false'" :src="image" :alt="title" />
    <div v-else-if="image !== 'false'" class="ccm-card__image"></div>
  </slot>

  <div class="ccm-card__text">
    <slot />
  </div>
    
  </nuxt-link>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  size: {
    type: String,
    default: 'l'
  },
  backgroundColor: {
    type: String,
    default: 'color-primary-tint-20'
  }
})
</script>

<style scoped>

.ccm-card {
  --_card-padding: var(--space-l);
  --_card-border-radius: var(--border-radius-l);
  --_card-gap: var(--space-m);
  --_card-background-color: var(--color-primary-tint-20);
}


.ccm-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-base);
}

.ccm-card__text {
  flex: 1;
  padding-block: var(--_card-padding);
}

.ccm-card__image {
  flex: 1;
  padding: var(--_card-padding);
  background-color: var(--_card-background-color);
  width: 100%;
  aspect-ratio: 16/9;
}



@media (min-width: 768px) {
  .ccm-card { flex-direction: row; }

  .ccm-card__text:not(:only-child) { padding-inline: var(--_card-padding); }

  .ccm-card__image {
    width: 100%;
    /* aspect-ratio: 1/1;  */
  }

  /* .ccm-card:nth-child(even) { 
    flex-direction: row-reverse; 
    .ccm-card__text { text-align: right; }
  } */
  
}

.ccm-card {
  @media (max-width: 768px) {
    
  }
}


</style>