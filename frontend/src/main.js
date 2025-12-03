import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// --- THÊM PHẦN NÀY ---
import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
// ---------------------

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab, fas)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

// --- CẤU HÌNH TOAST ---
app.use(Vue3Toastify, {
  autoClose: 10000,      // Hiện trong 10 giây (khá lâu)
  position: 'top-right', // Góc phải trên
  pauseOnHover: true,    // QUAN TRỌNG: Di chuột vào thông báo sẽ giữ nguyên không tắt
  closeOnClick: true,    // Bấm vào là tắt ngay
  limit: 3,              // Chỉ hiện tối đa 3 cái cùng lúc cho đỡ rối
});
// ----------------------

app.mount('#app')