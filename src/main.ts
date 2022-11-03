import { createApp } from 'vue'
import PrimeVue from "primevue/config"
import Tooltip from "primevue/tooltip"
import ToastService from "primevue/toastservice"
import Toast from 'primevue/toast'
import ConfirmationService from "primevue/confirmationservice"
import ConfirmPopup from "primevue/confirmpopup"

import "reset.css"
import "uno.css"

import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

import App from './App.vue'
import router from './router'
// import { pinia } from './data/store'

import ffmpeg from "./utils/createFFMpeg"

ffmpeg.load().then(() => {
  createApp(App)
    .use(PrimeVue)
    .use(ToastService)
    .component('p-toast', Toast)
    .use(ConfirmationService)
    .component('p-confirmpopup', ConfirmPopup)
    .use(router)
    // .use(pinia)
    .directive('tooltip', Tooltip)
    .mount('#app')
})


