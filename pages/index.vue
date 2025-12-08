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
  <typewriter-effect class="typewriter" :words="['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']" />
  <ccm-featured-work class="featured-work" data-slide-in="from-top" />
  <ccm-logo-reel class="logo-reel" />

  <!-- Control Panel -->
  <div class="control-panel" :class="{ 'is-collapsed': !panelOpen }">
    <button class="panel-toggle" @click="panelOpen = !panelOpen">
      {{ panelOpen ? '✕' : '⚙' }}
    </button>
    
    <div class="panel-content">
      <h3>Gradient Controls</h3>
      
      <div class="control-group">
        <label>Background 1</label>
        <input type="color" v-model="bg1Hex" />
      </div>
      
      <div class="control-group">
        <label>Background 2</label>
        <input type="color" v-model="bg2Hex" />
      </div>

      <div class="control-group">
        <label>Color 1 (Yellow)</label>
        <input type="color" v-model="color1Hex" />
      </div>

      <div class="control-group">
        <label>Color 2 (Navy)</label>
        <input type="color" v-model="color2Hex" />
      </div>

      <div class="control-group">
        <label>Color 3</label>
        <input type="color" v-model="color3Hex" />
      </div>

      <div class="control-group">
        <label>Color 4</label>
        <input type="color" v-model="color4Hex" />
      </div>

      <div class="control-group">
        <label>Color 5</label>
        <input type="color" v-model="color5Hex" />
      </div>

      <div class="control-group">
        <label>Interactive</label>
        <input type="color" v-model="interactiveHex" />
      </div>

      <div class="control-group">
        <label>Blur: {{ blurAmount }}px</label>
        <input type="range" v-model.number="blurAmount" min="0" max="100" />
      </div>

      <div class="control-group">
        <label>Circle Size: {{ circleSize }}</label>
        <input type="range" v-model.number="circleSizeNum" min="20" max="200" />
      </div>

      <div class="control-group">
        <label>Blend Mode</label>
        <select v-model="blendMode">
          <option value="normal">normal</option>
          <option value="multiply">multiply</option>
          <option value="screen">screen</option>
          <option value="overlay">overlay</option>
          <option value="hard-light">hard-light</option>
          <option value="soft-light">soft-light</option>
          <option value="color-dodge">color-dodge</option>
          <option value="color-burn">color-burn</option>
          <option value="difference">difference</option>
          <option value="exclusion">exclusion</option>
        </select>
      </div>

      <div class="control-group">
        <label>Interactive Size: {{ interactiveSize }}</label>
        <input type="range" v-model.number="interactiveSizeNum" min="10" max="150" />
      </div>

      <div class="control-group">
        <label>Quadrant</label>
        <select v-model="quadrant">
          <option value="center">Center</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
        </select>
      </div>

      <div class="control-group">
        <label>Opacity: {{ Math.round(gradientOpacity * 100) }}%</label>
        <input type="range" v-model.number="gradientOpacity" min="0" max="1" step="0.05" />
      </div>

      <button class="copy-btn" @click="copyConfig">Copy Config</button>
    </div>
  </div>
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

.logo-reel {
  padding-inline: var(--system-padding-edge);
  padding-block-end: var(--space-xl);
  mix-blend-mode: multiply;
}

/* Control Panel */
.control-panel {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 9999;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
}

.panel-toggle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, background 0.2s;
}

.panel-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.05);
}

.panel-content {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 260px;
  max-height: 70vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: opacity 0.2s, transform 0.2s;
}

.control-panel.is-collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px) scale(0.95);
}

.panel-content h3 {
  margin: 0 0 1rem;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.control-group {
  margin-bottom: 0.75rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.25rem;
  color: #666;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-group input[type="color"] {
  width: 100%;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  appearance: none;
  cursor: pointer;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #333;
  cursor: pointer;
}

.control-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  cursor: pointer;
}

.copy-btn {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 6px;
  background: #333;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: #000;
}
</style>


<script setup lang="ts">
// Helper functions for color conversion
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

function rgbToHex(rgb: string): string {
  const parts = rgb.replace(/[^\d,]/g, '').split(',').map(Number)
  if (parts.length < 3) return '#000000'
  return '#' + parts.slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbStringToHex(rgbString: string): string {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) return '#ffffff'
  return '#' + [match[1], match[2], match[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')
}

// Panel state
const panelOpen = ref(false)

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

// Copy current config to clipboard
function copyConfig() {
  const config = `const gradientColors = {
  bg1: '${gradientColors.value.bg1}',
  bg2: '${gradientColors.value.bg2}',
  color1: '${gradientColors.value.color1}',
  color2: '${gradientColors.value.color2}',
  color3: '${gradientColors.value.color3}',
  color4: '${gradientColors.value.color4}',
  color5: '${gradientColors.value.color5}',
  interactive: '${gradientColors.value.interactive}'
}

// Settings
blendMode: '${blendMode.value}'
blurAmount: ${blurAmount.value}
circleSize: '${circleSize.value}'
interactiveSize: '${interactiveSize.value}'
quadrant: '${quadrant.value}'
opacity: ${gradientOpacity.value}`
  
  navigator.clipboard.writeText(config)
  alert('Config copied to clipboard!')
}

definePageMeta({
  hero: {
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})
</script>

