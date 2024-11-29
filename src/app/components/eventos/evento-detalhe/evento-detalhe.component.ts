import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventInfoWrapper } from '@angular/core/primitives/event-dispatch';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css']
})
export class EventoDetalheComponent implements OnInit {

  modalRef!: BsModalRef;

  eventoId: any;
  //evento: Evento; ou
  evento= {} as Evento;
  form!: FormGroup;
  estadoSalvar: string = 'post';
  loteAtual = {id: 0, nome: '', indice: 0};

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any{   // pode tirar o get mas na pagina html
                         // tem que chamar como bsConfig() dentro das aspas
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activatedRouter: ActivatedRoute,
              private eventoService: EventoService,
              private loteService: LoteService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private router: Router )
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = this.activatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId != null || this.eventoId === 0){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventosById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento= {...evento};
          this.form.patchValue(this.evento);
          this.evento.lotes.forEach(lote => {         //com este comando elimina a carregarlotes()
            this.lotes.push(this.criarLote(lote));
          });
          //this.carregarLotes();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar Evento','Erro!');
          console.error(error);
        },
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        })
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar lotes','Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());

  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      local: ['',Validators.required],
      dataEvento: ['',Validators.required],
      qtdPessoas: ['',[Validators.required,Validators.max(120000)]],
      imagemURL: ['',Validators.required],
      telefone: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome,Validators.required],
      quantidade: [lote.quantidade,Validators.required],
      preco: [lote.preco,Validators.required],
      dataInicio: [lote.dataInicio,Validators.required],
      dataFim: [lote.dataFim,Validators.required]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarEvento(): void{
    this.spinner.show();

    if (this.form.valid){

      this.evento = (this.estadoSalvar == 'post')
        ? {... this.form.value}
        :
          {id: this.evento.id, ... this.form.value};

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com Sucesso','Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`])
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento', 'Erro')
        },
        () => this.spinner.hide()
        );
    }
  }

  public salvarLotes(): void {
    this.spinner.show();
    if(this.form.controls['lotes'].valid) {
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lote salvo com sucesso','Sucesso!');
            this.lotes.reset();
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar lote', 'Erro');
          }
        ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>,
                     indice: number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});

  }

  public confirmDeleteLote(): void{
    this.modalRef.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso', 'Sucesso !');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}`, 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  public declineDeleteLote(): void{
    this.modalRef.hide();
  }
}
