package com.knf.dev.demo.crudapplication.controller;

import com.knf.dev.demo.crudapplication.dto.AccountDTO;
import com.knf.dev.demo.crudapplication.dto.LoginDTO;
import com.knf.dev.demo.crudapplication.entity.Account;
import com.knf.dev.demo.crudapplication.entity.ResponseMessage;
import com.knf.dev.demo.crudapplication.security.JwtTokenProvider;
import com.knf.dev.demo.crudapplication.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Đăng ký người dùng mới
    @PostMapping("/register")
    public ResponseEntity<?> registerAccount(@RequestBody AccountDTO accountDTO) {
        Account account = new Account();
        account.setUsername(accountDTO.getUsername());
        account.setPassword(accountDTO.getPassword());
        //account.setEmail(accountDTO.getEmail());
        account.setRoles("ROLE_USER");

        try {
            accountService.registerAccount(account);
            return ResponseEntity.ok(new ResponseMessage("Đăng ký thành công!"));
        } catch (RuntimeException e) {
            // Trả về thông báo lỗi nếu có ngoại lệ
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage(e.getMessage()));
        }
    }

    // Đăng nhập và lấy JWT token
    @PostMapping("/login")
    public ResponseEntity<?> authenticateAccount(@RequestBody LoginDTO loginDTO) {
        try {
            // Xác thực thông tin đăng nhập
            Account account = accountService.findByUsername(loginDTO.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
            );

            // Tạo JWT token sau khi xác thực thành công
            String token = tokenProvider.createToken(authentication);

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu");
        }
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                return ResponseEntity.ok(userDetails);
            } else if (principal instanceof String) {
                String username = (String) principal;
                Map<String, String> response = new HashMap<>();
                response.put("username", username);
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
    }

    public boolean comparePassword(String rawPassword, String encodedPasswordFromDB) {
        return passwordEncoder.matches(rawPassword, encodedPasswordFromDB);
    }
}
