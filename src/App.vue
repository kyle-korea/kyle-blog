<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from './components/NavBar.vue';

import { storeToRefs } from 'pinia'
import { useToggleStore } from '@/stores/toggle'
const toggleStore = useToggleStore()
const { toggleDarKMode } = storeToRefs(toggleStore)

const title = ref("Geronimo! ~")
const navbarRef = ref(null);
const contentHeight = ref(null);
onMounted(() => {
  // Get the height of the navbar_div element
  if (navbarRef.value) {
    contentHeight.value = `calc(100vh - ${navbarRef.value.offsetHeight + 50}px)`
  }
  // Get scroll position
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const showTopButton = ref(false);

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

// Function to update the scroll direction based on the current scroll position
const handleScroll = () => {
  // console.log(window.scrollY, showTopButton.value)
  if (window.scrollY > 0) {
    showTopButton.value = true;
  } else {
    showTopButton.value = false;
  }
};

</script>

<template>
  <div id="main" class="flex flex-column align-items-center"
    :class="[toggleDarKMode ? 'surface-900 text-300' : 'bg-blue-50 text-800']"
    style="width: 100%; min-height: 100vh; min-width: 360px;">
    <div id="navbar_div" class="flex flex-column align-items-center w-full" ref="navbarRef">
      <NavBar class="navbar" :title="title" :toggle="toggleDarKMode" @toggle-change="toggleDarKMode = !toggleDarKMode" />
    </div>
    <div id="content_div" class="flex flex-column align-items-center" style="width: 100%;">
      <div class="content" :style="{ 'min-height': contentHeight }">
        <RouterView />
      </div>
    </div>
    <div id="footer_div" class="footer flex align-items-center justify-content-center" style="height: 50px;">
      © 2023 &nbsp;
      <a href="_self" :class="[toggleDarKMode ? 'text-300' : 'text-800']">{{ title }}</a>
      &nbsp; Powered by &nbsp;
      <a href="https://github.com/Larshavin/vue-blog" :class="[toggleDarKMode ? 'text-300' : 'text-800']">Larshavin</a>
    </div>
    <div v-if="showTopButton" class="scroll-btn flex align-items-center justify-content-center" @click="scrollToTop">TOP
    </div>
  </div>
</template>

<style>
html {
  font-size: 16px;
}

@media (min-width:0px) and (max-width:800px) {
  html {
    font-size: 14px;
  }

  .text-title {
    font-size: 1.5rem;
  }

  .scroll-btn {
    visibility: hidden;
  }

  .content {
    width: 100%;
  }

  .navbar {
    width: 100%;
  }

  .footer {
    width: 100%;
  }
}

@media (min-width:800px) and (max-width:1072px) {

  .text-title {
    font-size: 1.5rem;
  }

  .scroll-btn {
    cursor: pointer;
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--surface-700);
    color: aliceblue;
  }

  .content {
    width: 800px;
  }

  .navbar {
    width: 100%;
  }

  .footer {
    width: 800px;
  }
}

@media (min-width:1072px) {

  .text-title {
    font-size: 1.5rem;
  }

  .scroll-btn {
    cursor: pointer;
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--surface-700);
    color: aliceblue;
  }

  .content {
    width: 800px;
  }

  .navbar {
    width: 1072px;
  }

  .footer {
    width: 800px;
  }
}

/* @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400&display=swap'); */

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-Light.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: normal;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-Medium.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: medium;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-SemiBold.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: bold;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-Italic.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: italic;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Pretendard-1.3.6/public/static/Pretendard-Light.otf') format('opentype');
  font-weight: normal;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Pretendard-1.3.6/public/static/Pretendard-Medium.otf') format('opentype');
  font-weight: medium;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Pretendard-1.3.6/public/static/Pretendard-Bold.otf') format('opentype');
  font-weight: bold;
}

body {
  font-family: 'blog';
}

/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
.no-scroll::-webkit-scrollbar {
  display: none;
}

.no-scroll {
  -ms-overflow-style: none;
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
}
</style>
