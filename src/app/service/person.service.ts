import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from 'src/app/model/person';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  apiURL: string = environment.apiURL + '/person';

  constructor(private readonly http: HttpClient) {}

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiURL}`, person);
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiURL}`,person);
  }

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiURL);
  }

  getById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiURL}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }

}
