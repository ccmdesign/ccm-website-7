<script setup lang="ts">
definePageMeta({
  layout: false
})

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
</script>

<template>
  <div class="demo-page">
    <MorphingGradient :colors="activeColors" class="gradient-container">
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
</style>

