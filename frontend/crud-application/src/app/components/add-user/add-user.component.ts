import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../service/crud.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
    userForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        private router: Router,
        private ngZone: NgZone,
        private crudService: CrudService
    ) {
        // Setting up form with validation rules
        this.userForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            emailId: [
                '',
                [
                    Validators.email, // Check for email format
                    Validators.maxLength(255), // Optional email with max length
                ],
            ], // Email is optional but must be valid if provided
        });
    }

    ngOnInit() {
    }

    // Getter methods for easy access to form controls in the template
    get firstName() {
        return this.userForm.get('firstName');
    }

    get lastName() {
        return this.userForm.get('lastName');
    }

    get emailId() {
        return this.userForm.get('emailId');
    }

    // Form submission
    onSubmit(): any {
        if (this.userForm.invalid) {
            Swal.fire({
                icon: 'error',
                title: 'Tạo thất bại',
                text: 'Vui lòng kiểm tra lại thông tin!',
                confirmButtonText: 'OK'
            });
            return;
        }

        this.crudService.AddUser(this.userForm.value).subscribe(
            () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Tạo thành công',
                    text: 'Người dùng đã được thêm vào!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    this.ngZone.run(() => this.router.navigateByUrl('/users-list'));
                });
            },
            (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Tạo thất bại',
                    text: 'Đã xảy ra lỗi, vui lòng thử lại!',
                    confirmButtonText: 'OK'
                });
                console.log(err);
            }
        );
    }
}
