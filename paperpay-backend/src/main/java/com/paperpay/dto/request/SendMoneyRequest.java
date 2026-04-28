package com.paperpay.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SendMoneyRequest {
    @NotBlank(message = "UPI ID is required")
    private String toUpiId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least 1.00")
    @DecimalMax(value = "1000000.00", message = "Amount cannot exceed 1000000.00 per transaction")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String method = "UPI";

    @Size(max = 500, message = "Transaction note cannot exceed 500 characters")
    private String note;
}
