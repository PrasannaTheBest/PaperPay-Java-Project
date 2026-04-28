package com.paperpay.repository;

import com.paperpay.entity.Transaction;
import com.paperpay.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.sender = :user OR t.receiver = :user ORDER BY t.createdAt DESC")
    Page<Transaction> findAllByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.sender = :user OR t.receiver = :user ORDER BY t.createdAt DESC")
    List<Transaction> findAllByUserList(@Param("user") User user);

    // For fraud detection: count rapid-fire transactions
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.sender = :user AND t.createdAt >= :since")
    long countByUserSince(@Param("user") User user, @Param("since") LocalDateTime since);

    // Count round-amount transactions (potential fraud pattern)
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.sender = :user AND t.createdAt >= :since AND MOD(CAST(t.amount AS INTEGER), 1000) = 0")
    long countRoundAmountTransactions(@Param("user") User user, @Param("since") LocalDateTime since);

    // Count previous transactions with receiver
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.sender = :sender AND t.receiver = :receiver AND t.createdAt < :now AND t.status = 'COMPLETED'")
    long countPreviousTransactions(@Param("sender") User sender, @Param("receiver") User receiver, @Param("now") LocalDateTime now);

    // For analytics: monthly aggregation
    @Query("SELECT MONTH(t.createdAt) as month, YEAR(t.createdAt) as year, " +
           "SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END) as income, " +
           "SUM(CASE WHEN t.type = 'DEBIT' OR t.type = 'TRANSFER' THEN t.amount ELSE 0 END) as spend " +
           "FROM Transaction t WHERE (t.sender = :user OR t.receiver = :user) " +
           "AND t.status = 'COMPLETED' AND t.createdAt >= :since " +
           "GROUP BY YEAR(t.createdAt), MONTH(t.createdAt) ORDER BY year, month")
    List<Object[]> findMonthlyStats(@Param("user") User user, @Param("since") LocalDateTime since);
}
