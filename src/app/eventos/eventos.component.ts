import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ToastrService } from 'ngx-toastr';

import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';



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
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public showImage() {
    this.showImg = !this.showImg;
  }

  public getEventos (): void {

    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos','Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('Evento excluído !', 'Exclusão de Evento')
  }

  decline(): void {
    this.modalRef?.hide();
  }

}
