import { createAsyncThunk } from "@reduxjs/toolkit";
import { ArchivoTrabajador } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getDeclaracionesJuradasByTrabajador = createAsyncThunk<
        ArchivoTrabajador[],
        string,
        {rejectValue: APIError<ArchivoTrabajador[]>}
    >('get/archivos-trabajadores/trabajador', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<ArchivoTrabajador[]>>(`/archivos-trabajadores/trabajador/${id}`);
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

//El proceso de aceptación implica la creación del registro en base de datos
export const acceptDeclaracionJurada = createAsyncThunk<
        ArchivoTrabajador,
        ArchivoTrabajador,
        {rejectValue: APIError<ArchivoTrabajador>}
    >('accept/archivos-trabajadores', async(archivoTrabajador: ArchivoTrabajador, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<ArchivoTrabajador[]>>(`/archivos-trabajadores/accept`, archivoTrabajador);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const marcarArchivoDescargado = createAsyncThunk<
        ArchivoTrabajador,
        ArchivoTrabajador,
        {rejectValue: APIError<ArchivoTrabajador>}
    >('download/archivos-trabajadores', async(archivoTrabajador: ArchivoTrabajador, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.post<APIResponse<ArchivoTrabajador[]>>(`/archivos-trabajadores/download`, archivoTrabajador);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});