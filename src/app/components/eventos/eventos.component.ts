import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ToastrService } from 'ngx-toastr';

import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';



@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  // providers: [EventoService]   injeção de dependencia, outra forma
})
export class EventosComponent implements OnInit {

  ngOnInit(): void {

  }

}
