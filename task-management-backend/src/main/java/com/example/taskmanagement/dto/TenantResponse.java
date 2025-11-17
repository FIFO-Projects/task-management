package com.example.taskmanagement.dto;

public class TenantResponse {
    private Long id;
    private String name;
    private String tenantAdminName; // This will hold admin username

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTenantAdminName() { return tenantAdminName; }
    public void setTenantAdminName(String tenantAdminName) { this.tenantAdminName = tenantAdminName; }
}

