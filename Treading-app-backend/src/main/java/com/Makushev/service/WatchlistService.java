package com.Makushev.service;

import com.Makushev.model.Coin;
import com.Makushev.model.User;
import com.Makushev.model.Watchlist;

public interface WatchlistService {

        Watchlist findUserWatchlist(Long userId) throws Exception;

        Watchlist createWatchlist(User user);

        Watchlist findById(Long id) throws Exception;

        Coin addItemToWatchlist(Coin coin, User user) throws Exception;

}
