<template>
  <div class="bubble-demo">
    <ClientOnly>
      <TresCanvas>
        <TresOrthographicCamera :position="[0, 0, 1]" />
        <SoapBubble
          :background-color="backgroundColor"
          :bubble-size="bubbleSize"
          :wobble-intensity="wobbleIntensity"
          :speed="speed"
          :iridescence-intensity="iridescenceIntensity"
          :enable-mouse-interaction="enableMouse"
        />
      </TresCanvas>
    </ClientOnly>

    <div class="controls">
      <h2>Soap Bubble</h2>
      
      <div class="control-group">
        <label>Background</label>
        <input type="color" v-model="backgroundColor" />
        <span>{{ backgroundColor }}</span>
      </div>

      <div class="control-group">
        <label>Bubble Size: {{ bubbleSize.toFixed(2) }}</label>
        <input type="range" v-model.number="bubbleSize" min="0.15" max="0.6" step="0.01" />
      </div>

      <div class="control-group">
        <label>Wobble: {{ wobbleIntensity.toFixed(2) }}</label>
        <input type="range" v-model.number="wobbleIntensity" min="0" max="1.5" step="0.05" />
      </div>

      <div class="control-group">
        <label>Speed: {{ speed.toFixed(2) }}</label>
        <input type="range" v-model.number="speed" min="0.1" max="1" step="0.05" />
      </div>

      <div class="control-group">
        <label>Iridescence: {{ iridescenceIntensity.toFixed(2) }}</label>
        <input type="range" v-model.number="iridescenceIntensity" min="0" max="0.5" step="0.01" />
      </div>

      <div class="control-group checkbox">
        <label>
          <input type="checkbox" v-model="enableMouse" />
          Mouse Interaction
        </label>
      </div>

      <div class="presets">
        <h3>Presets</h3>
        <button @click="applyPreset('clean')">Clean</button>
        <button @click="applyPreset('dreamy')">Dreamy</button>
        <button @click="applyPreset('playful')">Playful</button>
        <button @click="applyPreset('minimal')">Minimal</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TresCanvas } from '@tresjs/core'

const backgroundColor = ref('#fafafa')
const bubbleSize = ref(0.35)
const wobbleIntensity = ref(0.5)
const speed = ref(0.3)
const iridescenceIntensity = ref(0.15)
const enableMouse = ref(true)

const presets = {
  clean: {
    backgroundColor: '#fafafa',
    bubbleSize: 0.35,
    wobbleIntensity: 0.5,
    speed: 0.3,
    iridescenceIntensity: 0.15
  },
  dreamy: {
    backgroundColor: '#f5f5f0',
    bubbleSize: 0.45,
    wobbleIntensity: 0.7,
    speed: 0.2,
    iridescenceIntensity: 0.25
  },
  playful: {
    backgroundColor: '#ffffff',
    bubbleSize: 0.3,
    wobbleIntensity: 1.0,
    speed: 0.5,
    iridescenceIntensity: 0.2
  },
  minimal: {
    backgroundColor: '#f8f8f8',
    bubbleSize: 0.4,
    wobbleIntensity: 0.3,
    speed: 0.15,
    iridescenceIntensity: 0.08
  }
}

function applyPreset(name: keyof typeof presets) {
  const preset = presets[name]
  backgroundColor.value = preset.backgroundColor
  bubbleSize.value = preset.bubbleSize
  wobbleIntensity.value = preset.wobbleIntensity
  speed.value = preset.speed
  iridescenceIntensity.value = preset.iridescenceIntensity
}
</script>

<style scoped>
.bubble-demo {
  position: fixed;
  inset: 0;
  background: #fafafa;
}

.bubble-demo canvas {
  width: 100% !important;
  height: 100% !important;
}

.controls {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  color: #333;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  width: 260px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.controls h2 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: #111;
}

.controls h3 {
  margin: 16px 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.control-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-group label {
  color: rgba(0, 0, 0, 0.7);
  font-size: 12px;
  font-weight: 500;
}

.control-group input[type="range"] {
  width: 100%;
  accent-color: #666;
}

.control-group input[type="color"] {
  width: 100%;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.control-group span {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
}

.control-group.checkbox {
  flex-direction: row;
  align-items: center;
}

.control-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.control-group.checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #666;
}

.presets {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 12px;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.presets button {
  padding: 8px 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  color: #333;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.presets button:hover {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.2);
}
</style>


