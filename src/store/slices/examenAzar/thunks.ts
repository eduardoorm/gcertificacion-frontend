import { createAsyncThunk } from "@reduxjs/toolkit";
import { ExamenAzar, ExamenResuelto } from "../../../interfaces/entities";
import { getExceptionPayload } from "../../../util/getExceptionPayload";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { APIError, APIResponse } from "../../../interfaces/response";

export const getExamenAzarByClaseTrabajador = createAsyncThunk<
        ExamenAzar,
        string,
        {rejectValue: APIError<ExamenAzar>}
    >('get/examen_azar/clase_trabajador', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<ExamenAzar[]>>(`/examenes-azar/clase-trabajador/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addExamenAzar = createAsyncThunk<
        ExamenAzar,
        ExamenAzar,
        {rejectValue: APIError<ExamenAzar>}
    >('post/examen_azar', async(examenAzarData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<ExamenAzar[]>>('/examenes-azar', examenAzarData);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const solveExamenAzar = createAsyncThunk<
        ExamenAzar,
        ExamenResuelto,
        {rejectValue: APIError<ExamenAzar>}
    >('post/examen_azar/solve', async(examenResuelto, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<ExamenAzar[]>>('/examenes-azar/solve', examenResuelto);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});
