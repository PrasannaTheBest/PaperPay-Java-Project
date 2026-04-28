package com.paperpay.service;

import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionService {

    private final TransactionRepository transactionRepository;
    private final FraudAlertRepository fraudAlertRepository;

    private static final BigDecimal LARGE_TX_THRESHOLD = new BigDecimal("50000");
    private static final long RAPID_FIRE_WINDOW_SECONDS = 60;
    private static final long RAPID_FIRE_COUNT = 5;

    @Async
    public void checkTransaction(User user, Transaction tx) {
        List<String> reasons = new ArrayList<>();
        FraudAlert.AlertLevel level = null;

        // Rule 1: Large transaction (50k+)
        if (tx.getAmount().compareTo(LARGE_TX_THRESHOLD) > 0) {
            reasons.add("Large transaction exceeds ₹50,000");
            level = FraudAlert.AlertLevel.HIGH;
        }

        // Rule 2: Rapid-fire transactions (5+ in 60 seconds)
        LocalDateTime since = LocalDateTime.now().minusSeconds(RAPID_FIRE_WINDOW_SECONDS);
        long recentCount = transactionRepository.countByUserSince(user, since);
        if (recentCount >= RAPID_FIRE_COUNT) {
            reasons.add("Rapid-fire detected: " + recentCount + " transactions in 60 seconds");
            if (level == null || level == FraudAlert.AlertLevel.HIGH) {
                level = FraudAlert.AlertLevel.CRITICAL;
            }
        }

        // Rule 3: Failed transaction (potential card testing)
        if (tx.getStatus() == Transaction.TransactionStatus.FAILED) {
            reasons.add("Transaction failed — possible invalid recipient");
            if (level == null) level = FraudAlert.AlertLevel.MEDIUM;
        }

        // Rule 4: Multiple round-amount transactions in 24 hours (suspicious pattern)
        long roundCount = transactionRepository.countRoundAmountTransactions(user, LocalDateTime.now().minusHours(24));
        if (roundCount >= 3) {
            reasons.add("Multiple round-amount transactions in 24 hours (suspicious pattern)");
            if (level == null || level == FraudAlert.AlertLevel.MEDIUM) {
                level = FraudAlert.AlertLevel.MEDIUM;
            }
        }

        // Rule 5: First-time recipient (info only)
        if (tx.getReceiver() != null) {
            long previousTxWithReceiver = transactionRepository.countPreviousTransactions(user, tx.getReceiver(), LocalDateTime.now());
            if (previousTxWithReceiver == 1) {
                // This is informational, doesn't raise alert level
            }
        }

        // Only log alerts if we have reasons and a level
        if (!reasons.isEmpty() && level != null) {
            String reasonsJson = "[\"" + String.join("\", \"", reasons) + "\"]";
            FraudAlert alert = FraudAlert.builder()
                    .user(user)
                    .transaction(tx)
                    .level(level)
                    .reasons(reasonsJson)
                    .status(FraudAlert.AlertStatus.PENDING)
                    .build();
            fraudAlertRepository.save(alert);
            log.info("[ALERT] Fraud alert created for user {} on transaction {} - level: {}, reasons: {}", 
                    user.getEmail(), tx.getRefId(), level, reasonsJson);
        }
    }
}
