package com.paperpay.controller;

import com.paperpay.dto.request.SendMoneyRequest;
import com.paperpay.dto.response.TransactionResponse;
import com.paperpay.entity.User;
import com.paperpay.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final AuthService authService;

    @PostMapping("/send")
    public ResponseEntity<TransactionResponse> send(@Valid @RequestBody SendMoneyRequest req,
                                                     Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(transactionService.send(user, req));
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(transactionService.getTransactions(user, page, size));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(transactionService.getAllTransactions(user));
    }
}
