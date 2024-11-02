package com.knf.dev.demo.crudapplication.service;

import com.knf.dev.demo.crudapplication.entity.Account;
import com.knf.dev.demo.crudapplication.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditTrailService auditTrailService;


    // Phương thức đăng ký người dùng mới
    public Account registerAccount(Account account) {
        // Kiểm tra xem Username đã tồn tại chưa
        if (accountRepository.existsByUsername(account.getUsername())) {
            throw new RuntimeException("Username đã tồn tại!");
        }

        // Mã hóa mật khẩu
        account.setPassword(passwordEncoder.encode(account.getPassword()));

        // Lưu người dùng vào database
        return accountRepository.save(account);
    }

    // Tìm kiếm người dùng dựa trên accountname
    public Account findByUsername(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }
}
