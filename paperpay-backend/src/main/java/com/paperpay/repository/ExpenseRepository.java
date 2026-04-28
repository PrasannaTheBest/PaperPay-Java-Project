package com.paperpay.repository;

import com.paperpay.entity.Expense;
import com.paperpay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByExpenseDateDesc(User user);

    List<Expense> findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
            User user, LocalDate start, LocalDate end);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user = :user " +
           "AND e.expenseDate BETWEEN :start AND :end GROUP BY e.category")
    List<Object[]> sumByCategory(@Param("user") User user,
                                  @Param("start") LocalDate start,
                                  @Param("end") LocalDate end);
}
