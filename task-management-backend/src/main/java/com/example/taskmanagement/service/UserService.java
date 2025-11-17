package com.example.taskmanagement.service;

import com.example.taskmanagement.model.User;

import java.util.List;

public interface UserService {

    // Get all users for a tenant admin
    List<User> getUsersByTenant(String tenantAdminUsername);

    // Create user under the tenant of logged-in admin
    User createUserForTenant(String tenantAdminUsername, String username, String rawPassword);

    // Enable or disable user
    User toggleUserStatus(Long userId);

    User register(User user);

    User changePassword(Long userId, String oldPassword, String newPassword);
    User findById(Long userId);
}
