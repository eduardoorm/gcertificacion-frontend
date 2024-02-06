export interface ItemSerie {
    name: string;
    value: number;
}

export interface CapacitacionSerie {
    avanceCapacitacion: ItemSerie[];
    avanceAreasCapacitacion: ItemSerie[];
}

export interface InduccionSerie {
    avanceInduccion: ItemSerie[];
    avanceAreasInduccion: ItemSerie[];
}

export interface DocumentacionSerie {
    avanceDescarga: ItemSerie[];
    avanceDeclaracionJurada: ItemSerie[];
    avanceAreasDescarga: ItemSerie[];
    avanceAreasDeclaracionJurada: ItemSerie[];
}
