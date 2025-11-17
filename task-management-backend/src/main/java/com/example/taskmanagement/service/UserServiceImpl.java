package com.example.taskmanagement.service;

import com.example.taskmanagement.model.User;
import com.example.taskmanagement.model.enums.Role;
import com.example.taskmanagement.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
  


    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    

     @Override
    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        user.setRole(Role.SUBORDINATE); // default role

        return userRepository.save(user);
    }
    @Override
public List<User> getUsersByTenant(String tenantAdminUsername) {
    User admin = userRepository.findByUsername(tenantAdminUsername)
            .orElseThrow(() -> new RuntimeException("Tenant Admin not found"));

    return userRepository.findByTenantId(admin.getTenant().getId()); // pass tenant ID
}

@Transactional
public User createUserForTenant(String tenantAdminUsername,
                                String username,
                                String rawPassword) {

    User tenantAdmin = userRepository.findByUsername(tenantAdminUsername)
            .orElseThrow(() -> new RuntimeException("Tenant Admin not found"));

    if (tenantAdmin.getTenant() == null) {
        throw new RuntimeException("Tenant Admin has no tenant assigned");
    }

    User newUser = new User();
    newUser.setUsername(username);
    newUser.setPassword(passwordEncoder.encode(rawPassword));
    newUser.setRole(Role.SUBORDINATE);
    newUser.setEnabled(true);
    newUser.setTenant(tenantAdmin.getTenant());

    return userRepository.save(newUser);
}

    @Override
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(!user.getEnabled());
        return userRepository.save(user);
    }
    // UserService.java
@Override
public User changePassword(Long userId, String oldPassword, String newPassword) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
        throw new IllegalArgumentException("Old password is incorrect");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    return userRepository.save(user);
}



}
