<template>
  <section class="ccm-cta-section">
    <form
      class="form | stack"
      @submit.prevent="handleSubmit"
    >
      <input
        v-model="email"
        type="email"
        name="EMAIL"
        placeholder="Email"
        required
        :disabled="subscribed"
        :class="{ subscribed }"
      />
      <div class="button-container">
        <input
          type="submit"
          name="subscribe"
          :value="subscribed ? 'Subscribed' : 'Subscribe'"
          class="button"
          variant="primary"
          data-size="s"
          :disabled="subscribed"
        />
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const subscribed = ref(false)

async function handleSubmit() {
  if (!email.value || subscribed.value) return

  const url = `https://claudiomendonca.us2.list-manage.com/subscribe/post-json?u=468ffb5e21f0082332ecdd5f3&id=eaa305764b&f_id=0074d8e3f0&EMAIL=${encodeURIComponent(email.value)}&c=callback`

  // JSONP approach for cross-origin Mailchimp requests
  const callbackName = `mc_callback_${Date.now()}`

  window[callbackName] = () => {
    subscribed.value = true
    email.value = 'Subscribed'
    delete window[callbackName]
    document.body.removeChild(script)
  }

  const script = document.createElement('script')
  script.src = url.replace('c=callback', `c=${callbackName}`)
  document.body.appendChild(script)
}
</script>

<style lang="scss" scoped>

.ccm-cta-section {
  text-align: right;
  padding-top: var(--space-3xl);

  .stack {
    align-items: flex-end;
  }

  
}

</style>