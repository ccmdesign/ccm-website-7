<template>
  <main class="layout">
    <ccm-topbar class="topbar" />
    <slot />
  </main>
</template>

<style>

.layout {
  min-block-size: 100svh;
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  justify-content: space-between;
}

.topbar {
  padding-inline: var(--system-padding-edge);
  padding-block-start: var(--space-m);
  @media (min-width: 960px) {
    padding-block-start: var(--system-padding-edge);
  }
}
</style>