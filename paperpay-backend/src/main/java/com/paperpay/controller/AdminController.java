package com.paperpay.controller;

import com.paperpay.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<Page<Map<String, Object>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(page, size));
    }

    @PatchMapping("/users/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }

    @GetMapping("/fraud/alerts")
    public ResponseEntity<List<Map<String, Object>>> getAllFraudAlerts() {
        return ResponseEntity.ok(adminService.getAllFraudAlerts());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
