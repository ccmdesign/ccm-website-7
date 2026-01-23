<template>
  <NuxtLayout name="homepage">
    <template #master-layout-hero>
      <ccm-hero
        v-if="hero"
        :brow="hero.brow"
        :title="hero.title"
        :tagline="hero.tagline"
        :background-color="hero.backgroundColor || 'transparent'"
        :size="hero.size || 'l'"
        :hide-bottom="hero.hideBottom !== undefined ? hero.hideBottom : true"
        :variant="hero.variant || 'default'"
      />
    </template>

    <template #master-layout-main>
      <form class="form | stack" @submit.prevent="handleSubmit" action="https://formspree.io/f/mnnarojy" method="POST">
    
    <div class="form-content">
      <div class="stack">
        <fieldset data-slide-in="from-top">
          <label for="name" class="sr-only">Name</label>
          <input id="name" v-model="contact.name" type="text" name="name" required autocomplete="name" placeholder="Name" />
        </fieldset>
        <fieldset data-slide-in="from-top">
          <label for="email" class="sr-only">Email</label>
          <input id="email" v-model="contact.email" type="email" name="email" required autocomplete="email" placeholder="Email" />
        </fieldset>
        <p class="mailto-link" data-slide-in="from-top"><a href="mailto:hello@ccmdesign.ca">hello@ccmdesign.ca</a></p>
      </div>

    <fieldset data-slide-in="from-top">
      <label for="message" class="sr-only">Message</label>
      <textarea id="message" v-model="contact.message" name="message" required rows="8" placeholder="Message"></textarea>
    </fieldset>
    </div>  
    <fieldset class="form-actions">
      <ccm-button type="submit" :disabled="submitting" variant="primary">Send</ccm-button>
    </fieldset>
    <div v-if="success" class="form-message success" role="status" aria-live="polite">Thanks for reaching out! We'll get back to you soon.</div>
    <div v-if="error" class="form-message error" role="alert" aria-live="assertive">Something went wrong. Please try again.</div>
      </form>
    </template>
  </NuxtLayout>
</template>


<style scoped>
.form {
  max-width: 960px;
  height: 50svh;
  width: 100%;
  margin-inline: auto;
  --_stack-space: var(--space-l);
  padding: var(--space-xl);
}

.form-content {
  gap: var(--space-m);
}

@media (min-width: 800px) {
  .form-content {
    columns: 2;
  }
  
  .form-content > * { 
    height: 100%;
  }
}

.mailto-link {
  color: var(--color-base);
  font-size: var(--size-1);
  font-weight: 500;
  text-align: center;
  margin-block-start: auto;
}

fieldset {
  border: 0;
  padding: 0;
}

input,
textarea {
  width: 100%;
  padding: var(--space-l);
}

input::placeholder,
textarea::placeholder {
  color: var(--color-base-tint-40);
}

textarea {
  height: 400px;
}

.form-actions {
  text-align: right;
  
}
.button {
  width: auto;
}


</style>

<script setup>
definePageMeta({
  layout: false,
  hero: {
    brow: 'Contact',
    title: 'Get in Touch',
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})

const hero = useHeroContent()

const config = useRuntimeConfig()
useSeoMeta({
  title: `Contact - ${config.public.siteName}`,
  description: 'Get in touch with CCM Design. We use design, data, and emerging tech to help our clients stay clear and connected as the world changes.',
  ogTitle: `Contact - ${config.public.siteName}`,
  ogDescription: 'Get in touch with CCM Design. We use design, data, and emerging tech to help our clients stay clear and connected as the world changes.',
  ogUrl: `${config.public.siteUrl}/contact`,
  ogType: 'website',
  twitterCard: 'summary'
})

const contact = reactive({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const success = ref(false)
const error = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  success.value = false
  error.value = false

  try {
    const response = await fetch('https://formspree.io/f/mnnarojy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: contact.name,
        email: contact.email,
        message: contact.message
      })
    })

    if (response.ok) {
      success.value = true
      contact.name = ''
      contact.email = ''
      contact.message = ''
    } else {
      error.value = true
    }
  } catch (err) {
    error.value = true
  } finally {
    submitting.value = false
  }
}

</script>
