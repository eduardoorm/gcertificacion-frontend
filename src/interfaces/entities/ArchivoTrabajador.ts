import { APIData } from "../response";

export enum DECLARACION_JURADA_ACEPTADA {
    ACEPTADA = 1,
    RECHAZADA = 0,
};

export enum ARCHIVO_DESCARGADO {
    SI = 1,
    NO = 0,
};

export interface ArchivoTrabajador {
    id: number;
    id_archivo: number;
    id_trabajador: number;
    descargado: ARCHIVO_DESCARGADO;
    aceptado: DECLARACION_JURADA_ACEPTADA;
}

export interface ArchivoTrabajadorState {
    archivosTrabajadores: APIData<ArchivoTrabajador[]>;
}