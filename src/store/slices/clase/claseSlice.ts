import { createSlice } from "@reduxjs/toolkit";
import { ClaseState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addClase, deleteClase, getClaseById, getClases, getClasesByEmpresa, getClasesByTrabajador, getClasesCapacitacionByTrabajador, getClasesDocumentacionByTrabajador, getClasesInduccionByTrabajador, updateClase } from "./thunks";

const initialState: ClaseState = {
    clases: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const claseSlice = createSlice({
    name: 'clase',
    initialState,
    reducers: {
        initializeStateClases: (state, action) => {
            state.clases.data = action.payload;
        },

    },
    extraReducers(builder) {
        builder
        .addCase(getClases.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClases.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = action.payload;
        })
        .addCase(getClases.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(getClaseById.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClaseById.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = [action.payload];
        })
        .addCase(getClaseById.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(getClasesByEmpresa.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClasesByEmpresa.fulfilled, (state, action) => {
            console.log('dentro de getClasesByEmpresa en el archivo claseSlice');
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = action.payload;
        })
        .addCase(getClasesByEmpresa.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(getClasesByTrabajador.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClasesByTrabajador.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = action.payload;
        })
        .addCase(getClasesByTrabajador.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(getClasesInduccionByTrabajador.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClasesInduccionByTrabajador.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = action.payload;
        })
        .addCase(getClasesInduccionByTrabajador.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(getClasesCapacitacionByTrabajador.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClasesCapacitacionByTrabajador.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = action.payload;
        })
        .addCase(getClasesCapacitacionByTrabajador.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(getClasesDocumentacionByTrabajador.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(getClasesDocumentacionByTrabajador.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = action.payload;
        })
        .addCase(getClasesDocumentacionByTrabajador.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(addClase.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(addClase.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data.push(action.payload[0]);
        })
        .addCase(addClase.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(updateClase.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(updateClase.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = state.clases.data.map(clase => {
                if (clase.id === action.payload.id) {
                    return action.payload;
                }
                return clase;
            });
        })
        .addCase(updateClase.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        })
        .addCase(deleteClase.pending, (state) => {
            state.clases.status = APIStatus.PENDING;
        })
        .addCase(deleteClase.fulfilled, (state, action) => {
            state.clases.status = APIStatus.FULFILLED;
            state.clases.data = state.clases.data.filter(clase => clase.id !== action.payload.id);
        })
        .addCase(deleteClase.rejected, (state, action) => {
            state.clases.status = APIStatus.REJECTED;
            state.clases.error = action.payload;
        });
    }
});

export const { initializeStateClases } = claseSlice.actions;