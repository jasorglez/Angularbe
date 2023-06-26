import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import emailjs,  { EmailJSResponseStatus} from 'emailjs-com'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailjsService  {

  private readonly EMAILJS_USER_ID      = 'zlMs5PLsv4XRQhXkc' ;
  private readonly EMAILJS_TEMPLATE_ID  = 'template_jguosg3';
  private readonly EMAILJS_SERVICE_ID   = 'service_zs51al4';


constructor(private http: HttpClient,) {}


public sendEmail(email: string): Observable<any> {
  const emailData = {
    user_id: this.EMAILJS_USER_ID,
    template_id: this.EMAILJS_TEMPLATE_ID,
    template_params: {
      to_email: email // Correo electrónico del destinatario
    }
  };

  return this.http.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
}






}
