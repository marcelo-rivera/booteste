import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha','senhaConfirm')
    };

    this.form = this.fb.group({
    titulo: ['',Validators.required],
    firstName: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(50)]],
    lastName: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(50)]],
    email: ['',[Validators.required,Validators.email]],
    telefone: ['',[Validators.required,Validators.minLength(11),Validators.maxLength(12)]],
    descricao: ['',[Validators.required,Validators.maxLength(30)]],
    senha: ['',[Validators.required,Validators.minLength(8)]],
    senhaConfirm: ['',[Validators.required]]
    }, formOptions);
  }
  onSubmit(): void {
    // Vai parar aqui se o form estiver inválido
    if (this.form.invalid) {
      return;
    }
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}
