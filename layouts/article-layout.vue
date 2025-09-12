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
            <p><ccm-button to="/blog">Back to Blog</ccm-button></p>
            <p><span v-if="hero.brow">{{ hero.brow }}</span></p>
            <h1>{{ hero.title }}</h1>
            <p v-if="hero.tagline">{{ hero.tagline }}</p>
          </hgroup>
          <div class="ccm-post-hero__meta">
            <p>Published {{ formatDate(hero.date, 'MMM d, yyyy') }} by {{ hero.author }}</p>
            <p>
              Tags:
              <span v-for="(tag, i) in hero.tags" :key="tag">
                <NuxtLink :to="`/blog/tag/${encodeURIComponent(tag)}`">{{ tag }}</NuxtLink><span v-if="i < hero.tags.length - 1">, </span>
              </span>
            </p>
          </div>
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
.layout {
  min-height: 100svh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "hero"
    "main"
    "footer";
}

.layout-main {
  --_center-measure: 70ch;
}
</style>