package com.Makushev.service.impl;

import com.Makushev.domain.PaymentMethod;
import com.Makushev.domain.PaymentOrderStatus;
import com.Makushev.model.PaymentOrder;
import com.Makushev.model.User;
import com.Makushev.repository.PaymentOrderRepository;
import com.Makushev.response.PaymentResponse;
import com.Makushev.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceimpl implements PaymentService {

    private PaymentOrderRepository paymentOrderRepository;

    @Autowired
    public PaymentServiceimpl(PaymentOrderRepository paymentOrderRepository) {
        this.paymentOrderRepository = paymentOrderRepository;
    }

    @Override
    public PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod) {
       PaymentOrder paymentOrder = new PaymentOrder();
       paymentOrder.setUser(user);
       paymentOrder.setAmount(amount);
       paymentOrder.setPaymentMethod(paymentMethod);
       paymentOrder.setStatus(PaymentOrderStatus.PENDING);

       return paymentOrderRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentOrderRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("payment order not found"));
    }

    @Override
    public Boolean ProcessedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws Exception {
        if(paymentOrder.getStatus()==null){
            paymentOrder.setStatus(PaymentOrderStatus.PENDING);
        }
        if(paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){
            // Simulate verification based on simulated success payment IDs
            if(paymentId != null && paymentId.startsWith("pay_mock_") && !paymentId.contains("fail")){
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
        }
        return paymentOrder.getStatus().equals(PaymentOrderStatus.SUCCESS);
    }

    @Override
    public PaymentResponse createRazorpayPaymentLink(User user, Long amount, Long orderId) throws Exception {
        String paymentLinkUrl = "/api/payment/demo-gateway?order_id=" + orderId 
                + "&amount=" + amount + "&payment_method=RAZORPAY";

        PaymentResponse res = new PaymentResponse();
        res.setPayment_url(paymentLinkUrl);
        return res;
    }

    @Override
    public PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId) throws Exception {
        String paymentLinkUrl = "/api/payment/demo-gateway?order_id=" + orderId 
                + "&amount=" + amount + "&payment_method=STRIPE";

        PaymentResponse res = new PaymentResponse();
        res.setPayment_url(paymentLinkUrl);
        return res;
    }
}
