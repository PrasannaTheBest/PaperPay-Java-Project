package com.paperpay.controller;

import com.paperpay.dto.request.AddMoneyRequest;
import com.paperpay.dto.response.WalletResponse;
import com.paperpay.entity.User;
import com.paperpay.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(walletService.getWallet(user));
    }

    @PostMapping("/add")
    public ResponseEntity<WalletResponse> addMoney(@Valid @RequestBody AddMoneyRequest req,
                                                    Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(walletService.addMoney(user, req));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<WalletResponse> withdraw(@Valid @RequestBody AddMoneyRequest req,
                                                    Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(walletService.withdraw(user, req));
    }
}
