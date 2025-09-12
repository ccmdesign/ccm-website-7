<template>
  <div class="ccm-tabbed">
    <ul 
      ref="tablistRef"
      role="tablist"
      class="ccm-tabs-list"
    >
      <li 
        v-for="(tab, index) in tabs" 
        :key="tab.id"
        role="presentation"
      >
        <a
          :ref="el => setTabRef(el, index)"
          role="tab"
          :href="`#${tab.id}`"
          :id="`tab-${tab.id}`"
          :aria-selected="activeTab === index"
          :tabindex="activeTab === index ? 0 : -1"
          class="ccm-tab"
          @click="handleTabClick($event, index)"
          @keydown="handleTabKeydown($event, index)"
        >
          {{ tab.label }}
        </a>
      </li>
    </ul>
    
    <div
      v-for="(tab, index) in tabs"
      :key="`panel-${tab.id}`"
      :ref="el => setPanelRef(el, index)"
      role="tabpanel"
      :id="tab.id"
      :aria-labelledby="`tab-${tab.id}`"
      :hidden="activeTab !== index"
      :tabindex="-1"
      class="ccm-tab-panel"
    >
      <slot 
        :name="tab.id" 
        :tab="tab"
        :index="index"
        :isActive="activeTab === index"
      >
        <div v-html="tab.content"></div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => 
      tab.id && tab.label && (tab.content || tab.slot)
    )
  },
  defaultTab: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['tab-change'])

const tablistRef = ref(null)
const tabRefs = ref([])
const panelRefs = ref([])
const activeTab = ref(props.defaultTab)

const setTabRef = (el, index) => {
  if (el) tabRefs.value[index] = el
}

const setPanelRef = (el, index) => {
  if (el) panelRefs.value[index] = el
}

const switchTab = async (newIndex) => {
  if (newIndex === activeTab.value || newIndex < 0 || newIndex >= props.tabs.length) {
    return
  }
  
  const oldIndex = activeTab.value
  activeTab.value = newIndex
  
  await nextTick()
  
  if (tabRefs.value[newIndex]) {
    tabRefs.value[newIndex].focus()
  }
  
  emit('tab-change', {
    activeTab: newIndex,
    tab: props.tabs[newIndex],
    previousTab: oldIndex
  })
}

const handleTabClick = (event, index) => {
  event.preventDefault()
  switchTab(index)
}

const handleTabKeydown = (event, index) => {
  let newIndex = null
  
  switch (event.key) {
    case 'ArrowLeft':
      newIndex = index > 0 ? index - 1 : props.tabs.length - 1
      break
    case 'ArrowRight':
      newIndex = index < props.tabs.length - 1 ? index + 1 : 0
      break
    case 'ArrowDown':
      event.preventDefault()
      if (panelRefs.value[index]) {
        panelRefs.value[index].focus()
      }
      return
    case 'Home':
      newIndex = 0
      break
    case 'End':
      newIndex = props.tabs.length - 1
      break
    default:
      return
  }
  
  if (newIndex !== null) {
    event.preventDefault()
    switchTab(newIndex)
  }
}

onMounted(() => {
  if (tabRefs.value[activeTab.value]) {
    tabRefs.value[activeTab.value].focus()
  }
})

defineExpose({
  switchTab,
  activeTab: computed(() => activeTab.value)
})
</script>

<style scoped>
.ccm-tabbed {
  max-width: 100%;
}

.ccm-tabs-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 2px solid var(--color-border, #222);
}

.ccm-tabs-list li {
  margin: 0;
}

.ccm-tab {
  display: inline-block;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  color: inherit;
  background: transparent;
  border: 2px solid var(--color-border, #222);
  border-bottom: none;
  margin-right: -2px;
  position: relative;
  transition: all 0.2s ease;
}

.ccm-tab:hover {
  background: var(--color-bg-hover, #f5f5f5);
}

.ccm-tab[aria-selected="true"] {
  background: var(--color-bg-active, #fff);
  z-index: 1;
  border-bottom: 2px solid var(--color-bg-active, #fff);
  margin-bottom: -2px;
}

.ccm-tab:focus {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--color-focus, lightblue);
}

.ccm-tab-panel {
  border: 2px solid var(--color-border, #222);
  border-top: none;
  padding: 1.5rem;
  background: var(--color-bg-active, #fff);
}

.ccm-tab-panel:focus {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--color-focus, lightblue);
}

.ccm-tab-panel * + * {
  margin-top: 0.75rem;
}

@media (max-width: 550px) {
  .ccm-tabs-list {
    flex-direction: column;
    border-bottom: none;
  }
  
  .ccm-tab {
    display: block;
    border: 2px solid var(--color-border, #222) !important;
    border-bottom: none !important;
    margin-right: 0;
    margin-bottom: 0;
  }
  
  .ccm-tabs-list li:last-child .ccm-tab {
    border-bottom: 2px solid var(--color-border, #222) !important;
  }
  
  .ccm-tab[aria-selected="true"] {
    position: relative;
    margin-bottom: 0;
    border-bottom: 2px solid var(--color-border, #222) !important;
  }
  
  .ccm-tab[aria-selected="true"]::after {
    content: '\\0020⬅';
    margin-left: 0.5rem;
  }
  
  .ccm-tab-panel {
    border-top: 2px solid var(--color-border, #222);
  }
}
</style>