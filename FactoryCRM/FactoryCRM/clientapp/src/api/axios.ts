import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // proxy работает
  headers: {
    "Content-Type": "application/json"
  }
});
