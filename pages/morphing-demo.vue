<script setup lang="ts">
definePageMeta({
  layout: false
})

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
const blurAmount = ref(40)
const circleSizeNum = ref(80)
const circleSize = computed(() => `${circleSizeNum.value}%`)
const blendMode = ref('hard-light')
const interactiveSizeNum = ref(20)
const interactiveSize = computed(() => `${interactiveSizeNum.value}%`)
const quadrant = ref<'center' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('center')
const gradientOpacity = ref(1)

const defaultColors = {
  bg1: 'rgb(108, 0, 162)',
  bg2: 'rgb(0, 17, 82)',
  color1: '18, 113, 255',
  color2: '221, 74, 255',
  color3: '100, 220, 255',
  color4: '200, 50, 50',
  color5: '180, 180, 50',
  interactive: '140, 100, 255'
}

const oceanColors = {
  bg1: 'rgb(0, 40, 70)',
  bg2: 'rgb(0, 20, 40)',
  color1: '0, 150, 200',
  color2: '0, 200, 180',
  color3: '100, 220, 255',
  color4: '0, 100, 150',
  color5: '50, 180, 200',
  interactive: '0, 255, 200'
}

const sunsetColors = {
  bg1: 'rgb(50, 20, 60)',
  bg2: 'rgb(20, 10, 30)',
  color1: '255, 100, 50',
  color2: '255, 50, 100',
  color3: '255, 180, 50',
  color4: '200, 50, 100',
  color5: '255, 150, 100',
  interactive: '255, 200, 100'
}

const forestColors = {
  bg1: 'rgb(10, 40, 20)',
  bg2: 'rgb(5, 20, 10)',
  color1: '50, 200, 100',
  color2: '100, 180, 50',
  color3: '150, 220, 100',
  color4: '80, 150, 80',
  color5: '120, 200, 80',
  interactive: '100, 255, 150'
}

const activeColors = ref(defaultColors)

// Color hex values for inputs
const bg1Hex = computed({
  get: () => rgbStringToHex(activeColors.value.bg1 || 'rgb(108, 0, 162)'),
  set: (val) => {
    activeColors.value = { ...activeColors.value, bg1: `rgb(${hexToRgb(val)})` }
  }
})

const bg2Hex = computed({
  get: () => rgbStringToHex(activeColors.value.bg2 || 'rgb(0, 17, 82)'),
  set: (val) => {
    activeColors.value = { ...activeColors.value, bg2: `rgb(${hexToRgb(val)})` }
  }
})

const color1Hex = computed({
  get: () => '#' + activeColors.value.color1?.split(',').map(x => parseInt(x.trim()).toString(16).padStart(2, '0')).join('') || '#1271ff',
  set: (val) => {
    activeColors.value = { ...activeColors.value, color1: hexToRgb(val) }
  }
})

const color2Hex = computed({
  get: () => '#' + activeColors.value.color2?.split(',').map(x => parseInt(x.trim()).toString(16).padStart(2, '0')).join('') || '#dd4aff',
  set: (val) => {
    activeColors.value = { ...activeColors.value, color2: hexToRgb(val) }
  }
})

const color3Hex = computed({
  get: () => '#' + activeColors.value.color3?.split(',').map(x => parseInt(x.trim()).toString(16).padStart(2, '0')).join('') || '#64dcff',
  set: (val) => {
    activeColors.value = { ...activeColors.value, color3: hexToRgb(val) }
  }
})

const color4Hex = computed({
  get: () => '#' + activeColors.value.color4?.split(',').map(x => parseInt(x.trim()).toString(16).padStart(2, '0')).join('') || '#c83232',
  set: (val) => {
    activeColors.value = { ...activeColors.value, color4: hexToRgb(val) }
  }
})

const color5Hex = computed({
  get: () => '#' + activeColors.value.color5?.split(',').map(x => parseInt(x.trim()).toString(16).padStart(2, '0')).join('') || '#b4b432',
  set: (val) => {
    activeColors.value = { ...activeColors.value, color5: hexToRgb(val) }
  }
})

const interactiveHex = computed({
  get: () => '#' + activeColors.value.interactive?.split(',').map(x => parseInt(x.trim()).toString(16).padStart(2, '0')).join('') || '#8c64ff',
  set: (val) => {
    activeColors.value = { ...activeColors.value, interactive: hexToRgb(val) }
  }
})

function setTheme(theme: string) {
  switch (theme) {
    case 'ocean':
      activeColors.value = oceanColors
      break
    case 'sunset':
      activeColors.value = sunsetColors
      break
    case 'forest':
      activeColors.value = forestColors
      break
    default:
      activeColors.value = defaultColors
  }
}

// Copy current config to clipboard
function copyConfig() {
  const config = `const gradientColors = {
  bg1: '${activeColors.value.bg1}',
  bg2: '${activeColors.value.bg2}',
  color1: '${activeColors.value.color1}',
  color2: '${activeColors.value.color2}',
  color3: '${activeColors.value.color3}',
  color4: '${activeColors.value.color4}',
  color5: '${activeColors.value.color5}',
  interactive: '${activeColors.value.interactive}'
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
</script>

<template>
  <div class="demo-page">
    <MorphingGradient 
      :colors="activeColors" 
      class="gradient-container"
      :blend-mode="blendMode"
      :blur-amount="blurAmount"
      :circle-size="circleSize"
      :interactive-size="interactiveSize"
      :quadrant="quadrant"
      :opacity="gradientOpacity"
    >
      <div class="demo-content">
        <h1>Morphing Gradient</h1>
        <p>Move your mouse around to interact</p>
        
        <div class="theme-buttons">
          <button @click="setTheme('default')">Default</button>
          <button @click="setTheme('ocean')">Ocean</button>
          <button @click="setTheme('sunset')">Sunset</button>
          <button @click="setTheme('forest')">Forest</button>
        </div>
      </div>
    </MorphingGradient>

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
          <label>Color 1</label>
          <input type="color" v-model="color1Hex" />
        </div>

        <div class="control-group">
          <label>Color 2</label>
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
  </div>
</template>

<style scoped>
.demo-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.gradient-container {
  width: 100%;
  height: 100%;
}

.demo-content {
  text-align: center;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.demo-content h1 {
  font-size: clamp(2rem, 8vw, 5rem);
  margin: 0 0 0.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.demo-content p {
  font-size: clamp(1rem, 2vw, 1.5rem);
  opacity: 0.8;
  margin: 0 0 2rem;
}

.theme-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.theme-buttons button {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.theme-buttons button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
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

