package com.Makushev.service;

import com.Makushev.domain.VerificationType;
import com.Makushev.model.User;
import com.Makushev.model.VerificationCode;

public interface VerificationCodeService {

    VerificationCode sendVerificationCode(User user, VerificationType verificationType);

    VerificationCode getVerificationCodeById(Long id) throws Exception;

    VerificationCode getVerificationCodeMyUser(long userId);

    void deleteVerificationCodeById(VerificationCode verificationCode);

}
