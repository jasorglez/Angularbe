export interface Imaterials {
    id?: number,
    idCompany?    : string,
    insumo        : string,
    articulo?     : string,
    idFamilia?    : number,
    idMedida?     : number,
    idUbication? : number,
    description   : string,
    date?         : Date,
    costoMN?      : number,
    costoDLL?     : number,
    ventaMN      : number,
    ventaDLL?    : number,
    picture?     : string
    aplicaResg? : boolean;
}
