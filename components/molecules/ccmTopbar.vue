<template>
  <div class="topbar | cluster">
    <h1 class="topbar__title">
      <slot name="logo">
        <nuxt-link to="/"><img src="/assets/ccm-logo.svg" alt="CCM Design" /></nuxt-link>
      </slot>
    </h1>
    <nav class="margin-left:auto">
      <ul class="menu | cluster">
        <li v-for="link in navLinks" :key="link.to">
          <nuxt-link
            class="menu__item"
            :to="link.to"
            :aria-current="route.path === link.to ? 'page' : undefined"
          >{{ link.label }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from '#imports'

const route = useRoute()
const navLinks = [
  { to: '/services', label: 'What we do' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
]
</script>

<style scoped>

.topbar {
  align-items: baseline;
  padding-block: var(--space-m);
}

.topbar__title {
  img {
    block-size: 1.5rem;
  }

  * { text-decoration: none; }
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

  &:hover { text-decoration: underline; }
}

.menu__item[aria-current="page"] {
  color: var(--color-accent);
}

li:not(:first-child) .menu__item { padding-inline-start: var(--space-xs); }
</style>
