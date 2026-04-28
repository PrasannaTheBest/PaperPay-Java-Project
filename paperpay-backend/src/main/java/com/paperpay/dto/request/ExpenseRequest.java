package com.paperpay.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {
    @NotBlank
    private String title;

    @NotNull @DecimalMin("0.01")
    private BigDecimal amount;

    @NotBlank
    private String category;

    private String notes;

    @NotNull
    private LocalDate expenseDate;
}
