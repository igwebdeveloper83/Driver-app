import { createApp } from 'vue'

import App from './App.vue'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import Primevue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button'


import { initializeApp, getApps, deleteApp } from "firebase/app"

import { createPinia } from 'pinia';

const app = createApp(App)

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: "drivers-c5ddd",
    storageBucket: "drivers-c5ddd.appspot.com",
    messagingSenderId: "105505764677",
    appId: "1:105505764677:web:51a4f941add9853bcafa2c"
  };

   
  initializeApp(firebaseConfig)
  
  window.addEventListener("beforeunload", () => {
    if (getApps().length) {
      deleteApp(getApps()[0]);
    }
  });
  

app.use(createPinia())

app.use(Primevue)
app.use(ToastService)

app.component('toast-service', Toast)
app.component('app-table', DataTable)
app.component('app-column', Column)
app.component('app-button', Button)
app.mount('#app')
