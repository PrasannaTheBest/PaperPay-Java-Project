package com.paperpay.controller;

import com.paperpay.dto.request.ExpenseRequest;
import com.paperpay.entity.*;
import com.paperpay.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(
            @RequestParam(required = false) String month,
            Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(expenseService.getExpenses(user, month));
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody ExpenseRequest req,
                                               Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(expenseService.addExpense(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id,
                                                  @Valid @RequestBody ExpenseRequest req,
                                                  Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(expenseService.updateExpense(id, user, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        expenseService.deleteExpense(id, user);
        return ResponseEntity.noContent().build();
    }
}
