import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

    login() {
        this.authService.login({ username: this.username, password: this.password })
            .pipe(
                catchError(error => {
                    // Sử dụng SweetAlert để hiển thị lỗi
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng nhập thất bại',
                        text: 'Vui lòng kiểm tra lại thông tin.',
                    });
                    return of(null); // Trả về null để tránh lỗi trong chuỗi
                })
            )
            .subscribe(response => {
                if (response) {
                    // Sử dụng SweetAlert để thông báo thành công
                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công!',
                        text: 'Bạn sẽ được chuyển hướng đến trang chính.',
                    }).then(() => {
                        this.authService.saveToken(response.token); // Lưu token
                        this.router.navigate(['/users-list']); // Chuyển hướng đến trang chính sau khi đăng nhập
                    });
                }
            });
    }
}
