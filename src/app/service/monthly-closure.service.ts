import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MonthlyClosure } from '../model/monthlyClosure';

@Injectable({
    providedIn: 'root',
})
export class MonthlyClosureService {
    apiURL: string = environment.apiURL + '/monthly-closure';

    constructor(private readonly http: HttpClient) {}

    save(closure: MonthlyClosure): Observable<MonthlyClosure> {
        return this.http.post<MonthlyClosure>(`${this.apiURL}`, closure);
    }

    getAll(): Observable<MonthlyClosure[]> {
        return this.http.get<MonthlyClosure[]>(this.apiURL);
    }

    getById(id: number): Observable<MonthlyClosure> {
        return this.http.get<MonthlyClosure>(`${this.apiURL}/${id}`);
    }
}
