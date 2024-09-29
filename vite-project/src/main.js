import { createApp } from 'vue'

import App from './App.vue'

import Primevue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { initializeApp, getApps, deleteApp } from "firebase/app"

import { createPinia } from 'pinia';

const app = createApp(App)

const firebaseConfig = {
    apiKey: "AIzaSyBNy0GfUOqAVfJIieVN190AGmyuxXr2MBc",
    authDomain: "drivers-c5ddd.firebaseapp.com",
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
app.mount('#app')
