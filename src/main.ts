import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Highcharts from 'highcharts'

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ',',
  },
  time: {
    timezone: '',
  },
})

const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')
