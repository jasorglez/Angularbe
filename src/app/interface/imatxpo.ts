export interface Imatxpo {
  id?           : number;
  idPo?       : number; // Use ? if the property is optional (nullable in the database)
  idSupplies? : number; // Use ? if the property is optional (nullable in the database)
  Quantity     : number;
  Sales        : number;
  Comment?     : string; // Use ? if the property is optional (nullable in the database)
  descmat?     : string;
}