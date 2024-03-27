export interface Ipsv {
  id: number;
  id_company?  : string;
  consecutivo  : number ;
  brand: string;
  serialnumber: string;
  typevalvule: string;
  model: string;
  modelpilot?: string;
  id_spare?: number;
  id_entryflange?: number;
  body?: string;
  bonete?: string;
  interns?: string;
  seat?: string;
  seals?: string;
  fuelle?: string;
  area?: number;
  designation?: string;
  matbody?: string;
  matinter?: string;
  matsealseat?: string;
  nspring?: string;
  matspring?: string;
  pressureof?: number;
  pressureto?: number;
  rantempof?: number;
  rantempto?: number;
  test?: string;
  place?: string;
  pressureajfr?: number;
  pressureajhot?: string;
  id_manometro?: number;
  picture? : string ;  //solo para obtener el valor sap
}
