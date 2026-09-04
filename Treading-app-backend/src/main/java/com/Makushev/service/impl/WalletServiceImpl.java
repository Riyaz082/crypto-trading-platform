package com.Makushev.service.impl;

import com.Makushev.domain.OrderType;
import com.Makushev.model.Order;
import com.Makushev.model.User;
import com.Makushev.model.Wallet;
import com.Makushev.repository.WalletRepository;
import com.Makushev.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class WalletServiceImpl implements WalletService {

    private WalletRepository walletRepository;

    @Autowired
    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }



    @Override
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());
        if(wallet==null){
            wallet = new Wallet();
            wallet.setUser(user);
            walletRepository.save(wallet);
        }
        return wallet;
    }

    @Override
    public Wallet addBalanceToWallet(Wallet wallet, Long money) {
        BigDecimal balance = wallet.getBalance();
        BigDecimal newBalance = balance.add(BigDecimal.valueOf(money));

        wallet.setBalance(newBalance);

        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        Optional<Wallet> wallet = walletRepository.findById(id);
        if(wallet.isPresent()){
            return wallet.get();
        }
        throw new Exception("Wallet not found");
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        if (amount == null || amount <= 0) {
            throw new Exception("Transfer amount must be greater than zero");
        }
        Wallet senderWallet = getUserWallet(sender);
        if (senderWallet.getId().equals(receiverWallet.getId())) {
            throw new Exception("Cannot transfer money to the same wallet");
        }
        if(senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount))<0){
            throw new Exception("Insufficient balance…");
        }
        // обновление баланса отправителя
        BigDecimal senderBalance = senderWallet.getBalance().subtract(BigDecimal.valueOf(amount)); // получаем баланс и вычитаем сумму перевода из текущего баланса
        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);

        // обновление баланса полчателя
        BigDecimal receiverBalance = receiverWallet.getBalance().add(BigDecimal.valueOf(amount));
        receiverWallet.setBalance(receiverBalance);
        walletRepository.save(receiverWallet);

        return senderWallet;
    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet = getUserWallet(user);

        if(order.getOrderType().equals(OrderType.BUY)){
            if(wallet.getBalance().compareTo(order.getPrice())<0){
                throw new Exception("Insufficient funds for this transaction");
            }
            BigDecimal newBalance = wallet.getBalance().subtract(order.getPrice());
            wallet.setBalance(newBalance);
        }
        else{
            BigDecimal newBalance = wallet.getBalance().add(order.getPrice());
            wallet.setBalance(newBalance);
        }
        walletRepository.save(wallet);
        return wallet;
    }
}
