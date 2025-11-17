package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TenantRequest;
import com.example.taskmanagement.dto.TenantResponse;
import com.example.taskmanagement.model.Tenant;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.model.enums.Role;
import com.example.taskmanagement.repository.TenantRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;

    public TenantServiceImpl(TenantRepository tenantRepository, UserRepository userRepository) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
    }
@Override
public TenantResponse createTenant(TenantRequest request) {
    User admin = userRepository.findById(request.getTenantAdminId())
            .orElseThrow(() -> new RuntimeException("Tenant admin not found"));

    // 1. Create tenant and assign admin
    Tenant tenant = new Tenant();
    tenant.setName(request.getName());
    tenant.setTenantAdmin(admin);

    Tenant savedTenant = tenantRepository.save(tenant);

    // 2. **Also** update the admin user to point to this tenant
    admin.setTenant(savedTenant);
    admin.setRole(Role.TENANT_ADMIN); // optional, if you want to mark as tenant admin
    userRepository.save(admin);

    return toTenantResponse(savedTenant);
}


    @Override
    public TenantResponse updateTenant(Long id, TenantRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (request.getName() != null) tenant.setName(request.getName());
        if (request.getTenantAdminId() != null) {
            User admin = userRepository.findById(request.getTenantAdminId())
                    .orElseThrow(() -> new RuntimeException("Tenant admin not found"));
            tenant.setTenantAdmin(admin);
        }

        Tenant updatedTenant = tenantRepository.save(tenant);
        return toTenantResponse(updatedTenant);
    }

    @Override
    public void deleteTenant(Long id) {
        tenantRepository.deleteById(id);
    }

    @Override
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll()
                .stream()
                .map(this::toTenantResponse)
                .collect(Collectors.toList());
    }

    // Convert Tenant entity to TenantResponse
    private TenantResponse toTenantResponse(Tenant tenant) {
        TenantResponse response = new TenantResponse();
        response.setId(tenant.getId());
        response.setName(tenant.getName());
        response.setTenantAdminName(tenant.getTenantAdmin() != null ? tenant.getTenantAdmin().getUsername() : null);
        return response;
    }
}
