import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    constructor(private storage: AngularFireStorage) {}

    uploadImage(image: File, path: string): Observable<string> {
        const storageRef = this.storage.ref(path);
        const uploadTask = from(this.storage.upload(path, image));
        return uploadTask.pipe(switchMap(() => storageRef.getDownloadURL()));
    }
}
