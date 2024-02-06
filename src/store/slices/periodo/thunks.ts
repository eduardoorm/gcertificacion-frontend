import { createAsyncThunk } from "@reduxjs/toolkit";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { Clase, Periodo } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getPeriodos = createAsyncThunk<
        Periodo[], 
        void, 
        {rejectValue: APIError<Periodo[]>}
    >('get/periodos', async(_, {rejectWithValue}) => {        
    try {
        const response = await gcertificacionApi.get<APIResponse<Periodo[]>>('/periodos');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getPeriodoByEmpresa = createAsyncThunk<
        Periodo, 
        string,
        {rejectValue: APIError<Periodo>}
    >('get/periodos/empresa/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Periodo[]>>(`/periodos/empresa-cliente/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getPeriodoById = createAsyncThunk<
        Periodo, 
        string,
        {rejectValue: APIError<Periodo>}
    >('get/periodos/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Periodo[]>>(`/periodos/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClasesByPeriodo = createAsyncThunk<
        Clase[],
        string,
        {rejectValue: APIError<Clase[]>}
    >('get/periodos/id/clases', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/periodos/${id}/clases`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addPeriodo = createAsyncThunk<
        Periodo[],
        Periodo,
        {rejectValue: APIError<Periodo[]>}
    >('post/periodos', async(periodoData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<Periodo[]>>('/periodos', periodoData);
        return response.data.data;
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updatePeriodo = createAsyncThunk<
        Periodo,
        Periodo,
        {rejectValue: APIError<Periodo>}
    >('put/periodos', async(periodoData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<Periodo[]>>(`/periodos/${periodoData.id}`, periodoData);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deletePeriodo = createAsyncThunk<
        Periodo, 
        string, 
        {rejectValue: APIError<Periodo>}
    >('delete/periodos', async(id, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<Periodo[]>>(`/periodos/${id}`);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});
