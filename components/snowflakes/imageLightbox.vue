<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="lightbox | lightbox-backdrop"
      @click="handleBackdropClick"
      @keydown.esc="handleClose"
    >
      <div
        class="lightbox-content imposter imposter-fixed"
        role="dialog"
        aria-modal="true"
        :aria-label="currentImage?.title || 'Image lightbox'"
        tabindex="-1"
        ref="lightboxDialog"
        @click.stop
      >
        <figure
          class="lightbox-figure"
          :data-mockup="currentImage?.mockupType || null"
        >
          <img
            :src="currentImage?.image"
            :alt="currentImage?.title || undefined"
          />
        </figure>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

type MockupType = 'editorial' | 'branding' | 'web'

interface ImageData {
  image: string
  title?: string | null
  caption?: string | null
  mockupType?: MockupType | null
}

const props = defineProps<{
  isOpen: boolean
  currentImage: ImageData | null
  currentIndex: number
  images?: ImageData[]
}>()

const emit = defineEmits<{
  close: []
  navigate: [direction: 'prev' | 'next']
}>()

const lightboxDialog = ref<HTMLDivElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)

const handleClose = () => {
  emit('close')
  // Restore focus
  if (previousActiveElement.value) {
    previousActiveElement.value.focus()
  }
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

const handlePrevious = () => {
  if (props.currentIndex > 0) {
    emit('navigate', 'prev')
  }
}

const handleNext = () => {
  if (props.images && props.currentIndex < props.images.length - 1) {
    emit('navigate', 'next')
  }
}

const handleKeyboard = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (e.key) {
    case 'Escape':
      handleClose()
      break
    case 'ArrowLeft':
      if (props.images && props.currentIndex > 0) {
        handlePrevious()
      }
      break
    case 'ArrowRight':
      if (props.images && props.currentIndex < props.images.length - 1) {
        handleNext()
      }
      break
  }
}

// Prevent body scroll when lightbox is open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Store current active element for focus restoration
    previousActiveElement.value = document.activeElement as HTMLElement
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    // Focus trap - focus the dialog
    nextTick(() => {
      if (lightboxDialog.value) {
        lightboxDialog.value.focus()
      }
    })
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
  }
})

// Keyboard event listener
onMounted(() => {
  document.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
  // Ensure body scroll is restored
  document.body.style.overflow = ''
})
</script>

<style scoped>

.lightbox {
  --_lightbox-border: 1px solid var(--color-primary-tint-10);
}
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--color-white-alpha-90, rgba(255, 255, 255, 0.9));
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-content {
  position: relative;
  background-color: var(--color-white, #fff);
  padding: 0;
  width: 80svw;
  height: fit-content;
  max-height: 90vh;
  overflow: auto;
  outline: none;
  border-radius: var(--border-radius-lg);
  border: var(--_lightbox-border);
}

.lightbox-content:focus {
}

.lightbox-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.lightbox-figure img {
  width: 100%;
  height: auto;
  display: block;
}


/* Apply mockup type styles */
.lightbox-figure[data-mockup="web"] {
  display: flex !important;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.lightbox-figure[data-mockup="web"] img {
  object-fit: contain !important;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
}

.lightbox-figure[data-mockup="branding"] img {
  width: 100%;
  height: auto;
  object-fit: contain !important;
}

.lightbox-figure[data-mockup="editorial"] img {
  object-fit: contain !important;
}
</style>

