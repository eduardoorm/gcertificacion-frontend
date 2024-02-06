import { configureStore, combineReducers, AnyAction, Reducer } from "@reduxjs/toolkit";
import { usuarioSlice } from "./slices/usuario";
import { empresaClienteSlice } from "./slices/empesaCliente";
import { periodoSlice } from "./slices/periodo";
import { claseSlice } from "./slices/clase";
import { archivoSlice } from "./slices/archivo";
import { bancosPreguntasSlice } from "./slices/bancoPreguntas";
import { trabajadorSlice } from "./slices/trabajador";
import { clasesTrabajadoresSlice } from "./slices/claseTrabajador";
import { examenAzarSlice } from "./slices/examenAzar";
import { archivoTrabajadorSlice } from "./slices/archivoTrabajador";

import { persistStore, persistReducer, FLUSH, REGISTER, PURGE, PERSIST, PAUSE, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { induccionSlice, capacitacionSlice, documentacionSlice } from "./slices/reporte";

const persistConfig = {
    key: 'root',
    storage,
    //whitelist: ['usuarios'],
}

const appReducer = combineReducers({
    archivos: archivoSlice.reducer,
    archivosTrabajadores: archivoTrabajadorSlice.reducer,
    bancosPreguntas: bancosPreguntasSlice.reducer,
    clases: claseSlice.reducer,
    clasesTrabajadores: clasesTrabajadoresSlice.reducer,
    empresas: empresaClienteSlice.reducer,
    examenesAzar: examenAzarSlice.reducer,
    periodos: periodoSlice.reducer,
    trabajadores: trabajadorSlice.reducer,
    usuarios: usuarioSlice.reducer,
    capacitacionReports: capacitacionSlice.reducer,
    induccionReports: induccionSlice.reducer,
    documentacionReports : documentacionSlice.reducer,
});

const initialState = appReducer({
    archivos:archivoSlice.getInitialState(), 
    archivosTrabajadores: archivoTrabajadorSlice.getInitialState(),
    bancosPreguntas:bancosPreguntasSlice.getInitialState(),
    clases: claseSlice.getInitialState(),
    clasesTrabajadores: clasesTrabajadoresSlice.getInitialState(),
    empresas: empresaClienteSlice.getInitialState(),
    examenesAzar: examenAzarSlice.getInitialState(),
    periodos: periodoSlice.getInitialState(),
    trabajadores: trabajadorSlice.getInitialState(),
    usuarios: usuarioSlice.getInitialState(),
    capacitacionReports: capacitacionSlice.getInitialState(),
    induccionReports: induccionSlice.getInitialState(),
    documentacionReports : documentacionSlice.getInitialState(),
}, archivoSlice.actions.setArchivos);

const rootReducer: Reducer = (state: ReturnType<typeof appReducer>, action: AnyAction) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(initialState, action);
    }

    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;