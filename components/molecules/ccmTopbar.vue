<template>
  <div class="topbar | cluster">
    <h1 class="topbar__title">
      <slot name="logo">
        <nuxt-link to="/" data-slide-in="from-top"><img src="/assets/ccm-logo.svg" alt="CCM Design" /></nuxt-link>
      </slot>
    </h1>
    <nav>
      <ul class="menu | cluster">
        <li v-for="link in navLinks" :key="link.to">
          <nuxt-link
            class="menu__item menu-item"
            :to="link.to"
            :class="{ 'current-page': isActiveRoute(link.to) }"
            :aria-active="isActiveRoute(link.to) ? 'true' : undefined"
          >{{ link.label }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from '#imports'
import { computed } from 'vue'

const route = useRoute()
const navLinks = useNavigation()

const isActiveRoute = (linkPath) => {
  if (route.path === linkPath) return true
  // Check if current route is a subpage of the nav link
  if (route.path.startsWith(linkPath + '/')) return true
  return false
}
</script>

<style scoped>

.topbar {
  align-items: baseline;
  padding-block: var(--space-m);
}

.topbar__title {
  @media (max-width: 600px) { margin-inline: auto; }
  img { block-size: 1.5rem; }
}

nav {
  @media (max-width: 600px) { margin-inline: auto; }
  @media (min-width: 600px) {
    margin-inline-start: auto;
  }
}

.menu {
  --_cluster-space: var(--space-xl);
  list-style: none;
  padding-inline: 0;
  margin-block: 0;
}

.menu li, 
.menu a {
  display: inline-block;
  padding-block: 0;
  margin-block: 0;
  line-height: 1;
}

.menu a {
  text-decoration: none;
  letter-spacing: .5px;
  font-weight: 400;
  font-family: var(--display-font);
  color: var(--color-base-tint-50);
}

.menu__item {
  color: var(--color-base);
  text-decoration: none;

  &:hover { color: var(--color-primary-tint-80); }
}

li:not(:first-child) .menu__item { padding-inline-start: var(--space-xs); }


.menu-item[aria-active="true"],
.menu-item.current-page {
  position: relative;
  
  &::after {
    transition: width 0.3s ease-in-out;
    content: '';
    width: 50%;
    height: 4px;
    background-color: var(--color-accent);
    position: absolute;
    bottom: -8px;
    left: 0;
  }
}

</style>
