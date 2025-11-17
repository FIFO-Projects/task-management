package com.example.taskmanagement.dto;

import java.time.LocalDate;
import com.example.taskmanagement.model.enums.Priority;
import com.example.taskmanagement.model.enums.Status;

public class TaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private Priority priority;
    private Status status;
    private Long userId; // assigned user

    // getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
