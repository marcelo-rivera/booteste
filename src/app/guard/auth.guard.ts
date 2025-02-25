import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = (route, state) => {
  const router = Inject(Router);
  const toaster = Inject(ToastrService);
  try {
    if (localStorage.getItem('user') !== null){
      return true;
    } else {
      toaster.info('Usuário não autenticado!');
      router.navigate(['/user/login']);
      return false;
    }
  } catch (error) {
    return false;
  }
}
