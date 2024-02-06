import { createSlice } from "@reduxjs/toolkit";
import { EmpresaClienteState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addEmpresa, getEmpresas, getEmpresaById, deleteEmpresa, updateEmpresa } from "./thunks";

const initialState: EmpresaClienteState = {
    empresasCliente: {
        status: APIStatus.IDLE,
        data: []
    },
}

export const empresaClienteSlice = createSlice({
    name: 'empresaCliente',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getEmpresas.pending, (state) => {
            state.empresasCliente.status = APIStatus.PENDING;
        })
        .addCase(getEmpresas.fulfilled, (state, action) => {
            state.empresasCliente.status = APIStatus.FULFILLED;
            state.empresasCliente.data = action.payload;
        })
        .addCase(getEmpresas.rejected, (state, action) => {
            state.empresasCliente.status = APIStatus.REJECTED;
            state.empresasCliente.error = action.payload;
        })
        .addCase(getEmpresaById.pending, (state) => {
            state.empresasCliente.status = APIStatus.PENDING;
        })
        .addCase(getEmpresaById.fulfilled, (state, action) => {
            state.empresasCliente.status = APIStatus.FULFILLED;
            state.empresasCliente.data = state.empresasCliente.data.map((item) => {
                if(item.id === action.payload.id) {
                    return action.payload;
                }
                return item
            })
        })
        .addCase(getEmpresaById.rejected, (state, action) => {
            state.empresasCliente.status = APIStatus.REJECTED;
            state.empresasCliente.error = action.payload;
        })
        .addCase(addEmpresa.pending, (state) => {
            state.empresasCliente.status = APIStatus.PENDING;
        })
        .addCase(addEmpresa.fulfilled, (state, action) => {
            state.empresasCliente.status = APIStatus.FULFILLED;
            state.empresasCliente.data = [...state.empresasCliente.data, action.payload[0]];
        })
        .addCase(addEmpresa.rejected, (state, action) => {
            state.empresasCliente.status = APIStatus.REJECTED;
            state.empresasCliente.error = action.payload;
        })
        .addCase(updateEmpresa.pending, (state) => {
            state.empresasCliente.status = APIStatus.PENDING;
        })
        .addCase(updateEmpresa.fulfilled, (state, action) => {
            state.empresasCliente.status = APIStatus.FULFILLED;
            state.empresasCliente.data = state.empresasCliente.data.map(empresa => {
                if(empresa.id === action.payload.id) {
                    return action.payload;
                }
                return empresa;
            });
        })
        .addCase(updateEmpresa.rejected, (state, action) => {
            state.empresasCliente.status = APIStatus.REJECTED;
            state.empresasCliente.error = action.payload;
        })
        .addCase(deleteEmpresa.pending, (state) => {
            state.empresasCliente.status = APIStatus.PENDING;
        })
        .addCase(deleteEmpresa.fulfilled, (state, action) => {
            state.empresasCliente.status = APIStatus.FULFILLED;
            state.empresasCliente.data = state.empresasCliente.data.filter(empresa => empresa.id !== action.payload.id);
        })
        .addCase(deleteEmpresa.rejected, (state, action) => {
            state.empresasCliente.status = APIStatus.REJECTED;
            state.empresasCliente.error = action.payload;
        });
    },
});

export const selectEmpresaClienteById = (state: any, idEmpresa: number) => state.empresas.empresasCliente.data.find((item: any) => item.id === idEmpresa);
//export const { selectEmpresaClienteById } = empresaClienteSlice.actions;