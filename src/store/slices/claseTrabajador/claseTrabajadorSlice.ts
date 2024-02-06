import { createSlice } from "@reduxjs/toolkit";
import { ClaseTrabajadorState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addClaseTrabajador, deleteClaseTrabajador, getClaseTrabajadorById, 
    getClasesTrabajadores, matricularTrabajadores, updateClaseTrabajador } from "./thunks";

const initialState: ClaseTrabajadorState = {
    clasesTrabajadores: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const clasesTrabajadoresSlice = createSlice({
    name: 'clasesTrabajadores',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getClasesTrabajadores.pending, (state) => {
            state.clasesTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(getClasesTrabajadores.fulfilled, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.FULFILLED;
            state.clasesTrabajadores.data = action.payload;
        })
        .addCase(getClasesTrabajadores.rejected, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.REJECTED;
            state.clasesTrabajadores.error = action.payload;
        })
        .addCase(getClaseTrabajadorById.pending, (state) => {
            state.clasesTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(getClaseTrabajadorById.fulfilled, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.FULFILLED;
            state.clasesTrabajadores.data = [action.payload];
        })
        .addCase(getClaseTrabajadorById.rejected, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.REJECTED;
            state.clasesTrabajadores.error = action.payload;
        })
        .addCase(addClaseTrabajador.pending, (state) => {
            state.clasesTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(addClaseTrabajador.fulfilled, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.FULFILLED;
            state.clasesTrabajadores.data.push(action.payload);
        })
        .addCase(addClaseTrabajador.rejected, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.REJECTED;
            state.clasesTrabajadores.error = action.payload;
        })
        .addCase(matricularTrabajadores.pending, (state) => {
            state.clasesTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(matricularTrabajadores.fulfilled, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.FULFILLED;
            state.clasesTrabajadores.data = [action.payload];
        })
        .addCase(matricularTrabajadores.rejected, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.REJECTED;
            state.clasesTrabajadores.error = action.payload;
        })
        .addCase(updateClaseTrabajador.pending, (state) => {
            state.clasesTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(updateClaseTrabajador.fulfilled, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.FULFILLED;
            state.clasesTrabajadores.data = state.clasesTrabajadores.data.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload;
                }
                return item;
            });
        })
        .addCase(updateClaseTrabajador.rejected, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.REJECTED;
            state.clasesTrabajadores.error = action.payload;
        })
        .addCase(deleteClaseTrabajador.pending, (state) => {
            state.clasesTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(deleteClaseTrabajador.fulfilled, (state, action) => {
            state.clasesTrabajadores.status = APIStatus.FULFILLED;
            state.clasesTrabajadores.data = state.clasesTrabajadores.data.filter((item) => item.id !== action.payload.id);
        });
    }
});
