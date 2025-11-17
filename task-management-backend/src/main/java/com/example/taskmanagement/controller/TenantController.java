package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.TenantRequest;
import com.example.taskmanagement.dto.TenantResponse;
import com.example.taskmanagement.service.TenantService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @PostMapping
    public TenantResponse createTenant(@RequestBody TenantRequest request) {
        return tenantService.createTenant(request);
    }

    @PutMapping("/{id}")
    public TenantResponse updateTenant(@PathVariable Long id, @RequestBody TenantRequest request) {
        return tenantService.updateTenant(id, request);
    }

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteTenant(@PathVariable Long id) {
    try {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok("Tenant deleted successfully");
    } catch (Exception e) {
        return ResponseEntity.status(500)
                .body("Failed to delete tenant: " + e.getMessage());
    }
}

    @GetMapping
    public List<TenantResponse> getAllTenants() {
        return tenantService.getAllTenants();
    }
}

