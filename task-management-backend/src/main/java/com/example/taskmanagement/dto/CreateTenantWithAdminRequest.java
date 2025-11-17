package com.example.taskmanagement.dto;

import lombok.Data;

@Data
public class CreateTenantWithAdminRequest {
    private String tenantName;
    private String adminUsername;
    private String adminPassword;
}
