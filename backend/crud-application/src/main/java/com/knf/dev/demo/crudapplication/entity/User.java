package com.knf.dev.demo.crudapplication.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "userTable")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "id_string")
    private String idString;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "email_id")
    private String emailId;


    public User() {
    }

    public User(long id, String idString, String firstName, String lastName, String emailId) {
        this.id = id;
        this.idString = idString;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
    }

    public User(String idString, String firstName, String lastName, String emailId) {
        this.idString = idString;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
    }

    public User(String firstName, String lastName, String emailId) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
        this.idString = String.valueOf(id); // Automatically update idString when id is set
    }

    public String getIdString() {
        return idString;
    }

    public void setIdString(String idString) {
        this.idString = idString;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public void convertIdToIdString() {
        this.idString = String.valueOf(this.id);
    }
}
