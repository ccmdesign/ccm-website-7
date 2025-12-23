<template>
  <component
    class="chip"
    :is="componentTag"
    v-bind="linkProps"
    :class="{ 'chip--active': active }"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  to?: string | null
  href?: string | null
  active?: boolean
  type?: string
}>(), {
  label: '',
  to: null,
  href: null,
  active: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const NuxtLink = resolveComponent('NuxtLink')

const isAbsolute = (url: string) => /^(https?:)?\/\//.test(url)

const componentTag = computed(() => {
  if (props.to) return NuxtLink
  if (props.href) return 'a'
  return 'button'
})

const linkProps = computed(() => {
  if (props.to) {
    const external = typeof props.to === 'string' && isAbsolute(props.to)
    return {
      to: props.to,
      external,
      target: external ? '_blank' : null,
      rel: external ? 'noopener noreferrer' : null
    }
  }
  if (props.href) {
    return {
      href: props.href,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }
  return { type: props.type }
})

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs) var(--space-l) calc(var(--space-xs) + 1px);
  border-radius: 999px;
  border: 1px solid var(--color-base-tint-10);
  background-color: var(--color-white);
  color: var(--color-base-tint-70);
  font-size: var(--size--2);
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: var(--shadow-elevation-low);
  text-transform: capitalize;
}

.chip:hover {
  box-shadow: var(--shadow-elevation-medium);
  border-color: var(--color-base-tint-20);
}

.chip--active {
  background-color: var(--color-base);
  color: var(--color-white);
  border-color: var(--color-base);
}

.chip--active:hover {
  background-color: var(--color-base-tint-80);
  border-color: var(--color-base-tint-80);
}
</style>
