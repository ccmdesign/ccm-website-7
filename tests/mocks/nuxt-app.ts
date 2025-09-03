// Mock for Nuxt #app imports
export const NuxtLink = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>'
}