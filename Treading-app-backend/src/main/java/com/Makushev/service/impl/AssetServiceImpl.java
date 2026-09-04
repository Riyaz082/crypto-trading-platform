package com.Makushev.service.impl;

import com.Makushev.model.Asset;
import com.Makushev.model.Coin;
import com.Makushev.model.User;
import com.Makushev.repository.AssetRepository;
import com.Makushev.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetServiceImpl implements AssetService {

    private AssetRepository assetRepository;

    @Autowired
    public AssetServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public Asset createAsset(User user, Coin coin, double quantity) {
        Asset asset = new Asset();
        asset.setUser(user);
        asset.setCoin(coin);
        asset.setQuantity(quantity);
        asset.setBuyPrice(coin.getCurrentPrice());

        return assetRepository.save(asset);
    }

    @Override
    public Asset getAssetById(Long assetId) throws Exception {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new Exception("asset not found"));
    }

    @Override
    public Asset getAssetByUserIdAndId(Long userid, Long assetId) {
        return null;
    }

    @Override
    public List<Asset> getUsersAssets(Long userId) {
        return assetRepository.findByUserId(userId);
    }

    @Override
    public Asset updateAsset(Long assetId, double quantity) throws Exception {

        Asset oldAsset = getAssetById(assetId);
        double oldQuantity = oldAsset.getQuantity();
        double oldBuyPrice = oldAsset.getBuyPrice();
        double currentPrice = oldAsset.getCoin().getCurrentPrice();

        double newQuantity = oldQuantity + quantity;
        if (newQuantity > 0) {
            double newBuyPrice = ((oldQuantity * oldBuyPrice) + (quantity * currentPrice)) / newQuantity;
            oldAsset.setBuyPrice(newBuyPrice);
        }
        oldAsset.setQuantity(newQuantity);

        return assetRepository.save(oldAsset);

    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) {
        return assetRepository.findByUserIdAndCoinId(userId, coinId);
    }

    @Override
    public void deleteAsset(Long assetId) {

        assetRepository.deleteById(assetId);
    }
}
