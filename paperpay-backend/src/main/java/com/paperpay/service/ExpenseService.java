package com.paperpay.service;

import com.paperpay.dto.request.ExpenseRequest;
import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<Expense> getExpenses(User user, String month) {
        if (month != null && !month.isBlank()) {
            try {
                YearMonth ym = YearMonth.parse(month);
                LocalDate start = ym.atDay(1);
                LocalDate end = ym.atEndOfMonth();
                return expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(user, start, end);
            } catch (Exception e) {
                // fall through to all
            }
        }
        return expenseRepository.findByUserOrderByExpenseDateDesc(user);
    }

    @Transactional
    public Expense addExpense(User user, ExpenseRequest req) {
        Expense expense = Expense.builder()
                .user(user)
                .title(req.getTitle())
                .amount(req.getAmount())
                .category(req.getCategory())
                .notes(req.getNotes())
                .expenseDate(req.getExpenseDate())
                .build();
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense updateExpense(Long id, User user, ExpenseRequest req) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized");
        }
        expense.setTitle(req.getTitle());
        expense.setAmount(req.getAmount());
        expense.setCategory(req.getCategory());
        expense.setNotes(req.getNotes());
        expense.setExpenseDate(req.getExpenseDate());
        return expenseRepository.save(expense);
    }

    @Transactional
    public void deleteExpense(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized");
        }
        expenseRepository.delete(expense);
    }
}
