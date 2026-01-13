<template>
  <nav v-if="to" class="next-navigation">
    <NuxtLink :to="to" class="next-link">
      <span class="next-label">{{ label }}</span>
      <span class="next-title">{{ title }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Next'
  }
})
</script>

<style scoped>
.next-navigation {
  display: flex;
  justify-content: center;
  padding-block: var(--space-3xl);
  border-top: 1px solid var(--color-base-tint-10);
}

.next-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  text-decoration: none;
  color: var(--color-base-tint-60);
  transition: color 0.2s ease;
}

.next-link:hover {
  color: var(--color-base);
}

.next-label {
  font-size: var(--size--2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.next-title {
  font-size: var(--size-1);
  font-weight: 200;
}
</style>
