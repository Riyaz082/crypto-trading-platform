package com.Makushev.requests;

import com.Makushev.domain.OrderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotBlank(message = "Coin ID is required")
    private String coinId;

    @Positive(message = "Quantity must be greater than zero")
    private double quantity;

    @NotNull(message = "Order type is required")
    private OrderType orderType;

}
