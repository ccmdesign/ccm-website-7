<template>
  <div class="layout">
    <slot name="hero">
      <ccm-hero
        v-if="hero"
        class="layout-hero"
        :background-color="hero.backgroundColor"
        :size="hero.size"
        :hide-topbar="hero.hideTopbar"
        :hide-bottom="hero.hideBottom"
        :variant="hero.variant"
      >
        <div>
          <hgroup>
            <p><ccm-button to="/case-studies">Back to Case Studies</ccm-button></p>
            <p><span v-if="hero.brow">{{ hero.brow }}</span></p>
            <h1>{{ hero.title }}</h1>
            <p v-if="hero.tagline">{{ hero.tagline }}</p>
            <p v-if="hero.client">Client: {{ hero.client }}</p>
            <p v-if="hero.project">Project: {{ hero.project }}</p>
          </hgroup>
          
        </div>
      </ccm-hero>
    </slot>
    <main class="layout-main | center">
      <slot />
    </main>
    <ccm-footer class="layout-footer" />
  </div>
</template>

<script setup>
const route = useRoute()
const heroState = useState('hero', () => null)
const hero = computed(() => route.meta.hero || heroState.value)

</script>

<style>

</style>