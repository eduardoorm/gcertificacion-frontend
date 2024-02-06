import { createAsyncThunk } from "@reduxjs/toolkit";
import { BancoPreguntas } from "../../../interfaces/entities/BancoPreguntas";
import { getExceptionPayload } from "../../../util/getExceptionPayload";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { APIError, APIResponse } from "../../../interfaces/response";

export const getBancosPreguntas = createAsyncThunk<
        BancoPreguntas[],
        void,
        {rejectValue: APIError<BancoPreguntas[]>}
    >('get/bancosPreguntas', async(_, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<BancoPreguntas[]>>('/banco-preguntas');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getBancoPreguntasById = createAsyncThunk<
        BancoPreguntas,
        string,
        {rejectValue: APIError<BancoPreguntas>}
    >('get/bancosPreguntas/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<BancoPreguntas[]>>(`/banco-preguntas/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getBancosPreguntasByEmpresa = createAsyncThunk<
        BancoPreguntas[],
        string,
        {rejectValue: APIError<BancoPreguntas[]>}
    >('get/bancos-preguntas', async(id: string, {rejectWithValue}) => {
        
        try {
            const response = await gcertificacionApi.get<APIResponse<BancoPreguntas[]>>(`/empresas-clientes/${id}/periodo-activo/bancos-preguntas`);
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(getExceptionPayload(err));
        }
});

export const addBancoPreguntas = createAsyncThunk<
        BancoPreguntas[],
        BancoPreguntas,
        {rejectValue: APIError<BancoPreguntas[]>}
    >('post/bancosPreguntas', async(banco, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<BancoPreguntas[]>>('/banco-preguntas', banco);
        return response.data.data;
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updateBancoPreguntas = createAsyncThunk<
        BancoPreguntas,
        BancoPreguntas,
        {rejectValue: APIError<BancoPreguntas>}
    >('put/bancosPreguntas', async(banco, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<BancoPreguntas[]>>(`/banco-preguntas/${banco.id}`, banco);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteBancoPreguntas = createAsyncThunk<
        BancoPreguntas,
        string,
        {rejectValue: APIError<BancoPreguntas>}
    >('delete/bancosPreguntas', async(id, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<BancoPreguntas[]>>(`/banco-preguntas/${id}`);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});