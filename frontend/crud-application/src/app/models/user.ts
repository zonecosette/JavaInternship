// src/app/models/user.model.ts

export interface User {
    id: number;            // ID của người dùng
    username: string;     // Tên đăng nhập
    firstName: string;    // Họ
    lastName: string;     // Tên
    emailId: string;      // Địa chỉ email
    roles: string;        // Vai trò, có thể là 'ROLE_USER' hoặc 'ROLE_ADMIN'
}
