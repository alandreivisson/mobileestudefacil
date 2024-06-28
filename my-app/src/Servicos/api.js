import axios from 'axios'

const api = axios.create({
    // baseURL:"http://192.168.21.184:3000"
    // baseURL:"http://192.168.34.149:3000"
    baseURL:"http://192.168.0.9:3000",
    baseURL:"https://estudefacil.azurewebsites.net/api/HomeApi/IndexJson"
})

export default api