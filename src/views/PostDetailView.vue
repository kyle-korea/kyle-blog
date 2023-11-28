<template>
    <div class="mx-3">
        <div>
            <div class="mt-8">
                <RouterLink to="/" style="text-decoration: none; color: inherit;">
                    Home
                </RouterLink> »
                <RouterLink :to="'/posts/' + currentPostID" style="text-decoration: none; color: inherit;">
                    Posts
                </RouterLink>
            </div>
            <h1 v-if="options.title">
                {{ options.title }}
            </h1>
            <div v-if="options.date" class="text-600">
                {{ timeFormatChange(options.date) }} · {{ timeToRead }} min read
            </div>
        </div>

        <div class="surface-600 text-300 text-lg p-3 mt-3 font-bold border-round flex flex-column align-items-start justify-content-center cursor-pointer"
            @click="tocClick()">
            <div class="">
                <i v-if="!tocOpen" class="pi pi-caret-right"></i>
                <i v-else class="pi pi-caret-down"></i>
                <span class="ml-2">Table of Contents</span>
            </div>
            <div v-if="tocOpen" class="mt-2">
                <div v-for="item in tocItems" :key="item.text" class="m-2 px-3">
                    <div v-html="linkForTitle(item)" class="toc"></div>
                </div>
            </div>

        </div>

        <div id="markdown" class="line-height-4 text-xl custom" v-html="markdownHtml"></div>

        <div v-if="options.Tags" class="flex gap-3">
            <div v-for="tag in options.Tags" :key="tag"
                class="flex align-items-center border-round justify-content-center surface-600 text-300 align-items-center px-1"
                style="height: 40px; min-width: 60px;">
                {{ tag }}
            </div>
        </div>
        <div class=" flex w-full justify-content-between border-round surface-600 text-300 align-items-center mt-3"
            style="height: 50px;">
            <div class="p-4 w-full">
                <div class="justify-content-start flex mb-1">
                    다음 글 :
                </div>
                <div v-if="prevPost.title" @click="seePostDetail(prevPost.title)"
                    class="w-full justify-content-start flex cursor-pointer underline">
                    {{ prevPost.title }}
                </div>
                <div v-else class="w-full justify-content-start flex ">
                    없음
                </div>
            </div>
            <div class="p-4  w-full">
                <div class="justify-content-end flex mb-1">
                    이전 글 :
                </div>
                <div v-if="nextPost.title" @click="seePostDetail(nextPost.title)"
                    class="w-full justify-content-end flex cursor-pointer underline">
                    {{ nextPost.title }}
                </div>
                <div v-else class="w-full justify-content-end flex">
                    없음
                </div>
            </div>
        </div>
        <Comment />
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios';
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { marked } from 'marked';
// import { markedHighlight } from "marked-highlight";
import fm from 'front-matter';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import Comment from '@/components/Comment.vue';

const route = useRoute()
const router = useRouter()

const markdown = ref('');
const markdownHtml = ref('');
const markdownToHtml = (() => {
    marked.use({ hooks });
    marked.use({ renderer });
    const output = marked(markdown.value, {
        async: true,
        pedantic: false,
        headerIds: false,
        gfm: true,
        mangle: false,
    });
    return output
});

onMounted(async () => {
    await importData();
});

const importData = async () => {
    const server = 'https://blog.3trolls.me/syyang/markdown'
    const path = "/" + route.params.id + "/" + route.params.id + ".md"
    await getPageInfo(route.params.id);
    await getMarkdownFile(server + path);
    markdownHtml.value = await markdownToHtml();
    readingTime(markdown.value);
    nextTick(() => {
        const preElements = document.querySelectorAll('#markdown pre');
        preElements.forEach((preElement) => {
            // console.log(preElement)
            const button = document.createElement('Button');
            button.classList.add('button', 'absolute', 'text-white', 'p-1', 'border-round');
            button.style.right = '0.25rem';
            button.style.top = '0.4rem';
            button.textContent = 'Copy';
            button.addEventListener('click', () => {
                const lines = preElement.textContent.trim();
                // console.log(lines)
                const code = lines.split('\n')
                code.shift()
                // console.log(code)
                const clipboard = code.join('\n').trim();
                // console.log(clipboard)
                window.navigator.clipboard.writeText(clipboard).then(() => {
                    console.log('Copied to clipboard');
                    button.textContent = "Copied !"
                    setTimeout(() => {
                        button.textContent = "Copy"
                    }, 5000);
                }).catch((error) => {
                    console.error(error);
                })
            });
            preElement.appendChild(button);
            preElement.classList.add('relative');
        })
    });
}


const timeToRead = ref(0);
const readingTime = (text) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    timeToRead.value = Math.ceil(minutes);
};

const getMarkdownFile = async (path) => {
    try {
        const response = await axios.get(path);
        markdown.value = response.data;
    } catch (error) {
        console.error(error);
    }
};


const prevPost = ref({ "title": "", "number": "" });
const nextPost = ref({ "title": "", "number": "" });
const currentPostID = ref();
const getPageInfo = async (title) => {
    const server = 'https://blog.3trolls.me/syyang/post'
    const rows = 5;
    try {
        const response = await axios.get(server + '/' + title + '/' + rows);
        prevPost.value = response.data.prev;
        nextPost.value = response.data.next;
        currentPostID.value = response.data.number + 1;

        // console.log(prevPost.value, nextPost.value, currentPostID.value)
    } catch (error) {
        console.error(error);
    }
};

const seePostDetail = async (path) => {
    await router.push({ name: 'postDetail', params: { id: path } })
    router.go(0)
    window.scrollTo(0, 0);
}

const tocItems = ref([]);
const renderer = (() => {
    const renderer = new marked.Renderer();
    renderer.code = function (code, language) {

        const codeContent = language ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value;
        const langClass = 'language-' + language;

        const template = `
        <pre class="flex flex-column">
            <div class="surface-700 text-white px-2 border-round">${language}</div>
            <code class="hljs ${langClass} border-round" style="font-size:60%;">${codeContent}</code></pre>`;
        return template;
    };
    renderer.image = function (href, title, text) {
        const path = 'https://blog.3trolls.me/syyang/image/' + href
        return `<div class="flex justify-content-center"><img src="${path}" alt="${text}" title="${title}" class="img border-1 border-round z-2 border-300" /></div>`; // for local references
    };
    renderer.heading = function (text, level, raw) {
        // console.log(text, level, raw)
        const anchor = raw.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
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
            + '<a hidden class="anchor" aria-hidden="true" href="#' + anchor + '">#</a>'
            + '</h'
            + level
            + '>'
    };
    return renderer;
})();
const options = ref({
    title: '',
    date: '',
    Tags: [],
})
const hooks = {
    preprocess(markdown) {
        const data = fm(markdown);
        options.value = data.attributes;
        return data.body;
    }
};

const linkForTitle = (item) => {
    // console.log(item)
    if (item.level == 1) {
        return `<li class="list-none"><a href="#${item.anchor}" class="toc">${item.text}</a></li>`
    }
    else if (item.level == 2) {
        return `<li style="margin-left: 1rem;" class="list-none"><a href="#${item.anchor}" class="toc">${item.text}</a></li>`
    }
}

const timeFormatChange = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
}


const tocOpen = ref(false);
const tocClick = () => {
    tocOpen.value = !tocOpen.value;
}

</script>



<style scoped>
.custom {
    /* Other styles */
    word-wrap: break-word;
    max-width: 100%;
    /* Set the desired maximum width for the content */
}

.custom :deep(a:not(.anchor)) {
    color: #42b983;
    text-decoration: none;
    border-bottom: 1px solid #42b983;
    transition: all 0.3s ease-in-out;
}

.custom :deep(p, h1, h2, h3, h4, h5, h6) {
    user-select: none;
    -webkit-user-select: none;
}

.custom :deep(code:not([class])) {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
}

.toc :deep(a) {
    color: inherit;
    text-decoration: none;
}

.toc:hover :deep(a) {
    color: #42b983;
    text-decoration: underline;
}

:deep(h1:hover .anchor) {
    display: inline-flex;
    color: var(--surface-700);
    margin-inline-start: 8px;
    font-weight: 100;
    user-select: none;
    text-decoration: underline;
    text-decoration-thickness: 1px;
}

:deep(.codeTop) {
    margin: 0;
    background-color: #2c1f23;
}

:deep(.circle) {
    div {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin: 0px 5px;
    }
}

:deep(.button) {
    color: #adb5bd;
    box-sizing: border-box;
    transition: 0.2s ease-out;
    cursor: pointer;
    user-select: none;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0);
    padding: 5px 10px;
    font-size: 0.8em;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0 0.15rem;
}

:deep(.img) {
    max-width: 100%;
    height: auto;
    object-fit: cover;
}
</style >
