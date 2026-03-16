import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credit } from 'src/app/model/credit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  apiURL: string = environment.apiURL + '/credit';

  constructor(private readonly http: HttpClient) {}

  create(credit: Credit): Observable<Credit> {
    return this.http.post<Credit>(`${this.apiURL}`, credit);
  }

  update(credit: Credit): Observable<Credit> {
    return this.http.put<Credit>(`${this.apiURL}`,credit);
  }

  getAll(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiURL);
  }

  getById(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.apiURL}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }

  getByPerson(id: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiURL}/person/${id}`);
  }

}
