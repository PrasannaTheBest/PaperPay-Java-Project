package com.paperpay.service;

import com.paperpay.dto.response.FraudAlertResponse;
import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FraudService {

    private final FraudAlertRepository fraudAlertRepository;
    private final TransactionRepository transactionRepository;

    public List<FraudAlertResponse> getUserAlerts(User user) {
        return fraudAlertRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(FraudAlertResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public FraudAlertResponse updateAlertStatus(Long alertId, User user, String action) {
        FraudAlert alert = fraudAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));

        if (!alert.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized");
        }

        FraudAlert.AlertStatus status = switch (action.toUpperCase()) {
            case "SAFE" -> FraudAlert.AlertStatus.SAFE;
            case "BLOCKED" -> FraudAlert.AlertStatus.BLOCKED;
            default -> throw new IllegalArgumentException("Invalid action: " + action);
        };

        alert.setStatus(status);
        return FraudAlertResponse.from(fraudAlertRepository.save(alert));
    }

    public int getRiskScore(User user) {
        long pending = fraudAlertRepository
                .findByUserAndStatus(user, FraudAlert.AlertStatus.PENDING).size();
        // Simple scoring: each pending alert adds 25 to risk
        return (int) Math.min(pending * 25, 100);
    }
}
