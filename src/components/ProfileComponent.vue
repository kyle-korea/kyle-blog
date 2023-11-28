<template>
    <div class="profile">
        <h1 class="mb-3">
            {{ props.title }}
        </h1>
        <div v-html="introduce" class="text-500" style="line-height:170%;"></div>
        <div class=" flex mt-4 gap-3">
            <a href="https://github.com/Larshavin" target="_blank" style="color: inherit; ">
                <i class="pi pi-github" style="font-size: 1.6rem"></i>
            </a>
            <a href="https://www.instagram.com/larshavin/" target="_blank" style="color: inherit; ">
                <i class="pi pi-instagram" style="font-size: 1.6rem"></i>
            </a>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    introduce: {
        type: String,
        required: true,
    },
})

const introduce = computed(() => {
    return props.introduce.replace(/\n/g, '<br />')
})
</script>

<style scoped>
.profile {
    /* width: 100%;
    height: 100%; */
    margin: 8rem 2rem 1rem 2rem;
}
</style>