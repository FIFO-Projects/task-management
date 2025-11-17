package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.enums.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private Role role;
}