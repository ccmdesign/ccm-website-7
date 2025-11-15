<template>
  <portfolio-section class="padding-block:3xl">
    <hgroup class="project-header | stack">
      <h2 class="h5">Federalism in Crisis</h2>
      <p>Bertelsmann Foundation</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta sequi molestias, animi quisquam, commodi ad inventore similique temporibus voluptatibus ab provident, assumenda minima alias. Assumenda incidunt velit adipisci labore repellendus.</p>
    </hgroup>
  </portfolio-section>
  <portfolio-section>
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-10-11.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-24-25.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <div class="project-info portfolio-item | stack">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta sequi molestias, animi quisquam, commodi ad inventore similique temporibus voluptatibus ab provident, assumenda minima alias. Assumenda incidunt velit adipisci labore repellendus.</p>
    </div>
    <image-card image="/assets/portfolio/test.avif" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/test3.avif" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-54-55.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-60-61.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-64-65.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-82-83.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <div class="project-info portfolio-item | stack">
      <p class="h4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta sequi molestias, animi quisquam, commodi ad inventore similique temporibus voluptatibus ab provident, assumenda minima alias. Assumenda incidunt velit adipisci labore repellendus.</p>
    </div>
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-86-87.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-cover.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
    <image-card image="/assets/portfolio/bfna/bfna-federalism-in-crisis-toc.png" title="Federalism in Crisis" caption="A study of the federalism in crisis" />
  </portfolio-section>
  </template>
  
  <script setup>
  definePageMeta({
    layout: 'work-layout'
  })
  
  </script>
  
  <style scoped>

.project-header {
  grid-column: 2 / 12;
}

  .project-header {
    /* outline: 1px solid red; */
  }

  .project-info {
    /* outline: 1px solid blue; */
  }

  .image-card {
    /* outline: 1px solid green; */
  }

  .project-info {
    justify-content: center;
    p { 
      font-weight: 500;
     }
  }
  </style>