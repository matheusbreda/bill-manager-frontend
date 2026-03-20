import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bill } from '../model/bill';
import { BillDTO } from '../model/billDTO';

@Injectable({
    providedIn: 'root',
})
export class BillService {
    apiURL: string = environment.apiURL + '/bill';

    constructor(private readonly http: HttpClient) {}

    create(bill: Bill): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiURL}`, bill);
    }

    update(bill: Bill): Observable<Bill> {
        return this.http.put<Bill>(`${this.apiURL}`, bill);
    }

    getAll(): Observable<Bill[]> {
        return this.http.get<Bill[]>(this.apiURL);
    }

    getById(id: number): Observable<Bill> {
        return this.http.get<Bill>(`${this.apiURL}/${id}`);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiURL}/${id}`);
    }

    getBillDTO(): Observable<BillDTO> {
        return this.http.get<BillDTO>(`${this.apiURL}/overall`);
    }
}
