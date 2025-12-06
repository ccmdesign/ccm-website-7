<template>
  <div class="featured-work">
    <nuxt-link :to="currentPath" class="featured-work__item">
      <div class="featured-work__image-container">
        <Transition name="slide-fade" mode="out-in">
          <div
            :key="currentIndex"
            class="featured-work__image-wrapper"
          >
            <ProjectCard 
              :image="currentImage" 
              :mockup-type="currentMockupType"
              :title="currentProject"
              :caption="currentClient"
            />
          </div>
        </Transition>
      </div>
      
      <div class="featured-work__info">
        <div class="featured-work__timer">
          <div
            :key="`timer-${currentIndex}`"
            class="featured-work__timer-line"
          />
        </div>
        <Transition name="slide-up" mode="out-in">
          <div
            :key="`info-${currentIndex}`"
            class="featured-work__info-wrapper"
          >
            <h4 class="featured-work__project">{{ currentProject }}</h4>  
            <h5 class="featured-work__client">{{ currentClient }}</h5>
          </div>
        </Transition>
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
  width: 0%;
  animation: timer-progress 6s linear forwards;
}

@keyframes timer-progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.featured-work__item {
  text-decoration: none;
}

.featured-work__image-wrapper {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  

}

/* Slide-fade transition for images */
.slide-fade-enter-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.slide-fade-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Slide-up transition for info */
.slide-up-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-up-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-up-enter-from {
  transform: translateY(30%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(30%);
  opacity: 0;
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
import ProjectCard from './ProjectCard.vue'

const { data: featuredWorkItems } = await useAsyncData('featured-work', () => {
  return queryCollection('work')
    .where('published', '=', true)
    .where('featured', '=', true)
    .order('order', 'ASC')
    .all()
})

const getWorkPath = (item: any) => {
  if (item.path) return item.path
  if (item._path) return item._path
  if (item._file) {
    const filename = item._file.replace('.md', '')
    return `/work/${filename}`
  }
  return '/work'
}

const images = computed(() => {
  if (!featuredWorkItems.value) return []
  
  return featuredWorkItems.value.map((workItem: any) => {
    // Get first cover image or first image
    const imageItems = workItem.items?.filter((item: any) => item.type === 'image') || []
    const coverImage = imageItems.find((item: any) => item.cover === true)
    const firstImage = coverImage || imageItems[0]
    
    return {
      image: firstImage?.image || '',
      mockupType: firstImage?.mockupType || 'web',
      client: workItem.client || '',
      project: workItem.title || '',
      path: getWorkPath(workItem)
    }
  }).filter((item) => item.image) // Only include items with images
})

const currentIndex = ref(0)
const currentImage = computed(() => images.value[currentIndex.value]?.image ?? '')
const currentMockupType = computed(() => images.value[currentIndex.value]?.mockupType ?? 'web')
const currentClient = computed(() => images.value[currentIndex.value]?.client ?? '')
const currentProject = computed(() => images.value[currentIndex.value]?.project ?? '')
const currentPath = computed(() => images.value[currentIndex.value]?.path ?? '/work')

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (images.value.length > 0) {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % images.value.length
    }, 6000)
  }
})

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>


