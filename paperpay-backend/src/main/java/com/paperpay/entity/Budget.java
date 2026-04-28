package com.paperpay.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "monthly_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyLimit;

    @Column(length = 20)
    @Builder.Default
    private String color = "yellow";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
