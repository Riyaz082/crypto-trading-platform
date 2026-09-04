package com.Makushev.service.impl;

import com.Makushev.model.PaymentDetails;
import com.Makushev.model.User;
import com.Makushev.repository.PaymentDetailsRepository;
import com.Makushev.service.PaymentDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

    PaymentDetailsRepository paymentDetailsRepository;

    @Autowired
    public PaymentDetailsServiceImpl(PaymentDetailsRepository paymentDetailsRepository) {
        this.paymentDetailsRepository = paymentDetailsRepository;
    }



    @PostMapping("/payment-details")
    @Override
    public PaymentDetails addPaymentDetails (String accountNumber,
                                             String accountHolderName,
                                             String inn,
                                             String bankName,
                                             User user)
    {

        PaymentDetails paymentDetails = new PaymentDetails();

        paymentDetails.setAccountNumber(accountNumber);
        paymentDetails.setAccountHolderName(accountHolderName);
        paymentDetails.setInn(inn);
        paymentDetails.setBankName(bankName);
        paymentDetails.setUser(user);

        return paymentDetailsRepository.save(paymentDetails);
    }

    @GetMapping("/payment-details")
    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {

        return paymentDetailsRepository.findByUserId(user.getId());

    }
}
