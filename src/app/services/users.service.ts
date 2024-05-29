import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProfileUser } from '../models/users';
import { Observable, from, map, of, startWith, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService
    ) {}

    get currentUserProfile$(): Observable<ProfileUser | null> {
        return this.authService.currentUser$.pipe(
            switchMap((user) => {
                if (!user?.uid) {
                    return of(null);
                }

                const userRef = this.firestore.collection('users').doc<ProfileUser>(user.uid);
                return userRef.valueChanges().pipe(
                    startWith(null),
                    map((profile) => profile || null) 
                );
            })
        );
    }

    addUser(user: ProfileUser): Observable<void> {
        const userRef = this.firestore.collection('users').doc(user.uid);
        return from(userRef.set(user));
    }

    updateUser(user: ProfileUser): Observable<void> {
        const userRef = this.firestore.collection('users').doc(user.uid);
        return from(userRef.update({ ...user }));
    }
}
