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
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
}

.top > :deep(*:only-child),
.bottom:has(:only-child) {
  justify-content: center;
}

.top {
  border-bottom: 1px solid var(--color-base-tint-20);
  padding-bottom: var(--space-s);
}

.bottom {
  padding-top: var(--space-s);
}


@media (min-width: 768px) { 
  .top { flex-direction: row; }
  .bottom { flex-direction: row; }
}

</style>
