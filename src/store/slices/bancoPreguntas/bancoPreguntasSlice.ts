import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BancoPreguntas, BancoPreguntasState } from "../../../interfaces/entities/BancoPreguntas";
import { APIStatus } from "../../../interfaces/response";
import { addBancoPreguntas, deleteBancoPreguntas, getBancoPreguntasById, getBancosPreguntas, getBancosPreguntasByEmpresa, updateBancoPreguntas } from "./thunks";

const initialState: BancoPreguntasState = {
    bancosPreguntas: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const bancosPreguntasSlice = createSlice({
    name: 'bancosPreguntas',
    initialState,
    reducers: {
        setBancosPreguntas: (state, action: PayloadAction<BancoPreguntas[]>) => {
            state.bancosPreguntas.data = action.payload;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(getBancosPreguntas.pending, (state) => {
            state.bancosPreguntas.status = APIStatus.PENDING;
        })
        .addCase(getBancosPreguntas.fulfilled, (state, action) => {
            state.bancosPreguntas.status = APIStatus.FULFILLED;
            state.bancosPreguntas.data = action.payload;
        })
        .addCase(getBancosPreguntas.rejected, (state, action) => {
            state.bancosPreguntas.status = APIStatus.REJECTED;
            state.bancosPreguntas.error = action.payload;
        })
        .addCase(getBancoPreguntasById.pending, (state) => {
            state.bancosPreguntas.status = APIStatus.PENDING;
        })
        .addCase(getBancoPreguntasById.fulfilled, (state, action) => {
            state.bancosPreguntas.status = APIStatus.FULFILLED;
            state.bancosPreguntas.data = [action.payload];
        })
        .addCase(getBancoPreguntasById.rejected, (state, action) => {
            state.bancosPreguntas.status = APIStatus.REJECTED;
            state.bancosPreguntas.error = action.payload;
        })
        .addCase(getBancosPreguntasByEmpresa.pending, (state) => {
            state.bancosPreguntas.status = APIStatus.PENDING;
        })
        .addCase(getBancosPreguntasByEmpresa.fulfilled, (state, action) => {
            state.bancosPreguntas.status = APIStatus.FULFILLED;
            state.bancosPreguntas.data = action.payload;
        })
        .addCase(getBancosPreguntasByEmpresa.rejected, (state, action) => {
            state.bancosPreguntas.status = APIStatus.REJECTED;
            state.bancosPreguntas.error = action.payload;
        })
        .addCase(addBancoPreguntas.pending, (state) => {
            state.bancosPreguntas.status = APIStatus.PENDING;
        })
        .addCase(addBancoPreguntas.fulfilled, (state, action) => {
            state.bancosPreguntas.status = APIStatus.FULFILLED;
            state.bancosPreguntas.data.push(action.payload[0]);
        })
        .addCase(addBancoPreguntas.rejected, (state, action) => {
            state.bancosPreguntas.status = APIStatus.REJECTED;
            state.bancosPreguntas.error = action.payload;
        })
        .addCase(updateBancoPreguntas.pending, (state) => {
            state.bancosPreguntas.status = APIStatus.PENDING;
        })
        .addCase(updateBancoPreguntas.fulfilled, (state, action) => {
            state.bancosPreguntas.status = APIStatus.FULFILLED;
            state.bancosPreguntas.data = [action.payload];
        })
        .addCase(updateBancoPreguntas.rejected, (state, action) => {
            state.bancosPreguntas.status = APIStatus.REJECTED;
            state.bancosPreguntas.error = action.payload;
        })
        .addCase(deleteBancoPreguntas.pending, (state) => {
            state.bancosPreguntas.status = APIStatus.PENDING;
        })
        .addCase(deleteBancoPreguntas.fulfilled, (state, action) => {
            state.bancosPreguntas.status = APIStatus.FULFILLED;
            state.bancosPreguntas.data = state.bancosPreguntas.data.filter((item) => item.id !== action.payload.id);
        })
        .addCase(deleteBancoPreguntas.rejected, (state, action) => {
            state.bancosPreguntas.status = APIStatus.REJECTED;
            state.bancosPreguntas.error = action.payload;
        });
    }
});

export const { setBancosPreguntas } = bancosPreguntasSlice.actions;