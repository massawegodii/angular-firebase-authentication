import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { User } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { Observable, concatMap, finalize, of, tap } from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfileUser } from '../../models/users';

@UntilDestroy()
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    user1$: Observable<ProfileUser | null> = this.userService.currentUserProfile$.pipe(untilDestroyed(this));
    photoURL: string | null = null;

    profileForm = this.fb.group({
        uid: [''],
        displayName: [''],
        firstName: [''],
        lastName: [''],
        phone: [''],
        address: [''],
    });

    constructor(
        private authService: AuthService,
        private imageUploadService: ImageUploadService,
        private toastr: ToastrService,
        private fb: NonNullableFormBuilder,
        private userService: UsersService
    ) {}

    ngOnInit(): void {
        this.authService.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.user = user;
            if (user?.photoURL) {
                this.photoURL = user.photoURL;
            }
        });

        this.user1$.subscribe((user) => {
            if (user?.photoURL) {
                this.photoURL = user.photoURL;
            }
            this.profileForm.patchValue({ ...user });
        });
    }

    onFileChange(event: any) {
        if (this.user) {
            const profileUser: ProfileUser = {
                uid: this.user.uid,
                displayName: this.user.displayName || '',
                email: this.user.email || '',
            };
            this.uploadImage(event, profileUser);
        } else {
            this.toastr.error('User not found');
        }
    }

    uploadImage(event: any, user: ProfileUser) {
        if (event.target.files.length === 0) {
            return;
        }

        this.toastr.info('Uploading profile image...');

        this.imageUploadService
            .uploadImage(event.target.files[0], `images/profile/${user.uid}`)
            .pipe(
                concatMap((photoURL: string) =>
                    this.userService.updateUser({ uid: user.uid, photoURL }).pipe(concatMap(() => of(photoURL)))
                ),
                finalize(() => this.toastr.clear())
            )
            .subscribe({
                next: (photoURL: string) => {
                    this.toastr.success('Image uploaded successfully');
                    this.photoURL = photoURL;
                },
                error: (error) => this.toastr.error('There was an error in uploading the image: ' + error.message),
            });
    }

    saveProfile() {
        // Get the current user's UID from AuthService or another source
        const uid = this.user?.uid;

        if (!uid) {
            // Handle the case where UID is not available
            this.toastr.error('User ID is not available');
            return;
        }

        const profileData: ProfileUser = {
            uid,
            displayName: this.profileForm.value.displayName,
            firstName: this.profileForm.value.firstName,
            lastName: this.profileForm.value.lastName,
            phone: this.profileForm.value.phone,
            address: this.profileForm.value.address,
        };

        this.userService
            .updateUser(profileData)
            .pipe(
                tap(() => this.toastr.info('Updating data...')),
                tap(() => this.toastr.success('Data has been updated')),
                tap({
                    error: () => this.toastr.error('There is an error in updating the data'),
                })
            )
            .subscribe();
    }
}
