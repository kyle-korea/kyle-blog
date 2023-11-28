<script setup>
import Posts from '@/components/PostsComponent.vue';
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
    <div class="flex flex-column " style="height: 100%;">
        <div class="mt-8">
            <RouterLink to="/" style="text-decoration: none; color: inherit;">
                Home
            </RouterLink>
        </div>
        <h1>
            Posts
        </h1>
        <div class="overflow-y-auto no-scroll mt-3">
            <Posts :number="Number(route.params.number)" />
        </div>
    </div>
</template>
