import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularFireModule } from '@angular/fire/compat';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        LoginComponent,
        SignupComponent,
        HomeComponent,
        ForgotPasswordComponent,
        VerifyEmailComponent,
        ProfileComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatMenuModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyBYRHE3SnJJbKwMqEekGuN7mgWEhGbjvvI',
            authDomain: 'sams-chat-app-20920.firebaseapp.com',
            projectId: 'sams-chat-app-20920',
            storageBucket: 'sams-chat-app-20920.appspot.com',
            messagingSenderId: '1020410639848',
            appId: '1:1020410639848:web:eb30e38c8b04058272e05d',
        }),

        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            closeButton: false,
            newestOnTop: false,
            progressBar: false,
            preventDuplicates: true,
        }),
    ],
    providers: [provideAnimationsAsync()],
    bootstrap: [AppComponent],
})
export class AppModule {}
