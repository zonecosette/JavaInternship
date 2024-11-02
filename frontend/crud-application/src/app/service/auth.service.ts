import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from "sweetalert2";

interface LoginResponse {
    token: string;
    user: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth'; // Đường dẫn đến API của bạn
    private currentUserUrl = 'http://localhost:8080/api/auth/current-user';
    private currentUserSubject = new BehaviorSubject<any>(null); // Store user info here
    public currentUser$ = this.currentUserSubject.asObservable();

    private tokenRefreshTimeout: any;


    constructor(private http: HttpClient) {}

    // Hàm đăng ký người dùng
    register(user: { username: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    // Hàm đăng nhập người dùng
    login(user: { username: string; password: string }): Observable<any> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user).pipe(
            tap((response: LoginResponse) => {
                localStorage.setItem('jwt', response.token);
                this.currentUserSubject.next(response.user);
                this.startTokenRefreshTimer();
                this.getCurrentUser().subscribe();
            }),
            catchError(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: 'Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.',
                    confirmButtonText: 'OK'
                });
                return of(null);
            })
        );
    }

    // Lưu token vào localStorage
    saveToken(token: string) {
        localStorage.setItem('jwt', token);
    }

    // Lấy token từ localStorage
    getToken() {
        return localStorage.getItem('jwt');
    }

    startTokenRefreshTimer() {
        const tokenExpiryTime = 15 * 60 * 1000; // Set to 15 minutes for example
        this.tokenRefreshTimeout = setTimeout(() => this.refreshToken(), tokenExpiryTime);
    }

    // Xóa token khi đăng xuất
    logout() {
        localStorage.removeItem('jwt');
        this.currentUserSubject.next(null); // Clear current user data
        clearTimeout(this.tokenRefreshTimeout);
    }

    // Kiểm tra xem người dùng đã đăng nhập chưa
    isLoggedIn() {
        const token = this.getToken();
        return token !== null; // Kiểm tra nếu token tồn tại
    }

    getCurrentUser(): Observable<any> {
        return this.http.get<any>(this.currentUserUrl).pipe(
            tap(user => {
                console.log("User fetched from API:", user); // Kiểm tra dữ liệu user từ API
                this.currentUserSubject.next(user);
            }),
            catchError(error => {
                console.error("Failed to fetch current user:", error);
                return of(null);
            })
        );
    }

    private refreshToken() {
        this.http.post<any>(`${this.apiUrl}/refresh-token`, {}).pipe(
            tap(response => {
                localStorage.setItem('jwt', response.token);
                this.startTokenRefreshTimer();
            }),
            catchError(() => {
                this.logout();
                return of(null);
            })
        ).subscribe();
    }
}
