import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable(
//  {  providedIn: 'root'}   injeçao de dependencia (outra forma)
)
export class EventoService { [key: string]: any  // [key: string]: any para poder usar as funções com string indexando

  baseURL = environment.apiURL + 'api/evento';
  tokenHeader = new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwidW5pcXVlX25hbWUiOiJ5YXJhIiwibmJmIjoxNzM3MDMzNzMxLCJleHAiOjE3MzcxMjAxMzEsImlhdCI6MTczNzAzMzczMX0.W_xw2hIjTLsiKjn19iV6F2_YBpQVoGCL9E_DB2u152nh6Ku8GCutzLg74sIHIJRRLBZ1m6h5LotmuS4pBhZdaw'});

  constructor(private http: HttpClient) { }


  public getEventos(): Observable <Evento[]> {
    return this.http
      .get<Evento[]>(this.baseURL,  { headers: this.tokenHeader})
      .pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable <Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
      .pipe(take(1));

    }

  public getEventosById(id: number): Observable <Evento> {
    return this.http
      .get<Evento>(`${this.baseURL}/${id}`)
      .pipe(take(1));

  }

  public post(evento: Evento): Observable <Evento> {
    return this.http
      .post<Evento>(this.baseURL,evento)
      .pipe(take(1));

  }

  public put(evento: Evento): Observable <Evento> {
    return this.http
      .put<Evento>(`${this.baseURL}/${evento.id}`,evento)
      .pipe(take(1));

  }

  public deleteEvento(id: number): Observable <any> {
    return this.http
      .delete(`${this.baseURL}/${id}`)
      .pipe(take(1));

  }

  postUpload(eventoId: number, file: File): Observable<Evento> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file',fileToUpload)

    return this.http
      .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
      .pipe(take(1));
  }
}
