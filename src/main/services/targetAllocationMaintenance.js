/**
 * Optimizes asset distribution in a portfolio to match target percentages.
 *
 * @param {Object} data - The portfolio data including assets, currency, and budget.
 * @returns {Object} The updated portfolio data and the new distribution of assets.
 */

function run_tam_optimization(data) {
  let totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    data.budget
  );

  // Determine target values for each asset
  let targetValues = {};
  for (let assetName in data.assets) {
    let asset = data.assets[assetName];
    targetValues[assetName] = totalValue * (asset.targetPercent / 100);
  }

  let budget = data.budget;
  let res = {};

  // Budget allocation
  for (let assetName in data.assets) {
    let asset = data.assets[assetName];
    let gap = targetValues[assetName] - asset.unitPrice * asset.quantityOwned;
    let additionalQuantity = 0;

    if (gap > 0 && budget >= asset.unitPrice) {
      additionalQuantity = Math.min(
        Math.floor(gap / asset.unitPrice),
        Math.floor(budget / asset.unitPrice)
      );

      asset.quantityOwned += additionalQuantity;
      budget -= additionalQuantity * asset.unitPrice;
    }

    res[assetName] = {
      oldQuantity: asset.quantityOwned - additionalQuantity,
      newQuantity: asset.quantityOwned,
      additionalQuantity: additionalQuantity,
      unitPrice: asset.unitPrice,
      assetName: asset.assetName,
      assetProp: asset.targetPercent,
    };
  }

  // Update the total value and proportions after purchases
  totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    budget
  );

  let resultList = [];
  for (let assetName in res) {
    let asset = res[assetName];
    let newProp = ((asset.unitPrice * asset.newQuantity) / totalValue) * 100;
    res[assetName].newProp = Math.round(newProp * 10) / 10;
    resultList.push(asset);
  }

  return resultList;
}

module.exports = { run_tam_optimization };
