import { createSlice } from "@reduxjs/toolkit";
import { PeriodoState } from "../../../interfaces/entities";
import { APIStatus } from "../../../interfaces/response";
import { addPeriodo, deletePeriodo, getClasesByPeriodo, getPeriodoById, getPeriodos, updatePeriodo } from "./thunks";

const initialState: PeriodoState = {
    periodos: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const periodoSlice = createSlice({
    name: 'periodo',
    initialState,
    reducers: { 
        setPeriodos: (state, action) => {

            if(!action.payload || action.payload.length === 0) {
                state.periodos.data = [];
            }
            /*else if (state.periodos.data.length === 0) {
                state.periodos.data = action.payload;
                return;
            }
            else{
                state.periodos.data = state.periodos.data.map((item) => {
                    let pay = action.payload.filter((pay: any) => {
                        return pay.id === item.id
                    });
                    
                    if(pay.length > 0) return pay[0];
                    return item;
                });
            }*/
            else {
                state.periodos.data = action.payload;
            }
            
            state.periodos.status = APIStatus.FULFILLED;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(getPeriodos.pending, (state) => {
            state.periodos.status = APIStatus.PENDING;
        })
        .addCase(getPeriodos.fulfilled, (state, action) => {
            state.periodos.status = APIStatus.FULFILLED;
            state.periodos.data = action.payload;
        })
        .addCase(getPeriodos.rejected, (state, action) => {
            state.periodos.status = APIStatus.REJECTED;
            state.periodos.error = action.payload;
        })
        .addCase(getPeriodoById.pending, (state) => {
            state.periodos.status = APIStatus.PENDING;
        })
        .addCase(getPeriodoById.fulfilled, (state, action) => {
            state.periodos.status = APIStatus.FULFILLED;
            //state.periodos.data = [action.payload];
            state.periodos.data = state.periodos.data.map((item) => {
                if(item.id === action.payload.id) {
                    return action.payload;
                }
                return item
            })
        })
        .addCase(getPeriodoById.rejected, (state, action) => {
            state.periodos.status = APIStatus.REJECTED;
            state.periodos.error = action.payload;
        })
        .addCase(getClasesByPeriodo.pending, (state) => {
            state.periodos.status = APIStatus.PENDING;
        })
        .addCase(getClasesByPeriodo.fulfilled, (state, action) => {
            state.periodos.status = APIStatus.FULFILLED;
            state.periodos.data[0].clases = action.payload;
        })
        .addCase(getClasesByPeriodo.rejected, (state, action) => {
            state.periodos.status = APIStatus.REJECTED;
            state.periodos.error = action.payload;
        })
        .addCase(addPeriodo.pending, (state) => {
            state.periodos.status = APIStatus.PENDING;
        })
        .addCase(addPeriodo.fulfilled, (state, action) => {
            state.periodos.status = APIStatus.FULFILLED;
            state.periodos.data.push(action.payload[0]);
        })
        .addCase(addPeriodo.rejected, (state, action) => {
            state.periodos.status = APIStatus.REJECTED;
            state.periodos.error = action.payload;
        })
        .addCase(updatePeriodo.pending, (state) => {
            state.periodos.status = APIStatus.PENDING;
        })
        .addCase(updatePeriodo.fulfilled, (state, action) => {
            state.periodos.status = APIStatus.FULFILLED;
            state.periodos.data = state.periodos.data.map(periodo => {
                if (periodo.id === action.payload.id) {
                    return action.payload;
                }
                return periodo;
            })
        })
        .addCase(updatePeriodo.rejected, (state, action) => {
            state.periodos.status = APIStatus.REJECTED;
            state.periodos.error = action.payload;
        })
        .addCase(deletePeriodo.pending, (state) => {
            state.periodos.status = APIStatus.PENDING;
        })
        .addCase(deletePeriodo.fulfilled, (state, action) => {
            state.periodos.status = APIStatus.FULFILLED;
            console.log(state.periodos.data.filter(periodo => periodo.id !== action.payload.id));
            state.periodos.data = state.periodos.data.filter(periodo => periodo.id !== action.payload.id);
        })
        .addCase(deletePeriodo.rejected, (state, action) => {
            state.periodos.status = APIStatus.REJECTED;
            state.periodos.error = action.payload;
        });
    }
});

export const selectPeriodoById = (state: any, id: number) => state.periodos.periodos.data.find((item: any) => item.id === id);
export const { setPeriodos } = periodoSlice.actions;