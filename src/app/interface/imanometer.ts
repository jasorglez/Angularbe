export interface Imanometer {
  id                   : number;
  id_psv?              : number;
  consecutivo          : number;
  brand                : string;
  identification       : string;
  numberserie          : string;
  numbercertificate?   : string;
  interval?            : string;
  datecalibratepatron? : Date | null;
  datenextcalibrate?   : Date | null;
}
