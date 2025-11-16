<template>
  <footer class="ccm-footer" :background-color="backgroundColor" :size="size">
    <div class="ccm-footer-container | master-grid-columns">
      <nav class="footer-nav">
        <ul class="footer-menu | cluster">
          <li v-for="link in navLinks" :key="link.to">
            <nuxt-link
              class="footer-menu__item"
              :to="link.to"
              :aria-current="route.path === link.to ? 'page' : undefined"
            >{{ link.label }}</nuxt-link>
          </li>
        </ul>
      </nav>
      <ccm-by-line />
    </div>
  </footer>
</template>

<script setup>
import { useRoute, useRouter } from '#imports'

const route = useRoute()
const router = useRouter()

// Define the same navigation items as topbar (duplicated logic for independent evolution)
const topbarNavLinks = [
  { to: '/services', label: 'What we do' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
]

// Get all routes from router and filter to only show topbar items
const allRoutes = router.getRoutes()
const navLinks = computed(() => {
  return topbarNavLinks.filter(link => {
    // Check if the route exists in the router
    return allRoutes.some(route => route.path === link.to)
  })
})

const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'transparent'
  },
  size: {
    type: String,
    default: 'l'
  }
})

</script>

<style scoped>
.ccm-footer {
  --_ccm-footer-padding-block: var(--space-l);
  --_ccm-footer-padding-top: var(--space-2xl);
  --_ccm-footer-background-color: var(--color-primary-tint-20);
}

.ccm-footer {
  padding-block: var(--_ccm-footer-padding-block);
  padding-top: var(--_ccm-footer-padding-top);
  background-color: var(--_ccm-footer-background-color);
}

.ccm-footer[size="xs"]  { --_ccm-footer-padding-block: var(--space-xs);  }
.ccm-footer[size="s"]   { --_ccm-footer-padding-block: var(--space-s);   }
.ccm-footer[size="m"]   { --_ccm-footer-padding-block: var(--space-m);   }
.ccm-footer[size="l"]   { --_ccm-footer-padding-block: var(--space-l);   }
.ccm-footer[size="xl"]  { --_ccm-footer-padding-block: var(--space-xl);  }
.ccm-footer[size="2xl"] { --_ccm-footer-padding-block: var(--space-2xl); }
.ccm-footer[size="3xl"] { --_ccm-footer-padding-block: var(--space-3xl); }

.ccm-footer-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  align-items: center;
}

.footer-nav {
  width: 100%;
}

.footer-menu {
  --_cluster-space: var(--space-xl);

  list-style: none;
  padding-inline: 0;
  margin-block: 0;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-menu li, 
.footer-menu a {
  display: inline-block;
  padding-block: 0;
  margin-block: 0;
  line-height: 1;
}

.footer-menu__item {
  color: var(--color-base);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: .5px;
  font-weight: 400;

  &:hover { text-decoration: underline; }
}

.footer-menu__item[aria-current="page"] {
  color: var(--color-accent);
}

li:not(:first-child) .footer-menu__item { padding-inline-start: var(--space-xs); }

</style>