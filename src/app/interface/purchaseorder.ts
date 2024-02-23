export interface Ipurchaseorder {
  id?           : number;
  numorder      : string;
  date          : Date;
  id_provider?  : number;
  id_company?   : number;
  delivery?     : string;
  deliverytime? : string;
  datedelivery? : Date;
  id_pay?       : number ;
  id_currency?  : number ;
  conditions?   : string ;
  adresssend?   : string ;
  phonesend?    : string ;
  id_request?   : number ;
  id_authorizes?: number ;
  status        : string ;
  desCurr?      : string ;
}
