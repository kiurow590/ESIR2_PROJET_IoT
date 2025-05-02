//import './assets/main.scss'

import toast from 'vue3-toastify';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import CanvasJSChart from '@canvasjs/vue-charts';
import 'vue3-toastify/dist/index.css'
import App from './App.vue'
import router from './router'
import Sidebar from "@/components/Sidebar.vue";
import store from './stores/store.js'

const app = createApp(App)
app.component('Sidebar', Sidebar)
app.use(toast, {
    position: 'top-right',
    duration: 3000,
    theme: 'light',
    icon: true
})
app.use(createPinia())
app.use(router)
app.use(CanvasJSChart); // install the CanvasJS Vuejs Chart Plugin
const vfm = createVfm()
app.use(vfm)

// Restaurer l'état du store Vuex depuis le localStorage
const savedWidgets = JSON.parse(localStorage.getItem('widgets'));

if (savedWidgets) {
    store.commit('setWidgets', savedWidgets);
}

app.use(store).mount('#app')
