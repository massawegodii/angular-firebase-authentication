import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

    user$ = this.userServices.currentUserProfile$;

    constructor(
        private authService: AuthService,
        private userServices: UsersService
    ) {}

    ngOnInit(): void {}

    logout() {
        this.authService.logout();
    }
}
