<template>
  <ccm-card :to="to" :title="title" :image="imageValue">
    <span v-if="categories">{{ categories }}</span>
    <h4 v-if="brow">{{ brow }}</h4>
    <h3>{{ title }}</h3>
  </ccm-card>
</template>

<style lang="css" scoped>

</style>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  to: string
  categories?: string | null
  brow?: string | null
  title: string
  image?: boolean | string
}>(), {
  image: false
})

const imageValue = computed(() => {
  if (typeof props.image === 'boolean') {
    return props.image ? undefined : 'false'
  }
  return props.image
})
</script>

