<template>
  <MorphingGradient 
    :colors="gradientColors" 
    class="gradient-background" 
    :blend-mode="blendMode"
    :blur-amount="blurAmount"
    :circle-size="circleSize"
    :interactive-size="interactiveSize"
    :quadrant="quadrant"
    :opacity="gradientOpacity"
  />
  <!-- <typewriter-effect class="typewriter" :words="['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']" /> -->
  
  <NuxtLayout name="homepage">
    <template #master-layout-hero>
      <h2 v-if="hero?.tagline">{{ hero.tagline }}</h2>
    </template>

    <template #master-layout-main>
      <ccm-featured-work class="featured-work" data-slide-in="from-top" />
    </template>
  </NuxtLayout>
</template>

<style scoped>
.gradient-background {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1 !important;
  pointer-events: none;
}

.featured-work {
  max-width: 800px;
  margin-inline-start: auto;
}


</style>


<script setup lang="ts">
definePageMeta({
  layout: false,
  hero: {
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})

const hero = useHeroContent()


// Helper functions for color conversion
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result || !result[1] || !result[2] || !result[3]) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}


// Gradient settings
const blurAmount = ref(18)
const circleSizeNum = ref(54)
const circleSize = computed(() => `${circleSizeNum.value}%`)
const blendMode = ref('multiply')
const interactiveSizeNum = ref(20)
const interactiveSize = computed(() => `${interactiveSizeNum.value}%`)
const quadrant = ref<'center' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('bottom-left')
const gradientOpacity = ref(0.45)

// Color hex values for inputs
const bg1Hex = ref('#ffffff')
const bg2Hex = ref('#fafafa')
const color1Hex = ref('#ffffff')
const color2Hex = ref('#ffffff')
const color3Hex = ref('#ffffff')
const color4Hex = ref('#145078')  // navy: 20, 80, 120
const color5Hex = ref('#ffc832')  // yellow: 255, 200, 50
const interactiveHex = ref('#00466e')  // navy: 0, 70, 110

// Computed gradient colors object
const gradientColors = computed(() => ({
  bg1: `rgb(${hexToRgb(bg1Hex.value)})`,
  bg2: `rgb(${hexToRgb(bg2Hex.value)})`,
  color1: hexToRgb(color1Hex.value),
  color2: hexToRgb(color2Hex.value),
  color3: hexToRgb(color3Hex.value),
  color4: hexToRgb(color4Hex.value),
  color5: hexToRgb(color5Hex.value),
  interactive: hexToRgb(interactiveHex.value)
}))


</script>

