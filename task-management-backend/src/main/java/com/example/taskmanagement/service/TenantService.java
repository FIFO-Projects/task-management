package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TenantRequest;
import com.example.taskmanagement.dto.TenantResponse;
import java.util.List;


public interface TenantService {
    TenantResponse createTenant(TenantRequest request);
    TenantResponse updateTenant(Long id, TenantRequest request);
    void deleteTenant(Long id);
    List<TenantResponse> getAllTenants();
}

