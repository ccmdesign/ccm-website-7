# ccmTabs Component

An accessible, keyboard-navigable tabbed interface component built with Vue 3 Composition API following inclusive design principles.

## Features

- **Fully Accessible**: Implements proper ARIA semantics with `tablist`, `tab`, and `tabpanel` roles
- **Keyboard Navigation**: Arrow keys for tab switching, down arrow to focus panel content
- **Progressive Enhancement**: Works as basic links that enhance into a full tabbed interface
- **Responsive Design**: Automatically stacks tabs vertically on mobile viewports
- **Flexible Content**: Supports both direct content and Vue slots
- **Vue 3 Ready**: Built with Composition API and proper reactivity

## Props

### `tabs` (Required)
- **Type**: `Array`
- **Description**: Array of tab objects defining the tabbed interface
- **Structure**:
  ```typescript
  {
    id: string,        // Unique identifier for the tab/panel
    label: string,     // Display text for the tab
    content?: string,  // HTML content (optional if using slots)
    slot?: string      // Named slot reference (optional)
  }
  ```

### `defaultTab`
- **Type**: `Number`
- **Default**: `0`
- **Description**: Index of the initially active tab

## Events

### `tab-change`
Emitted when the active tab changes.

**Payload**:
```typescript
{
  activeTab: number,    // Index of the new active tab
  tab: object,          // The new active tab object
  previousTab: number   // Index of the previously active tab
}
```

## Slots

The component supports named slots for each tab panel. Use the tab's `id` as the slot name.

```vue
<template #section1="{ tab, index, isActive }">
  <h2>{{ tab.label }}</h2>
  <p>Custom content for tab {{ index + 1 }}</p>
</template>
```

**Slot Props**:
- `tab`: The tab object
- `index`: Tab index
- `isActive`: Boolean indicating if this is the active tab

## Basic Usage

```vue
<template>
  <ccmTabs 
    :tabs="tabs"
    @tab-change="handleTabChange"
  />
</template>

<script setup>
const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: '<p>Project overview content here.</p>'
  },
  {
    id: 'features',
    label: 'Features',
    content: '<p>Feature list and descriptions.</p>'
  },
  {
    id: 'usage',
    label: 'Usage',
    content: '<p>Usage examples and guidelines.</p>'
  }
]

const handleTabChange = (event) => {
  console.log('Tab changed:', event.activeTab)
}
</script>
```

## Advanced Usage with Slots

```vue
<template>
  <ccmTabs 
    :tabs="tabs"
    :default-tab="1"
  >
    <template #overview="{ tab }">
      <div class="overview-section">
        <h2>{{ tab.label }}</h2>
        <p>Welcome to our project overview.</p>
        <ul>
          <li>Built with Vue 3</li>
          <li>Fully accessible</li>
          <li>Mobile responsive</li>
        </ul>
      </div>
    </template>
    
    <template #features="{ isActive }">
      <div class="features-section">
        <h2>Key Features</h2>
        <div v-if="isActive" class="feature-animation">
          <!-- Animated content only when tab is active -->
        </div>
      </div>
    </template>
  </ccmTabs>
</template>

<script setup>
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'documentation', label: 'Docs', content: '<p>Documentation content</p>' }
]
</script>
```

## Keyboard Controls

- **Left/Right Arrow Keys**: Navigate between tabs
- **Down Arrow**: Move focus to the active panel content
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Tab**: Move focus to panel content (bypasses inactive tabs)
- **Shift + Tab**: Return to active tab from panel

## Accessibility Features

- **Screen Reader Support**: Proper ARIA roles and relationships
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Intelligent focus handling for better UX
- **Panel Labeling**: Each panel is labeled by its corresponding tab
- **State Announcements**: Screen readers announce tab selection and count

## Responsive Behavior

On viewports smaller than 550px:
- Tabs stack vertically
- Visual indicator (arrow) shows selected tab
- All accessibility features remain intact
- Keyboard navigation continues to work normally

## Styling

The component uses CSS custom properties for theming:

```css
.ccm-tabbed {
  --color-border: #222;
  --color-bg-active: #fff;
  --color-bg-hover: #f5f5f5;
  --color-focus: lightblue;
}
```

## Component Methods

Access component methods via template ref:

```vue
<template>
  <ccmTabs ref="tabsRef" :tabs="tabs" />
  <button @click="switchToTab(2)">Go to Tab 3</button>
</template>

<script setup>
const tabsRef = ref(null)

const switchToTab = (index) => {
  tabsRef.value?.switchTab(index)
}
</script>
```

### Available Methods

- `switchTab(index)`: Programmatically switch to a specific tab
- `activeTab`: Computed property returning the current active tab index

## Best Practices

1. **Use Meaningful Labels**: Tab labels should be descriptive and concise
2. **Limit Tab Count**: Avoid too many tabs; consider accordions for large sets
3. **Content Organization**: Group related content logically
4. **Progressive Enhancement**: Ensure content works without JavaScript
5. **Mobile Consideration**: Test the vertical layout on small screens

## When to Use

- **Related Content**: When you have multiple sections of related content
- **Space Constraints**: When you need to save vertical space
- **User Control**: When users benefit from quick switching between views

## When NOT to Use

- **Site Navigation**: Don't use for primary site navigation
- **Sequential Content**: Avoid for content that should be read in order
- **Single Content Block**: Don't use for content that doesn't need organization