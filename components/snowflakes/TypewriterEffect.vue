<template>
  <div class="typewriter" ref="typewriterEl">
    <span v-for="(letter, index) in currentWordLetters" :key="`${currentWordIndex}-${index}`" 
          class="letter" 
          :style="{ opacity: letterOpacity[index] || 0 }">
      {{ letter }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  words: string[]
}>()

const typewriterEl = ref<HTMLElement | null>(null)
const typewriterState = {
  wordIndex: 0,
  position: 0,
  deleting: false,
}

const typingSpeed = 120
const deletingSpeed = 60
const pauseOnComplete = 1000
const pauseBetweenWords = 300

const currentWordIndex = computed(() => typewriterState.wordIndex % props.words.length)
const currentWord = computed(() => props.words[currentWordIndex.value] || '')
const currentWordLetters = computed(() => currentWord.value.split(''))

const letterOpacity = ref<number[]>([])

let typingTimeout: ReturnType<typeof setTimeout> | null = null
let positionFrame: number | null = null

watch(() => props.words, () => {
  typewriterState.wordIndex = 0
  typewriterState.position = 0
  typewriterState.deleting = false
  letterOpacity.value = []
}, { immediate: true })

watch([currentWord], () => {
  if (currentWord.value) {
    letterOpacity.value = new Array(currentWord.value.length).fill(0)
  }
})

const runTypewriter = () => {
  const words = props.words
  if (!words || words.length === 0) {
    letterOpacity.value = []
    typingTimeout = setTimeout(runTypewriter, pauseBetweenWords)
    return
  }
  const word = currentWord.value
  if (!word) return
  
  if (typewriterState.deleting) {
    typewriterState.position = Math.max(0, typewriterState.position - 1)
    letterOpacity.value[typewriterState.position] = 0
  } else {
    typewriterState.position = Math.min(word.length, typewriterState.position + 1)
    if (typewriterState.position > 0) {
      letterOpacity.value[typewriterState.position - 1] = 1
    }
  }

  let nextDelay = typewriterState.deleting ? deletingSpeed : typingSpeed

  if (!typewriterState.deleting && typewriterState.position === word.length) {
    typewriterState.deleting = true
    nextDelay = pauseOnComplete
  } else if (typewriterState.deleting && typewriterState.position === 0) {
    typewriterState.deleting = false
    typewriterState.wordIndex = (typewriterState.wordIndex + 1) % words.length
    letterOpacity.value = new Array(currentWord.value.length).fill(0)
    nextDelay = pauseBetweenWords
  }

  typingTimeout = setTimeout(runTypewriter, nextDelay)
}

const updatePosition = () => {
  const anchor = document.querySelector('[data-typewriter-anchor]')
  if (anchor && typewriterEl.value) {
    const rect = anchor.getBoundingClientRect()
    // We add window.scrollX/Y because absolute positioning is relative to the document
    // (assuming the parent doesn't have position: relative/absolute/fixed, or if we are at root)
    // However, if we are deeply nested, this might be tricky.
    // Ideally, we'd use fixed positioning to match the rect exactly, preventing scroll sync issues?
    // No, fixed positioning stays on screen. Absolute + scrollY scrolls with page.
    // The previous implementation was inside `ccmPageHero` usually at top of page.
    typewriterEl.value.style.top = `${rect.top + window.scrollY}px`
    typewriterEl.value.style.left = `${rect.left + window.scrollX}px`
    
    // Match width/height if needed, though the effect seems to overflow.
    // typewriterEl.value.style.width = `${rect.width}px`
    // typewriterEl.value.style.height = `${rect.height}px`
  }
  positionFrame = requestAnimationFrame(updatePosition)
}

onMounted(() => {
  typingTimeout = setTimeout(runTypewriter, 400)
  updatePosition()
})

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  if (positionFrame) {
    cancelAnimationFrame(positionFrame)
  }
})
</script>

<style scoped>
.typewriter {
  overflow: hidden;
  display: block;
  white-space: nowrap;
  position: absolute;
  /* Use transform for offset to avoid conflict with JS top/left */
  transform: translate(0svw, -9svh);
  /* Reset default top/left to 0 just in case */
  bottom: 0;
  left: 0;
  mix-blend-mode: multiply;
  font-family: "Caslon Doric", var(--display-font), serif;
  font-size: 20svw;
  font-weight: 700;
  line-height: 1;
  font-family: var(--display-font);
  background: linear-gradient(90deg, #fff, #000);
  background-size: 200% 100%;
  background-position: 0% 0%;
  animation: typewriter-gradient-move 4s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  opacity: 0.05;
  z-index: -1;
  pointer-events: none; /* Good practice for overlays */
  /* Animate gradient to move left to right */
  @keyframes typewriter-gradient-move {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 0%;
    }
  }
}

.typewriter .letter {
  display: inline-block;
  margin: 0;
  transition: opacity .3s ease-in-out;
  opacity: 0;
}
</style>
