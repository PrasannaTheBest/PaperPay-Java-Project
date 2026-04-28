package com.paperpay.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertLevel level;

    /**
     * JSON array string, e.g. ["Large transaction (>50k)", "Rapid fire detected"]
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reasons;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AlertStatus status = AlertStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AlertLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum AlertStatus {
        PENDING, SAFE, BLOCKED
    }
}
