import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/chat",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createChat = () => API.post("/new");

export const getChats = () => API.get("/");

export const getMessages = (chatId) => API.get(`/${chatId}`);

export const sendMessage = (chatId, message) =>
  API.post(`/${chatId}/message`, { message });

export const renameChat = (chatId, title) =>
  API.patch(`/${chatId}`, { title });

export const deleteChat = (chatId) =>
  API.delete(`/${chatId}`);