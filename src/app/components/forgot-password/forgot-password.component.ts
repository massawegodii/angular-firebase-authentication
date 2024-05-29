import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
    email: string = '';

    constructor(
        private auth: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    forgotPassword() {
        if (this.email.trim()) {
            this.auth.forgotPassword(this.email).subscribe(
                () => {
                    this.toastr.success('Email Sent Successfully');
                    this.router.navigateByUrl('/verify_email');
                },
                (err) => {
                    this.toastr.error('An error occurred while sending email.');
                }
            );
            this.email = '';
        } else {
            this.toastr.error('Please enter a valid email address.');
        }
    }
}
