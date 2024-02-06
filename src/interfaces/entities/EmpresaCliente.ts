import { APIData } from "../response"
import { Periodo } from "./Periodo"
import { Trabajador } from "./Trabajador"

export interface EmpresaCliente {
    id: number,
    razon_social: string,
    direccion: string,
    telefono: string,
    ruc: string,
    correo: string,
    numero_trabajadores: number,
    responsable: string,
    logo: string,
    periodos?: Periodo[],
    trabajadores?: Trabajador[],
};

export const EmpresaClienteInitialState: EmpresaCliente = {
    id: 0,
    razon_social: '',
    direccion: '',
    telefono: '',
    ruc: '',
    correo: '',
    numero_trabajadores: 0,
    responsable: '',
    logo: '',
};

export interface EmpresaClienteState {
    empresasCliente: APIData<EmpresaCliente[]>
}