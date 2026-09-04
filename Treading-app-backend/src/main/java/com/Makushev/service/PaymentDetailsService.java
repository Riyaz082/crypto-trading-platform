package com.Makushev.service;

import com.Makushev.model.PaymentDetails;
import com.Makushev.model.User;

public interface PaymentDetailsService {

    public PaymentDetails addPaymentDetails(String accountNumber,
                                            String accountHolderName,
                                            String inn,
                                            String bankName,
                                            User user);

    public PaymentDetails getUsersPaymentDetails(User user);

}
