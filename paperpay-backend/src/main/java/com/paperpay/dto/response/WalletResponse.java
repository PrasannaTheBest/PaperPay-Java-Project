package com.paperpay.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletResponse {
    private Long walletId;
    private BigDecimal balance;
    private String currency;
    private String upiId;
}
