import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AddUserComponent} from './components/add-user/add-user.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';
import {UsersListComponent} from './components/users-list/users-list.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {AuthInterceptor} from "./auth/AuthInterceptor";

@NgModule({
    declarations: [
        AppComponent,
        AddUserComponent,
        UserDetailComponent,
        UsersListComponent,
        LoginComponent,
        RegisterComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }],
    bootstrap: [AppComponent],
})
export class AppModule {
}
