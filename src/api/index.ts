import axios from 'axios'

console.log('api base url', import.meta.env.VITE_API_BASE_URL)

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['Access-Control-Allow-Origin'] = '*'

    return config
  },
  (error) => Promise.reject(error),
)

export default api
