import axios from "axios";
import { getCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.request.use((config) => {
  const token = getCookie("session");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSocialAccounts = async () => {
  const response = await api.get("/users/social-accounts");
  return response.data;
};
