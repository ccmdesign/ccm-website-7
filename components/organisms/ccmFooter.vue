<template>
  <footer class="footer">
    <div class="footer__grid center padding-bottom:s3">
      <!-- Sections navigation -->
      <div class="footer__col stack">
        <h3 class="footer__heading">Sections</h3>
        <nav role="navigation">
          <ul class="stack footer-nav">
            <li v-for="link in navLinks" :key="link.to">
              <nuxt-link :to="link.to" class="footer-link">{{ link.label }}</nuxt-link>
            </li>
            <li><nuxt-link to="/blog" class="footer-link">Insights</nuxt-link></li>
          </ul>
        </nav>
      </div>

      <!-- About ccm.design -->
      <div class="footer__col stack">
        <h3 class="footer__heading">About ccm.design</h3>
        <p>Our team have over fifteen years of experience designing brand identities, online experiences and digital products.</p>
        <p><nuxt-link to="/about" class="button button--outline">Learn About Us</nuxt-link></p>
      </div>

      <!-- Careers -->
      <div class="footer__col stack">
        <h3 class="footer__heading">Careers</h3>
        <p>We are always on the lookout for great designers and developers who enjoy the freedom and responsibility of a fully remote team.</p>
        <p><nuxt-link to="/contact/" class="button button--outline">Apply</nuxt-link></p>
      </div>

      <!-- Let's Talk -->
      <div class="footer__col stack">
        <h3 class="footer__heading">Let's Talk</h3>
        <p>Did you like what you see? Feel free to contact us if you are starting a new project, fixing an old one, just wanna say hi.</p>
        <p><nuxt-link to="/contact/" class="button button--solid">Contact</nuxt-link></p>
      </div>
    </div>

    <!-- Site credits -->
    <div class="site-credits-bar">
      <div class="site-credits-content">
        <span>
          <nuxt-link class="by-line links" to="/terms" title="Terms of Use">Terms of Use</nuxt-link> |
          <nuxt-link class="by-line links" to="/privacy" title="Privacy Policy">Privacy</nuxt-link>
        </span>
        <nuxt-link class="by-line" href="http://ccmdesign.ca" target="_blank" rel="noreferrer" title="Website design and development by ccm.design">by ccm.design<span class="sr-only"> (opens in new tab)</span></nuxt-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRoute, useRouter, computed } from '#imports'

const route = useRoute()
const router = useRouter()

// Primary navigation links (same as top‑bar)
const topbarNavLinks = [
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

// Filter to only include routes that actually exist
const allRoutes = router.getRoutes()
const navLinks = computed(() => topbarNavLinks.filter(link => allRoutes.some(r => r.path === link.to)))

const props = defineProps({
  backgroundColor: { type: String, default: 'transparent' },
  size: { type: String, default: 'l' }
})
</script>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding-top: var(--space-2xl);
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: var(--space-m) var(--space-m) var(--space-2xl);
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.footer__heading {
  font-size: var(--font-size-l);
  margin-bottom: var(--space-xs);
  color: var(--color-base-tint-80); /* Slightly muted white */
  font-weight: bold;
}

.footer-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.footer-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

p {
  line-height: 1.5;
  color: var(--color-white);
}

.button {
  display: inline-block;
  padding: var(--space-xs) var(--space-m);
  text-decoration: none;
  font-weight: 500;
  border-radius: 4px; /* Or use a token if available */
  transition: all 0.2s ease;
  text-align: center;
  margin-top: var(--space-s);
}

.button--outline {
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  background: transparent;
}

.button--outline:hover {
  background: var(--color-accent);
  color: var(--color-primary);
}

.button--solid {
  background-color: var(--color-accent);
  color: var(--color-primary);
  border: 1px solid var(--color-accent);
}

.button--solid:hover {
  background-color: var(--color-white);
  border-color: var(--color-white);
}

.site-credits-bar {
  background-color: color-mix(in srgb, var(--color-primary) 80%, black 20%); /* Darker shade */
  padding: var(--space-s) 0;
  font-size: var(--font-size-xs);
  color: var(--color-white-alpha-50);
}

.site-credits-content {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--space-m);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-credits-content a {
  color: inherit;
  text-decoration: none;
}

.site-credits-content a:hover {
  color: var(--color-white);
}

@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: var(--space-l);
  }
  
  .site-credits-content {
    flex-direction: column;
    gap: var(--space-xs);
    text-align: center;
  }
}
</style>