package com.paperpay.dto.response;

import com.paperpay.entity.Transaction;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionResponse {
    private Long id;
    private String refId;
    private String senderName;
    private String receiverName;
    private BigDecimal amount;
    private String type;
    private String category;
    private String method;
    private String status;
    private String note;
    private LocalDateTime createdAt;

    public static TransactionResponse from(Transaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .refId(tx.getRefId())
                .senderName(tx.getSender() != null ? tx.getSender().getFullName() : null)
                .receiverName(tx.getReceiver() != null ? tx.getReceiver().getFullName() : null)
                .amount(tx.getAmount())
                .type(tx.getType().name())
                .category(tx.getCategory())
                .method(tx.getMethod().name())
                .status(tx.getStatus().name())
                .note(tx.getNote())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
