<template>
  <header class="ccm-page-hero">
    <ccm-topbar class="ccm-page-hero__topbar" />

    <hgroup class="ccm-page-hero__main">
      <span v-if="hero?.brow">{{ hero.brow }}</span>
      <h1>{{ hero?.title }}</h1>
      <p v-if="hero?.tagline" class="ccm-page-hero__tagline">{{ hero.tagline }}</p>
      <div class="typewriter">
        <span>{{ typewriterText }}</span>
      </div>
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
  font-weight: 600;
  font-size: var(--size-3);
  color: var(--color-accent);
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

.typewriter {
  overflow: hidden;
  display: block;
  white-space: nowrap;
  position: absolute;
  left: -25svw;
  top: -17svh;
  font-size: 20svw;
  font-weight: 700;
  line-height: 1;
  font-family: var(--display-font);
  color: transparent;
  -webkit-text-stroke: 2px var(--color-base-tint-05);
  z-index: -1;
}

.typewriter span {
  display: inline-block;
  margin: 0;
}

</style>


<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { CcmHeroContent } from '~/types/hero'

const defaultTypewriterWords = ['Create', 'Inspire', 'Collaborate', 'Deliver']
const props = defineProps<{
  hero?: CcmHeroContent | null
  fallback?: CcmHeroContent | null
  typewriterWords?: string[]
}>()

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
const typewriterWordList = computed<string[]>(() => {
  if (props.typewriterWords && props.typewriterWords.length > 0) {
    return props.typewriterWords
  }

  const heroWords = hero.value?.typewriterWords
  if (heroWords && heroWords.length > 0) {
    return heroWords
  }

  return defaultTypewriterWords
})
const typewriterText = ref('')
const typewriterState = {
  wordIndex: 0,
  position: 0,
  deleting: false,
}
const typingSpeed = 120
const deletingSpeed = 60
const pauseOnComplete = 1000
const pauseBetweenWords = 300

let typingTimeout: ReturnType<typeof setTimeout> | null = null

watch(typewriterWordList, () => {
  typewriterState.wordIndex = 0
  typewriterState.position = 0
  typewriterState.deleting = false
  typewriterText.value = ''
}, { immediate: true })

const runTypewriter = () => {
  const words = typewriterWordList.value
  if (words.length === 0) {
    typewriterText.value = ''
    typingTimeout = setTimeout(runTypewriter, pauseBetweenWords)
    return
  }
  const currentWord = words[typewriterState.wordIndex % words.length]
  if (typewriterState.deleting) {
    typewriterState.position = Math.max(0, typewriterState.position - 1)
  } else {
    typewriterState.position = Math.min(currentWord.length, typewriterState.position + 1)
  }

  typewriterText.value = currentWord.slice(0, typewriterState.position)

  let nextDelay = typewriterState.deleting ? deletingSpeed : typingSpeed

  if (!typewriterState.deleting && typewriterState.position === currentWord.length) {
    typewriterState.deleting = true
    nextDelay = pauseOnComplete
  } else if (typewriterState.deleting && typewriterState.position === 0) {
    typewriterState.deleting = false
    typewriterState.wordIndex = (typewriterState.wordIndex + 1) % words.length
    nextDelay = pauseBetweenWords
  }

  typingTimeout = setTimeout(runTypewriter, nextDelay)
}

onMounted(() => {
  typingTimeout = setTimeout(runTypewriter, 400)
})

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})
</script>
