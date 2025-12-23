<template>
  <div class="layout-three-column">
    <div class="layout-three-column__main">
      <h1>Layout 1 Main Content</h1>
      <NuxtLink to="/layouts/">List</NuxtLink>
    </div>
    <aside class="layout-three-column__sidebar-1">
      <h2>Layout 1 Aside</h2>
    </aside>
    <aside class="layout-three-column__sidebar-2">
      <h2>Layout 1 Aside</h2>
    </aside>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.layout-three-column {
  display: flex;
}
.layout-three-column__main {
  outline: 3px solid red;
  flex: 3;
}
.layout-three-column__sidebar-1 {
  outline: 3px solid green;
  display: none;
  @media (min-width: 960px) {
    flex: 1;
    display: block;
  }
}

.layout-three-column__sidebar-2 {
  outline: 3px solid blue;
  display: none;
  @media (min-width: 600px) {
    flex: 2;
    display: block;
  }
}
</style>