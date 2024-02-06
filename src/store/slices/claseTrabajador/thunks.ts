import { createAsyncThunk } from "@reduxjs/toolkit";
import { ClaseTrabajador, ClaseTrabajadorMatricula, Trabajador } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getClasesTrabajadores = createAsyncThunk<
        ClaseTrabajador[],
        void,
        {rejectValue: APIError<ClaseTrabajador[]>}
    >('get/clasesTrabajadores', async(_, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<ClaseTrabajador[]>>('/clases-trabajadores');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getClaseTrabajadorById = createAsyncThunk<
        ClaseTrabajador,
        string,
        {rejectValue: APIError<ClaseTrabajador>}
    >('get/clasesTrabajadores/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<ClaseTrabajador[]>>(`/clases-trabajadores/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addClaseTrabajador = createAsyncThunk<
        ClaseTrabajador,
        ClaseTrabajador,
        {rejectValue: APIError<ClaseTrabajador>}
    >('add/clasesTrabajadores', async(claseTrabajador: ClaseTrabajador, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<ClaseTrabajador[]>>('/clases-trabajadores', claseTrabajador);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const matricularTrabajadores = createAsyncThunk<
        ClaseTrabajador,
        ClaseTrabajadorMatricula,
        {rejectValue: APIError<ClaseTrabajador>}
    >('matricular/clasesTrabajadores', async(claseTrabajadorMatricula: ClaseTrabajadorMatricula, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<ClaseTrabajador[]>>('/clases-trabajadores/matricular', claseTrabajadorMatricula);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updateClaseTrabajador = createAsyncThunk<
        ClaseTrabajador,
        ClaseTrabajador,
        {rejectValue: APIError<ClaseTrabajador>}
    >('update/clasesTrabajadores', async(claseTrabajador: ClaseTrabajador, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<ClaseTrabajador[]>>('/clases-trabajadores', claseTrabajador);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteClaseTrabajador = createAsyncThunk<
        ClaseTrabajador,
        string,
        {rejectValue: APIError<ClaseTrabajador>}
    >('delete/clasesTrabajadores', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<ClaseTrabajador[]>>(`/clases-trabajadores/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});
