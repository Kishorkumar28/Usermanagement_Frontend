import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../services/user';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-view.html',
  styleUrls: ['./user-view.css']
})
export class UserViewComponent implements OnInit {
  user: User | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getById(id).subscribe((data: User) => {
        this.user = data;
      });
    }
  }
}
