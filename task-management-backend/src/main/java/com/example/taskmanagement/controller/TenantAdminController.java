// com.example.taskmanagement.controller.TenantAdminController.java
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.CreateTenantWithAdminRequest;
import com.example.taskmanagement.model.Tenant;
import com.example.taskmanagement.service.TenantAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants")
public class TenantAdminController {

    private final TenantAdminService tenantAdminService;

    public TenantAdminController(TenantAdminService tenantAdminService) {
        this.tenantAdminService = tenantAdminService;
    }

    @PostMapping("/create-with-admin")
    public ResponseEntity<?> createTenantWithAdmin(@RequestBody CreateTenantWithAdminRequest req) {
        try {
            Tenant tenant = tenantAdminService.createTenantWithAdmin(
                    req.getTenantName(),
                    req.getAdminUsername(),
                    req.getAdminPassword()
            );
            return ResponseEntity.ok(tenant);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }
}
