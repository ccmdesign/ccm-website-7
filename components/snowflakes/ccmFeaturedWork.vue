<template>
  <div class="featured-work">
    <nuxt-link :to="currentPath" class="featured-work__item">
      <div class="featured-work__image-container">
        <AnimatePresence mode="wait">
          <Motion
            :key="currentIndex"
            :initial="{ x: '100%', opacity: 0 }"
            :animate="{ x: 0, opacity: 1 }"
            :exit="{ x: '100%', opacity: 0 }"
            :transition="{ duration: .5, ease: 'easeInOut' }"
            class="featured-work__image-wrapper"
          >
            <img 
              :src="currentImage" 
              :data-mockup="currentMockupType"
              alt="Featured work"
            />
          </Motion>
        </AnimatePresence>
      </div>
      
      <div class="featured-work__info">
        <div class="featured-work__timer">
          <Motion
            :key="`timer-${currentIndex}`"
            :initial="{ width: '0%' }"
            :animate="{ width: '100%' }"
            :transition="{ duration: 6, ease: 'linear' }"
            class="featured-work__timer-line"
          />
        </div>
        <AnimatePresence mode="wait">
          <Motion
            :key="`info-${currentIndex}`"
            :initial="{ y: '30%', opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :exit="{ y: '30%', opacity: 0 }"
            :transition="{ duration: 0.3, ease: 'easeInOut' }"
            class="featured-work__info-wrapper"
          >
          <h4 class="featured-work__project">{{ currentProject }}</h4>  
          <h5 class="featured-work__client">{{ currentClient }}</h5>
            
          </Motion>
        </AnimatePresence>
      </div>

    </nuxt-link>
  </div>
</template>

<style scoped>
.featured-work {
  display: flex;
  flex-direction: column;
}

.featured-work__image-container {
  overflow: hidden;
  padding: var(--space-l);
  padding-inline: var(--system-padding-edge);
}

.featured-work__info {
  position: relative;
  padding-inline: var(--system-padding-edge);
}

.featured-work__timer {
  width: 50%;
  height: 2px;
  background: var(--color-base-tint-05);
  margin-block: var(--space-s);
}

.featured-work__timer-line {
  height: 100%;
  background: var(--color-accent);
}

.featured-work__item {
  text-decoration: none;
}

.featured-work__image-wrapper {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  
  
  img {
    width: 100%;
    object-fit: contain;
    display: block;
    
    &:not([data-mockup="editorial"]) {
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
    }

    &[data-mockup="editorial"] {
      transform: scale(1.27);
    }
  }
}

.featured-work__project {
  font-size: var(--size--1);
  font-weight: 600;
}

.featured-work__client {
  font-size: var(--size--1);
  font-weight: 200;
  opacity: 0.6;
}

</style>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'

const images = [
  { 
    image: '/assets/portfolio/bfna/bfna-federalism-in-crisis-24-25.png', 
    mockupType: 'editorial',
    client: 'Bertelsmann Foundation',
    project: 'Federalism in Crisis',
    path: '/work/bfna-federalism-in-crisis'
  },
  { 
    image: '/assets/portfolio/bfna/bfna-future-of-work-homepage.png', 
    mockupType: 'web',
    client: 'Bertelsmann Foundation',
    project: 'The Future of Work',
    path: '/work/bfna-future-of-work'
  },
  { 
    image: '/assets/portfolio/bfna/bfna-website-homepage.png', 
    mockupType: 'web',
    client: 'Bertelsmann Foundation',
    project: 'BFNA Website',
    path: '/work/bfna-website'
  }
]

const currentIndex = ref(0)
const currentImage = computed(() => images[currentIndex.value]?.image ?? '')
const currentMockupType = computed(() => images[currentIndex.value]?.mockupType ?? 'web')
const currentClient = computed(() => images[currentIndex.value]?.client ?? '')
const currentProject = computed(() => images[currentIndex.value]?.project ?? '')
const currentPath = computed(() => images[currentIndex.value]?.path ?? '/work')

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length
  }, 6000)
})

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>


