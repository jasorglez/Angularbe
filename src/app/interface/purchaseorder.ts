export interface Ipurchaseorder {
  id?           : number ;
  numorder      : string ;
  date          : Date   ;
  idProvider   : number ;
  idCompany    : string ;
  delivery?     : string ;
  deliverytime? : string ;
  datedelivery? : Date   ;
  idPay        : number ;
  idCurrency   : number ;
  conditions?   : string ;
  adresssend?   : string ;
  citysend      : string ;
  phonesend?    : string ;
  idRequest?   : number ;
  idAuthorizes?: number ;
  status        : string ;
  desCurr?      : string ;
  comment?      : string ;
  isValidGetMaterials?: boolean;
}
