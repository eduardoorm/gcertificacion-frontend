import { createAsyncThunk } from "@reduxjs/toolkit";
import { gcertificacionApi } from "../../../api/gcertificacionApi";
import { EmpresaCliente } from "../../../interfaces/entities";
import { APIError, APIResponse } from "../../../interfaces/response";
import { getExceptionPayload } from "../../../util/getExceptionPayload";

export const getEmpresas = createAsyncThunk<
        EmpresaCliente[],
        void,
        {rejectValue: APIError<EmpresaCliente[]>}
    >('get/empresas-clientes', async(_, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<EmpresaCliente[]>>('/empresas-clientes');
        return response.data.data;
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const getEmpresaById = createAsyncThunk<
        EmpresaCliente,
        string,
        {rejectValue: APIError<EmpresaCliente>}
    >('get/empresas-clientes/id', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<EmpresaCliente[]>>(`/empresas-clientes/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const addEmpresa = createAsyncThunk<
        EmpresaCliente[], 
        EmpresaCliente, 
        {rejectValue: APIError<EmpresaCliente[]>}
    >('post/empresas-clientes', async(empresaData, {rejectWithValue}) => {   
    try {
        const response = await gcertificacionApi.post<APIResponse<EmpresaCliente[]>>('/empresas-clientes', empresaData);
        return response.data.data;
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const updateEmpresa = createAsyncThunk<
        EmpresaCliente, 
        EmpresaCliente, 
        {rejectValue: APIError<EmpresaCliente>}
    >('put/empresas-clientes', async(empresaData, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.put<APIResponse<EmpresaCliente[]>>(`/empresas-clientes/${empresaData.id}`, empresaData);
        return response.data.data[0];
    } catch(err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});

export const deleteEmpresa = createAsyncThunk<
        EmpresaCliente,
        string,
        {rejectValue: APIError<EmpresaCliente>}
    >('delete/empresas-clientes', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.delete<APIResponse<EmpresaCliente[]>>(`/empresas-clientes/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }    
});