import { createSlice } from "@reduxjs/toolkit";
import { TrabajadorState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addTrabajador, deleteTrabajador, deleteTrabajadores, desmatricularTrabajadores, getTrabajadorById, getTrabajadores, getTrabajadoresByEmpresa, getTrabajadoresMatriculados, updateTrabajador } from "./thunks";

const initialState: TrabajadorState = {
    trabajadores: {
        status: APIStatus.IDLE,
        data: [],
    }
}

export const trabajadorSlice = createSlice({
    name: 'trabajador',
    initialState,
    reducers: {
        setTrabajadores: (state, action) => {
            state.trabajadores.data = action.payload;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(getTrabajadores.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(getTrabajadores.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = action.payload;
        })
        .addCase(getTrabajadores.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(getTrabajadorById.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(getTrabajadorById.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = [action.payload];
        })
        .addCase(getTrabajadorById.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(getTrabajadoresByEmpresa.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(getTrabajadoresByEmpresa.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = action.payload;
        })
        .addCase(getTrabajadoresByEmpresa.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(getTrabajadoresMatriculados.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(getTrabajadoresMatriculados.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = action.payload;
        })
        .addCase(getTrabajadoresMatriculados.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(desmatricularTrabajadores.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(desmatricularTrabajadores.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = state.trabajadores.data.filter((item) => {
                return action.payload.filter(el => el.id === item.id).length !== 0
            })
        })
        .addCase(desmatricularTrabajadores.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(addTrabajador.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(addTrabajador.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data.push(action.payload[0]);
        })
        .addCase(addTrabajador.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(updateTrabajador.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(updateTrabajador.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = state.trabajadores.data.map((trabajador) => {
                if (trabajador.id === action.payload.id) {
                    return action.payload;
                }
                return trabajador
            })
        })
        .addCase(updateTrabajador.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        .addCase(deleteTrabajador.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(deleteTrabajador.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = state.trabajadores.data.filter((trabajador) => {
                return trabajador.id !== action.payload.id;
            })
        })
        .addCase(deleteTrabajador.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
        
        .addCase(deleteTrabajadores.pending, (state) => {
            state.trabajadores.status = APIStatus.PENDING;
        })
        .addCase(deleteTrabajadores.fulfilled, (state, action) => {
            state.trabajadores.status = APIStatus.FULFILLED;
            state.trabajadores.data = state.trabajadores.data.filter((trabajador) => {
                return action.payload.filter(el => el.id === trabajador.id).length === 0
            })
        })
        .addCase(deleteTrabajadores.rejected, (state, action) => {
            state.trabajadores.status = APIStatus.REJECTED;
            state.trabajadores.error = action.payload;
        })
    }
});

export const { setTrabajadores } = trabajadorSlice.actions;