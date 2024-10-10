import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {


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
    firstName: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(50)]],
    lastName: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(50)]],
    email: ['',[Validators.required,Validators.email]],
    usuario: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    senha: ['',[Validators.required,Validators.minLength(8)]],
    senhaConfirm: ['',[Validators.required]]
    }, formOptions);
  }

}
