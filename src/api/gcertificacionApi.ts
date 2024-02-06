import axios, { AxiosResponse } from "axios";
import config from "../config";

export const onRequest = (config: any) => {
    config.headers = config.headers || {};
    config.headers.Authorization = `${JSON.parse(localStorage.getItem("token") || '{"token": "", "tokenType": ""}').tokenType} ${JSON.parse(localStorage.getItem("token") || '{"token": "", "tokenType": ""}').token}`;
    return config;
};
export const onFulfilledRequest = (response: AxiosResponse) => response;
export const onRejectedResponse = (error: any): any => {
    if(error.response.status === 401) {
        window.location.href = '/login';
    }
    return Promise.reject(error);
}

export const gcertificacionApi = axios.create({
    baseURL: config.baseUrl, 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

gcertificacionApi.interceptors.request.use(onRequest);
gcertificacionApi.interceptors.response.use(onFulfilledRequest, onRejectedResponse);
