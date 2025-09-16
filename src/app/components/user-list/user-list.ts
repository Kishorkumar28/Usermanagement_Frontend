import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';
import { User } from '../../services/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'mobile',
    'department',
    'status',
    'actions',
  ];

  // 🔹 Pagination + search + sort
  total = 0;
  limit = 10;
  page = 1;
  sortColumn = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();

    // 🔎 Debounced search
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((val) => {
        this.page = 1; // reset to first page on search
        this.loadUsers(val || '');
      });
  }

  // 🚀 Load users from backend (server-side pagination)
  loadUsers(search: string = ''): void {
    this.userService
      .getAll(
        this.page,
        this.limit,
        search,
        this.sortColumn,
        this.sortDirection
      )
      .subscribe((data: any) => {
        this.users = data.users;
        this.total = data.total; // backend must return total count
        this.dataSource.data = this.users;
      });
  }

  // 🔄 Paginator event
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadUsers(this.searchControl.value || '');
  }

  // 🔄 Sort event
  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = (sort.direction || 'asc') as 'asc' | 'desc';
    this.loadUsers(this.searchControl.value || '');
  }

  

  // ❌ Delete user
  deleteUser(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe(() => {
          this.loadUsers(this.searchControl.value || '');
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        });
      }
    });
  }
}
