package com.Makushev.controller;

import com.Makushev.model.Coin;
import com.Makushev.model.User;
import com.Makushev.model.Watchlist;
import com.Makushev.service.CoinService;
import com.Makushev.service.UserService;
import com.Makushev.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private WatchlistService watchlistService;
    private UserService userService;
    private CoinService coinService;

    @Autowired
    public WatchlistController(WatchlistService watchlistService, UserService userService, CoinService coinService) {
        this.watchlistService = watchlistService;
        this.userService = userService;
        this.coinService = coinService;
    }

    @GetMapping("/user")
    public ResponseEntity<Watchlist> getUserWatchlist(
            @RequestHeader("Authorization") String jwt) throws Exception{

        User user = userService.findUserProfileByJwt(jwt);
        Watchlist watchlist = watchlistService.findUserWatchlist(user.getId());

        return ResponseEntity.ok(watchlist);
    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<Watchlist> getWatchlistById(
            @PathVariable Long watchlistId,
            @RequestHeader("Authorization") String jwt) throws Exception {

       User user = userService.findUserProfileByJwt(jwt);
       Watchlist watchlist = watchlistService.findById(watchlistId);

       if(!watchlist.getUser().getId().equals(user.getId())){
           throw new Exception("unauthorized access to this watchlist");
       }

       return ResponseEntity.ok(watchlist);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin> addItemToWatchlist(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String coinId) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Coin coin = coinService.findById(coinId);
        Coin addedCoin = watchlistService.addItemToWatchlist(coin, user);

        return ResponseEntity.ok(addedCoin);
    }

}
