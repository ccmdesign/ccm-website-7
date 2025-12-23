<template>
  <footer class="footer">
    
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
        <p><ccm-button to="/about" color="accent" size="s">Learn About Us</ccm-button></p>
      </div>

      <!-- Careers -->
      <div class="footer__col stack">
        <h3 class="footer__heading">Careers</h3>
        <p>We are always on the lookout for great designers and developers who enjoy the freedom and responsibility of a fully remote team.</p>
        <p><ccm-button to="/contact/" color="accent" size="s">Apply</ccm-button></p>
      </div>

      <!-- Let's Talk -->
      <div class="footer__col stack">
        <h3 class="footer__heading">Let's Talk</h3>
        <p>Did you like what you see? Feel free to contact us if you are starting a new project, fixing an old one, just wanna say hi.</p>
        <p><ccm-button to="/contact/" color="accent" variant="primary" size="s">Contact</ccm-button></p>
      </div>
    

    <!-- Site credits -->
    
  </footer>
</template>



<style scoped>

.footer {
  display: grid;
  grid-template-columns: minmax(1rem, auto) 1fr minmax(1rem, auto);
  grid-template-rows: auto auto auto auto;
  grid-template-areas: ". col1 ."
                       ". col2 ."
                       ". col3 ."
                       ". col4 .";

  @media (min-width: 960px) {
    grid-template-columns: minmax(1rem, auto) repeat(12, minmax(6ch, 9ch)) minmax(1rem, auto);
    grid-template-rows: auto auto auto auto;
    grid-template-areas: ". col1 col1 col1 col2 col2 col2 col3 col3 col3 col4 col4 col4 .";
  }
}

.footer__col:first-child { grid-area: col1; }
.footer__col:nth-child(2) { grid-area: col2; }
.footer__col:nth-child(3) { grid-area: col3; }
.footer__col:last-child { grid-area: col4; }

.footer__col {
  padding-bottom: var(--space-xl);
  @media (min-width: 960px) {
    padding-inline-end: var(--space-xl);
  }
}

.footer {
  background-color: hsla(var(--hsl-primary), 0.03);
  color: var(--color-primary);
  padding-top: var(--space-2xl);
  @media (min-width: 960px) { padding-bottom: var(--space-3xl); }
}

.footer__heading {
  font-size: var(--size-0);
  margin-bottom: var(--space-xs);
  color: var(--color-primary);
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
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

p {
  line-height: 1.5;
  color: var(--color-primary);
}
</style>

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