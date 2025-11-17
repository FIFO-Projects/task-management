package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.TaskRequest;
import com.example.taskmanagement.model.Comment;
import com.example.taskmanagement.model.Task;

import com.example.taskmanagement.service.TaskServiceImpl;
import com.example.taskmanagement.service.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskServiceImpl taskService;
    private final UserServiceImpl userService;

    public TaskController(TaskServiceImpl taskService, UserServiceImpl userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    // List all tasks in the tenant of logged-in user
    @GetMapping
    public ResponseEntity<List<Task>> getTasks(Authentication authentication) {
        String username = authentication.getName();
        List<Task> tasks = taskService.getTasksForTenant(username);
        return ResponseEntity.ok(tasks);
    }

    // Create task within tenant
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request,
                                           Authentication authentication) {
        String creatorUsername = authentication.getName();
        Task savedTask = taskService.createTaskInTenant(
                creatorUsername,
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getDueDate(),
                request.getUserId()
        );
        return ResponseEntity.ok(savedTask);
    }
    @GetMapping("/mytasks")
    public List<Task> getMyTasks(Authentication authentication) {
        String username = authentication.getName(); // logged-in user
        return taskService.getTasksForUser(username);
    }



@PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long taskId,
                                             @RequestBody StatusUpdateRequest request,
                                             Authentication authentication) {
        String username = authentication.getName();
        Task updated = taskService.updateTaskStatus(taskId, username, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long taskId,
                                              @RequestBody CommentRequest request,
                                              Authentication authentication) {
        String username = authentication.getName();
        Comment saved = taskService.addCommentToTask(taskId, username, request.getText());
        return ResponseEntity.ok(saved);
    }

    // small DTOs
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class CommentRequest {
        private String text;
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
}


