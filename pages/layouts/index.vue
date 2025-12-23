<template>
  <div>
    <h1>Layouts</h1>
    <ul class="list">
      <li>
        <NuxtLink to="/layouts/layout-single-column">Single Column</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/layouts/layout-sidebar-main">Sidebar Main</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/layouts/layout-three-column">Three Column</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>

</style>