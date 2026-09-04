package com.Makushev.model;

import com.Makushev.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "verification_code")
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String otp;

    @OneToOne
    private User user;

    private String email;

    private String mobile;

    private VerificationType verificationType;



}
