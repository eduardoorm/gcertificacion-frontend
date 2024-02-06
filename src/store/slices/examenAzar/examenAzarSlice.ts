import { createSlice } from "@reduxjs/toolkit";
import { ExamenAzarState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addExamenAzar, getExamenAzarByClaseTrabajador, solveExamenAzar } from "./thunks";

const initialState: ExamenAzarState = {
    examenesAzar: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const examenAzarSlice = createSlice({
    name: 'examen_azar',
    initialState,
    reducers: {
        initializeStateExamenesAzar: (state) => {
            state = initialState;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(getExamenAzarByClaseTrabajador.pending, (state) => {
            state.examenesAzar.status = APIStatus.PENDING;
        })
        .addCase(getExamenAzarByClaseTrabajador.fulfilled, (state, action) => {
            state.examenesAzar.status = APIStatus.FULFILLED;
            state.examenesAzar.data = [action.payload];
        })
        .addCase(getExamenAzarByClaseTrabajador.rejected, (state, action) => {
            state.examenesAzar.status = APIStatus.REJECTED;
            state.examenesAzar.error = action.payload;
        })
        .addCase(addExamenAzar.pending, (state) => {
            state.examenesAzar.status = APIStatus.PENDING;
        })
        .addCase(addExamenAzar.fulfilled, (state, action) => {
            state.examenesAzar.status = APIStatus.FULFILLED;
            state.examenesAzar.data = [action.payload];
        })
        .addCase(addExamenAzar.rejected, (state, action) => {
            state.examenesAzar.status = APIStatus.REJECTED;
            state.examenesAzar.error = action.payload;
        })
        .addCase(solveExamenAzar.pending, (state) => {
            state.examenesAzar.status = APIStatus.PENDING;
        })
        .addCase(solveExamenAzar.fulfilled, (state, action) => {
            state.examenesAzar.status = APIStatus.FULFILLED;
            state.examenesAzar.data = state.examenesAzar.data.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload;
                }
                return item;
            });
        })
        .addCase(solveExamenAzar.rejected, (state, action) => {
            state.examenesAzar.status = APIStatus.REJECTED;
            state.examenesAzar.error = action.payload;
        });
    }
});