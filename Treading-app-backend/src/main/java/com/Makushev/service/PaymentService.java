package com.Makushev.service;


import com.Makushev.domain.PaymentMethod;
import com.Makushev.model.PaymentOrder;
import com.Makushev.model.User;
import com.Makushev.response.PaymentResponse;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean ProcessedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws Exception;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount, Long orderId) throws Exception;

    PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId) throws Exception;

}
