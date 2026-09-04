package com.Makushev.service;


import com.Makushev.model.Coin;

import java.util.List;

public interface CoinService {

    List<Coin> getCoinList(int page) throws Exception; // получение списка монет

    String getMarketChart(String coinId, int days) throws Exception; // получение рыночной диаграммы

    String getCoinDetails(String coinId) throws Exception;

    Coin findById(String coinId) throws Exception; // из бд именно

    String searchCoin(String keyword) throws Exception;

    String getTop50CoinsByMarketCapRank() throws Exception; // реализовать вхождение монеты в топ 50

    String getTrendingCoins() throws Exception; // торгующиеся монеты

}
