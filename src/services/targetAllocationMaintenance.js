/**
 * Optimizes asset distribution in a portfolio to match target percentages.
 *
 * @param {Object} data - The portfolio data including assets, currency, and budget.
 * @returns {Object} The updated portfolio data and the new distribution of assets.
 */
function run_tam_optimization(data) {
  // Initialize total portfolio value (including budget)
  let totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    data.budget
  );

  let res = {};
  let budget = data.budget;

  // Optimization loop
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

      let newProp =
        ((asset.unitPrice * asset.quantityOwned) / totalValue) * 100;
      newProp = Math.round(newProp * 10) / 10;

      res[assetName] = {
        oldQuantity: res[assetName]
          ? res[assetName].oldQuantity
          : asset.quantityOwned - additionalQuantity,
        newQuantity: asset.quantityOwned,
        unitPrice: asset.unitPrice,
        assetName: asset.assetName,
        assetProp: asset.targetPercent,
        newProp: newProp,
      };
    }

    if (!allocationFound) {
      break;
    }
  }

  // Update total value for calculating final proportions
  totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    budget
  );

  // Update new proportions for each asset
  for (let assetName in res) {
    let asset = res[assetName];
    let newProp = ((asset.unitPrice * asset.newQuantity) / totalValue) * 100;
    res[assetName].newProp = Math.round(newProp * 10) / 10; // Round to one decimal place
  }

  return { data, res };
}

module.exports = { run_tam_optimization };
