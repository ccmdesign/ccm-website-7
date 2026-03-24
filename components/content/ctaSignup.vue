<template>
  <section 
    class="tldr-section"
    :size="size"
    :background-color="backgroundColor"
    :foreground-color="foregroundColor"
    :style="{
      '--_prose-section-background-color': `var(--${backgroundColor})`,
      '--_prose-section-foreground-color': `var(--${foregroundColor})`,
      '--_prose-section-padding-block': `var(--space-${size})`
    }"
    >
    <h2>Signup for our newsletter</h2>
    <p>Get the latest analysis and design thinking from our team, delivered straight to your inbox. We share practical advice for organizations looking to increase their impact.</p>
    <form class="form" @submit.prevent="subscribe">
      <fieldset class="form-fieldset" inline>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          :disabled="subscribed || loading"
        />
        <input
          type="submit"
          :value="subscribed ? 'Subscribed!' : loading ? 'Subscribing...' : 'Subscribe'"
          :disabled="subscribed || loading"
        />
      </fieldset>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { useNewsletterSubscribe } from '~/composables/useNewsletterSubscribe'

const { email, subscribed, error, loading, subscribe } = useNewsletterSubscribe()

const props = defineProps({
  size: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: ''
  },
  foregroundColor: {
    type: String,
    default: 'color-base'
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.tldr-section {
  --_prose-section-padding: var(--space-m);
  --_prose-section-background-color: var(--color-accent);
  --_prose-section-foreground-color: var(--color-base);
}

.tldr-section { 
  margin-block: var(--space-xl);
  padding: var(--_prose-section-padding);
  background-color: var(--_prose-section-background-color);
  color: var(--_prose-section-foreground-color);

  box-sizing: content-box;
  margin-inline: calc(var(--_prose-section-padding) * -1);
}

</style>
