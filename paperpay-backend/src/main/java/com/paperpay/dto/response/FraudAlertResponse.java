package com.paperpay.dto.response;

import com.paperpay.entity.FraudAlert;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FraudAlertResponse {
    private Long id;
    private Long userId;
    private Long transactionId;
    private String merchant;
    private String amount;
    private String level;
    private List<String> reasons;
    private String status;
    private LocalDateTime createdAt;

    public static FraudAlertResponse from(FraudAlert alert) {
        // Parse JSON reasons string to list
        String rawReasons = alert.getReasons();
        List<String> reasonList;
        try {
            rawReasons = rawReasons.replaceAll("[\\[\\]\"]", "");
            reasonList = List.of(rawReasons.split(",\\s*"));
        } catch (Exception e) {
            reasonList = List.of(rawReasons);
        }

        return FraudAlertResponse.builder()
                .id(alert.getId())
                .userId(alert.getUser().getId())
                .transactionId(alert.getTransaction() != null ? alert.getTransaction().getId() : null)
                .merchant(alert.getTransaction() != null
                        ? (alert.getTransaction().getReceiver() != null
                            ? alert.getTransaction().getReceiver().getFullName()
                            : "Unknown")
                        : "System Alert")
                .amount(alert.getTransaction() != null
                        ? alert.getTransaction().getAmount().toPlainString()
                        : "0")
                .level(alert.getLevel().name())
                .reasons(reasonList)
                .status(alert.getStatus().name())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
