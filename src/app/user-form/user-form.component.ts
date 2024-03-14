import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user.model';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  isEditMode = false;
  userFormText: string = 'Add User'
  userToEdit: User | null = null;
  userId: number = 0;
  constructor(private fb: FormBuilder, private userService: UserServiceService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id']; // Convert id to number
        // Fetch user details and pre-fill the form
        this.userService.getUser(this.userId).subscribe(user => {
          if (user) {
            this.userFormText = 'Edit User'
            this.userForm.patchValue({
              name: user.name,
              email: user.email,
              role: user.role
            });
          }
        });
      }
    });
  }
  get f() { return this.userForm.controls; }
  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (this.isEditMode) {
        this.userService.updateUser(this.userId, user);
      } else {
        this.userService.addUser(user);
      }
      this.router.navigate(['/users']); // Navigate back to user list after submission
    }
  }
}
