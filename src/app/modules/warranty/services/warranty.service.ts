import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { removeNullishFieldsParams } from '../../../core/utilities/helper-function';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {
  baseUrl = environment.api_base_url;

  constructor(private _http: HttpClient) { }

  getAllWarranties(params?: any) {
    params = removeNullishFieldsParams(params);
    return this._http.get(`${this.baseUrl}warranties`, { params });
  }

  getWarrantyById(id: number) {
    return this._http.get(`${this.baseUrl}warranties/${id}`);
  }

  deleteWarranty(id: number) {
    return this._http.delete(`${this.baseUrl}warranties/${id}`);
  }

  activateWarranty(warranty: FormData) {
    return this._http.post(`${this.baseUrl}warranties`, warranty);
  }
}
