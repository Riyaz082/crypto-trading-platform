package com.Makushev.service;

import com.Makushev.domain.OrderType;
import com.Makushev.model.Coin;
import com.Makushev.model.Order;
import com.Makushev.model.OrderItem;
import com.Makushev.model.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId) throws Exception;

    List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol);

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;

}
