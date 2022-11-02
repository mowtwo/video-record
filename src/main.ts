import { createApp } from 'vue'
import PrimeVue from "primevue/config"

import "reset.css"
import "uno.css"

import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

import App from './App.vue'
import router from './router'

createApp(App)
  .use(PrimeVue)
  .use(router)
  .mount('#app')
