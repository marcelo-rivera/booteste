import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';



@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  // providers: [EventoService]   injeção de dependencia, outra forma
})
export class EventosComponent implements OnInit {

  modalRef?: BsModalRef;


  public eventos: Evento[] = [] ;
  public eventosFiltrados: Evento[] = [] ;

  public widthImg: number = 62;
  public marginImg: number = 2;
  public showImg: boolean = true;
  private _filtrolista: string= '';

  public get filtrolista(): string{
    return this._filtrolista;
  }

  public set filtrolista(value: string){
    this._filtrolista = value;
    this.eventosFiltrados = this.filtrolista ? this.filtrarEventos(this.filtrolista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
  ) {}

  public ngOnInit(): void {
    this.getEventos();
  }

  public showImage() {
    this.showImg = !this.showImg;
  }

  public getEventos (): void {

    this.eventoService.getEventos().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(error)

    );
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }

}
