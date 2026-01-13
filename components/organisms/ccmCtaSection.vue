<template>
  <section class="ccm-cta-section">
    <form
      action="https://claudiomendonca.us2.list-manage.com/subscribe/post?u=468ffb5e21f0082332ecdd5f3&amp;id=eaa305764b&amp;f_id=0074d8e3f0"
      method="post"
      target="_blank"
      class="form | stack"
    >
      <input
        type="email"
        name="EMAIL"
        placeholder="Email"
        required
      />
      <!-- Honeypot field to prevent bot signups -->
      <div aria-hidden="true" style="position: absolute; left: -5000px;">
        <input type="text" name="b_468ffb5e21f0082332ecdd5f3_eaa305764b" tabindex="-1" value="">
      </div>
      <div class="button-container">
        <input type="submit" name="subscribe" value="Subscribe" class="button" variant="primary" data-size="s"/>
      </div>
    </form>
  </section>
</template>

<script setup>

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