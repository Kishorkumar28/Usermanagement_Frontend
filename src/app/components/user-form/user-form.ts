import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html'
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Viewer', Validators.required],
      mobile: [''],
      department: [''],
      address: [''],
      status: ['Active']
    });

    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getById(this.userId).subscribe((user: User) => {
        this.form.patchValue(user);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const user: User = this.form.value;

    if (this.userId) {
      this.userService.update(this.userId, user).subscribe((updatedUser: User) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Updated: ${updatedUser.name} (${updatedUser.email})`,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.create(user).subscribe((newUser: User) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Created: ${newUser.name} (${newUser.email})`,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });
        this.router.navigate(['/users']);
      });
    }
  }
}
