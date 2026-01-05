<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useFishSimulation } from '~/composables/explorations/fish-school/useFishSimulation'
import { defaultConfig, type FishConfig, type Vector2D } from '~/composables/explorations/fish-school/types'

interface Props {
  initialConfig?: Partial<FishConfig>
  showControls?: boolean
  backgroundColor?: string
  fishColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  showControls: true,
  backgroundColor: '#0a1628',
  fishColor: 'rgba(100, 150, 200, 1)',
})

// Panel state
const panelOpen = ref(false)

// Configuration
const config = reactive<FishConfig>({
  ...defaultConfig,
  ...props.initialConfig,
})

// Canvas and mouse refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const mousePos = ref<Vector2D | null>(null)

// Use the simulation composable
const configRef = computed(() => config)
useFishSimulation(canvasRef, configRef, mousePos)

// Mouse tracking
function handleMouseMove(event: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mousePos.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function handleMouseLeave() {
  mousePos.value = null
}

// Copy current config to clipboard
function copyConfig() {
  const configStr = `const fishConfig = {
  fishCount: ${config.fishCount},
  maxSpeed: ${config.maxSpeed},
  perceptionRadius: ${config.perceptionRadius},
  separationWeight: ${config.separationWeight},
  alignmentWeight: ${config.alignmentWeight},
  cohesionWeight: ${config.cohesionWeight},
  fleeRadius: ${config.fleeRadius},
  fleeStrength: ${config.fleeStrength},
}`
  navigator.clipboard.writeText(configStr)
  alert('Config copied to clipboard!')
}
</script>

<template>
  <div class="fish-school">
    <canvas
      ref="canvasRef"
      class="fish-canvas"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    />

    <slot />

    <!-- Control Panel -->
    <div v-if="showControls" class="control-panel" :class="{ 'is-collapsed': !panelOpen }">
      <button class="panel-toggle" @click="panelOpen = !panelOpen">
        {{ panelOpen ? '✕' : '⚙' }}
      </button>

      <div class="panel-content">
        <h3>Fish School Controls</h3>

        <div class="control-group">
          <label>Fish Count: {{ config.fishCount }}</label>
          <input type="range" v-model.number="config.fishCount" min="50" max="300" />
        </div>

        <div class="control-group">
          <label>Max Speed: {{ config.maxSpeed.toFixed(1) }}</label>
          <input type="range" v-model.number="config.maxSpeed" min="1" max="6" step="0.1" />
        </div>

        <div class="control-group">
          <label>Perception Radius: {{ config.perceptionRadius }}</label>
          <input type="range" v-model.number="config.perceptionRadius" min="20" max="100" />
        </div>

        <div class="control-group">
          <label>Separation: {{ config.separationWeight.toFixed(1) }}</label>
          <input type="range" v-model.number="config.separationWeight" min="0" max="3" step="0.1" />
        </div>

        <div class="control-group">
          <label>Alignment: {{ config.alignmentWeight.toFixed(1) }}</label>
          <input type="range" v-model.number="config.alignmentWeight" min="0" max="3" step="0.1" />
        </div>

        <div class="control-group">
          <label>Cohesion: {{ config.cohesionWeight.toFixed(1) }}</label>
          <input type="range" v-model.number="config.cohesionWeight" min="0" max="3" step="0.1" />
        </div>

        <div class="control-group">
          <label>Flee Radius: {{ config.fleeRadius }}</label>
          <input type="range" v-model.number="config.fleeRadius" min="50" max="200" />
        </div>

        <div class="control-group">
          <label>Flee Strength: {{ config.fleeStrength.toFixed(1) }}</label>
          <input type="range" v-model.number="config.fleeStrength" min="0" max="5" step="0.1" />
        </div>

        <button class="copy-btn" @click="copyConfig">Copy Config</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fish-school {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fish-canvas {
  display: block;
  width: 100%;
  height: 100%;
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
