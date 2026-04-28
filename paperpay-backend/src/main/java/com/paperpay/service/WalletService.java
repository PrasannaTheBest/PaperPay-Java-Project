package com.paperpay.service;

import com.paperpay.dto.request.AddMoneyRequest;
import com.paperpay.dto.response.WalletResponse;
import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final UpiAccountRepository upiAccountRepository;
    private final TransactionRepository transactionRepository;

    public WalletResponse getWallet(User user) {
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        String upiId = upiAccountRepository.findByUserAndIsPrimaryTrue(user)
                .map(UpiAccount::getUpiId).orElse("N/A");
        return WalletResponse.builder()
                .walletId(wallet.getId())
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .upiId(upiId)
                .build();
    }

    @Transactional
    public WalletResponse addMoney(User user, AddMoneyRequest req) {
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(req.getAmount()));
        walletRepository.save(wallet);

        // Record as CREDIT transaction
        Transaction tx = Transaction.builder()
                .refId(generateRefId())
                .receiver(user)
                .amount(req.getAmount())
                .type(Transaction.TransactionType.CREDIT)
                .category("Add Money")
                .method(Transaction.PaymentMethod.BANK)
                .status(Transaction.TransactionStatus.COMPLETED)
                .note("Wallet top-up")
                .build();
        transactionRepository.save(tx);

        return getWallet(user);
    }

    @Transactional
    public WalletResponse withdraw(User user, AddMoneyRequest req) {
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        if (wallet.getBalance().compareTo(req.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance().subtract(req.getAmount()));
        walletRepository.save(wallet);

        Transaction tx = Transaction.builder()
                .refId(generateRefId())
                .sender(user)
                .amount(req.getAmount())
                .type(Transaction.TransactionType.DEBIT)
                .category("Withdrawal")
                .method(Transaction.PaymentMethod.BANK)
                .status(Transaction.TransactionStatus.COMPLETED)
                .note("Wallet withdrawal")
                .build();
        transactionRepository.save(tx);

        return getWallet(user);
    }

    public static String generateRefId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "TXN" + timestamp + uuid;
    }
}
