import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {UsersListComponent} from './components/users-list/users-list.component';
import {AddUserComponent} from './components/add-user/add-user.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';
import {AuthGuard} from "./auth/AuthGuard";

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'login'},
    {path: 'users-list', component: UsersListComponent, data: {title: 'Danh sách người dùng'}},
    {path: 'add-user', component: AddUserComponent, data: {title: 'Thêm người dùng'}},
    {path: 'edit-user/:id', component: UserDetailComponent, data: {title: 'Sửa người dùng'}},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
