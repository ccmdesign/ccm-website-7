<template>
  <ccm-section>
      <h1 class="page-title">Contact</h1>
      <form class="form | stack" @submit.prevent="submitContact">
        <div class="form-group">
          <label for="name" class="sr-only">Name</label>
          <input id="name" v-model="contact.name" type="text" required autocomplete="name" placeholder="NAME" />
        </div>
        <div class="form-group">
          <label for="email" class="sr-only">Email</label>
          <input id="email" v-model="contact.email" type="email" required autocomplete="email" placeholder="EMAIL" />
        </div>
        <div class="form-group">
          <label for="message" class="sr-only">Message</label>
          <textarea id="message" v-model="contact.message" required rows="8" placeholder="MESSAGE"></textarea>
        </div>
        <div class="form-actions">
          <ccm-button type="submit" :disabled="submitting">{{ submitting ? 'SENDING…' : 'SEND' }}</ccm-button>
        </div>
        <div v-if="success" class="form-message success">Thanks for reaching out! We'll get back to you soon.</div>
        <div v-if="error" class="form-message error">Something went wrong. Please try again.</div>
      </form>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  hero: {
    brow: 'Contact',
    title: 'Contact',
    tagline: 'Get in touch with us',
    backgroundColor: 'color-accent',
    hideLogoReel: true,
    variant: 'minimal'
  }
})

const contact = reactive({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const success = ref(false)
const error = ref(false)

async function submitContact() {
  if (submitting.value) return
  success.value = false
  error.value = false
  submitting.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: contact
    })
    success.value = true
    contact.name = ''
    contact.email = ''
    contact.message = ''
  } catch (e) {
    error.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form {
  gap: var(--space-m);
  max-width: 800px;
  margin-inline: auto;
}

.page-title {
  text-align: center;
  margin-bottom: var(--space-xl);
  font-family: 'Caslon Doric Extended', sans-serif;
  font-size: var(--size-3);
}

.form-group {
  display: flex;
  flex-direction: column;
}


.form input,
.form textarea {
  padding: var(--space-l);
  background-color: white;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: inherit;
  font-size: var(--size-0);
  color: var(--color-base);
}

.form input::placeholder,
.form textarea::placeholder {
  color: var(--color-base-tint-50);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-family: 'Caslon Doric Extended', sans-serif;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-s);
}

.form-message {
  padding: var(--space-s);
  border-radius: var(--radius-s);
  text-align: center;
}

.form-message.success {
  background-color: var(--color-success-tint-90);
  color: var(--color-success);
}

.form-message.error {
  background-color: var(--color-error-tint-90);
  color: var(--color-error);
}
</style>