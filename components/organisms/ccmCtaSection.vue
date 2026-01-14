<template>
  <section class="ccm-cta-section">
    <form
      class="form"
      @submit.prevent="handleSubmit"
    >
      <div class="input-wrapper" :class="{ subscribed, scrambling }">
        <input
          v-model="email"
          type="email"
          name="EMAIL"
          placeholder="Email"
          required
          :disabled="subscribed"
          :class="{ subscribed, 'text-hidden': scrambling }"
        />
        <div v-if="scrambling" class="char-overlay">
          <span
            v-for="(char, i) in displayChars"
            :key="i"
            :class="{ locked: char.locked }"
          >{{ char.value }}</span>
        </div>
        <button
          type="submit"
          class="submit-icon"
          :disabled="subscribed"
          aria-label="Subscribe"
        >
          <span class="icon-wrapper">
            <span class="material-symbols-outlined icon arrow">arrow_forward</span>
            <span class="material-symbols-outlined icon check">check</span>
          </span>
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const subscribed = ref(false)
const scrambling = ref(false)
const displayChars = ref([])

// Subtle lowercase charset
const chars = 'abcdefghijklmnopqrstuvwxyz'

// Ease-out function for smooth deceleration
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

function scrambleText(target, duration = 1000) {
  scrambling.value = true
  const startText = email.value
  const startLength = startText.length
  const targetLength = target.length
  const startTime = Date.now()
  const interval = 50 // Consistent 50ms updates

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime
    const linearProgress = Math.min(elapsed / duration, 1)
    const progress = easeOutQuart(linearProgress)

    // Characters lock in with eased timing
    const lockedChars = Math.floor(progress * targetLength)

    // Length transitions smoothly
    const currentLength = Math.round(startLength + (targetLength - startLength) * progress)

    const newChars = []
    let result = ''
    for (let i = 0; i < currentLength; i++) {
      if (i < lockedChars) {
        result += target[i]
        newChars.push({ value: target[i], locked: true })
      } else {
        // 30% chance to show correct char early (subtle flicker)
        let charValue
        if (i < targetLength && Math.random() < 0.3) {
          charValue = target[i]
        } else {
          charValue = chars[Math.floor(Math.random() * chars.length)]
        }
        result += charValue
        newChars.push({ value: charValue, locked: false })
      }
    }

    displayChars.value = newChars
    email.value = result

    if (linearProgress >= 1) {
      clearInterval(timer)
      email.value = target
      scrambling.value = false
      displayChars.value = []
    }
  }, interval)
}

async function handleSubmit() {
  if (!email.value || subscribed.value) return

  const url = `https://claudiomendonca.us2.list-manage.com/subscribe/post-json?u=468ffb5e21f0082332ecdd5f3&id=eaa305764b&f_id=0074d8e3f0&EMAIL=${encodeURIComponent(email.value)}&c=callback`

  const callbackName = `mc_callback_${Date.now()}`

  window[callbackName] = () => {
    subscribed.value = true
    scrambleText('Subscribed')
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

  .form {
    display: flex;
    justify-content: flex-end;
  }

  .input-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  input[type="email"] {
    padding-right: 2.5rem;
    transition: opacity 0.3s ease;

    &.subscribed {
      opacity: 0.7;
    }

    &.text-hidden {
      color: transparent;
    }
  }

  .char-overlay {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: var(--space-xs);
    pointer-events: none;
    font-family: inherit;
    font-size: inherit;
    letter-spacing: inherit;

    span {
      display: inline-block;
      transform: translateY(-12px);
      opacity: 0.5;
      transition:
        transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &.locked {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  .submit-icon {
    position: absolute;
    right: 0;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    opacity: 0.6;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      opacity: 1;
    }

    &:disabled {
      cursor: default;
    }
  }

  .icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  .icon {
    position: absolute;
    font-size: 1.25rem;
    transition:
      opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .check {
    opacity: 0;
    transform: scale(0.8);
  }

  .input-wrapper.subscribed {
    .arrow {
      opacity: 0;
      transform: translateX(0.25rem);
    }

    .check {
      opacity: 1;
      transform: scale(1);
    }

    .submit-icon {
      opacity: 1;
    }
  }
}

</style>