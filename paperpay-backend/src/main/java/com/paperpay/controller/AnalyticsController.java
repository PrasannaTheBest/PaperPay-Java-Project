package com.paperpay.controller;

import com.paperpay.entity.User;
import com.paperpay.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuthService authService;

    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> monthly(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(analyticsService.getMonthlyTrends(user));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(analyticsService.getSummary(user));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> categories(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(user));
    }
}
