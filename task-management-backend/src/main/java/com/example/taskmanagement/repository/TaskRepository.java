package com.example.taskmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.Tenant;
import com.example.taskmanagement.model.User;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByUser(User user);
    List<Task> findByTenant(Tenant tenant);

  


}
