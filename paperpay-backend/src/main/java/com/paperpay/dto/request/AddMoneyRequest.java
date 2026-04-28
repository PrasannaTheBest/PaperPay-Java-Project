package com.paperpay.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddMoneyRequest {
    @NotNull @DecimalMin("1.00")
    private BigDecimal amount;
}
