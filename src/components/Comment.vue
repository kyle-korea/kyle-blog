<template>
    <div ref="commentContainer"></div>
</template>
  
<script setup>
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToggleStore } from '@/stores/toggle';

const toggleStore = useToggleStore();
const { toggleDarKMode } = storeToRefs(toggleStore);

// Define a ref for the "commentContainer" element
const commentContainer = ref(null);

// Function to add Utterances script with the specified theme
function addUtterancesScript(theme) {
    // Remove the existing Utterances script container (if any)
    const existingContainer = document.querySelector('#utterances-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create a new container div for the script
    const utterancesContainer = document.createElement('div');
    utterancesContainer.id = 'utterances-container';

    // Create the new script element
    const utterances = document.createElement('script');
    utterances.type = 'text/javascript';
    utterances.async = true;
    utterances.crossorigin = 'anonymous';
    utterances.src = 'https://utteranc.es/client.js';
    utterances.setAttribute('issue-term', 'pathname');
    utterances.setAttribute('theme', theme);
    utterances.setAttribute('repo', 'Larshavin/Larshavin.github.io');

    // Append the script to the container
    utterancesContainer.appendChild(utterances);

    // Append the container to the "commentContainer" element
    commentContainer.value.appendChild(utterancesContainer);
}

// Call the function when the component is mounted
onMounted(() => {
    // Add the Utterances script with the initial theme
    addUtterancesScript(toggleDarKMode.value ? 'github-dark' : 'github-light');
});

// Watch for changes in the toggleDarKMode ref and update the theme accordingly
watch(toggleDarKMode, (newValue) => {
    const theme = newValue ? 'github-dark' : 'github-light';
    addUtterancesScript(theme);
});
</script>
  