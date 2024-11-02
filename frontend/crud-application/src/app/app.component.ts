import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter, map} from 'rxjs/operators';
import {AuthService} from "./service/auth.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Danh sách người dùng';
    currentUser: any;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        // Subscribe to currentUser updates
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });

        // Get the user information if it wasn't already set (e.g., on page reload)
        if (!this.currentUser) {
            this.authService.getCurrentUser().subscribe();
        }

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute.firstChild;
                    while (route?.firstChild) {
                        route = route.firstChild;
                    }
                    return route?.snapshot.data['title'];
                })
            )
            .subscribe((title: string) => {
                this.title = title;
                this.titleService.setTitle(title);
            });
    }

    login(username: string, password: string): void {
        this.authService.login({ username, password }).subscribe({
            next: (user) => {
                if (user) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công',
                        text: `Xin chào ${user.username || 'user'}!`,
                    });
                    this.router.navigate(['/users-list']); // Chuyển hướng sau khi đăng nhập thành công
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng nhập thất bại',
                        text: 'Không thể đăng nhập, vui lòng thử lại.',
                    });
                }
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi đăng nhập',
                    text: `Đã xảy ra lỗi: ${err.message || 'Vui lòng thử lại sau.'}`,
                });
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.currentUser = null;
        Swal.fire({
            icon: 'success',
            title: 'Đăng xuất thành công',
            text: 'Bạn đã đăng xuất.',
        }).then(() => {
            this.router.navigate(['/login']);
        });
    }

    isLoginPage(): boolean {
        return this.router.url === '/login';
    }

    isRegisterPage(): boolean {
        return this.router.url === '/register';
    }
}
