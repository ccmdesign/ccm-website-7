<template>
  <nuxt-link 
    class="ccm-card-minimal" 
    :to="to" 
    :aria-label="title" 
    :aria-describedby="ctaId" 
    :image="image"
    :style="{
      '--_card-padding': `var(--space-${size})`,
      '--_card-background-color': `var(--${backgroundColor})`
    }"
    >
    <slot />
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
  size: {
    type: String,
    default: 's'
  },
  backgroundColor: {
    type: String,
    default: 'color-primary-tint-20'
  }
})
</script>

<style scoped>

.ccm-card-minimal {
  --_card-padding: var(--space-s);
  --_card-border-radius: var(--border-radius-m);
  --_card-gap: var(--space-s);
  --_card-background-color: var(--color-primary-tint-05);
}


.ccm-card-minimal {
  display: inline-block;
  text-decoration: none;
  color: var(--color-base);
  background-color: var(--_card-background-color);
  padding: var(--_card-padding);
  border-radius: var(--_card-border-radius);
  gap: var(--_card-gap);
}




</style>