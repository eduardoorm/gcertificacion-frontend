import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TIPO_USUARIO, UserAuthenticated } from "../../../interfaces/entities/Usuario";

const initialState: UserAuthenticated = {
    id_trabajador: 0,
    id_empresa_cliente: undefined,
    nombres: '',
    apellidos: '',
    usuario: '',
    tipo: TIPO_USUARIO.TRABAJADOR,
    token: '',
    tokenType: 'Bearer',
    recargar_lista_clientes: true,
}

export const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: {
        userAuthenticated: initialState,
    },
    reducers: {
        setUserAuthenticated: (state, action) => {
            state.userAuthenticated = action.payload;
        },
        updateUserAuthenticated: (state, action: PayloadAction<UserAuthenticated>) => {
            state.userAuthenticated = action.payload
        }
    }
});

export const { setUserAuthenticated, updateUserAuthenticated } = usuarioSlice.actions;