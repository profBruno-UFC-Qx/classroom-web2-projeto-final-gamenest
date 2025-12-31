import axios from "axios";

export const BASE_URL = 'https://gamenest-back.onrender.com'

export const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 3000
});