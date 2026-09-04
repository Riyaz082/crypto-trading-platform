package com.Makushev.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentDetailsRequest {

    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;

    @NotBlank(message = "INN is required")
    private String inn;

    @NotBlank(message = "Bank name is required")
    private String bankName;

}
