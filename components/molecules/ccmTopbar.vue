<template>
  <div class="topbar | cluster">
    <h1 class="topbar__title">
      <slot name="logo">
        <nuxt-link to="/" data-slide-in="from-top"><img src="/assets/ccm-logo.svg" alt="CCM Design" /></nuxt-link>
      </slot>
    </h1>
    <nav>
      <ul class="menu | cluster">
        <li v-for="link in navLinks" :key="link.to" data-slide-in="from-top">
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
  justify-content: center;
}

.topbar__title {
  
  /* margin-inline: auto;
  @media (min-width: 960px) {
    margin-inline-start: 0; 
  } */


  img { block-size: 1.5rem; }

  * { text-decoration: none; }
}

nav {
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
</style>
