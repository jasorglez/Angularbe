import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }


  sendMessage() {
    const url = 'https://api.twilio.com/2010-04-01/Accounts/AC7755bbf940dfe91d8b620e37ac42808a/Messages.json';
    
    const body = {
      From: 'whatsapp:+14155238886',
      Body: 'Hello, world!',
      To  : 'whatsapp:+17654266126'
    };
    
    const headers = {
      Authorization: 'Basic ' + btoa('AC7755bbf940dfe91d8b620e37ac42808a:bdd2f8164317b726fdff3a76b051f7b1')
    };
    this.http.post(url, body, { headers }).subscribe(response => {
      console.log(response);
    });
  }


  
}













