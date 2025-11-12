<template>
  <div class="layout">
    <slot name="hero" :hero="hero">
      <ccm-page-hero class="layout-hero">
        <template #default="{ hero }">
          <div>
            <hgroup>
              <p><ccm-button to="/case-studies">Back to Case Studies</ccm-button></p>
              <p><span v-if="hero?.brow">{{ hero.brow }}</span></p>
              <h1>{{ hero?.title }}</h1>
              <p v-if="hero?.tagline">{{ hero.tagline }}</p>
              <p v-if="hero?.client">Client: {{ hero.client }}</p>
              <p v-if="hero?.project">Project: {{ hero.project }}</p>
            </hgroup>
          </div>
        </template>
      </ccm-page-hero>
    </slot>
    <main class="layout-main | center">
      <slot />
    </main>
    <ccm-footer class="layout-footer" />
  </div>
</template>

<script setup lang="ts">
const hero = useHeroContent()
</script>

<style>

</style>