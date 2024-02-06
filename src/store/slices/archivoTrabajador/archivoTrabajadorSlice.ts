import { createSlice } from "@reduxjs/toolkit";
import { APIStatus } from "../../../interfaces/response";
import { ArchivoTrabajadorState } from "../../../interfaces/entities";
import { acceptDeclaracionJurada, getDeclaracionesJuradasByTrabajador, marcarArchivoDescargado} from "./thunks";

const initialState: ArchivoTrabajadorState = {
    archivosTrabajadores: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const archivoTrabajadorSlice = createSlice({
    name: 'archivoTrabajador',
    initialState,
    reducers: { },
    extraReducers(builder) {
        builder
        .addCase(getDeclaracionesJuradasByTrabajador.pending, (state) => {
            state.archivosTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(getDeclaracionesJuradasByTrabajador.fulfilled, (state, action) => {
            state.archivosTrabajadores.status = APIStatus.FULFILLED;
            state.archivosTrabajadores.data = action.payload;
        })
        .addCase(getDeclaracionesJuradasByTrabajador.rejected, (state, action) => {
            state.archivosTrabajadores.status = APIStatus.REJECTED;
            state.archivosTrabajadores.error = action.payload;
        })
        .addCase(acceptDeclaracionJurada.pending, (state) => {
            state.archivosTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(acceptDeclaracionJurada.fulfilled, (state, action) => {
            state.archivosTrabajadores.status = APIStatus.FULFILLED;
            if(state.archivosTrabajadores.data.length === 0){
                state.archivosTrabajadores.data = [action.payload];
            }
            else {
                /*state.archivosTrabajadores.data = state.archivosTrabajadores.data.map((item) => {
                    if (item.id === action.payload.id) {
                        return action.payload;
                    }
                    return item;
                });*/
                state.archivosTrabajadores.data = [...state.archivosTrabajadores.data, action.payload];
            }
        })
        .addCase(acceptDeclaracionJurada.rejected, (state, action) => {
            state.archivosTrabajadores.status = APIStatus.REJECTED;
            state.archivosTrabajadores.error = action.payload;
        })
        .addCase(marcarArchivoDescargado.pending, (state) => {
            state.archivosTrabajadores.status = APIStatus.PENDING;
        })
        .addCase(marcarArchivoDescargado.fulfilled, (state, action) => {
            state.archivosTrabajadores.status = APIStatus.FULFILLED;
            if(state.archivosTrabajadores.data.length === 0){
                state.archivosTrabajadores.data = [action.payload];
            }
            else {
                state.archivosTrabajadores.data = state.archivosTrabajadores.data.map((item) => {
                    if (item.id === action.payload.id) {
                        return action.payload;
                    }
                    return item;
                });
            }
        });

    },
});