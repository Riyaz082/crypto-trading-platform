package com.Makushev.service.impl;

import com.Makushev.model.Coin;
import com.Makushev.model.User;
import com.Makushev.model.Watchlist;
import com.Makushev.repository.UserRepository;
import com.Makushev.repository.WatchlistRepository;
import com.Makushev.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
public class WatchlistServiceImpl implements WatchlistService {

    private WatchlistRepository watchlistRepository;
    private UserRepository userRepository;

    @Autowired
    public WatchlistServiceImpl(WatchlistRepository watchlistRepository, UserRepository userRepository) {
        this.watchlistRepository = watchlistRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Watchlist findUserWatchlist(Long userId) throws Exception {
        Watchlist watchlist = watchlistRepository.findByUserId(userId);
        if(watchlist==null){
            User user = userRepository.findById(userId).orElseThrow(() -> new Exception("user not found"));
            watchlist = createWatchlist(user);
        }
        return watchlist;
    }

    @Override
    public Watchlist createWatchlist(User user) {
        Watchlist watchlist = new Watchlist();
        watchlist.setUser(user);

        return watchlistRepository.save(watchlist);
    }

    @Override
    public Watchlist findById(Long id) throws Exception {
        Optional<Watchlist> watchlistOptional = watchlistRepository.findById(id);
        if(watchlistOptional.isEmpty()){
            throw new Exception("watchlist not found");
        }
        return watchlistOptional.get();
    }

    @Override
    @Transactional
    public Coin addItemToWatchlist(Coin coin, User user) throws Exception {
        Watchlist watchlist = findUserWatchlist(user.getId());

        Coin existingCoin = null;
        for (Coin c : watchlist.getCoins()) {
            if (c.getId().equals(coin.getId())) {
                existingCoin = c;
                break;
            }
        }

        if (existingCoin != null) {
            watchlist.getCoins().remove(existingCoin);
        } else {
            watchlist.getCoins().add(coin);
        }
        watchlistRepository.save(watchlist);
        return coin;
    }
}
