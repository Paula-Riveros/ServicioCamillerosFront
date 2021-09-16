import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Servicio } from '../components/models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  servicioURL = 'http://localhost:1433/servicio/';

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(this.servicioURL + 'lista');
  }

  public detail(id: number): Observable<Servicio> {
    return this.httpClient.get<Servicio>(this.servicioURL + `detail/${id}`);
  }

  public save(servicio: Servicio): Observable<any> {
    return this.httpClient.post<any>(this.servicioURL + 'create', servicio); 
    // En caso de utilizar un metodo POST y no envie ningun RequestBody 
    // entonces se pondria {} en lugar de paciente, en el ultimo parametro.
  }

  public update(id: number, servicio: Servicio): Observable<any> {
    return this.httpClient.put<any>(this.servicioURL + `update/${id}`, servicio); 
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.servicioURL + `delete/${id}`);
  }

 /*  public getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiServerUrl}/servicio/all`);
  }

  public addServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiServerUrl}/servicio/all`, servicio);
  } */

  
}