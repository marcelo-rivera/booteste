import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { take } from 'rxjs/operators';

@Injectable(
//  {  providedIn: 'root'}   injeçao de dependencia (outra forma)
)
export class EventoService { [key: string]: any  // [key: string]: any para poder usar as funções com string indexando

  baseURL = 'http://localhost:5131/api/evento'

  constructor(private http: HttpClient) { }


  public getEventos(): Observable <Evento[]> {
    return this.http
      .get<Evento[]>(this.baseURL)
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
}
