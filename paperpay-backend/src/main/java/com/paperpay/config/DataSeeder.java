package com.paperpay.config;

import com.paperpay.entity.*;
import com.paperpay.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final UpiAccountRepository upiAccountRepository;
    private final BudgetRepository budgetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        log.info("[OK] PaperPay backend ready. API at http://localhost:8080/api");
    }

    private void seedAdmin() {
        String adminEmail = "admin@paperpay.com";
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("[INFO] Admin user already exists - skipping seed.");
            return;
        }

        User admin = User.builder()
                .fullName("PaperPay Admin")
                .email(adminEmail)
                .phone("9000000000")
                .password(passwordEncoder.encode("Admin@1234"))
                .role(User.Role.ADMIN)
                .build();
        admin = userRepository.save(admin);

        Wallet wallet = Wallet.builder().user(admin).build();
        walletRepository.save(wallet);

        UpiAccount upi = UpiAccount.builder()
                .user(admin)
                .upiId("admin@paperpay")
                .isPrimary(true)
                .build();
        upiAccountRepository.save(upi);

        // Default budgets for admin
        String[][] budgets = {
            {"Food", "15000", "yellow"},
            {"Transport", "5000", "blue"},
            {"Shopping", "10000", "pink"},
            {"Bills", "20000", "green"}
        };
        for (String[] b : budgets) {
            Budget budget = Budget.builder()
                    .user(admin)
                    .category(b[0])
                    .monthlyLimit(new java.math.BigDecimal(b[1]))
                    .color(b[2])
                    .build();
            budgetRepository.save(budget);
        }

        log.info("[SEED] Admin seeded: {} / Admin@1234", adminEmail);
    }
}
