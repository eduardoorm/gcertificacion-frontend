import { createAsyncThunk } from "@reduxjs/toolkit";
import { Archivo } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getArchivos = createAsyncThunk<
        Archivo[],
        void,
        {rejectValue: APIError<Archivo[]>}
    >('get/archivos', async(_, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Archivo[]>>('/archivos');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getArchivoById = createAsyncThunk<
        Archivo,
        string,
        {rejectValue: APIError<Archivo>}
    >('get/archivos/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Archivo[]>>(`/archivos/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getArchivosByClase = createAsyncThunk<
        Archivo[],
        string,
        {rejectValue: APIError<Archivo[]>}
    >('get/archivos/clase/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Archivo[]>>(`/clases/${id}/archivos`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addArchivo = createAsyncThunk<
        Archivo[],
        Archivo,
        {rejectValue: APIError<Archivo[]>}
    >('post/archivos', async(archivoData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<Archivo[]>>('/archivos', archivoData);
        return response.data.data;
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updateArchivo = createAsyncThunk<
        Archivo,
        Archivo,
        {rejectValue: APIError<Archivo>}
    >('put/archivos', async(archivoData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<Archivo[]>>(`/archivos/${archivoData.id}`, archivoData);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteArchivo = createAsyncThunk<
        Archivo,
        string,
        {rejectValue: APIError<Archivo>}
    >('delete/archivos', async(id, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<Archivo[]>>(`/archivos/${id}`);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});