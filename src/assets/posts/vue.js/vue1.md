---
title: "Vue.js로 블로그 UI 만들기 (1)"
date: 2023-07-17T21:29:25+09:00
ShowToc: true
TocOpen: false
Tags: ['vue.js', 'blog']
---

# 개요

최근 저는 [kubesy.com](http://kubesy.com) 에 Hugo라는 정적 사이트 생성기와 github.io를 이용하여 기술 블로그를 생성하였습니다. Hugo의 장점으로는 markdown 기반으로 홈페이지를 쉽게 구성한다는 점과 이미 만들어진 여러 사이트 템플릿이 존재한다는 것인데요. 처음 보는 사람들에게는 쉬운 시작점이 될 수 있겠으나, 이를 커스텀하기 위해서는 역시 또다른 공부가 필요해 보였습니다.

저는 이미 Vue.js를 공부하고 있었습니다. github 블로그의 작동 원리가, repository에 올라온 html 파일을 기반으로 화면을 뿌려주는 것으로 보여지는 상황에서, Hugo를 세세하게 공부하며 커스텀하기 보다, UI를 Vue.js를 이용해 만들고 배포해보는 것이 어떨까 생각이 들었습니다.

그래서 Vue.js의 튜토리얼 일환으로, Hugo 템플릿 중 PaperMod의 UI를 처음부터 쌓아가보는 연습을 해볼까 합니다.

# 시작

 역시 시작은 Vue.js 환경 구성이겠습니다. 저는 금붕어라서 설치법을 항상 [여기](https://vuejs.org/guide/quick-start.html#creating-a-vue-application)서 참고하곤 합니다. 

 바닐라 자바스크립트 위에 CDN을 활용한 방식이 있겠습니다만, Vue의 특징은 프레임워크이니 이 환경을 최대한 활용해보도록 합니다. 우선 그렇기 위해선 npm이 설치되어 있어야 합니다. npm이 설치되어 있음을 가정하고 진행해보도록 합시다.

```bash
$ npm init vue@latest

Vue.js - The Progressive JavaScript Framework

✔ Project name: … blog_vue
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add an End-to-End Testing Solution? › No
✔ Add ESLint for code quality? … No / Yes

Scaffolding project in /root/hugo/blog_vue...

Done. Now run:

  cd blog_vue
  npm install
  npm run dev
```

 짜잔, 설치가 끝났습니다. 제가 선택한 모듈은 Vue Router와 Pinia(피냐) 입니다. 둘의 활용도는 추후에 설명드리도록 하게습니다. 이제 시키는 대로 blog_vue 폴더에 들어가 npm 으로 시작하는 두 명령어를 쳐보겠습니다. 

아, 그 전에 생성된 폴더 구조를 살펴보고 가시죠.

```bash
$ ls
README.md  index.html  node_modules  package-lock.json  package.json  public  src  vite.config.js
```

 `npm install` 은 package.json에 정의된 모듈을 레포지토리에 설치하는 명령어입니다. 깃으로 형상관리 시에, node_modules 파일은 gitignore 하기 때문에, 새로 레포지토리를 클론하거나 할 때 마다 위의 명령어를 실행 시켜줘야 합니다. 

물론 지금은 특정한 모듈을 사용한 적이 없기 때문에 별 메세지는 뜨지 않을 겁니다. 우리는 추후에 추가적인 모듈을 설치 할 것 입니다.  

`npm run dev`는 개발 환경 상에서 프로젝트를 가동하는 명령어 입니다. 추후에 최종 버젼이 완성이 되면 저희는 `npm build`를 사용할 것 입니다. 명령어를 치면 다음과 같이 터미널 환경이 바뀝니다!

```bash
VITE v4.4.4  ready in 624 ms

  ➜  Local:   http://127.0.0.1:5174/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

 [http://127.0.0.1:5174/](http://127.0.0.1:5174/)를 눌러 시작페이지를 살펴봅시다. 격려인사와 함께 뷰 프로젝트의 디폴트 화면이 등장합니다. 이 페이지에는 각종 피가되고 살이 되는 (하지만 제대로 보기는 귀찮은) 각종 문서들이 링크되어 있습니다. 뷰를 시작할 때 보면 좋은 것들 입니다. 

![](/images/vuejs/Untitled.png)


하지만 저는 고리타분하게 문서를 들여다보는 것보단, 뭐라도 뚝딱거리는 걸 좋아하는 편 (아마도 .. 나쁜 습관이라고 생각합니다) 입니다. 메인 화면을 고쳐봅시다!

## 메인 화면으로 파악하는 뷰의 구조

그 전에 폴더 구조를 더 깊게 살펴봅시다. 저희가 집중해서 볼만한 폴더는 바로 /src 입니다. 

```bash
.
├── App.vue
├── assets
│   ├── base.css
│   ├── logo.svg
│   └── main.css
├── components
│   ├── HelloWorld.vue
│   ├── TheWelcome.vue
│   ├── WelcomeItem.vue
│   └── icons
│       ├── IconCommunity.vue
│       ├── IconDocumentation.vue
│       ├── IconEcosystem.vue
│       ├── IconSupport.vue
│       └── IconTooling.vue
├── main.js
├── router
│   └── index.js
├── stores
│   └── counter.js
└── views
    ├── AboutView.vue
    └── HomeView.vue
```

이 폴더 안에는 현재의 메인 페이지를 구성하고 있는 요소들이 모두 담겨 있습니다. 우선 파일 중 `App.vue`를 살펴봅시다. 왠지 html 구조를 연상케하는 코드입니다.

```jsx
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
 ...
</style>
```

 크게 보면 단락이 세 가지로 나뉘어 있음을 알 수 있는데요.

 `<script>`, `<template>`, `<style>` 입니다. 각각 javascript, html, css 문법이 적용되어 있습니다. 이는 Vue.js 프레임워크의 특징이라고 볼 수 있습니다. `*.vue`라는 확장자 밑에 프론트엔드 삼대장의 요소들이 같이 들어있는 것이죠.  `*.vue` 를 우리는 SFC(Single-File Components)라고 부릅니다.

 vue.js 공식 홈페이지에서 제공하는 [플레이 그라운드](https://play.vuejs.org/#eNp9kUFLwzAUx79KfJcqzA3ZbXQDlYF6UFHBSy6je+sy0yQkL7NQ+t19SVn1ILv1/X//l/7SdnDr3PQYERZQhsorRyIgRbeSRjXOehKd8LgTvdh524iCq4U00lTWBBJNqMUy8cviAbW24tN6vb0orqQpZ8NxfBAPhI3TG0KehCj3N6uuy8t9X854yqkyLpI4Xjd2i3opgbkERuVs3IYJUOBX71Q9PQRr2LpLuxIq2zil0b84UqwmYSEySWzDZt9POSMfcXLKqz1WX//kh9CmTMKrx4D+iBJGRhtfIw14/f6MLT+PkM2j5vYZ+IbB6pgch9pdNFvW/tPLto/52ytTf4R1S2jC6VJJNDX73JfA/+P+zNV/defTed6Tpof+B7x8phs=)를 들어가보면 위의 코드와 구성이 같다는 것을 확인할 수 있습니다. (플레이 그라운드에서 vue.js의 문법을 익히는 것도 좋을 듯 합니다)

 Vue에서 App.vue 파일은 가장 최상위 컴포넌트 입니다. 그러니까, 프로젝트가 빌드되어 구동 될 때의 시작점이라고 보아도 무방합니다(하지만 이건 틀렸습니다). 그럼 최상위 컴포넌트는 무슨 요소들을 가지고 있을까요?

 `<template>` 쪽을 살펴봅시다.  `<HelloWorld msg="You did it!" />` 와 `<nav>` 등을 지니고 있습니다. HelloWorld msg를 바꾸고 저장해봅시다. 그리고 인터넷에서 화면이 어떻게 변화 했는지 살펴보면, 우리가 작성한 내용대로 초록 글자가 변경되었음을 확인 할 수 있습니다.

 그럼 `<style>` 쪽을 건드려 볼까요? 안에 있는 내용을 다 지워봅시다. 그리고 화면이 어떻게 변하는지 확인해보죠. CSS를 없앴으니까 화면이 초라해지겠죠? 음, 글쎄요. 뭔가 변한 것 같긴한데 그다지 인상적으로 망가지진 않았습니다. 그렇다면, 어디서 화면에 스타일을 주고 있는 걸까요?

 아마도 `/assets/main.css` 파일이 그 범인인 것 같습니다. 온갖 현란한 방식으로 스타일을 주고있군요. 그럼 `/assets/main.css` 는 누가 불러오고 있는 것이죠? 바로 `main.js` 입니다. 순수 자바스크립트로 된 이 파일에서는 App.vue 뿐 만이라 더 많은 요소들이 import 되고 있습니다. 

```jsx
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

vue.js의 구조를 좀 더 파악해봅시다. import 되고 있는 router, pinia를 확인 할 수 있네요. 그리고 vue 라는 곳에서 createApp을 이용해 `const app = createApp(App)` 을 실행시키고 있습니다. 추상적으로 이곳이 바로 App.vue 파일을 통해 어떤 처리를 하는 곳이라는 것을 알 수 있습니다. 아하, App.vue의 더 상위 포인트가 이 자바스크립트 파일이라는 걸 알 수 있겠습니다. 그럼, main.js는 어디서 사용되는 거죠?

 프로젝트 최상단 폴더로 돌아가보면, `index.html` 파일이 존재합니다. 그리고 그곳에서 main.js가 호출 되는 것을 확인 할 수 있습니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

`npm build` 를 할 때 다시 한 번 살펴보겠지만, 이 index.html은 특별 합니다.

 다시 메인화면 분석으로 돌아가봅시다. 남은 것은 `<script>` 입니다. `<script>` 를 특별히 뭐라고 설명하기가 애매합니다. 크게 보면 그냥 javascript 문법 영역입니다. 다만 이곳에도 특별한 점이 분명 존재하죠. 아니, 어쩌면 가장 설명할 것이 많을지도 모르겠습니다.

 흠, 먼저 이걸 이야기 해봅시다. 저희가 main.js 파일에서 살펴보았던 `import { createApp } from 'vue'` 는 공식 홈페이지 [API 문서](https://vuejs.org/api/)에 가장 처음으로 찾아볼 수 있습니다. 자바스크립트 상에서 import 할 수 있는 `'vue'` 라는 모듈에는 문서에 나온 것 같은 여러가지 기능들이 존재합니다. 

 문서에서 ****Composition API**** 칸을 봅시다. ( 바로 밑에 Options API라는 것이 존재합니다. 이는 vue2 를 위한 기능들이었습니다. Vue3 에서는 composition api 사용을 권장합니다) `setup()`, `Reactivity: Core`, `Reactivity: Utilities`, `Reactivity: Advanced`, `Lifecycle Hooks`, `Dependency Injection` .

 핵심 키워드는 Reactivity 와 Lifecycle 입니다. 이 둘을 이해하고 파악하려면, 꽤나 또 깊은 탐구(저도 이런 친구들을 low-level 까지 살펴본 적은 없습니다 …)를 해야할 듯 하니 생략하고 넘어가도록 합시다. 다만, 이 둘을 통해 **동적 웹사이트**를 쉽게 만들 수 있음을 기억하고 넘어갑시다.

 `<script>` 에서는 이런 특별한 vue의 기능을 사용할 수 있습니다. 특히 요즘에는 `<script setup>` 이라는 폼으로 많이 사용합니다. (****Single-File Component**** 칸에 해당 내용이 있습니다.)

 [API 문서](https://vuejs.org/api/)에 `Built-ins` 이야기도 해볼까요? 이들은 말 그대로 이미 만들어져 있는 것들 입니다. `<template>` 쪽에서 많이 사용됩니다.

 그 중에 ****Directives****를 보시면  `v-*` 로 표현된 것들의 리스트들이 나타나있습니다. vue에서는 `<script>` 쪽에서 정의한 어느 자바스크립트 변수에 대한 표현을 `<template>` 쪽에 바로 표현이 가능합니다. 그 반대로 html 폼에 입력되는 요소들을 반대로 자바스크립트 변수에 할당 할 수 도 있죠. 그 뿐 만이 아니라, html 단에서 반복적으로 수행해야 할 요소나, 특정 환경에 따라 표현되거나 표현되지 않아야 하는 요소들 까지도 처리 가능합니다. 마치 if 문, for 문을 쓰는 것처럼 말이죠. 그 때 바로 이 `Built-ins` 를 이용하면 됩니다.

 추후 진행 될 예제에서 많이 사용하는 것 위주로 알아보도록 합시다.

 위의 내용 정도로 Vue.js에 대해 구구절절 설명하는 것을 마치고, 이제 정말 해야하는 것. 바로 Blog UI를 만들기 위한 초석을 다져봅시다.

 우선 저는 main.js에서 기본 main.css 파일 임포트 하는 부분을 없앴습니다. 그리고 *.vue 파일에 있는 style 부분도 모두 없애버렸습니다. 그랬더니, 어머나!  기대처럼 메인 페이지가 파괴적인 몰골 만을 남겨두었습니다. 잔혹하게 왜 이런 짓을 하냐구요? 새로 집을 지으려면 기존의 건물을 부셔야하는 법이죠. 아예 내용까지 다 지워버립시다. 

# primeVue & primeFlex

 이제 저희에게 남은 것은 텅빈 땅과 드문드문 남은 과거의 잔재들 뿐 입니다. 새로운 집을 만들기 위해 저희는 건축 자재를 구비해야 합니다.

 사람들 중에는 여러 타입의 사람들이 존재합니다. 어떤 사람들은 자신의 멋진 집을 위해 자재 하나하나 신중하게 결정하고, 구매할 겁니다. CSS를 커스텀으로 장신정신과 함께 빗어내는 사람들을 우리는 이에 비유할 수 있겠습니다. 숙련자가 아니라면 오래 걸리고 참으로 수고스러운 일이지만, 집이 완성되고 나면 고장이 났을 때 쉽게쉽게 고쳐 나갈 수 있겠지요.

 하지만 어떤 사람은 극한의 편리함을 추구할 수 있습니다. 쿠팡에서 검색해서 상단에 뜨는 아무거나 구매하는 그런 사람들이요. 뭐, 자기가 원하는 그림은 아닐지도 몰라도 빠르게 집을 지어날 수 있겠지요. hugo에서 템플릿을 다운 받은 후, 아무 변경 없이 사용하는 것이 딱 이런 분들에게 제격입니다.

 저는 욕심쟁이 입니다. 편리함을 추구하면서도, 최소한의 커스텀을 보장할 수 있었으면 좋겠습니다. 그런 측면에서 스타일링과 관련해 여러 좋은 옵션들이 존재합니다. 대표적으로 Bootstrap, Tailwind, 뷰로 특정하면 vuetify 등이 있겠습니다. 그런데 저희는 그 중에 비슷한 친구인 primeVue를 선택할 것 입니다. 왜냐구요? 제가 가진 일종의 원형성 편향 (Prototype bias) 혹인 각인 (imprinting)의 영향인 것 같습니다 … 사실 처음 제대로 써본 게 primeVue 거든요. (~~마음에 여유만 있다면 Tailwind를 한 번~~)

 [primeVue](https://primevue.org/installation/)와 [primeFlex](https://primeflex.org/installation)의 차이는 전자는 컴포넌트에 대한 집합이고, 후자는 CSS에 대한 집합이라고 보시면 될 것 같습니다. 둘은 상호적으로 사용됩니다. 이러한 관계는 다른 툴에서도 쉽게 목격 됩니다. 이 둘을 설치해 저희 프로젝트에 이식하고 main.js를 아래와 같이 수정해봅시다.

```bash
$ npm install primeflex
$ npm install primevue
$ npm install primeicons
```

```jsx
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';

import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import Button from 'primevue/button';

const app = createApp(App)

app.use(PrimeVue, { unstyled: true });
app.use(createPinia())
app.use(router)

app.component('Button', Button);

app.mount('#app')
```

필수 요소는 설치가 끝났습니다. 그런데 이렇게 한다고 다는 아니겠죠? 사용법을 익혀봅시다. App.vue에 [버튼](https://primevue.org/button/) 하나를 추가해보고 싶습니다. 우선 main.js에 다음 두 줄을 적절한 곳에 넣어봅시다.

```jsx
import Button from 'primevue/button';
...
app.component('Button', Button);
...
```

그런 다음 App.vue를 이렇게 만들어 봅시다.

```jsx
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      메롱
      <Button>Button</Button>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped></style>
```

보면 작고 보잘 것 없는 버튼 하나가 메롱 옆에 붙어 있습니다!

 에잉, 이게 뭐야 싶긴 하겠지만, 저 형편 없는 버튼에는 그 이유가 있습니다. 바로 primeVue에서 따끈따끈하게 업데이트한 기능 `unstyled` 모드가 적용되어 있기 때문 입니다. 위에서 반은 장난, 반은 진심으로 ‘primeVue 말고 다른 것을 써보고 싶다’ 라고 적어놓긴 했지만, 이 `unstyled` 기능은 어쩌면 커스텀에 있어 무한한 확장성을 줄지도 모르는 강력한 기능이라고 생각하고, 이는 확실한 강점이라고 생각 합니다.

 자 한 번 저 버튼을 그럴싸하게 꾸며보도록 합시다.

```jsx
<Button label="Submit" icon="pi pi-check" unstyled :pt="{
        root: { class: 'bg-teal-500 hover:bg-teal-700 cursor-pointer text-white p-3 border-round border-none flex gap-2' },
        label: { class: 'text-white font-bold text-xl' },
        icon: 'text-white text-2xl' // OR { class: 'text-white text-2xl' }
      }" />
```

![](/images/vuejs/Untitled%201.png)


![](/images/vuejs/Untitled%202.png)


 둘의 차이가 확연하게 느껴지나요? 좋습니다. 저희는 이렇게 쉽게 커스텀 할 수 있는 편리한 도구를 얻었습니다! 하지만 이 도구들도 제대로 써야 맛있는 법이겠지요. 다음 두 파트를 지난 후에 실전으로 도구를 사용할 때가 오면 한 번 이야기를 더 진행해 봅시다.

# vue Router

 [이곳](https://www.notion.so/vue-js-ui-1-b7980fba44b94ee99bc897c550dc5722?pvs=21)에서 언급한 내용에 대해 설명드려야 할 때가 왔습니다. Vue는 기본적으로 build를 한 번 거치면, index.html 파일 하나(와 부가적인 무언가)가 생성됩니다. 웹서버에서는 이 index.html을 들고 있다가 실제 client들에게 전달 해줍니다. 그리고 클라이언트의 브라우저에서 화면들이 구성되기 시작합니다. 이 과정을 소위 CSR(Client Side Rendering)이라 부릅니다. 반대의 개념으로는 SSR(Server Side Rendering)이 있습니다.

![](/images/vuejs/Untitled%203.png)

 그런데, 보통의 페이지를 생각해보면 홈페이지 하나에는 수많은 url 포인트가 존재합니다. 전통적인 (혹은 또한 현대적인) 방식으로 SSR을 하면, 각 url 마다 html 파일이 따로 따로 날라갑니다. 그러면 어떻게 html 파일 하나만 던져서 여러 url의 화면을 표현하는 걸까요? 

 vue에서 url 관리는 [Vue Router](https://router.vuejs.org) 라이브러리를 사용합니다. main.js에서 import 했던 파일인 /src/router 폴더를 열어서 index.js를 열어봅시다. 

```jsx
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```

 이것이 현재 설정된 기본적인 상황입니다. 조금 파악해볼까요? 두 개의 경로가 각자의 `*.vue` 파일과 연결되어 있네요. 저희는 이걸 사실 메인 페이지에서도 지켜보고 있었습니다. Home과 About라고 링크 처리 된 부분입니다. 두 버튼을 번갈아 가면서 눌러보면 url이 [http://127.0.0.1:5174](http://127.0.0.1:5174/) 와[http://127.0.0.1:5174/about](http://127.0.0.1:5174/about) 가 번갈아가면서 바뀌는 걸 볼 수 있습니다. 그리고 그 사이에 서버와의 통신은 없습니다. 클라이언트 위 자바스크립트 내부 로직에 의해 결정되는 것 이니까요.

```jsx
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
```

 vueRouter에도 역시 위의 사용 예제 처럼 여러 [기능](https://router.vuejs.org/api/)이 있습니다. 어떤 기능이 필요할 때 마다 문서를 살펴보도록 합시다. (저도 아는 게 그리 많지는 않습니다)

 추후에 저희는 navigation bar를 만들 것이고, 그 곳에 RouterLink 을 사용할 것 입니다. 또한 nav bar 아래에 실제 url 페이지 마다의 요소들이 표현 될 것이고, 그것을 RouterView가 표현해 줍니다.

# Pinia

 각각의 url 마다, 같은 데이터를 프로그래밍적인 변수로 간직하고 싶다면 어떻게 해야 할까요?, 과거 자바와 같은 개발 환경에서는 백엔드 코드로 html과 javascript 상의 데이터를 저장할 순 있었겠습니다만, 보시다시피 Vue.js는 백엔드와 묶여있지 않습니다.

 또한 Vue는 각각의 컴포넌트 파일에 따라서 일종의 지역변수 같이 자바스크립트 변수들이 작동합니다. 변수를 공유하기 위해서는 앞서 설명 드린 적은 없는 props 등의 기능을 사용해야 합니다. 하지만 부모 자식 관계가 형성되는 이런 구조에서는 조금 번거러운 감이 있죠.

 따라서 각각의 컴포넌트 파일끼리 실시간으로 데이터를 공유해야 하려면 [Pinia](https://pinia.vuejs.org)와 같은 라이브러리를 활용해야 합니다. /src/stores 에서 디폴트로 들어가 있는 counter.js 파일을 열어봅시다.

```jsx
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

 이는 pinia의 전체 기능을 담은 파일이 아닙니다. pinia로 저장할 “counter”라는 특성들에 대한 일종의 명세 입니다. 다른 표현으로, 카운트를 셀 때 필요한 전역변수와 전역함수를 정의 해놓은 파일입니다. 꼭 counter.js 가 아니더라도, 각종 여러 특정 사용자 요구에 맞는 도메인의 파일을 생성해 둘 수 있습니다.

 예를 들어 특정 사이트에서 유저가 로그인 하였을 때 그 로그인의 여부를 `login.js`라는 폴더 안 `checkLogin`이라는 변수를 생성해 저장해 둘 수 있겠습니다.

 그런데 또 여기서 고려해야할 부분이 있다면, 기본적으로 pinia는 새로고침을 하게되면 저장해 두었던 요소들을 다 날려버립니다. 왜냐하면 CSR 특성상 사이트 이용시 새로고침을 그다지 권장하지 않기 때문인데요. 그러나 사용자 경험상 필요에 따라 새로고침이 필요할 때가 오곤 합니다. 그런데 새로고침을 할 때 마다 로그인 여부가 초기화 된다면 마음이 조금 아프겠죠. 

 그래서 pinia를 쓸 때 [pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) 와 같은 추가적인 플러그인을 사용해, 클라이언트의 세션 스토리지 등의 저장하는 법도 존재 합니다.

# 페이지 구성하기

자, 이 정도면 블로그 UI를 구성하기 위해 필요한 여러가지 요소에 대한 준비가 충분하지 싶습니다. 다음 단계는 위의 도구들을 이용해 Hugo의 템플릿과 같은 메인 페이지를 만들 준비를 해보겠습니다.

제 휴고 사이트의 겉모습은 다음과 같습니다.

![](/images/vuejs/Untitled%204.png)

 맨 윗 단에 간단한 네비게이션바가 존재합니다. 그리고 x축의 여백이 꽤나 인상적인 가운데, 중간에 게시글 카드와 카드 위로 제가 설정 해놓은 간략한 설명 프로필이 존재합니다. 더해 핸드폰으로 화면을 켜보아도 잘 정렬된 반응형 페이지라는 것을 알 수 있습니다. 

 primeFlex를 사용하면 flex, 반응형 등등의 css 요소를 쉽게 사용할 수 있습니다. 우선 백그라운드 전체를 회색으로 바꿔봅시다. App.vue와 index.html을 다음과 같이 만듭니다. 

```HTML
<!DOCTYPE html>
<html lang="kr">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Geronimo ~ </title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>

<style>
  body {
    margin: 0px;
  }
</style>
```

```jsx
<script setup>
</script>

<template>
  <div class="bg-blue-50" style="width: 100%; height: 100vh;">
    
  </div>
</template>

<style scoped></style>
```

아래 template 아래 화면 크기에 딱 맞는 <div>를 만들어 줍니다. 그리고 색깔을 **bg-blue-50** 라는 primeFlex class를 사용하겠습니다. 저희는 이제 **<NavBar>** 라는 컴포넌트를 만들 것 입니다. /src/components/ 아래 NavBar.vue 파일을 만들고 App.vue 에 Import 하겠습니다. 

```jsx
<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
```

```jsx
<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="main" class="bg-blue-50" style="width: 100%; height: 100vh;">
    <NavBar />
    <RouterView />
  </div>
</template>

<style scoped></style>
```

정말 뼈대만 남은 무언가가 있습니다. 다음 글에서 이를 본격적으로 꾸며보도록 합시다.