// com.example.taskmanagement.service.TenantAdminService.java
package com.example.taskmanagement.service;

import com.example.taskmanagement.model.enums.Role;
import com.example.taskmanagement.model.Tenant;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TenantRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TenantAdminService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public TenantAdminService(UserRepository userRepository, TenantRepository tenantRepository) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
    }

    @Transactional
    public Tenant createTenantWithAdmin(String tenantName, String adminUsername, String adminPassword) {
        // 1. Create the admin user first
        if (userRepository.existsByUsername(adminUsername)) {
            throw new RuntimeException("Username already exists");
        }

        User adminUser = new User();
        adminUser.setUsername(adminUsername);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.setRole(Role.TENANT_ADMIN);
        adminUser.setEnabled(true);
        adminUser = userRepository.save(adminUser);

        // 2. Create the tenant
        Tenant tenant = new Tenant();
        tenant.setName(tenantName);
        tenant.setTenantAdmin(adminUser); // if you have a relation
        tenant = tenantRepository.save(tenant);

        // 3. Update the admin user with tenant_id
        adminUser.setTenant(tenant);
        userRepository.save(adminUser);

        return tenant;
    }
}

