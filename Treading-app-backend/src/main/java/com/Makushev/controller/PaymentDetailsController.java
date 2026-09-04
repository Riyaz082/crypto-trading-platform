package com.Makushev.controller;

import com.Makushev.model.PaymentDetails;
import com.Makushev.model.User;
import com.Makushev.repository.PaymentDetailsRepository;
import com.Makushev.service.PaymentDetailsService;
import com.Makushev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.Makushev.requests.PaymentDetailsRequest;

@RestController
@RequestMapping("/api")
public class PaymentDetailsController {

    private UserService userService;
    private PaymentDetailsService paymentDetailsService;
    private PaymentDetailsRepository paymentDetailsRepository;

    @Autowired
    public PaymentDetailsController(UserService userService, PaymentDetailsService paymentDetailsService, PaymentDetailsRepository paymentDetailsRepository) {
        this.userService = userService;
        this.paymentDetailsService = paymentDetailsService;
        this.paymentDetailsRepository = paymentDetailsRepository;
    }

    @PostMapping("/payment-details")
    public ResponseEntity<PaymentDetails> addPaymentDetails(
            @Valid @RequestBody PaymentDetailsRequest paymentDetailsRequest,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        PaymentDetails paymentDetails = paymentDetailsService.addPaymentDetails(
                paymentDetailsRequest.getAccountNumber(),
                paymentDetailsRequest.getAccountHolderName(),
                paymentDetailsRequest.getInn(),
                paymentDetailsRequest.getBankName(),
                user
        );


        return new ResponseEntity<>(paymentDetails, HttpStatus.CREATED);
    }

    @GetMapping("/payment-details")
    public ResponseEntity<PaymentDetails> getUsersPaymentDetails(
            @RequestHeader("Authorization") String jwt) throws Exception {

                User user = userService.findUserProfileByJwt(jwt);

                PaymentDetails paymentDetails = paymentDetailsService.getUsersPaymentDetails(user);

                return new ResponseEntity<>(paymentDetails, HttpStatus.OK);
    }
}
