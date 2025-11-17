package com.example.taskmanagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // 🔑 Use at least 32 characters for HS256 key:
    // In production, store this in application.properties or an env var
    private static final String SECRET = "uRJr!38F7z93jASdfL!k2A1lM93nQPxZ"; // 32+ chars
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // --- Generate token from UserDetails (existing) ---
    public String generateToken(org.springframework.security.core.userdetails.UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // --- New: Generate token from username and role ---
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // add role as a claim

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // --- Extract username from token ---
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // --- Validate token ---
    public boolean validateToken(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) &&
               !extractClaims(token).getExpiration().before(new Date());
    }

    // --- Extract all claims ---
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
