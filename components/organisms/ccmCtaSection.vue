<template>
  <section class="ccm-cta-section">
    <form class="form | stack">
      <input type="email" label="Email" placeholder="Email" />
      <div class="button-container"><input type="submit" label="Subscribe" value="Subscribe" class="button" variant="primary" data-size="s"/></div>
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