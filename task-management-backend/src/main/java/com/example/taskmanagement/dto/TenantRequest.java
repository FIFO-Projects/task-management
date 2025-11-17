package com.example.taskmanagement.dto;

public class TenantRequest {
    private String name;
    private Long tenantAdminId; // ID of the admin user

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getTenantAdminId() { return tenantAdminId; }
    public void setTenantAdminId(Long tenantAdminId) { this.tenantAdminId = tenantAdminId; }
}

