import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  user!: User;
  userId!: string;
  isEditingMode = false;
  userForm!: FormGroup;
  userSub!: Subscription;
  isLoading = false;
  errorMessage!: string;
  errorMessageSub!: Subscription;
  showPassword = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.isLoading = true;
      this.userId = params['id'];
      this.isEditingMode = params['id'] != null;

      this.errorMessageSub = this.userService.errorMessage.subscribe((err) => {
        this.errorMessage = err;
      });

      this.initializeUserForm();
      this.isLoading = false;
    });
  }

  private initializeUserForm() {
    let userName = '';
    let userEmail = '';
    let userPassword = '';
    let userType = 'User';

    if (this.isEditingMode) {
      this.userSub = this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;

          this.userForm = new FormGroup({
            name: new FormControl(user.name, Validators.required),
            email: new FormControl(user.email, [
              Validators.required,
              Validators.email,
            ]),
            password: new FormControl(user.password, [
              Validators.required,
              Validators.minLength(6),
            ]),
            type: new FormControl(user.type, Validators.required),
          });
        },
        error: (err) => (this.errorMessage = err.message),
      });
    }

    this.userForm = new FormGroup({
      name: new FormControl(userName, Validators.required),
      email: new FormControl(userEmail, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(userPassword, [
        Validators.required,
        Validators.minLength(6),
      ]),
      type: new FormControl(userType, Validators.required),
    });
  }

  onSubmitForm() {
    if (!this.userForm.valid) return;
    this.isLoading = true;

    const name = this.userForm.controls['name'].value;
    const email = this.userForm.controls['email'].value;
    const password = this.userForm.controls['password'].value;
    const type = this.userForm.controls['type'].value;

    if (this.isEditingMode) {
      this.userService.updateUserById(this.userId, name, email, password, type);
    } else {
      this.userService.addUser(name, email, password, type);
    }

    this.isLoading = false;
  }

  onCancelEdit() {
    this.router.navigate(['/users']);
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.errorMessageSub.unsubscribe();
  }
}
