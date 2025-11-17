package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.LoginRequest;
import com.example.taskmanagement.dto.LoginResponse;
import com.example.taskmanagement.dto.RegisterRequest;
import com.example.taskmanagement.model.User;

import com.example.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    try {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());   // directly set enum
        user.setEnabled(true);             // make sure enabled is set

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
    }
}


    // --- LOGIN ---
// --- LOGIN ---
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    System.out.println("=== Login Attempt ===");
    System.out.println("Username from frontend: " + request.getUsername());
    System.out.println("Password from frontend: " + request.getPassword());

    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));

    boolean match = passwordEncoder.matches(request.getPassword(), user.getPassword());
    System.out.println("Password match? " + match);

    if (!match) {
        return ResponseEntity.status(401).body(null);
    }

    String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

    // build LoginResponse DTO
    LoginResponse response = new LoginResponse();
    response.setId(user.getId());                     // add user id
    response.setUsername(user.getUsername());
    response.setRole(user.getRole().name());          // add role
    response.setToken(token);

    return ResponseEntity.ok(response);
}


}
