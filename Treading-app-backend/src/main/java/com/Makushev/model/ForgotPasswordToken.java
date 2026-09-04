package com.Makushev.model;

import com.Makushev.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "forgotpassword_token")
public class ForgotPasswordToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @OneToOne
    private User user;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;

}
