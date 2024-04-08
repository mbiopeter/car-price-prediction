import axios from "axios";

export const makeRequest = axios.create({
    baseURL: ' http://127.0.0.1:8000/api/',
    withCredentials: true
})