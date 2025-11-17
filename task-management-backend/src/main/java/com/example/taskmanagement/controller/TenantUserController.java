package com.example.taskmanagement.controller;

import com.example.taskmanagement.model.User;
import com.example.taskmanagement.service.UserService;
import lombok.Data;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenant/users")
public class TenantUserController {

    private final UserService userService;

    public TenantUserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users of the logged-in tenant
    @GetMapping
    public List<User> getTenantUsers(@AuthenticationPrincipal UserDetails tenantAdmin) {
        return userService.getUsersByTenant(tenantAdmin.getUsername());
    }

    // Create new user under the tenant of logged-in admin
    @PostMapping
    public User createUser(@AuthenticationPrincipal UserDetails tenantAdmin,
                           @RequestBody CreateUserRequest request) {
        // Pass only the necessary fields to the service
        System.out.println("TenantAdmin = " + tenantAdmin);
        return userService.createUserForTenant(
                tenantAdmin.getUsername(),
                request.getUsername(),
                request.getPassword());
    }

    // Enable or disable user
    @PutMapping("/{userId}/status")
    public User toggleStatus(@PathVariable Long userId) {
        return userService.toggleUserStatus(userId);
    }

    // Inner static DTO class for convenience
    @Data
    public static class CreateUserRequest {
        private String username;
        private String password;
    }
        // UserController.java
@PutMapping("/{userId}/password")
public ResponseEntity<?> changePassword(@PathVariable Long userId,
                                        @RequestBody Map<String, String> passwords) {
    String oldPassword = passwords.get("oldPassword");
    String newPassword = passwords.get("newPassword");

    try {
        User updatedUser = userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok(updatedUser);
    } catch (IllegalArgumentException e) {
        // Bad request: old password incorrect
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    } catch (Exception e) {
        // Other errors
        return ResponseEntity.status(500).body(Map.of("message", "Something went wrong"));
    }
}   @GetMapping("/{userId}")
    public User getUserById(@PathVariable Long userId) {
        return userService.findById(userId);
    }
}
