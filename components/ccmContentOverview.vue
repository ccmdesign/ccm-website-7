<template>
  <section class="overview" :variant="variant">
    <div class="top">
      <slot name="top"/>
    </div>
    <div class="bottom">
      <slot name="bottom"/>
    </div>
  </section>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.top, .bottom {
  display: flex;
  gap: var(--space-3xs);
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
}

.top > :deep(*:only-child) {
  justify-content: center;
}

/* Modern browsers with :has() support */
@supports selector(:has(*)) {
  .bottom:has(:only-child) {
    justify-content: center;
  }
}

.top {
  border-bottom: 1px solid var(--color-base-tint-20);
  padding-bottom: var(--space-s);
}

.bottom {
  padding-top: var(--space-s);
}

</style>
