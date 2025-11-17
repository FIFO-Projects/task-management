package com.example.taskmanagement.service;

import com.example.taskmanagement.model.Comment;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.Tenant;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.model.enums.Priority;
import com.example.taskmanagement.model.enums.Status;
import com.example.taskmanagement.repository.CommentRepository;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class TaskServiceImpl implements TaskServiceInterface {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentRepository commentRepository;

    // Create task inside tenant
    public Task createTaskInTenant(String creatorUsername,
                                   String title,
                                   String description,
                                   Priority priority,
                                   Status status,
                                   LocalDate dueDate,
                                   Long assignedUserId) {

        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Tenant tenant = creator.getTenant();

        User assignedUser;
        if (assignedUserId != null) {
            assignedUser = userRepository.findById(assignedUserId)
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        } else {
            assignedUser = creator; // default assign to creator
        }

        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(priority);
        task.setStatus(status);
        task.setDueDate(dueDate);
        task.setUser(assignedUser);
        task.setTenant(tenant);

        return taskRepository.save(task);
    }

    // Get all tasks in the tenant of logged-in user
    public List<Task> getTasksForTenant(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tenant tenant = user.getTenant();
        return taskRepository.findByTenant(tenant);
    }

    @Override
public List<Task> getTasksByUsername(String username) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
    return taskRepository.findByUser(user);
}
public List<Task> getTasksForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return taskRepository.findByUser(user);
    }

public Task updateTaskStatus(Long taskId, String username, String newStatus) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

    // allow only assigned user to change
    if (!task.getUser().getId().equals(user.getId())) {
        throw new RuntimeException("Not allowed");
    }

    task.setStatus(Status.valueOf(newStatus.toUpperCase()));
    return taskRepository.save(task);
}

public Comment addCommentToTask(Long taskId, String username, String text) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

    // allow only assigned user (or tenant admin) to comment
    if (!task.getUser().getId().equals(user.getId())
        && !user.getTenant().getId().equals(task.getTenant().getId())) {
        throw new RuntimeException("Not allowed");
    }

    Comment comment = new Comment();
    comment.setTask(task);
    comment.setAuthor(user);
    comment.setText(text);
    return commentRepository.save(comment);
}
}
