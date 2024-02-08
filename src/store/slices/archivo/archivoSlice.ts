import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Archivo, ArchivoState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addArchivo, deleteArchivo, getArchivoById, getArchivosByClase, getArchivos, updateArchivo } from "./thunks";

const initialState: ArchivoState = {
    archivos: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const archivoSlice = createSlice({
    name: 'archivo',
    initialState,
    reducers: {
        setArchivos: (state, action: PayloadAction<Archivo[]>) => {
            state.archivos.data = action.payload
        }
     },
    extraReducers(builder) {
        builder
        .addCase(getArchivos.pending, (state) => {
            state.archivos.status = APIStatus.PENDING;
        })
        .addCase(getArchivos.fulfilled, (state, action) => {
            state.archivos.status = APIStatus.FULFILLED;
            state.archivos.data = action.payload;
        })
        .addCase(getArchivos.rejected, (state, action) => {
            state.archivos.status = APIStatus.REJECTED;
            state.archivos.error = action.payload;
        })
        .addCase(getArchivoById.pending, (state) => {
            state.archivos.status = APIStatus.PENDING;
        })
        .addCase(getArchivoById.fulfilled, (state, action) => {
            state.archivos.status = APIStatus.FULFILLED;
            state.archivos.data = [action.payload];
        })
        .addCase(getArchivosByClase.pending, (state) => {
            state.archivos.status = APIStatus.PENDING;
        })
        .addCase(getArchivosByClase.fulfilled, (state, action) => {
            state.archivos.status = APIStatus.FULFILLED;
            state.archivos.data = action.payload;
        })
        .addCase(getArchivosByClase.rejected, (state, action) => {
            state.archivos.status = APIStatus.REJECTED;
            state.archivos.error = action.payload;
        })
        .addCase(getArchivoById.rejected, (state, action) => {
            state.archivos.status = APIStatus.REJECTED;
            state.archivos.error = action.payload;
        })
        .addCase(addArchivo.pending, (state) => {
            state.archivos.status = APIStatus.PENDING;
        })
        .addCase(addArchivo.fulfilled, (state, action) => {
            state.archivos.status = APIStatus.FULFILLED;
            state.archivos.data.push(action.payload[0]);
        })
        .addCase(addArchivo.rejected, (state, action) => {
            state.archivos.status = APIStatus.REJECTED;
            state.archivos.error = action.payload;
        })
        .addCase(updateArchivo.pending, (state) => {
            state.archivos.status = APIStatus.PENDING;
        })
        .addCase(updateArchivo.fulfilled, (state, action) => {
            state.archivos.status = APIStatus.FULFILLED;
            state.archivos.data = state.archivos.data.map(archivo => {
                if (archivo.id === action.payload.id) {
                    return action.payload;
                }
                return archivo;
            })
        })
        .addCase(updateArchivo.rejected, (state, action) => {
            state.archivos.status = APIStatus.REJECTED;
            state.archivos.error = action.payload;
        })
        .addCase(deleteArchivo.pending, (state) => {
            state.archivos.status = APIStatus.PENDING;
        })
        .addCase(deleteArchivo.fulfilled, (state, action) => {
            state.archivos.status = APIStatus.FULFILLED;
            state.archivos.data = state.archivos.data.filter(archivo => archivo.id !== action.payload.id);
        })
        .addCase(deleteArchivo.rejected, (state, action) => {
            state.archivos.status = APIStatus.REJECTED;
            state.archivos.error = action.payload;
        });
    }
});

export const { setArchivos } = archivoSlice.actions;