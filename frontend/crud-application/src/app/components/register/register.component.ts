import {Component} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {catchError} from "rxjs/operators";
import {of, pipe} from "rxjs";
import Swal from "sweetalert2";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    username: string = '';
    password: string = '';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private authService: AuthService, private router: Router) {
    }

    register() {
        this.authService.register({ username: this.username, password: this.password })
            .subscribe({
                next: (response) => {
                    // Kiểm tra xem response có đúng định dạng không
                    if (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đăng ký thành công!',
                            text: response.message, // Sử dụng thông điệp từ phản hồi
                        }).then(() => {
                            this.router.navigate(['/login']);
                        });
                    }
                },
                error: (error) => {
                    // Xử lý lỗi
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng ký thất bại',
                        text: 'Vui lòng kiểm tra lại thông tin.',
                    });
                }
            });
    }
}
