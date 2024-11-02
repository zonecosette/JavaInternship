import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../service/crud.service';
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import Swal from "sweetalert2";

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
    Users: any = [];
    currentPage = 0;
    pageSize = 10;  // Số lượng bản ghi mỗi trang
    totalPages = 0;
    totalRecords = 0;
    searchQuery: string = '';
    searchResults: any[] = [];
    isSearching = false; // Biến để kiểm tra trạng thái tìm kiếm

    constructor(private crudService: CrudService) {
    }

    ngOnInit(): void {
        this.crudService.GetUsers().subscribe((res: any) => {
            this.Users = res;
        });
        this.loadUsers();
    }

    delete(id: any, i: any) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                this.crudService.deleteUser(id).subscribe(() => {
                    this.Users.splice(i, 1);
                    Swal.fire(
                        'Đã xóa người dùng.',
                        'success'
                    );
                });
            }
        });
    }

    downloadPDF() {
        this.crudService.exportUsersToPDF().subscribe((data: Blob) => {
            const blob = new Blob([data], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.pdf'; // Tên file PDF
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    }

    loadUsers(): void {
        this.crudService.getUsersPaged(this.currentPage, this.pageSize).subscribe(
            data => {
                this.Users = data.content;
                this.totalPages = data.totalPages;
                this.totalRecords = data.totalElements;
            },
            error => {
                console.error('Error fetching paged users', error);
            }
        );
    }

    goToPage(page: number): void {
        this.currentPage = page;
        this.loadUsers();
    }

    onPageSizeChange(): void {
        this.currentPage = 0; // Reset to the first page when page size changes
        this.loadUsers(); // Reload users with the new page size
    }

    getPageNumbers(): number[] {
        const pageNumbers = [];
        for (let i = 0; i < this.totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    }

    onSearch() {
        this.isSearching = !!this.searchQuery; // Kiểm tra có đang tìm kiếm hay không
        if (this.isSearching) {
            this.crudService.searchUsers(this.searchQuery).pipe(
                catchError(error => {
                    console.error('Search failed', error);
                    return of([]); // Return an empty array in case of an error
                })
            ).subscribe(results => {
                this.Users = results; // Cập nhật danh sách người dùng với kết quả tìm kiếm
                this.totalPages = 1;
                this.totalRecords = results.length;
            });
        } else {
            this.searchResults = []; // Clear results if search box is empty
        }
    }
}
