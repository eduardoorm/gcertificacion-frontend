import { createAsyncThunk } from "@reduxjs/toolkit";
import { ClaseTrabajadorMatricula, Trabajador } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getTrabajadores = createAsyncThunk<
        Trabajador[],
        void,
        {rejectValue: APIError<Trabajador[]>}
    >('get/trabajadores', async(_, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Trabajador[]>>('/trabajadores');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getTrabajadorById = createAsyncThunk<
        Trabajador,
        string,
        {rejectValue: APIError<Trabajador>}
    >('get/trabajadores/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Trabajador[]>>(`/trabajadores/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getTrabajadoresByEmpresa = createAsyncThunk<
        Trabajador[],
        string,
        {rejectValue: APIError<Trabajador[]>}
    >('get/trabajadores/empresa/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Trabajador[]>>(`/empresas-clientes/${id}/trabajadores`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getTrabajadoresMatriculados = createAsyncThunk<
        Trabajador[],
        string,
        {rejectValue: APIError<Trabajador[]>}
    >('get/trabajadores/matriculados/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<Trabajador[]>>(`/trabajadores/matriculados/${id}`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const desmatricularTrabajadores = createAsyncThunk<
        Trabajador[],
        ClaseTrabajadorMatricula,
        {rejectValue: APIError<Trabajador>}
    >('desmatricular/clasesTrabajadores', async(claseTrabajadorMatricula: ClaseTrabajadorMatricula, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<Trabajador[]>>('/clases-trabajadores/desmatricular', claseTrabajadorMatricula);

        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addTrabajador = createAsyncThunk<
        Trabajador[],
        Trabajador,
        {rejectValue: APIError<Trabajador[]>}
    >('add/trabajador', async(trabajador: Trabajador, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<Trabajador[]>>('/trabajadores', trabajador);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updateTrabajador = createAsyncThunk<
        Trabajador,
        Trabajador,
        {rejectValue: APIError<Trabajador>}
    >('update/trabajador', async(trabajador: Trabajador, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<Trabajador[]>>('/trabajadores', trabajador);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteTrabajador = createAsyncThunk<
        Trabajador,
        string,
        {rejectValue: APIError<Trabajador>}
    >('delete/trabajador', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<Trabajador[]>>(`/trabajadores/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteTrabajadores = createAsyncThunk<
        Trabajador[],
        number[],
        {rejectValue: APIError<Trabajador>}
    >('delete/trabajadores', async(ids: number[], {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<Trabajador[]>>(`/trabajadores/eliminar`, {ids_trabajadores: ids});
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});