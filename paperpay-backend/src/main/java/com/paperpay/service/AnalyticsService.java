package com.paperpay.service;

import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    /**
     * Returns last 6 months of income vs spend
     */
    public List<Map<String, Object>> getMonthlyTrends(User user) {
        LocalDateTime since = LocalDateTime.now().minusMonths(6);
        List<Object[]> rows = transactionRepository.findMonthlyStats(user, since);

        List<Map<String, Object>> result = new ArrayList<>();
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};

        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("name", months[month - 1]);
            entry.put("income", row[2] != null ? row[2] : 0);
            entry.put("spend", row[3] != null ? row[3] : 0);
            result.add(entry);
        }
        return result;
    }

    /**
     * Summary stats for the current month
     */
    public Map<String, Object> getSummary(User user) {
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth();

        List<Object[]> categoryData = expenseRepository.sumByCategory(user, start, end);

        BigDecimal totalExpenses = BigDecimal.ZERO;
        String biggestCategory = "-";
        BigDecimal biggestAmount = BigDecimal.ZERO;

        for (Object[] row : categoryData) {
            BigDecimal amt = (BigDecimal) row[1];
            totalExpenses = totalExpenses.add(amt);
            if (amt.compareTo(biggestAmount) > 0) {
                biggestAmount = amt;
                biggestCategory = (String) row[0];
            }
        }

        // Get all transactions for income
        List<TransactionSummary_> txList = getTransactionSummary(user);
        BigDecimal totalIncome = txList.stream()
                .filter(t -> "CREDIT".equals(t.type))
                .map(t -> t.amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal savings = totalIncome.subtract(totalExpenses);
            savingsRate = savings.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(1, RoundingMode.HALF_UP);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("savingsRate", savingsRate + "%");
        summary.put("biggestCategory", biggestCategory);
        summary.put("biggestCategoryAmount", biggestAmount);
        return summary;
    }

    /**
     * Category breakdown with budget comparison
     */
    public List<Map<String, Object>> getCategoryBreakdown(User user) {
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth();

        List<Object[]> rows = expenseRepository.sumByCategory(user, start, end);
        List<Budget> budgets = budgetRepository.findByUser(user);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            String category = (String) row[0];
            BigDecimal spent = (BigDecimal) row[1];

            BigDecimal limit = budgets.stream()
                    .filter(b -> b.getCategory().equalsIgnoreCase(category))
                    .findFirst()
                    .map(Budget::getMonthlyLimit)
                    .orElse(spent.multiply(new BigDecimal("1.2")));

            String color = budgets.stream()
                    .filter(b -> b.getCategory().equalsIgnoreCase(category))
                    .findFirst()
                    .map(Budget::getColor)
                    .orElse("yellow");

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", "cat-" + result.size());
            entry.put("name", category);
            entry.put("spent", spent);
            entry.put("limit", limit);
            entry.put("color", color);
            result.add(entry);
        }
        return result;
    }

    // Internal helper record
    private List<TransactionSummary_> getTransactionSummary(User user) {
        return transactionRepository.findAllByUserList(user).stream()
                .map(tx -> new TransactionSummary_(tx.getType().name(), tx.getAmount()))
                .toList();
    }

    private record TransactionSummary_(String type, BigDecimal amount) {}
}
