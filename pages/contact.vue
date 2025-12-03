<template>
  <h2 class="tagline">{{ hero?.tagline }}</h2>
  <form class="form | stack">
    <p class="mailto-link"><a href="mailto:hello@ccmdesign.ca">hello@ccmdesign.ca</a></p>
    <div class="switcher">
      <fieldset>
        <label for="name" class="sr-only">Name</label>
        <input id="name" v-model="contact.name" type="text" required autocomplete="name" placeholder="Name" />
      </fieldset>
      <fieldset>
        <label for="email" class="sr-only">Email</label>
        <input id="email" v-model="contact.email" type="email" required autocomplete="email" placeholder="Email" />
      </fieldset>
    </div>

    <fieldset>
      <label for="message" class="sr-only">Message</label>
      <textarea id="message" v-model="contact.message" required rows="8" placeholder="Message"></textarea>
    </fieldset>
    <fieldset class="form-actions">
      <input type="submit" :disabled="submitting" value="Send" class="button" data-variant="primary" />
    </fieldset>
    <div v-if="success" class="form-message success">Thanks for reaching out! We'll get back to you soon.</div>
    <div v-if="error" class="form-message error">Something went wrong. Please try again.</div>
  </form>
  <ccm-logo-reel class="logo-reel" />
</template>


<style scoped>
.form {
  max-width: 50svw;
  height: 50svh;
  width: 100%;
  margin-inline: auto;
  --_stack-space: var(--space-l);
  padding: var(--space-xl);
}

.mailto-link {
  color: var(--color-base);
  font-size: var(--size-1);
  font-weight: 500;
  text-align: center;
  margin-block: 0;
  margin-inline: auto;
}

fieldset {
  border: 0;
  padding: 0;
}

input,
textarea {
  width: 100%;
  padding: var(--space-l);

  &::placeholder {
    color: var(--color-base-tint-40);
  }
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
  hero: {
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})

const hero = useHeroContent()

const contact = reactive({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const success = ref(false)
const error = ref(false)


</script>
