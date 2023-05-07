import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { USERS_URL } from 'src/app/routes/json-server.routes';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersChanged = new Subject<void>();
  errorMessage = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(USERS_URL);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(USERS_URL + id);
  }

  addUser(name: string, email: string, password: string, type: string) {
    this.http
      .post(USERS_URL, {
        name,
        email,
        password,
        type,
      })
      .subscribe({
        next: () => this.redirectToHomePage(),
        error: (err) => this.forwardErrorMessage(err),
      });
  }

  updateUserById(
    id: string,
    updatedName: string,
    updatedEmail: string,
    updatedPassword: string,
    updatedType: string
  ) {
    this.http
      .patch(USERS_URL + id, {
        name: updatedName,
        email: updatedEmail,
        password: updatedPassword,
        type: updatedType,
      })
      .subscribe({
        next: () => this.redirectToHomePage(),
        error: (err) => this.forwardErrorMessage(err),
      });
  }

  deleteUserById(id: string) {
    this.http.delete(USERS_URL + id).subscribe({
      next: () => this.redirectToHomePage(),
      error: (err) => this.forwardErrorMessage(err),
    });
  }

  getUsersChanged(): Observable<void> {
    return this.usersChanged.asObservable();
  }

  private redirectToHomePage() {
    this.router.navigate(['/users']);
    this.usersChanged.next();
  }

  private forwardErrorMessage(err: HttpErrorResponse) {
    this.errorMessage.next(err.message);
  }
}
