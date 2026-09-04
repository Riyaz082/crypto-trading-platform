package com.Makushev.requests;

import com.Makushev.domain.VerificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ForgotPasswordTokenRequest {

    @NotBlank(message = "Recipient identifier (email/phone) is required")
    private String sendTo;

    @NotNull(message = "Verification type is required")
    private VerificationType verificationType;

}
