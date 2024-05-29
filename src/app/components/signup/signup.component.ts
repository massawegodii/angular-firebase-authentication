import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCredential } from 'firebase/auth';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
    name: AbstractControl | null = null;
    email: AbstractControl | null = null;
    password: AbstractControl | null = null;
    confirmPassword: AbstractControl | null = null;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private toastr: ToastrService,
        private userService: UsersService
    ) {}

    signUpForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
    });

    ngOnInit(): void {
        this.name = this.signUpForm.get('name');
        this.email = this.signUpForm.get('email');
        this.password = this.signUpForm.get('password');
        this.confirmPassword = this.signUpForm.get('confirmPassword');
    }

    register() {
        if (this.signUpForm.valid) {
            const { name, email, password, confirmPassword } = this.signUpForm.value;

            // Check if password and confirm password match
            if (password !== confirmPassword) {
                this.toastr.error('Passwords do not match.');
                return;
            }

            const userData = {
                name: name || '',
                email: email || '',
                password: password || '',
            };

            from(this.authService.registerWithEmailAndPassword(userData.email, userData.password))
                .pipe(
                    switchMap((userCredential: UserCredential) => {
                        const { uid } = userCredential.user;
                        return this.userService.addUser({ uid, email: userData.email, displayName: userData.name });
                    })
                )
                .subscribe(
                    () => {
                        this.toastr.success('Account created successfully!');
                        this.router.navigateByUrl('/login');
                    },
                    (error: any) => {
                        console.log(error);
                        if (error.code === 'auth/weak-password') {
                            this.toastr.warning('Password should be at least 6 characters.');
                        } else if (error.code === 'auth/email-already-in-use') {
                            this.toastr.error('The email address is already in use.');
                        } else {
                            this.toastr.error('An error occurred during registration.');
                        }
                    }
                );
        } else {
            this.toastr.error('Please fill in all required fields.');
        }
    }
}
