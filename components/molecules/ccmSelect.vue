<template>
  <select class="ccm-select" v-model="modelValue">
    <slot />
  </select>
</template>

<script setup>

</script>

<style scoped>
.ccm-select {
  padding-block: var(--_input-padding-block);
  padding-inline: var(--_input-padding-inline);
  border-width: var(--_input-border-width);
  border-style: var(--_input-border-style);
  border-color: var(--_input-border-color);
  border-radius: var(--_input-border-radius);
  background-color: var(--_input-background-color);
  color: var(--_input-color);
  font-size: var(--_input-font-size, 100%);
  font-weight: var(--_input-font-weight, 400);
  font-family: var(--_input-font-family, var(--font-family));
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--_input-padding-inline) center;
  background-size: var(--size-1);
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  &:focus {
    border-color: var(--_input-border-color-focus);
  }
  &:hover {
    border-color: var(--_input-border-color-hover);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:invalid {
    border-color: var(--_input-border-color-invalid);
  }
}
</style>