<template>
    <div>
        <div>
            {{ options }}
        </div>
        <div>
            {{ tocItems }}
        </div>
        <div v-html="renderedContent"></div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';
import fm from 'front-matter';

const renderedContent = ref();
onMounted(() => {
    marked.use({ hooks });
    marked.use({ renderer });

    // Render the Markdown content
    renderedContent.value = marked(markdown);

    console.log(tocItems.value);
});

// The Markdown content with headings
const markdown = `
---
title: Just hack'n
description: Nothing to see here
---

  # Heading 1
  ## Subheading 1.1
  ## Subheading 1.2
  ### Sub-subheading 1.2.1
  # Heading 2
  ## Subheading 2.1
  \`<template>\` 쪽을 살펴봅시다. 
`.trim()

const options = ref()
// Override function
const hooks = {
    preprocess(markdown) {
        const data = fm(markdown);
        options.value = data.attributes;
        return data.body;
    }
};

const tocItems = ref([]);
const renderer = (() => {
    var renderer = new marked.Renderer();
    renderer.heading = function (text, level, raw) {
        var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
        tocItems.value.push({
            anchor: anchor,
            level: level,
            text: text
        });
        return '<h'
            + level
            + ' id="'
            + anchor
            + '">'
            + text
            + '</h'
            + level
            + '>'
    };
    return renderer;
})();

</script>

<style>
/* Your component's styles here */
</style>
