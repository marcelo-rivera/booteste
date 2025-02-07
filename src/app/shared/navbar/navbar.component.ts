import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;

  constructor(public accountService: AccountService,
              @Inject(Router) private router: Router) { }

  ngOnInit() {
    console.log(this.accountService.currentUser$);
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  showMenu(): boolean {
    console.log(this.router.url);
    return this.router.url !== 'user/login';
  }
}
