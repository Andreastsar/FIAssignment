import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private usersSub!: Subscription;
  private usersChangedSub!: Subscription;
  isLoading: boolean = false;
  errorMessage!: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.usersSub = this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => (this.errorMessage = err.message),
    });

    this.usersChangedSub = this.userService.getUsersChanged().subscribe({
      next: () => {
        this.userService.getAllUsers().subscribe((users) => {
          this.users = users;
        });
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }

  addNewUser() {
    this.router.navigate(['/users/create']);
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    this.usersChangedSub.unsubscribe();
  }
}
