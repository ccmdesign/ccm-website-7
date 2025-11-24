<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { ParsedContent } from '@nuxt/content/dist/runtime/types';

// Get the current route to access the client's slug
const route = useRoute();
const slug = route.params.slug as string;

// Fetch both the client's page data and all work projects concurrently
const { data, error } = await useAsyncData(`client-${slug}`, async () => {
  const { find: findClient } = useContent();
  const { find: findWork } = useContent();

  // Fetch the client's main page content
  const clientPage = await findClient(`/clients/${slug}`).findOne();

  // Fetch all work/project documents and filter them by the client slug
  const work = await findWork('/work').where({ 'client-slug': slug }).find();

  return { clientPage, work };
});

// Handle cases where the client page might not be found
if (error.value || !data.value?.clientPage) {
  console.error(`Client page or work not found for slug: ${slug}`, error.value);
  // You could redirect to a 404 page here
}
</script>

<template>
  <main v-if="data?.clientPage">
    <CcmHero :title="data.clientPage.title" :tagline="`Projects for ${data.clientPage.title}`" />

    <CcmBaseSection v-if="data.work && data.work.length > 0">
      <CcmFeed :items="data.work" />
    </CcmBaseSection>
    <CcmBaseSection v-else>
      <p>There are no projects for this client yet.</p>
    </CcmBaseSection>
  </main>
</template>