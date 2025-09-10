<template>
  <nuxt-link class="ccm-card" :to="to">
    
    <div class="ccm-card__image">
      <img v-if="image" :src="image" :alt="title" />
      <div v-else class="ccm-card__image-placeholder">
        <slot name="image-placeholder" />
      </div>
    </div>

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
  }
})
</script>

<style scoped>
.ccm-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-base);
}

.ccm-card__text {
  flex: 1;
  padding-block: var(--space-m);
}

.ccm-card__image {
  flex: 1;
  padding: var(--space-m);
  background-color: var(--color-primary-tint-20);
  width: 100%;
  aspect-ratio: 16/9;
}



@media (min-width: 768px) {
  .ccm-card { flex-direction: row; }

  .ccm-card__text { padding-inline: var(--space-m); }

  .ccm-card__image-placeholder {
    width: 100%;
    aspect-ratio: 1/1; 
  }

  .ccm-card:nth-child(even) { 
    flex-direction: row-reverse; 
    .ccm-card__text { text-align: right; }
  }
  
}

.ccm-card {
  @media (max-width: 768px) {
    
  }
}


</style>