package com.paperpay.service;

import com.paperpay.dto.request.*;
import com.paperpay.dto.response.AuthResponse;
import com.paperpay.entity.*;
import com.paperpay.repository.*;
import com.paperpay.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final UpiAccountRepository upiAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        // Validate password strength
        validatePasswordStrength(req.getPassword());
        
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.USER)
                .build();
        user = userRepository.save(user);

        // Create wallet
        Wallet wallet = Wallet.builder()
                .user(user)
                .currency(req.getCurrency() != null ? req.getCurrency() : "INR")
                .build();
        walletRepository.save(wallet);

        // Create UPI ID: firstname@paperpay
        String upiBase = req.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", "");
        if (upiBase.isEmpty()) {
            upiBase = "user" + System.nanoTime() % 10000; // Fallback if email prefix is empty
        }
        String upiId = upiBase + "@paperpay";
        if (upiAccountRepository.existsByUpiId(upiId)) {
            upiId = upiBase + user.getId() + "@paperpay";
        }
        UpiAccount upiAccount = UpiAccount.builder()
                .user(user)
                .upiId(upiId)
                .isPrimary(true)
                .build();
        upiAccountRepository.save(upiAccount);

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return AuthResponse.of(token, user);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Account has been deactivated.");
        }

        String token = jwtTokenProvider.generateToken(auth);
        return AuthResponse.of(token, user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    /**
     * Validates password strength:
     * - At least 8 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one digit
     * - At least one special character
     */
    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one digit");
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':'\",.<>?/].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character (!@#$%^&*etc.)");
        }
    }
}
