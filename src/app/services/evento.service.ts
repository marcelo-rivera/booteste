import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable(
//  {  providedIn: 'root'}   injeçao de dependencia (outra forma)
)
export class EventoService {
  baseURL = 'http://localhost:5131/api/evento'

  constructor(private http: HttpClient) { }


  public getEventos(): Observable <Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }

  public getEventosByTema(tema: string): Observable <Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
    }

  public getEventosById(id: number): Observable <Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);

  }

}
