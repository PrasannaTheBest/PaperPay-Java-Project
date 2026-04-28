package com.paperpay.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type;
    private Long id;
    private String email;
    private String fullName;
    private String role;

    public static AuthResponse of(String token, com.paperpay.entity.User user) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}
