import { Component, Input } from '@angular/core';
import { User } from '../../user.model';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
})
export class UserItemComponent {
  @Input() user!: User;
  isLoading = false;

  constructor(private router: Router, private userService: UserService) {}

  onEditUser(id: string) {
    this.router.navigate(['/users', id, 'edit']);
  }

  onDeleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;

      this.userService.deleteUserById(id);
    }

    this.isLoading = false;
  }
}
