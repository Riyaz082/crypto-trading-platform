package com.Makushev.config;

import com.Makushev.domain.USER_ROLE;
import com.Makushev.model.User;
import com.Makushev.repository.UserRepository;
import com.Makushev.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, WalletService walletService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
        initializeCustomerUser();
    }

    private void initializeAdminUser() {
        try {
            User existingAdmin = userRepository.findByEmail("admin@riyaz.com");
            if (existingAdmin == null) {
                User admin = new User();
                admin.setFullName("Admin Riyaz");
                admin.setEmail("admin@riyaz.com");
                admin.setPassword(passwordEncoder.encode("Admin@000"));
                admin.setRole(USER_ROLE.ROLE_ADMIN);
                User savedAdmin = userRepository.save(admin);
                walletService.getUserWallet(savedAdmin);
                System.out.println("Demo admin user (admin@riyaz.com) initialized successfully.");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize admin user: " + e.getMessage());
        }
    }

    private void initializeCustomerUser() {
        try {
            User existingCustomer = userRepository.findByEmail("user@1.com");
            if (existingCustomer == null) {
                User customer = new User();
                customer.setFullName("Demo Customer");
                customer.setEmail("user@1.com");
                customer.setPassword(passwordEncoder.encode("User@123"));
                customer.setRole(USER_ROLE.ROLE_CUSTOMER);
                User savedCustomer = userRepository.save(customer);
                walletService.getUserWallet(savedCustomer);
                System.out.println("Demo customer user (user@1.com) initialized successfully.");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize customer user: " + e.getMessage());
        }
    }
}
