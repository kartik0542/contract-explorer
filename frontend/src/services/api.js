import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Pages APIs

export const getAllPages = () => API.get("/pages");
export const getPageByUrl = (url) => API.get(`/pages?url=${url}`);
export const getPageById = (id) => API.get(`/pages/${id}`);
export const createPage = (data) => API.post("/pages", data);
export const updatePage = (id, data) => API.put(`/pages/${id}`, data);
export const deletePage = (id) => API.delete(`/pages/${id}`);

// Contracts APIs

export const getAllContracts = (params) => API.get("/contracts", { params });
export const getContractById = (id) => API.get(`/contracts/${id}`);
export const createContract = (data) => API.post("/contracts", data);
export const updateContract = (id, data) => API.put(`/contracts/${id}`, data);
export const deleteContract = (id) => API.delete(`/contracts/${id}`);
