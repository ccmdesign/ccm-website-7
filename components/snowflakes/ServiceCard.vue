<template>
  <div class="service-card" data-slide-in="from-top">
    <hgroup class="service-card__header">
      <h3 class="h5">{{ service.title }}</h3>
      <p>{{ service.description }}</p>
    </hgroup>

    <div class="service-card__icon">
      <img :src="service.meta?.icon" :alt="service.title" />
    </div>

    <div class="service-card__activities">
      <ul>
        <li v-for="activity in service.meta.activities" :key="activity">
          <p>{{ activity }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  service: Service
}>()
</script>

<style scoped>
.service-card {
  display: flex;
  gap: var(--space-2xl);
  padding-block: var(--space-2xl);
  border-top: 1px solid var(--color-base-tint-10);
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.service-card__header {
  flex: 2;
  font-weight: 100;
}

.service-card__icon {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
}

.service-card__activities {
  flex: 1;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  
  
}
</style>
