in the @[...slug].vue the @portfolioSection.vue is working correctly, applying the mockupType on the items. 
We have 2 more intances of the @portfolioSection.vue that need to work the same way. 

1. @index.vue - Main Index
2. @index.vue  - Work Index

The similarities:
They should all render the subsets of the `work` collection following the same grid, applying styles conditionally based on `mockupType`. 

The differences:
**Main Index**: @index.vue => Only shows a subset of cards, flagged `featuredProject:true`. We need to implement that.
Right now, it only pulls the first 5 items, but we need to implement this "featuredProject" flag.
This list renders nuxt-links that take users to a specific project. 

**Work Index**: @index.vue => Only shows the covers for each project, depending on the filter selected. This logic is already implemented.
This list renders nuxt-links that take users to a specific project.

**Work Detail**: @[...slug].vue => Shows all the images listed under a single project markdown file. 
This list renders clickable images that expand in a modal. This is a lightbox effect. We should use the everylayout>imposter component.


What I want to understand now:
What is the best approach to implement this constellation of components?
I want to understand vue/nuxt best practices, component flexibility, accessibility and SEO implications (if any).
How to streamline this constellation so the pages get more robust. 

I don't need detailed code right now. We will leave that for a few steps later

