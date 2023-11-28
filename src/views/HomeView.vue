<script setup>
import { ref } from 'vue';
import Profile from '@/components/ProfileComponent.vue';
import Posts from '@/components/PostsComponent.vue';

const title = ref("I love Go and K8S");
const introduce = ref("In the realm of astronomy once, \n but now becoming a dream-chasing gopher.");
</script>

<template>
  <div class="flex flex-column " style="height: 100%;">
    <div class="">
      <Profile :title="title" :introduce="introduce" />
    </div>
    <div class="overflow-y-auto no-scroll mt-3">
      <Posts :number="1" />
    </div>
  </div>
</template>
