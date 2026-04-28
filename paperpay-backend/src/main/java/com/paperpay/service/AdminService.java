package com.paperpay.service;

import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final FraudAlertRepository fraudAlertRepository;
    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;

    public Page<Map<String, Object>> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAllByOrderByCreatedAtDesc(pageable).map(u -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("isActive", u.getIsActive());
            map.put("createdAt", u.getCreatedAt());
            return map;
        });
    }

    @Transactional
    public Map<String, Object> deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return Map.of("id", userId, "isActive", false, "message", "Account deactivated.");
    }

    public Map<String, Object> getStats() {
        long totalUsers = userRepository.count();
        long activeAlerts = fraudAlertRepository.countByStatus(FraudAlert.AlertStatus.PENDING);
        long totalTransactions = transactionRepository.count();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeAlerts", activeAlerts);
        stats.put("totalTransactions", totalTransactions);
        return stats;
    }

    public List<Map<String, Object>> getAllFraudAlerts() {
        return fraudAlertRepository.findAllByOrderByCreatedAtDesc().stream().map(a -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", a.getId());
            map.put("user", a.getUser().getEmail());
            map.put("level", a.getLevel());
            map.put("status", a.getStatus());
            map.put("createdAt", a.getCreatedAt());
            return map;
        }).toList();
    }
}
