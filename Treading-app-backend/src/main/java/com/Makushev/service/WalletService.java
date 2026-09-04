package com.Makushev.service;

import com.Makushev.model.Order;
import com.Makushev.model.User;
import com.Makushev.model.Wallet;

public interface WalletService {

    Wallet getUserWallet (User user);

    Wallet addBalanceToWallet(Wallet wallet, Long money);

    Wallet findWalletById(Long id) throws Exception;

    Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception;

    Wallet payOrderPayment(Order order, User user) throws Exception;

}
