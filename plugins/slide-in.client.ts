export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  // Intersection Observer options
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1, // Trigger when 10% of element is visible
  }

  // Observer callback
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-in-active')
        // Unobserve after animation triggers to improve performance
        observer.unobserve(entry.target)
      }
    })
  }

  // Create observer
  const observer = new IntersectionObserver(handleIntersection, observerOptions)

  // Observe all elements with data-slide-in attribute
  const observeElements = () => {
    const elements = document.querySelectorAll('[data-slide-in]')
    elements.forEach((el) => {
      observer.observe(el)
    })
  }

  // Initial observation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements)
  } else {
    observeElements()
  }

  // Observe dynamically added elements
  const mutationObserver = new MutationObserver(() => {
    const elements = document.querySelectorAll('[data-slide-in]:not(.slide-in-active)')
    elements.forEach((el) => {
      observer.observe(el)
    })
  })

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

