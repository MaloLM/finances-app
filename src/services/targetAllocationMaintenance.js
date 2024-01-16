function run_tam_optimization(data) {
  // Initialisation
  let totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    data.budget
  );

  let res = {};
  let budget = data.budget;

  // Boucle d'optimisation
  while (budget > 0) {
    let allocationFound = false;

    for (let assetName in data.assets) {
      let asset = data.assets[assetName];
      let currentValue = asset.unitPrice * asset.quantityOwned;
      let targetValue = totalValue * (asset.targetPercent / 100);
      let gap = targetValue - currentValue;
      let additionalQuantity = 0;

      if (gap > asset.unitPrice && budget >= asset.unitPrice) {
        additionalQuantity = Math.min(
          Math.floor(gap / asset.unitPrice),
          Math.floor(budget / asset.unitPrice)
        );
        asset.quantityOwned += additionalQuantity;
        budget -= additionalQuantity * asset.unitPrice;
        allocationFound = true;
      }

      res[assetName] = {
        oldQuantity: res[assetName]
          ? res[assetName].oldQuantity
          : asset.quantityOwned - additionalQuantity,
        newQuantity: asset.quantityOwned,
        unitPrice: asset.unitPrice,
        assetName: asset.assetName,
        assetProp: asset.targetPercent,
      };
    }

    if (!allocationFound) {
      break;
    }
  }

  return { data, res };
}

module.exports = { run_tam_optimization };
