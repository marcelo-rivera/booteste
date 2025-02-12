import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { User } from '@app/models/Identity/User';
import { map, Observable, ReplaySubject, take } from 'rxjs';

@Injectable(//{
  //providedIn: 'root'
//}
)
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  public userNull = new User();


  baseUrl = environment.apiURL + 'api/account/';

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<void>{
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user)

        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(this.userNull);
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public register(model: any): Observable<User>{
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

}
