import { createAsyncThunk } from "@reduxjs/toolkit";
import { Archivo, Clase } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getClases = createAsyncThunk<
        Clase[],
        void,
        {rejectValue: APIError<Clase[]>}
    >('get/clases', async(_, {rejectWithValue}) => {    
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>('/clases');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClaseById = createAsyncThunk<
        Clase,
        string,
        {rejectValue: APIError<Clase>}
    >('get/clases/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/clases/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClasesByEmpresa = createAsyncThunk<
        Clase[],
        string,
        {rejectValue: APIError<Clase[]>}
    >('get/clases/empresa/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/empresas-clientes/${id}/periodo-activo/clases`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClasesByTrabajador = createAsyncThunk<
        Clase[],
        string,
        {rejectValue: APIError<Clase[]>}
    >('get/clases/trabajador/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/trabajadores/${id}/periodo-activo/clases`);
        console.log(response.data.data)
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClasesInduccionByTrabajador = createAsyncThunk<
        Clase[],
        string,
        {rejectValue: APIError<Clase[]>}
    >('get/clases/trabajador/id/induccion', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/trabajadores/${id}/periodo-activo/clases/induccion`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClasesCapacitacionByTrabajador = createAsyncThunk<
        Clase[],
        string,
        {rejectValue: APIError<Clase[]>}
    >('get/clases/trabajador/id/capacitacion', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/trabajadores/${id}/periodo-activo/clases/capacitacion`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClasesDocumentacionByTrabajador = createAsyncThunk<
        Clase[],
        string,
        {rejectValue: APIError<Clase[]>}
    >('get/clases/trabajador/id/documentacion', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Clase[]>>(`/trabajadores/${id}/periodo-activo/clases/documentacion`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addClase = createAsyncThunk<
        Clase[],
        Clase,
        {rejectValue: APIError<Clase[]>}
    >('post/clases', async(claseData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<Clase[]>>('/clases', claseData);
        return response.data.data;
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updateClase = createAsyncThunk<
        Clase,
        Clase,
        {rejectValue: APIError<Clase>}
    >('put/clases', async(claseData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<Clase[]>>(`/clases/${claseData.id}`, claseData);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteClase = createAsyncThunk<
        Clase,
        string,
        {rejectValue: APIError<Clase>}
    >('delete/clases', async(id, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<Clase[]>>(`/clases/${id}`);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});