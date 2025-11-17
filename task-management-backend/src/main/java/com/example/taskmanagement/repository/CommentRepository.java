package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.Comment;
import com.example.taskmanagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTask(Task task);
}

