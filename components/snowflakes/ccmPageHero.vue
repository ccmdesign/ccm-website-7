<template>
  <header class="ccm-page-hero | master-grid-columns master-grid-rows" :minimal="isMinimal">
    <ccm-topbar class="ccm-page-hero__topbar" />

    <hgroup v-if="!isMinimal" class="ccm-page-hero__main" data-typewriter-anchor>
      <span v-if="hero?.brow">{{ hero.brow }}</span>
      <h1>{{ hero?.title || hero?.tagline }}</h1>
      <p class="ccm-page-hero__tagline" v-if="hero?.tagline && hero?.title">{{ hero.tagline }}</p>

    </hgroup>
    <!-- <pre>{{ hero }}</pre> -->

    <footer v-if="!isMinimal" class="ccm-page-hero__footer">
      <slot name="footer">
        <ccm-logo-reel v-if="!hero?.hideLogoReel" />
      </slot>
    </footer>
  </header>
</template>

<style scoped>
.ccm-page-hero {
  background-color: transparent;
  block-size: auto;
  min-block-size: 5svh;
}

.ccm-page-hero[minimal="false"] {
  block-size: 92svh;
}

.ccm-page-hero__topbar :deep(img) {
  max-inline-size: 250px;
  inline-size: 100%;
}

.ccm-page-hero__topbar {
  grid-column: wider-start / wider-end;

  @media (min-width: 1441px) {
    grid-column: wide-start / wide-end;
  }
    
  grid-row: 1/2;
  align-self: end;
}

.ccm-page-hero__main {
  width: 100%;
  grid-column: wider-start / wider-end;
  grid-row: tall-start / tall-end;
  align-self: center;

  @media (min-width: 1441px) {
    grid-column: narrow-start / normal-end;
  }
  
}

.ccm-page-hero__footer {
  grid-column: full-start / full-end;
  grid-row: taller-end / full-end;
  align-self: end;
  justify-self: center;
}

h1 {
  /* TODO:We might want to make this a default scale for all headings */
  
  font-size: var(--size-1);
  @media (min-width: 600px) { font-size: var(--size-2); }
  color: var(--color-base);
  font-weight: 600;
}

.ccm-page-hero__tagline {
  font-family: var(--display-font);
  font-size: calc(var(--size-1) * 1.1);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-base);
}

.ccm-page-hero__main {
  position: relative;
}



</style>


<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CcmHeroContent } from '~/types/hero'

const defaultTypewriterWords = ['Create', 'Inspire', 'Collaborate', 'Deliver']
const props = defineProps<{
  hero?: CcmHeroContent | null
  fallback?: CcmHeroContent | null
  typewriterWords?: string[]
  minimal?: boolean
}>()

const hero = useHeroContent(
  computed(() => props.hero),
  computed(() => props.fallback),
)

const isMinimal = computed(() => {
  if (props.minimal) return true
  return hero.value?.variant === 'minimal'
})

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
