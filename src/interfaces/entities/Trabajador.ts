import { APIData } from "../response";
import { Clase } from "./Clase";

export interface Trabajador {
    id: number,
    id_empresa_cliente: number,
    nombres: string,
    apellidos: string,
    dni: string,
    area: string,
    puesto: string,
    sede: string,
    fecha_nacimiento: string
}

export interface TrabajadorConClases {
    id: number,
    id_empresa_cliente: number,
    nombres: string,
    apellidos: string,
    dni: string,
    area: string,
    puesto: string,
    sede: string,
    fecha_nacimiento: string,
    clases: Clase[]
}

export interface TrabajadorState {
    trabajadores: APIData<Trabajador[]>,
}