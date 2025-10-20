import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _baseUrl = environment.api_base_url;

  constructor(private _http: HttpClient) { }

  login(data: any) {
    return this._http.post(`${this._baseUrl}auth/login`, data);
  }
  
}
