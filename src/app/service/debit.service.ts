import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Debit } from 'src/app/model/debit';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DebitService {
    apiURL: string = environment.apiURL + '/debit';

    constructor(private readonly http: HttpClient) {}

    create(debit: Debit): Observable<Debit> {
        return this.http.post<Debit>(`${this.apiURL}`, debit);
    }

    update(debit: Debit): Observable<Debit> {
        return this.http.put<Debit>(`${this.apiURL}`, debit);
    }

    getAll(): Observable<Debit[]> {
        return this.http.get<Debit[]>(this.apiURL);
    }

    getById(id: number): Observable<Debit> {
        return this.http.get<Debit>(`${this.apiURL}/${id}`);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiURL}/${id}`);
    }

    getByPerson(id: number): Observable<Debit[]> {
        return this.http.get<Debit[]>(`${this.apiURL}/person/${id}`);
    }
}
