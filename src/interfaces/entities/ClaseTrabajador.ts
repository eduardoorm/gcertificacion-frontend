import { APIData } from "../response";

export interface ClaseTrabajador {
    id: number,
    id_clase: number,
    id_trabajador: number,
    id_usuario: number,
    numero_intentos: number,
}

export interface ClaseTrabajadorMatricula {
    id_clase: number,
    ids_trabajadores: number[],
}

export interface ClaseTrabajadorState {
    clasesTrabajadores: APIData<ClaseTrabajador[]>
}