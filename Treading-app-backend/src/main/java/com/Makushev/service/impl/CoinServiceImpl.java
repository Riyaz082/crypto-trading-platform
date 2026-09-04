package com.Makushev.service.impl;

import com.Makushev.model.Coin;
import com.Makushev.repository.CoinRepository;
import com.Makushev.service.CoinService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class CoinServiceImpl implements CoinService {

    private CoinRepository coinRepository;
    private ObjectMapper objectMapper;

    @Autowired
    public CoinServiceImpl(CoinRepository coinRepository, ObjectMapper objectMapper) {
        this.coinRepository = coinRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<Coin> getCoinList(int page) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/markets/?vs_currency=usd&per_page=10&page=" + page;

        RestTemplate restTemplate = new RestTemplate();

        try{
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            List<Coin> coinList = objectMapper.readValue(response.getBody(), // с помощью маппера читаем тело ответа и из json переводим в java obj
                    new TypeReference<List<Coin>>(){});
            coinRepository.saveAll(coinList);
            return coinList;
        }
        catch (HttpClientErrorException e){ // HttpClientErrorException | HttpClientErrorException e
            throw new Exception(e.getMessage());
        }

    }

    @Override
    public String getMarketChart(String coinId, int days) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/"+coinId+"/market_chart/?vs_currency=usd&days=" + days;

        RestTemplate restTemplate = new RestTemplate();

        try{
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

           return response.getBody();
        }
        catch (HttpClientErrorException e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public String getCoinDetails(String coinId) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/"+coinId;

        RestTemplate restTemplate = new RestTemplate();

        try{
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            Coin coin = new Coin();
            if (jsonNode.get("id") != null) coin.setId(jsonNode.get("id").asText());
            if (jsonNode.get("name") != null) coin.setName(jsonNode.get("name").asText());
            if (jsonNode.get("symbol") != null) coin.setSymbol(jsonNode.get("symbol").asText());
            if (jsonNode.get("image") != null && jsonNode.get("image").get("large") != null) {
                coin.setImage(jsonNode.get("image").get("large").asText());
            }

            JsonNode marketData = jsonNode.get("market_data"); // все про рыночную капитализацию

            if (marketData != null) {
                if (marketData.get("current_price") != null && marketData.get("current_price").get("usd") != null) {
                    coin.setCurrentPrice(marketData.get("current_price").get("usd").asDouble());
                }
                if (marketData.get("market_cap") != null && marketData.get("market_cap").get("usd") != null) {
                    coin.setMarketCap(marketData.get("market_cap").get("usd").asLong());
                }
                if (marketData.get("market_cap_rank") != null) {
                    coin.setMarketCapRank(marketData.get("market_cap_rank").asInt());
                }
                if (marketData.get("total_volume") != null && marketData.get("total_volume").get("usd") != null) {
                    coin.setTotalVolume(marketData.get("total_volume").get("usd").asLong());
                }
                if (marketData.get("high_24h") != null && marketData.get("high_24h").get("usd") != null) {
                    coin.setHigh24h(marketData.get("high_24h").get("usd").asDouble());
                }
                if (marketData.get("low_24h") != null && marketData.get("low_24h").get("usd") != null) {
                    coin.setLow24h(marketData.get("low_24h").get("usd").asDouble());
                }
                if (marketData.get("price_change_24h") != null) {
                    coin.setPriceChange24h(marketData.get("price_change_24h").asDouble());
                }
                if (marketData.get("price_change_percentage_24h") != null) {
                    coin.setPriceChangePercentage24h(marketData.get("price_change_percentage_24h").asDouble());
                }
                if (marketData.get("market_cap_change_24h") != null) {
                    coin.setMarketCapChange24h(marketData.get("market_cap_change_24h").asLong());
                }
                if (marketData.get("market_cap_change_percentage_24h") != null) {
                    coin.setMarketCapChangePercentage24h(marketData.get("market_cap_change_percentage_24h").asDouble());
                }
                if (marketData.get("total_supply") != null) {
                    coin.setTotalSupply(marketData.get("total_supply").asLong());
                }
            }

            coinRepository.save(coin);

            return response.getBody();

        }
        catch (HttpClientErrorException e){ // HttpClientErrorException | HttpClientErrorException e
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Coin findById(String coinId) throws Exception {
        Optional<Coin> optionalCoin = coinRepository.findById(coinId);
        if (optionalCoin.isPresent()) {
            return optionalCoin.get();
        }
        try {
            getCoinDetails(coinId);
            return coinRepository.findById(coinId)
                    .orElseThrow(() -> new Exception("coin not found on market"));
        } catch (Exception e) {
            throw new Exception("coin not found: " + coinId);
        }
    }

    @Override
    public String searchCoin(String keyword) throws Exception {
        String url = "https://api.coingecko.com/api/v3/search?query=" + keyword;

        RestTemplate restTemplate = new RestTemplate();

        try{
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();
        }
        catch (HttpClientErrorException e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public String getTop50CoinsByMarketCapRank() throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1";

        RestTemplate restTemplate = new RestTemplate();

        try{
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();
        }
        catch (HttpClientErrorException e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public String getTrendingCoins() throws Exception {
        String url = "https://api.coingecko.com/api/v3/search/trending";

        RestTemplate restTemplate = new RestTemplate();

        try{
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();
        }
        catch (HttpClientErrorException e){
            throw new Exception(e.getMessage());
        }
    }
}
