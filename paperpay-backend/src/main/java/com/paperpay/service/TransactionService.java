package com.paperpay.service;

import com.paperpay.dto.request.SendMoneyRequest;
import com.paperpay.dto.response.TransactionResponse;
import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final UpiAccountRepository upiAccountRepository;
    private final FraudDetectionService fraudDetectionService;

    @Transactional
    public TransactionResponse send(User sender, SendMoneyRequest req) {
        // Validate sender wallet with pessimistic locking to prevent race conditions
        Wallet senderWallet = walletRepository.findByUserLocked(sender)
                .orElseThrow(() -> new IllegalArgumentException("Sender wallet not found"));

        if (senderWallet.getBalance().compareTo(req.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient balance. Available: ₹" + senderWallet.getBalance() + ", Required: ₹" + req.getAmount());
        }

        // Resolve receiver via UPI ID
        UpiAccount receiverUpi = upiAccountRepository.findByUpiId(req.getToUpiId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "UPI ID not found: " + req.getToUpiId() + ". Make sure the recipient has a PaperPay account."));

        User receiver = receiverUpi.getUser();

        if (receiver.getId().equals(sender.getId())) {
            throw new IllegalArgumentException("You cannot send money to yourself");
        }

        // Check if receiver is active
        if (!receiver.getIsActive()) {
            throw new IllegalArgumentException("Recipient account is inactive");
        }

        // Create transaction first with PENDING status
        Transaction.PaymentMethod method;
        try {
            method = Transaction.PaymentMethod.valueOf(req.getMethod().toUpperCase());
        } catch (Exception e) {
            method = Transaction.PaymentMethod.UPI;
        }

        Transaction tx = Transaction.builder()
                .refId(WalletService.generateRefId())
                .sender(sender)
                .receiver(receiver)
                .amount(req.getAmount())
                .type(Transaction.TransactionType.TRANSFER)
                .category("Transfer")
                .method(method)
                .status(Transaction.TransactionStatus.PENDING)
                .note(req.getNote())
                .build();
        tx = transactionRepository.save(tx);

        try {
            // Debit sender
            senderWallet.setBalance(senderWallet.getBalance().subtract(req.getAmount()));
            walletRepository.save(senderWallet);

            // Credit receiver
            Wallet receiverWallet = walletRepository.findByUserLocked(receiver)
                    .orElseThrow(() -> new IllegalArgumentException("Receiver wallet not found"));
            receiverWallet.setBalance(receiverWallet.getBalance().add(req.getAmount()));
            walletRepository.save(receiverWallet);

            // Mark transaction as completed
            tx.setStatus(Transaction.TransactionStatus.COMPLETED);
            transactionRepository.save(tx);
        } catch (Exception e) {
            // Mark transaction as failed
            tx.setStatus(Transaction.TransactionStatus.FAILED);
            transactionRepository.save(tx);
            throw e;
        }

        // Async fraud check
        fraudDetectionService.checkTransaction(sender, tx);

        return TransactionResponse.from(tx);
    }

    public Page<TransactionResponse> getTransactions(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Transaction> txPage = transactionRepository.findAllByUser(user, pageable);
        return txPage.map(TransactionResponse::from);
    }

    public List<TransactionResponse> getAllTransactions(User user) {
        return transactionRepository.findAllByUserList(user)
                .stream().map(TransactionResponse::from).collect(Collectors.toList());
    }
}
