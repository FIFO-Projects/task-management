package com.example.taskmanagement.service;

import com.example.taskmanagement.model.Comment;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.enums.Priority;
import com.example.taskmanagement.model.enums.Status;

import java.time.LocalDate;
import java.util.List;

public interface TaskServiceInterface {

    /**
     * Create a new task inside a tenant
     */
    Task createTaskInTenant(String creatorUsername,
                            String title,
                            String description,
                            Priority priority,
                            Status status,
                            LocalDate dueDate,
                            Long assignedUserId);

    /**
     * Get all tasks for the tenant of the logged-in user
     */
    List<Task> getTasksForTenant(String username);

    /**
     * Get tasks assigned to a specific user
     */
    List<Task> getTasksByUsername(String username);
    List<Task> getTasksForUser(String username);

    /**
     * Update the status of a task by assigned user
     */
    Task updateTaskStatus(Long taskId, String username, String newStatus);

    /**
     * Add comment to a task
     */
    Comment addCommentToTask(Long taskId, String username, String text);
}

