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
import Paginator from 'primevue/paginator';

const app = createApp(App)

app.use(PrimeVue, { unstyled: true });
app.use(createPinia())
app.use(router)

app.component('Button', Button);
app.component('Paginator', Paginator);

app.mount('#app')
