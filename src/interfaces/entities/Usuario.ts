export enum TIPO_USUARIO {
    TRABAJADOR = 'trabajador',
    ADMIN = 'admin',
    EMPRESA = 'empresa',
}

export interface Usuario {
    id: number;
    nombre_completo: string,
    usuario: string,
    clave: string,
    tipo: string
    activo: 0|1
}

export interface UserAuthenticated {
    id_trabajador: number,
    id_empresa_cliente?: number,
    razon_social?: string,
    ruc?: string,
    logo?: string,
    nombres: string,
    apellidos: string,
    usuario: string,
    tipo: TIPO_USUARIO,
    token: string,
    tokenType: 'Bearer'|'Basic',
    recargar_lista_clientes: boolean,
}
