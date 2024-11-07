import { Component, OnInit } from '@angular/core';
import { EventInfoWrapper } from '@angular/core/primitives/event-dispatch';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css']
})
export class EventoDetalheComponent implements OnInit {

  //evento: Evento; ou
  evento= {} as Evento;
  form!: FormGroup;

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

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService )
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam != null){
      this.spinner.show();
      this.eventoService.getEventosById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento= {...evento};
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar Evento','Erro!');
          console.error(error);
        },
        () => this.spinner.hide(),
      )
    }
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
    email: ['',[Validators.required,Validators.email]]

    })
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarAlteracao(): void{
    this.spinner.show();
    if (this.form.valid){

      this.evento = {... this.form.value};

      this.eventoService.postEvento(this.evento).subscribe(
      () => this.toastr.success('Evento salvo com Sucesso','Sucesso'),
      (error: any) => {
        console.error(error);
        this.spinner.hide();
        this.toastr.error('Erro ao salvar evento', 'Erro')
      },
      () => this.spinner.hide()
      );
    }
  }
}
