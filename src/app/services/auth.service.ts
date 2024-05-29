import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider, UserCredential, UserInfo, updateProfile } from 'firebase/auth';
import { BehaviorSubject, Observable, from, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    currentUser$: Observable<any>;

    private loggedIn = new BehaviorSubject<boolean>(false);

    constructor(
        private auth: AngularFireAuth,
        private router: Router
    ) {
        this.auth.onAuthStateChanged((user) => {
            this.loggedIn.next(!!user);
        });

        this.currentUser$ = auth.authState;
    }

    get isLoggedIn(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    signInWithGoogle() {
        return this.auth.signInWithPopup(new GoogleAuthProvider());
    }

    registerWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
        return this.auth.createUserWithEmailAndPassword(email, password) as unknown as Promise<UserCredential>;
    }

    signWithEmailAndPasword(user: { email: string; password: string }) {
        return this.auth.signInWithEmailAndPassword(user.email, user.password);
    }

    loginWithEmailAndPassword(email: string, password: string): Observable<any> {
        return from(this.auth.signInWithEmailAndPassword(email, password));
    }

    // forgot password
    forgotPassword(email: string) {
        return from(this.auth.sendPasswordResetEmail(email));
    }

    updateProfileData(profileData: Partial<UserInfo>): Observable<void> {
        return from(this.auth.currentUser).pipe(
            switchMap((user) => {
                if (!user) throw new Error('Not authenticated');
                return from(updateProfile(user, profileData));
            })
        );
    }

    // sign out
    logout() {
        this.auth.signOut().then(
            () => {
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
            },
            (err) => {
                alert(err.message);
            }
        );
    }
}
