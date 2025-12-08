<template>
  <div class="fabric-demo">
    <ClientOnly>
      <TresCanvas>
        <TresOrthographicCamera :position="[0, 0, 1]" />
        <FabricMeshGradient
          :color-primary="colorPrimary"
          :color-secondary="colorSecondary"
          :color-accent="colorAccent"
          :speed="speed"
          :mesh-intensity="meshIntensity"
          :light-intensity="lightIntensity"
          :light-position="lightPosition"
          :enable-mouse-interaction="enableMouse"
        />
      </TresCanvas>
    </ClientOnly>

    <div class="controls">
      <h2>Fabric Mesh Controls</h2>
      
      <div class="control-group">
        <label>Primary Color</label>
        <input type="color" v-model="colorPrimary" />
        <span>{{ colorPrimary }}</span>
      </div>

      <div class="control-group">
        <label>Secondary Color</label>
        <input type="color" v-model="colorSecondary" />
        <span>{{ colorSecondary }}</span>
      </div>

      <div class="control-group">
        <label>Accent Color</label>
        <input type="color" v-model="colorAccent" />
        <span>{{ colorAccent }}</span>
      </div>

      <div class="control-group">
        <label>Speed: {{ speed.toFixed(2) }}</label>
        <input type="range" v-model.number="speed" min="0" max="2" step="0.05" />
      </div>

      <div class="control-group">
        <label>Mesh Intensity: {{ meshIntensity.toFixed(2) }}</label>
        <input type="range" v-model.number="meshIntensity" min="0.1" max="3" step="0.1" />
      </div>

      <div class="control-group">
        <label>Light Intensity: {{ lightIntensity.toFixed(2) }}</label>
        <input type="range" v-model.number="lightIntensity" min="0.5" max="3" step="0.1" />
      </div>

      <div class="control-group">
        <label>Light X: {{ lightPosition.x.toFixed(2) }}</label>
        <input type="range" v-model.number="lightPosition.x" min="-1" max="2" step="0.05" />
      </div>

      <div class="control-group">
        <label>Light Y: {{ lightPosition.y.toFixed(2) }}</label>
        <input type="range" v-model.number="lightPosition.y" min="-1" max="2" step="0.05" />
      </div>

      <div class="control-group">
        <label>Light Z: {{ lightPosition.z.toFixed(2) }}</label>
        <input type="range" v-model.number="lightPosition.z" min="0.1" max="3" step="0.1" />
      </div>

      <div class="control-group checkbox">
        <label>
          <input type="checkbox" v-model="enableMouse" />
          Mouse Interaction
        </label>
      </div>

      <div class="presets">
        <h3>Presets</h3>
        <button @click="applyPreset('silk')">Silk</button>
        <button @click="applyPreset('velvet')">Velvet</button>
        <button @click="applyPreset('ocean')">Ocean</button>
        <button @click="applyPreset('sunset')">Sunset</button>
        <button @click="applyPreset('midnight')">Midnight</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TresCanvas } from '@tresjs/core'

const colorPrimary = ref('#1a1a2e')
const colorSecondary = ref('#16213e')
const colorAccent = ref('#e94560')
const speed = ref(0.4)
const meshIntensity = ref(1.0)
const lightIntensity = ref(1.2)
const lightPosition = reactive({ x: 0.5, y: 0.5, z: 1.0 })
const enableMouse = ref(true)

const presets = {
  silk: {
    colorPrimary: '#2d1b4e',
    colorSecondary: '#4a2c7c',
    colorAccent: '#d4af37',
    speed: 0.3,
    meshIntensity: 0.8,
    lightIntensity: 1.5,
    lightPosition: { x: 0.7, y: 0.3, z: 1.2 }
  },
  velvet: {
    colorPrimary: '#1a0a0a',
    colorSecondary: '#4a1c1c',
    colorAccent: '#8b0000',
    speed: 0.2,
    meshIntensity: 1.5,
    lightIntensity: 1.0,
    lightPosition: { x: 0.3, y: 0.7, z: 0.8 }
  },
  ocean: {
    colorPrimary: '#0a192f',
    colorSecondary: '#172a45',
    colorAccent: '#64ffda',
    speed: 0.5,
    meshIntensity: 1.2,
    lightIntensity: 1.3,
    lightPosition: { x: 0.5, y: 0.2, z: 1.5 }
  },
  sunset: {
    colorPrimary: '#2d1f3d',
    colorSecondary: '#553c5a',
    colorAccent: '#ff6b6b',
    speed: 0.35,
    meshIntensity: 1.0,
    lightIntensity: 1.4,
    lightPosition: { x: 0.8, y: 0.6, z: 1.0 }
  },
  midnight: {
    colorPrimary: '#0d0d1a',
    colorSecondary: '#1a1a33',
    colorAccent: '#6366f1',
    speed: 0.25,
    meshIntensity: 1.3,
    lightIntensity: 1.1,
    lightPosition: { x: 0.4, y: 0.4, z: 1.3 }
  }
}

function applyPreset(name: keyof typeof presets) {
  const preset = presets[name]
  colorPrimary.value = preset.colorPrimary
  colorSecondary.value = preset.colorSecondary
  colorAccent.value = preset.colorAccent
  speed.value = preset.speed
  meshIntensity.value = preset.meshIntensity
  lightIntensity.value = preset.lightIntensity
  lightPosition.x = preset.lightPosition.x
  lightPosition.y = preset.lightPosition.y
  lightPosition.z = preset.lightPosition.z
}
</script>

<style scoped>
.fabric-demo {
  position: fixed;
  inset: 0;
  background: #000;
}

.fabric-demo canvas {
  width: 100% !important;
  height: 100% !important;
}

.controls {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 12px;
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  width: 280px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.controls h2 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.controls h3 {
  margin: 20px 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
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
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.control-group input[type="range"] {
  width: 100%;
  accent-color: #e94560;
}

.control-group input[type="color"] {
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
}

.control-group span {
  font-family: monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
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
  accent-color: #e94560;
}

.presets {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.presets button {
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.presets button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>


