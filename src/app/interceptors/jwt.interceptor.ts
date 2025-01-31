import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/account.service';

@Injectable()

export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let currentUser: User | undefined;

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {

      currentUser = user;
      console.log('currentUser' + currentUser);

      if (currentUser) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`
          }
        })
        //console.log('token ' + currentUser.token);
      }
    })


    // const token = localStorage.getItem('token');
    // if (token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });
    // }

    return next.handle(request);
  }
}
