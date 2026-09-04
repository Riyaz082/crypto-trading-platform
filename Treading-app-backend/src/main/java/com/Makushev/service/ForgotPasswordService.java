package com.Makushev.service;

import com.Makushev.domain.VerificationType;
import com.Makushev.model.ForgotPasswordToken;
import com.Makushev.model.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user,
                                    String id, String otp,
                                    VerificationType verificationType,
                                    String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);

}
