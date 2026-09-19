import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:5011"
})

export default api;