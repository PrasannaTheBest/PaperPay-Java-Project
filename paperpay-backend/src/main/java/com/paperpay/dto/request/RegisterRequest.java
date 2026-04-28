package com.paperpay.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters (with uppercase, lowercase, digit, and special char)")
    private String password;

    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phone;

    private String currency = "INR";

    private Double monthlyBudget = 20000.0;
}
