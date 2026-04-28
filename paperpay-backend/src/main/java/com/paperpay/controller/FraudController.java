package com.paperpay.controller;

import com.paperpay.dto.response.FraudAlertResponse;
import com.paperpay.entity.User;
import com.paperpay.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudService fraudService;
    private final AuthService authService;

    @GetMapping("/alerts")
    public ResponseEntity<List<FraudAlertResponse>> getAlerts(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(fraudService.getUserAlerts(user));
    }

    @PatchMapping("/alerts/{id}")
    public ResponseEntity<FraudAlertResponse> updateAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        String action = body.get("action");
        return ResponseEntity.ok(fraudService.updateAlertStatus(id, user, action));
    }

    @GetMapping("/risk-score")
    public ResponseEntity<Map<String, Object>> riskScore(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        int score = fraudService.getRiskScore(user);
        String level = score >= 75 ? "DANGER" : score >= 40 ? "CAUTION" : "SAFE";
        return ResponseEntity.ok(Map.of("score", score, "level", level));
    }
}
