package com.knf.dev.demo.crudapplication.dto;

public class AccountDTO {

    private String username;
    private String password;
    private String email;

    public AccountDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public AccountDTO(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
