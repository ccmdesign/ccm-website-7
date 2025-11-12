<template>
  <header class="ccm-page-hero">
    <ccm-topbar class="ccm-page-hero__topbar" />

    <hgroup class="ccm-page-hero__main">
      <span v-if="hero?.brow">{{ hero.brow }}</span>
      <h1>{{ hero?.title }}</h1>
      <p v-if="hero?.tagline">{{ hero.tagline }}</p>
    </hgroup>
    <!-- <pre>{{ hero }}</pre> -->

    <footer class="ccm-page-hero__footer">
      <slot name="footer">
        <ccm-logo-reel />
      </slot>
    </footer>
  </header>
</template>

<style scoped>
.ccm-page-hero {
  background-color: transparent;
  min-block-size: 90svh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 1100px auto;
    
  grid-template-areas:
    ". topbar ."
    ". main ."
    "footer footer footer";
}

.ccm-page-hero__topbar {
  grid-column: 2/3;
  grid-row: 1/2;
}

.ccm-page-hero__main {
  grid-column: 2/3;
  grid-row: 2/3;
  align-self: center;
  width: 100%;
  
}

.ccm-page-hero__footer {
  grid-area: footer;
  grid-row: 3/4;
}

h1 {
  font-weight: 100;
}

</style>


<script setup lang="ts">
import type { CcmHeroContent } from '~/types/hero'

const props = withDefaults(defineProps<{
  hero?: CcmHeroContent | null
  fallback?: CcmHeroContent | null
}>(), {
  hero: null,
  fallback: null,
})

const hero = useHeroContent(
  computed(() => props.hero),
  computed(() => props.fallback),
)

const heroBindings = computed(() => {
  if (!hero.value) { return null }
  return {
    brow: hero.value.brow,
    title: hero.value.title ?? '',
    tagline: hero.value.tagline,
    backgroundColor: hero.value.backgroundColor,
    size: hero.value.size ?? 'l',
    hideTop: hero.value.hideTop ?? false,
    hideTopbar: hero.value.hideTopbar ?? false,
    hideBottom: hero.value.hideBottom ?? true,
    variant: hero.value.variant ?? 'default',
  }
})

defineExpose({
  hero,
})
</script>

