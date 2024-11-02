import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    API_IGNORE_ACCESS_TOKEN = ['/login','/register'];

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const isIgnore = this.API_IGNORE_ACCESS_TOKEN.some(apiIgnore => req.url.includes(apiIgnore));

        if (req.method === 'OPTIONS') {
            return next.handle(req); // Pass it without modification
        }

        const token = this.authService.getToken();
        if (!isIgnore && token) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${token}`)
            });
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
