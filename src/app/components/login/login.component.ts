import { Component, OnInit } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    constructor(
        private router: Router,
        private fb: NonNullableFormBuilder,
        private authService: AuthService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {}

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    signInWithGoogle() {
        this.authService
            .signInWithGoogle()
            .then((resp: any) => {
                this.toastr.success('Google sign-in successful!', 'Success');
                this.router.navigateByUrl('/home');
            })
            .catch((error: any) => {
                this.toastr.error('Google sign-in failed!', 'Error');
            });
    }

    submit() {
        const { email, password } = this.loginForm.value;

        if (!this.loginForm.valid || !email || !password) {
            this.toastr.error('Fill the required field to continue');
            return;
        }
 
        this.authService.loginWithEmailAndPassword(email, password).subscribe(
            (resp: any) => {
                this.toastr.success('Login successful!');
                this.router.navigateByUrl('/home');
            },
            (error: any) => {
                this.toastr.error('Login failed provide correct credentials!');
            }
        );
    }
}
