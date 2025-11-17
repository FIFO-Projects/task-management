package com.example.taskmanagement.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tenant")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Tenant Admin
    @ManyToOne
    @JoinColumn(name = "tenant_admin_id")
    private User tenantAdmin;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL)
    private List<User> users;

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public User getTenantAdmin() {
        return tenantAdmin;
    }

    public List<User> getUsers() {
        return users;
    }
    

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTenantAdmin(User tenantAdmin) {
        this.tenantAdmin = tenantAdmin;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
