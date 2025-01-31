import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {

  user = {} as User;
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password','passwordConfirm')
    };

    this.form = this.fb.group({
    primeiroNome: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(50)]],
    ultimoNome: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(50)]],
    email: ['',[Validators.required,Validators.email]],
    userName: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    password: ['',[Validators.required,Validators.minLength(8)]],
    passwordConfirm: ['',[Validators.required]]
    }, formOptions);
  }

  register(): void {
    this.user = {...this.form.value};
    console.log(this.user);
    this.accountService.register(this.user).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
        this.toastr.success('Cadastro realizado');
      },
      (error: any) => this.toastr.error(error.error)
    );
  }

}
